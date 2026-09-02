from __future__ import annotations

import math
from dataclasses import dataclass

import numpy as np
from pyproj import CRS, Geod, Transformer
from shapely.geometry import Point, Polygon
from shapely.prepared import prep

from app.models import GeoPoint, PolygonEnvelope

WGS84_GEOD = Geod(ellps="WGS84")
EARTH_RADIUS_M = 6371008.8


def normalize_lon(lon: float) -> float:
    return ((lon + 180.0) % 360.0) - 180.0


def haversine_m(a: GeoPoint, b: GeoPoint) -> float:
    lat1 = math.radians(a.lat)
    lat2 = math.radians(b.lat)
    dlat = lat2 - lat1
    dlon = math.radians(b.lon - a.lon)
    h = math.sin(dlat / 2.0) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2.0) ** 2
    return 2.0 * EARTH_RADIUS_M * math.asin(min(1.0, math.sqrt(h)))


def bearing_deg(a: GeoPoint, b: GeoPoint) -> float:
    az12, _, _ = WGS84_GEOD.inv(a.lon, a.lat, b.lon, b.lat)
    return az12 % 360.0


def circular_difference_deg(a: float, b: float) -> float:
    return abs((a - b + 180.0) % 360.0 - 180.0)


def geodesic_interpolate(a: GeoPoint, b: GeoPoint, fraction: float) -> GeoPoint:
    fraction = min(1.0, max(0.0, fraction))
    az12, _, distance_m = WGS84_GEOD.inv(a.lon, a.lat, b.lon, b.lat)
    lon, lat, _ = WGS84_GEOD.fwd(a.lon, a.lat, az12, distance_m * fraction)
    return GeoPoint(lat=lat, lon=normalize_lon(lon))


def move_by_en_m(point: GeoPoint, east_m: float, north_m: float) -> GeoPoint:
    distance = math.hypot(east_m, north_m)
    if distance == 0.0:
        return point
    azimuth = math.degrees(math.atan2(east_m, north_m))
    lon, lat, _ = WGS84_GEOD.fwd(point.lon, point.lat, azimuth, distance)
    return GeoPoint(lat=lat, lon=normalize_lon(lon))


def velocity_to_latlon_rate(lat_deg: float, east_mps: float, north_mps: float) -> tuple[float, float]:
    lat_rad = math.radians(lat_deg)
    dlat_deg_s = math.degrees(north_mps / EARTH_RADIUS_M)
    cos_lat = max(1.0e-8, abs(math.cos(lat_rad)))
    dlon_deg_s = math.degrees(east_mps / (EARTH_RADIUS_M * cos_lat))
    return dlat_deg_s, dlon_deg_s


def polygon_centroid(points: list[GeoPoint]) -> GeoPoint:
    polygon = Polygon([(p.lon, p.lat) for p in points])
    if polygon.is_empty or not polygon.is_valid:
        raise ValueError("spill polygon is invalid")
    c = polygon.centroid
    return GeoPoint(lat=float(c.y), lon=float(c.x))


def polygon_area_km2(points: list[GeoPoint]) -> float:
    lons = [p.lon for p in points]
    lats = [p.lat for p in points]
    area_m2, _ = WGS84_GEOD.polygon_area_perimeter(lons, lats)
    return abs(area_m2) / 1_000_000.0


def sample_uniform_in_polygon(points: list[GeoPoint], rng: np.random.Generator) -> GeoPoint:
    polygon = Polygon([(p.lon, p.lat) for p in points])
    if polygon.is_empty or not polygon.is_valid or polygon.area <= 0.0:
        raise ValueError("cannot sample from invalid polygon")
    prepared = prep(polygon)
    minx, miny, maxx, maxy = polygon.bounds
    for _ in range(10000):
        lon = rng.uniform(minx, maxx)
        lat = rng.uniform(miny, maxy)
        if prepared.contains(Point(lon, lat)):
            return GeoPoint(lat=float(lat), lon=float(lon))
    c = polygon.representative_point()
    return GeoPoint(lat=float(c.y), lon=float(c.x))


def local_transformers(center: GeoPoint) -> tuple[Transformer, Transformer]:
    local = CRS.from_proj4(
        f"+proj=aeqd +lat_0={center.lat} +lon_0={center.lon} +datum=WGS84 +units=m +no_defs"
    )
    wgs84 = CRS.from_epsg(4326)
    to_xy = Transformer.from_crs(wgs84, local, always_xy=True)
    to_ll = Transformer.from_crs(local, wgs84, always_xy=True)
    return to_xy, to_ll


@dataclass(frozen=True)
class EnvelopeComputation:
    envelope: PolygonEnvelope
    center_xy: tuple[float, float]
    covariance: np.ndarray
    empirical_mahalanobis_quantile: float


def confidence_ellipse(
    samples: list[GeoPoint],
    probability_mass: float,
    vertices: int,
    min_variance_m2: float,
) -> EnvelopeComputation:
    if len(samples) < 3:
        raise ValueError("at least three origin samples are required")
    center = GeoPoint(
        lat=float(np.mean([p.lat for p in samples])),
        lon=float(np.mean([p.lon for p in samples])),
    )
    to_xy, to_ll = local_transformers(center)
    xy = np.array([to_xy.transform(p.lon, p.lat) for p in samples], dtype=float)
    mean_xy = np.mean(xy, axis=0)
    centered = xy - mean_xy
    cov = np.cov(centered.T, ddof=1)
    if cov.shape != (2, 2) or not np.all(np.isfinite(cov)):
        cov = np.eye(2, dtype=float) * min_variance_m2
    cov = cov + np.eye(2, dtype=float) * min_variance_m2
    inv_cov = np.linalg.pinv(cov)
    mahal_sq = np.einsum("ni,ij,nj->n", centered, inv_cov, centered)
    q = float(np.quantile(mahal_sq, probability_mass))
    q = max(q, 1.0e-9)

    eigvals, eigvecs = np.linalg.eigh(cov)
    order = np.argsort(eigvals)[::-1]
    eigvals = eigvals[order]
    eigvecs = eigvecs[:, order]
    radii = np.sqrt(np.maximum(eigvals, min_variance_m2) * q)

    angles = np.linspace(0.0, 2.0 * math.pi, vertices, endpoint=False)
    unit = np.vstack((np.cos(angles), np.sin(angles)))
    ellipse_xy = (eigvecs @ (radii[:, None] * unit)).T + mean_xy
    polygon_points: list[GeoPoint] = []
    for x, y in ellipse_xy:
        lon, lat = to_ll.transform(float(x), float(y))
        polygon_points.append(GeoPoint(lat=float(lat), lon=normalize_lon(float(lon))))
    polygon_points.append(polygon_points[0])

    major_vector = eigvecs[:, 0]
    bearing = math.degrees(math.atan2(float(major_vector[0]), float(major_vector[1]))) % 360.0
    envelope = PolygonEnvelope(
        probability_mass=probability_mass,
        polygon=polygon_points,
        semi_major_km=float(radii[0] / 1000.0),
        semi_minor_km=float(radii[1] / 1000.0),
        bearing_deg=bearing,
    )
    return EnvelopeComputation(
        envelope=envelope,
        center_xy=(float(mean_xy[0]), float(mean_xy[1])),
        covariance=cov,
        empirical_mahalanobis_quantile=q,
    )


def point_in_envelope(point: GeoPoint, envelope: PolygonEnvelope) -> bool:
    polygon = Polygon([(p.lon, p.lat) for p in envelope.polygon])
    return polygon.covers(Point(point.lon, point.lat))
