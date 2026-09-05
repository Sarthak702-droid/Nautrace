from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import datetime, timedelta

import numpy as np
from scipy.stats import truncnorm

from app.algorithms.geo import (
    confidence_ellipse,
    move_by_en_m,
    polygon_centroid,
    sample_uniform_in_polygon,
    velocity_to_latlon_rate,
)
from app.algorithms.metocean import ForcingCoverageError, RegularGridMetoceanField
from app.config import HindcastConfig
from app.models import (
    GeoPoint,
    HindcastSummary,
    ParticlePath,
    ParticleSample,
    ReleaseTimePrior,
    ReleaseTimeSummary,
    SpillObservation,
)


def _downsample(samples: list[ParticleSample], limit: int) -> list[ParticleSample]:
    """Thin a trajectory to at most `limit` waypoints, always keeping both endpoints."""
    if len(samples) <= limit:
        return samples
    last = len(samples) - 1
    indices = sorted({round(i * last / (limit - 1)) for i in range(limit)})
    return [samples[i] for i in indices]


@dataclass(frozen=True)
class HindcastMember:
    origin: GeoPoint
    release_time: datetime
    age_hours: float
    current_scale: float
    wind_scale: float
    windage: float
    path: tuple[ParticleSample, ...] = ()


@dataclass(frozen=True)
class HindcastComputation:
    members: list[HindcastMember]
    summary: HindcastSummary


