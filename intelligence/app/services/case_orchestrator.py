from __future__ import annotations

from datetime import timedelta
from typing import Any
from app.adapters.copernicus import build_metocean_grid
from app.algorithms.detection import SarOilDetector
from app.models import (
    LiveCaseRequest, AnalysisRequest, AnalysisResponse,
    SpillObservation, ReleaseTimePrior, GeoPoint
)
from app.services.analysis import AnalysisService

class CaseOrchestrator:
    def __init__(self, analysis_service: AnalysisService):
        self.analysis_service = analysis_service
        self.detector = SarOilDetector()

    def run_live_case(self, req: LiveCaseRequest) -> AnalysisResponse:
        # 1. Detect or extract spill geometry
        detection_res = self.detector.detect(
            image_base64=req.image_base64,
            center_lat=req.aoi_lat,
            center_lon=req.aoi_lon,
            pixel_size_m=10.0,
            threshold=0.5
        )

        polygon_points = [GeoPoint(lat=p["lat"], lon=p["lon"]) for p in detection_res["polygon"]]

        observation = SpillObservation(
            polygon=polygon_points,
            detection_time=req.detection_time,
            oil_probability=detection_res["oil_probability"],
            boundary_sigma_m=detection_res["boundary_sigma_m"],
            source_product_id=f"CDSE_S1_{req.detection_time.strftime('%Y%m%d%H%M')}",
            source_uri="https://catalogue.dataspace.copernicus.eu",
            source_sha256=None
        )

        # 2. Automatically generate Copernicus Metocean Grid
        # Bounding box covering ~100 km radius
        d_deg = 0.6
        start_time = req.detection_time - timedelta(hours=req.max_age_hours + 1.0)
        end_time = req.detection_time + timedelta(hours=1.0)

        metocean = build_metocean_grid(
            min_lat=req.aoi_lat - d_deg,
            max_lat=req.aoi_lat + d_deg,
            min_lon=req.aoi_lon - d_deg,
            max_lon=req.aoi_lon + d_deg,
            start_time=start_time,
            end_time=end_time
        )

        prior = ReleaseTimePrior(
            distribution="uniform",
            min_age_hours=req.min_age_hours,
            max_age_hours=req.max_age_hours
        )

        analysis_req = AnalysisRequest(
            incident_id=req.incident_id,
            spill=observation,
            release_prior=prior,
            metocean=metocean,
            ais_tracks=req.vessel_tracks,
            ensemble_size=req.ensemble_size
        )

        return self.analysis_service.analyze(analysis_req)
