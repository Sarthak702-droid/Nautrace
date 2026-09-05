from __future__ import annotations

from datetime import timedelta

from app.adapters.copernicus import build_metocean_grid
from app.algorithms.detection import SarOilDetector
from app.algorithms.geo import polygon_centroid
from app.models import (
    LiveCaseRequest, AnalysisRequest, AnalysisResponse,
    SpillObservation, ReleaseTimePrior, GeoPoint
)
from app.services.analysis import AnalysisService

# Half-width of the generated forcing grid. Backward advection over the maximum
# supported release age stays well inside this footprint.
GRID_MARGIN_DEG = 0.6


class CaseOrchestrator:
    def __init__(self, analysis_service: AnalysisService):
        self.analysis_service = analysis_service
        self.detector = SarOilDetector()

    def _resolve_spill(self, req: LiveCaseRequest) -> SpillObservation:
        if req.spill_polygon:
            return SpillObservation(
                polygon=req.spill_polygon,
                detection_time=req.detection_time,
                oil_probability=req.oil_probability if req.oil_probability is not None else 0.9,
                boundary_sigma_m=req.boundary_sigma_m if req.boundary_sigma_m is not None else 45.0,
                source_product_id=req.source_product_id
                or f"ANALYST_POLYGON_{req.detection_time.strftime('%Y%m%d%H%M')}",
                source_uri=None,
                source_sha256=None,
            )

        detection = self.detector.detect(
            image_base64=req.image_base64,
            center_lat=req.aoi_lat,
            center_lon=req.aoi_lon,
            pixel_size_m=10.0,
            threshold=0.5,
        )
        return SpillObservation(
            polygon=[GeoPoint(lat=p["lat"], lon=p["lon"]) for p in detection["polygon"]],
            detection_time=req.detection_time,
            oil_probability=detection["oil_probability"],
            boundary_sigma_m=detection["boundary_sigma_m"],
            source_product_id=req.source_product_id
            or f"CDSE_S1_{req.detection_time.strftime('%Y%m%d%H%M')}",
            source_uri="https://catalogue.dataspace.copernicus.eu",
            source_sha256=None,
        )

    def run_live_case(self, req: LiveCaseRequest) -> AnalysisResponse:
        spill = self._resolve_spill(req)

        # Centre the forcing grid on the slick itself so coverage follows the geometry
        # actually being hindcast rather than a caller-supplied hint point.
        centre = polygon_centroid(spill.polygon)

        forcing_kwargs = {
            key: value
            for key, value in (
                ("mean_wind_mps", req.wind_speed_mps),
                ("mean_wind_dir_deg", req.wind_dir_deg),
                ("mean_current_mps", req.current_speed_mps),
                ("mean_current_dir_deg", req.current_dir_deg),
            )
            if value is not None
        }

        metocean = build_metocean_grid(
            min_lat=centre.lat - GRID_MARGIN_DEG,
            max_lat=centre.lat + GRID_MARGIN_DEG,
            min_lon=centre.lon - GRID_MARGIN_DEG,
            max_lon=centre.lon + GRID_MARGIN_DEG,
            start_time=req.detection_time - timedelta(hours=req.max_age_hours + 1.0),
            end_time=req.detection_time + timedelta(hours=1.0),
            **forcing_kwargs,
        )

        prior = ReleaseTimePrior(
            distribution="uniform",
            min_age_hours=req.min_age_hours,
            max_age_hours=req.max_age_hours,
        )

        analysis_req = AnalysisRequest(
            incident_id=req.incident_id,
            spill=spill,
            release_prior=prior,
            metocean=metocean,
            ais_tracks=req.vessel_tracks,
            ensemble_size=req.ensemble_size,
            random_seed=req.random_seed,
            particle_path_count=req.particle_path_count,
            particle_path_samples=req.particle_path_samples,
        )

        return self.analysis_service.analyze(analysis_req)
