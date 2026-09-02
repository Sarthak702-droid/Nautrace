from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.config import load_algorithm_config
from app.models import AnalysisRequest
from app.services.analysis import AnalysisService


def constant_grid(value_e: float, value_n: float, times: list[str], lats: list[float], lons: list[float]):
    return [
        [[value_e if value_e is not None else value_n for _ in lons] for _ in lats]
        for _ in times
    ]


def make_request(unknown: bool = False) -> AnalysisRequest:
    detection = datetime(2026, 9, 1, 12, 0, tzinfo=timezone.utc)
    times = [
        (detection - timedelta(hours=2)).isoformat(),
        (detection - timedelta(hours=1)).isoformat(),
        detection.isoformat(),
    ]
    lats = [9.8, 10.0, 10.2]
    lons = [69.8, 70.0, 70.2]

    def cube(value: float):
        return [[[value for _ in lons] for _ in lats] for _ in times]

    origin_lon = 70.017
    vessel_a_lon = 70.35 if unknown else origin_lon
    data = {
        "incident_id": "CASE-001-UNKNOWN" if unknown else "CASE-001",
        "spill": {
            "polygon": [
                {"lat": 9.999, "lon": 70.049},
                {"lat": 9.999, "lon": 70.051},
                {"lat": 10.001, "lon": 70.051},
                {"lat": 10.001, "lon": 70.049},
            ],
            "detection_time": detection.isoformat(),
            "oil_probability": 0.94,
            "boundary_sigma_m": 20.0,
            "source_product_id": "S1-TEST",
        },
        "release_prior": {
            "distribution": "uniform",
            "min_age_hours": 0.98,
            "max_age_hours": 1.02,
        },
        "metocean": {
            "source_id": "SMOC-TEST",
            "times": times,
            "latitudes": lats,
            "longitudes": lons,
            "current_east_mps": cube(1.0),
            "current_north_mps": cube(0.0),
            "wind_east_mps": cube(0.0),
            "wind_north_mps": cube(0.0),
            "stokes_east_mps": cube(0.0),
            "stokes_north_mps": cube(0.0),
        },
        "ais_tracks": [
            {
                "vessel_id": "V-A",
                "mmsi": "123456789",
                "name": "SOURCE-LIKE",
                "source_id": "AIS-TEST",
                "points": [
                    {
                        "timestamp": (detection - timedelta(hours=1, minutes=20)).isoformat(),
                        "lat": 10.0,
                        "lon": vessel_a_lon - 0.01,
                        "sog_knots": 8.0,
                        "cog_deg": 90.0,
                    },
                    {
                        "timestamp": (detection - timedelta(minutes=40)).isoformat(),
                        "lat": 10.0,
                        "lon": vessel_a_lon + 0.01,
                        "sog_knots": 8.0,
                        "cog_deg": 90.0,
                    },
                ],
            },
            {
                "vessel_id": "V-B",
                "mmsi": "987654321",
                "name": "DISTANT",
                "source_id": "AIS-TEST",
                "points": [
                    {
                        "timestamp": (detection - timedelta(hours=1, minutes=20)).isoformat(),
                        "lat": 10.08,
                        "lon": 70.10,
                        "sog_knots": 8.0,
                        "cog_deg": 20.0,
                    },
                    {
                        "timestamp": (detection - timedelta(minutes=40)).isoformat(),
                        "lat": 10.08,
                        "lon": 70.11,
                        "sog_knots": 8.0,
                        "cog_deg": 20.0,
                    },
                ],
            },
        ],
        "ensemble_size": 64,
        "random_seed": 1234,
    }
    return AnalysisRequest.model_validate(data)


def test_known_source_is_ranked() -> None:
    loaded = load_algorithm_config()
    loaded.config.hindcast.horizontal_diffusivity_m2_s = 0.0
    loaded.config.hindcast.current_scale_std = 0.01
    loaded.config.hindcast.wind_scale_std = 0.0
    loaded.config.hindcast.windage.std = 0.0
    service = AnalysisService(loaded)
    response = service.analyze(make_request(unknown=False))
    assert response.hindcast.ensemble_size == 64
    assert response.candidates
    assert response.candidates[0].vessel_id == "V-A"
    assert response.candidates[0].compatibility_median > response.decision.unknown_median
    assert response.decision.outcome == "RANKED_CANDIDATES"


def test_unknown_hypothesis_when_no_track_near_origin() -> None:
    loaded = load_algorithm_config()
    loaded.config.hindcast.horizontal_diffusivity_m2_s = 0.0
    loaded.config.hindcast.current_scale_std = 0.01
    loaded.config.hindcast.wind_scale_std = 0.0
    loaded.config.hindcast.windage.std = 0.0
    loaded.config.ais.candidate_margin_km = 5.0
    service = AnalysisService(loaded)
    response = service.analyze(make_request(unknown=True))
    assert response.decision.outcome == "UNKNOWN_NON_AIS"
