from __future__ import annotations

import bisect
import math
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import numpy as np
from pyproj import Geod
from scipy.spatial import cKDTree

from app.algorithms.geo import (
    circular_difference_deg,
    geodesic_interpolate,
    haversine_m,
    local_transformers,
)
from app.config import AISConfig
from app.models import AISTrackPoint, AISQualitySummary, GeoPoint, VesselTrack

GEOD = Geod(ellps="WGS84")
KNOT_TO_MPS = 0.5144444444444445


def _epoch_seconds(value: datetime) -> float:
    return value.astimezone(timezone.utc).timestamp()


def _circular_mean_deg(values: list[float]) -> float | None:
    if not values:
        return None
    radians = np.radians(np.asarray(values, dtype=float))
    x = float(np.mean(np.cos(radians)))
    y = float(np.mean(np.sin(radians)))
    if x == 0.0 and y == 0.0:
        return None
    return math.degrees(math.atan2(y, x)) % 360.0


def _merge_duplicate_group(group: list[AISTrackPoint]) -> AISTrackPoint:
    lats = [p.lat for p in group]
    lons = [p.lon for p in group]
    sogs = [p.sog_knots for p in group if p.sog_knots is not None]
    cogs = [p.cog_deg for p in group if p.cog_deg is not None]
    return AISTrackPoint(
        timestamp=group[0].timestamp,
        lat=float(np.median(lats)),
        lon=float(np.median(lons)),
        sog_knots=float(np.median(sogs)) if sogs else None,
        cog_deg=_circular_mean_deg([float(v) for v in cogs]),
    )


@dataclass(frozen=True)
class CleanedTrack:
    vessel_id: str
    mmsi: str | None
    name: str | None
    vessel_type: str | None
    source_id: str
    points: list[AISTrackPoint]
    quality: AISQualitySummary


@dataclass(frozen=True)
class InterpolatedAISPoint:
    timestamp: datetime
    position: GeoPoint
    sog_knots: float | None
    cog_deg: float | None
    bracket_gap_seconds: float


class AISTrackCleaner:
    def __init__(self, config: AISConfig) -> None:
        self.config = config

    def clean(self, track: VesselTrack) -> CleanedTrack:
        ordered = sorted(track.points, key=lambda p: p.timestamp)
        input_count = len(ordered)

        deduplicated: list[AISTrackPoint] = []
        duplicate_removed = 0
        i = 0
        while i < len(ordered):
            j = i + 1
            while j < len(ordered) and ordered[j].timestamp == ordered[i].timestamp:
                j += 1
            group = ordered[i:j]
            deduplicated.append(_merge_duplicate_group(group))
            duplicate_removed += len(group) - 1
            i = j

        kept: list[AISTrackPoint] = []
        motion_removed = 0
        max_speed_mps = self.config.max_implied_speed_knots * KNOT_TO_MPS
        for point in deduplicated:
            if not kept:
                kept.append(point)
                continue
            previous = kept[-1]
            dt = (point.timestamp - previous.timestamp).total_seconds()
            if dt <= 0.0:
                continue
            distance_m = haversine_m(
                GeoPoint(lat=previous.lat, lon=previous.lon),
                GeoPoint(lat=point.lat, lon=point.lon),
            )
            implied_speed = distance_m / dt
            if implied_speed > max_speed_mps:
                motion_removed += 1
                continue
            kept.append(point)

        if len(kept) < 2:
            raise ValueError(f"AIS track {track.vessel_id} has fewer than two valid points after cleaning")

        gaps = [
            (b.timestamp - a.timestamp).total_seconds()
            for a, b in zip(kept, kept[1:])
            if b.timestamp > a.timestamp
        ]
        median_cadence = float(np.median(gaps)) if gaps else None
        max_gap_minutes = float(max(gaps) / 60.0) if gaps else None
        valid_fraction = len(kept) / input_count if input_count else 0.0

        quality = AISQualitySummary(
            input_points=input_count,
            kept_points=len(kept),
            duplicate_points_removed=duplicate_removed,
            impossible_motion_points_removed=motion_removed,
            median_cadence_seconds=median_cadence,
            max_gap_minutes=max_gap_minutes,
            valid_fraction=float(valid_fraction),
        )
        return CleanedTrack(
            vessel_id=track.vessel_id,
            mmsi=track.mmsi,
            name=track.name,
            vessel_type=track.vessel_type,
            source_id=track.source_id,
            points=kept,
            quality=quality,
        )


