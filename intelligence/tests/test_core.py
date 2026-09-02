from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.algorithms.ais import AISTrackCleaner, AISTrajectory
from app.config import load_algorithm_config
from app.models import AISTrackPoint, VesselTrack


def test_ais_cleaner_removes_duplicate_and_impossible_jump() -> None:
    cfg = load_algorithm_config().config.ais
    cleaner = AISTrackCleaner(cfg)
    t0 = datetime(2026, 9, 1, 10, tzinfo=timezone.utc)
    track = VesselTrack(
        vessel_id="V1",
        source_id="test",
        points=[
            AISTrackPoint(timestamp=t0, lat=10.0, lon=70.0, sog_knots=10, cog_deg=90),
            AISTrackPoint(timestamp=t0, lat=10.0, lon=70.0, sog_knots=10, cog_deg=90),
            AISTrackPoint(timestamp=t0 + timedelta(minutes=5), lat=40.0, lon=120.0, sog_knots=10, cog_deg=90),
            AISTrackPoint(timestamp=t0 + timedelta(minutes=10), lat=10.0, lon=70.02, sog_knots=10, cog_deg=90),
        ],
    )
    cleaned = cleaner.clean(track)
    assert cleaned.quality.duplicate_points_removed == 1
    assert cleaned.quality.impossible_motion_points_removed == 1
    assert cleaned.quality.kept_points == 2


def test_ais_interpolation_is_geodesic_and_bounded_by_gap() -> None:
    cfg = load_algorithm_config().config.ais
    cleaner = AISTrackCleaner(cfg)
    t0 = datetime(2026, 9, 1, 10, tzinfo=timezone.utc)
    cleaned = cleaner.clean(
        VesselTrack(
            vessel_id="V1",
            source_id="test",
            points=[
                AISTrackPoint(timestamp=t0, lat=10.0, lon=70.0, sog_knots=10, cog_deg=350),
                AISTrackPoint(timestamp=t0 + timedelta(minutes=10), lat=10.0, lon=70.1, sog_knots=12, cog_deg=10),
            ],
        )
    )
    trajectory = AISTrajectory(cleaned, cfg)
    mid = trajectory.interpolate(t0 + timedelta(minutes=5))
    assert mid is not None
    assert 70.04 < mid.position.lon < 70.06
    assert mid.sog_knots is not None and 10.9 < mid.sog_knots < 11.1
    assert mid.cog_deg is not None and (mid.cog_deg < 2 or mid.cog_deg > 358)