class EnsembleLagrangianHindcast:
    name = "nautrace-ensemble-lagrangian"
    integration_method = "RK4 advection + stochastic horizontal diffusion"

    def __init__(self, config: HindcastConfig) -> None:
        self.config = config

    def _sample_release_age(self, prior: ReleaseTimePrior, rng: np.random.Generator) -> float:
        if prior.distribution == "uniform":
            return float(rng.uniform(prior.min_age_hours, prior.max_age_hours))
        assert prior.mean_age_hours is not None
        assert prior.std_age_hours is not None
        a = (prior.min_age_hours - prior.mean_age_hours) / prior.std_age_hours
        b = (prior.max_age_hours - prior.mean_age_hours) / prior.std_age_hours
        return float(
            truncnorm.rvs(
                a,
                b,
                loc=prior.mean_age_hours,
                scale=prior.std_age_hours,
                random_state=rng,
            )
        )

    def _sample_positive_scale(self, std: float, rng: np.random.Generator) -> float:
        if std == 0.0:
            return 1.0
        # Multiplicative uncertainty should remain positive. A log-normal parameterization
        # gives E[scale] approximately 1 while avoiding non-physical negative current/wind scaling.
        sigma2 = math.log1p(std * std)
        sigma = math.sqrt(sigma2)
        mu = -0.5 * sigma2
        return float(rng.lognormal(mean=mu, sigma=sigma))

    def _sample_windage(self, rng: np.random.Generator) -> float:
        cfg = self.config.windage
        if cfg.std == 0.0:
            return min(cfg.max, max(cfg.min, cfg.mean))
        a = (cfg.min - cfg.mean) / cfg.std
        b = (cfg.max - cfg.mean) / cfg.std
        return float(truncnorm.rvs(a, b, loc=cfg.mean, scale=cfg.std, random_state=rng))

    @staticmethod
    def _advance_rk4(
        point: GeoPoint,
        at: datetime,
        dt_seconds: float,
        forcing: RegularGridMetoceanField,
        current_scale: float,
        wind_scale: float,
        windage: float,
    ) -> GeoPoint:
        def derivative(p: GeoPoint, t: datetime) -> tuple[float, float]:
            comp = forcing.velocity(p, t)
            east, north = comp.total(
                current_scale=current_scale,
                wind_scale=wind_scale,
                windage=windage,
            )
            dlat, dlon = velocity_to_latlon_rate(p.lat, east, north)
            return dlat, dlon

        k1_lat, k1_lon = derivative(point, at)
        p2 = GeoPoint(
            lat=point.lat + 0.5 * dt_seconds * k1_lat,
            lon=point.lon + 0.5 * dt_seconds * k1_lon,
        )
        k2_lat, k2_lon = derivative(p2, at + timedelta(seconds=0.5 * dt_seconds))
        p3 = GeoPoint(
            lat=point.lat + 0.5 * dt_seconds * k2_lat,
            lon=point.lon + 0.5 * dt_seconds * k2_lon,
        )
        k3_lat, k3_lon = derivative(p3, at + timedelta(seconds=0.5 * dt_seconds))
        p4 = GeoPoint(
            lat=point.lat + dt_seconds * k3_lat,
            lon=point.lon + dt_seconds * k3_lon,
        )
        k4_lat, k4_lon = derivative(p4, at + timedelta(seconds=dt_seconds))

        lat = point.lat + dt_seconds * (k1_lat + 2.0 * k2_lat + 2.0 * k3_lat + k4_lat) / 6.0
        lon = point.lon + dt_seconds * (k1_lon + 2.0 * k2_lon + 2.0 * k3_lon + k4_lon) / 6.0
        lon = ((lon + 180.0) % 360.0) - 180.0
        if not (-90.0 <= lat <= 90.0):
            raise ForcingCoverageError("particle integration moved outside valid latitude range")
        return GeoPoint(lat=float(lat), lon=float(lon))

    def _integrate_member(
        self,
        spill: SpillObservation,
        prior: ReleaseTimePrior,
        forcing: RegularGridMetoceanField,
        rng: np.random.Generator,
        record_path: bool = False,
        path_samples: int = 12,
    ) -> HindcastMember:
        age_hours = self._sample_release_age(prior, rng)
        target_seconds = age_hours * 3600.0
        current_scale = self._sample_positive_scale(self.config.current_scale_std, rng)
        wind_scale = self._sample_positive_scale(self.config.wind_scale_std, rng)
        windage = self._sample_windage(rng)

        point = sample_uniform_in_polygon(spill.polygon, rng)
        if spill.boundary_sigma_m > 0.0:
            east_jitter = float(rng.normal(0.0, spill.boundary_sigma_m))
            north_jitter = float(rng.normal(0.0, spill.boundary_sigma_m))
            point = move_by_en_m(point, east_jitter, north_jitter)

        elapsed = 0.0
        current_time = spill.detection_time
        path: list[ParticleSample] | None = None
        if record_path:
            path = [ParticleSample(timestamp=current_time, lat=point.lat, lon=point.lon)]
        configured_step = float(self.config.integration_step_seconds)
        while elapsed < target_seconds:
            step = min(configured_step, target_seconds - elapsed)
            dt = -step
            point = self._advance_rk4(
                point,
                current_time,
                dt,
                forcing,
                current_scale=current_scale,
                wind_scale=wind_scale,
                windage=windage,
            )

            if self.config.horizontal_diffusivity_m2_s > 0.0:
                sigma_m = math.sqrt(2.0 * self.config.horizontal_diffusivity_m2_s * step)
                point = move_by_en_m(
                    point,
                    float(rng.normal(0.0, sigma_m)),
                    float(rng.normal(0.0, sigma_m)),
                )

            current_time = current_time - timedelta(seconds=step)
            elapsed += step
            if path is not None:
                path.append(ParticleSample(timestamp=current_time, lat=point.lat, lon=point.lon))

        return HindcastMember(
            origin=point,
            release_time=current_time,
            age_hours=age_hours,
            current_scale=current_scale,
            wind_scale=wind_scale,
            windage=windage,
            path=tuple(_downsample(path, path_samples)) if path is not None else (),
        )

    def run(
        self,
        spill: SpillObservation,
        prior: ReleaseTimePrior,
        forcing: RegularGridMetoceanField,
        ensemble_size: int,
        rng: np.random.Generator,
        particle_path_count: int = 0,
        particle_path_samples: int = 12,
    ) -> HindcastComputation:
        members: list[HindcastMember] = []
        failed = 0
        for index in range(ensemble_size):
            try:
                members.append(
                    self._integrate_member(
                        spill,
                        prior,
                        forcing,
                        rng,
                        record_path=index < particle_path_count,
                        path_samples=particle_path_samples,
                    )
                )
            except ForcingCoverageError:
                failed += 1

        if len(members) < self.config.min_successful_members:
            raise RuntimeError(
                f"hindcast produced only {len(members)} successful members; "
                f"minimum is {self.config.min_successful_members}"
            )
        if failed / ensemble_size > self.config.max_failed_fraction:
            raise RuntimeError(
                f"hindcast forcing coverage failure fraction {failed / ensemble_size:.3f} exceeds configured maximum"
            )

        origins = [m.origin for m in members]
        env50 = confidence_ellipse(
            origins,
            probability_mass=0.50,
            vertices=self.config.envelope_vertices,
            min_variance_m2=self.config.min_covariance_variance_m2,
        ).envelope
        env90 = confidence_ellipse(
            origins,
            probability_mass=0.90,
            vertices=self.config.envelope_vertices,
            min_variance_m2=self.config.min_covariance_variance_m2,
        ).envelope

        release_times = sorted(m.release_time for m in members)
        n = len(release_times)

        def quantile_time(q: float) -> datetime:
            idx = int(round((n - 1) * q))
            return release_times[max(0, min(n - 1, idx))]

        center = polygon_centroid(env50.polygon[:-1])
        radial_scale_km = math.sqrt(env90.semi_major_km * env90.semi_minor_km)
        particle_paths = [
            ParticlePath(member_index=idx, samples=list(member.path))
            for idx, member in enumerate(members)
            if member.path
        ]
        summary = HindcastSummary(
            engine=self.name,
            integration_method=self.integration_method,
            ensemble_size=len(members),
            origin_centroid=center,
            origin_50=env50,
            origin_90=env90,
            release_time=ReleaseTimeSummary(
                p05=quantile_time(0.05),
                median=quantile_time(0.50),
                p95=quantile_time(0.95),
            ),
            spatial_bandwidth_km=radial_scale_km,
            failed_members=failed,
            particle_paths=particle_paths,
        )
        return HindcastComputation(members=members, summary=summary)