class AISTrajectory:
    def __init__(self, track: CleanedTrack, config: AISConfig) -> None:
        self.track = track
        self.config = config
        self._times = [p.timestamp for p in track.points]
        self._epoch = [_epoch_seconds(t) for t in self._times]

    @property
    def start_time(self) -> datetime:
        return self._times[0]

    @property
    def end_time(self) -> datetime:
        return self._times[-1]

    def interpolate(self, at: datetime) -> InterpolatedAISPoint | None:
        target = _epoch_seconds(at)
        idx = bisect.bisect_left(self._epoch, target)
        if idx < len(self._epoch) and self._epoch[idx] == target:
            p = self.track.points[idx]
            return InterpolatedAISPoint(
                timestamp=at,
                position=GeoPoint(lat=p.lat, lon=p.lon),
                sog_knots=p.sog_knots,
                cog_deg=p.cog_deg,
                bracket_gap_seconds=0.0,
            )
        if idx == 0 or idx >= len(self._epoch):
            return None

        left = self.track.points[idx - 1]
        right = self.track.points[idx]
        gap_seconds = (right.timestamp - left.timestamp).total_seconds()
        if gap_seconds <= 0.0:
            return None
        if gap_seconds > self.config.max_interpolation_gap_minutes * 60.0:
            return None

        fraction = (at - left.timestamp).total_seconds() / gap_seconds
        position = geodesic_interpolate(
            GeoPoint(lat=left.lat, lon=left.lon),
            GeoPoint(lat=right.lat, lon=right.lon),
            fraction,
        )

        sog: float | None = None
        if left.sog_knots is not None and right.sog_knots is not None:
            sog = float(left.sog_knots + fraction * (right.sog_knots - left.sog_knots))
        elif left.sog_knots is not None:
            sog = left.sog_knots
        elif right.sog_knots is not None:
            sog = right.sog_knots

        cog: float | None = None
        if left.cog_deg is not None and right.cog_deg is not None:
            delta = ((right.cog_deg - left.cog_deg + 180.0) % 360.0) - 180.0
            cog = float((left.cog_deg + fraction * delta) % 360.0)
        elif left.cog_deg is not None:
            cog = left.cog_deg
        elif right.cog_deg is not None:
            cog = right.cog_deg

        return InterpolatedAISPoint(
            timestamp=at,
            position=position,
            sog_knots=sog,
            cog_deg=cog,
            bracket_gap_seconds=float(gap_seconds),
        )

    def continuity_score(self, start: datetime, end: datetime) -> float:
        if end <= start:
            return 0.0
        start_epoch = _epoch_seconds(start)
        end_epoch = _epoch_seconds(end)
        lo = max(0, bisect.bisect_left(self._epoch, start_epoch) - 1)
        hi = min(len(self.track.points), bisect.bisect_right(self._epoch, end_epoch) + 1)
        points = self.track.points[lo:hi]
        if len(points) < 2:
            return 0.0
        max_gap_seconds = max(
            (b.timestamp - a.timestamp).total_seconds() for a, b in zip(points, points[1:])
        )
        threshold = self.config.max_interpolation_gap_minutes * 60.0
        if threshold <= 0.0:
            return 0.0
        return float(math.exp(-max_gap_seconds / threshold))

    def behavior_score(self, release_time: datetime) -> float | None:
        behavior_half = timedelta(minutes=self.config.behavior_window_minutes)
        baseline_span = timedelta(minutes=self.config.baseline_window_minutes)
        event_points = [
            p for p in self.track.points if release_time - behavior_half <= p.timestamp <= release_time + behavior_half
        ]
        baseline_points = [
            p
            for p in self.track.points
            if release_time - baseline_span <= p.timestamp < release_time - behavior_half
        ]

        event_speeds = [p.sog_knots for p in event_points if p.sog_knots is not None]
        baseline_speeds = [p.sog_knots for p in baseline_points if p.sog_knots is not None]
        slowdown: float | None = None
        if event_speeds and baseline_speeds:
            event_median = float(np.median(event_speeds))
            baseline_median = float(np.median(baseline_speeds))
            if baseline_median > 0.0:
                slowdown = min(1.0, max(0.0, 1.0 - event_median / baseline_median))

        event_cogs = [p.cog_deg for p in event_points if p.cog_deg is not None]
        turn_signal: float | None = None
        if len(event_cogs) >= 2:
            diffs = [
                circular_difference_deg(float(a), float(b)) / 180.0
                for a, b in zip(event_cogs, event_cogs[1:])
            ]
            turn_signal = min(1.0, float(np.max(diffs))) if diffs else None

        available = [v for v in (slowdown, turn_signal) if v is not None]
        if not available:
            return None
        complement = 1.0
        for value in available:
            complement *= 1.0 - value
        return float(1.0 - complement)


@dataclass(frozen=True)
class IndexedPoint:
    epoch: float
    vessel_id: str
    point: GeoPoint


class AISTemporalSpatialIndex:
    """Two-stage index: bisect on time, then KD-tree on locally projected positions."""

    def __init__(self, trajectories: dict[str, AISTrajectory]) -> None:
        self.trajectories = trajectories
        flattened: list[IndexedPoint] = []
        for vessel_id, trajectory in trajectories.items():
            for p in trajectory.track.points:
                flattened.append(
                    IndexedPoint(
                        epoch=_epoch_seconds(p.timestamp),
                        vessel_id=vessel_id,
                        point=GeoPoint(lat=p.lat, lon=p.lon),
                    )
                )
        flattened.sort(key=lambda item: item.epoch)
        self._points = flattened
        self._epochs = [p.epoch for p in flattened]

    def query(
        self,
        start: datetime,
        end: datetime,
        center: GeoPoint,
        radius_m: float,
    ) -> set[str]:
        lo = bisect.bisect_left(self._epochs, _epoch_seconds(start))
        hi = bisect.bisect_right(self._epochs, _epoch_seconds(end))
        subset = self._points[lo:hi]
        if not subset:
            return set()
        to_xy, _ = local_transformers(center)
        xy = np.asarray([to_xy.transform(item.point.lon, item.point.lat) for item in subset], dtype=float)
        tree = cKDTree(xy)
        indexes = tree.query_ball_point([0.0, 0.0], r=radius_m)
        return {subset[i].vessel_id for i in indexes}
