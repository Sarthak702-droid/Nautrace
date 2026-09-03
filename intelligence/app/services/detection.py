from __future__ import annotations

from typing import Any
from app.algorithms.detection import SarOilDetector
from app.models import DetectionRequest, DetectionResponse, GeoPoint, SpillObservation

class DetectionService:
    def __init__(self, weights_path: str | None = None):
        self.detector = SarOilDetector(weights_path=weights_path)

    def get_info(self) -> dict[str, Any]:
        return self.detector.get_info()

    def detect(self, req: DetectionRequest) -> DetectionResponse:
        res = self.detector.detect(
            image_base64=req.image_base64,
            center_lat=req.center_lat,
            center_lon=req.center_lon,
            pixel_size_m=req.pixel_size_m,
            threshold=req.threshold,
        )

        polygon_points = [GeoPoint(lat=p["lat"], lon=p["lon"]) for p in res["polygon"]]
        centroid_point = GeoPoint(lat=res["centroid"]["lat"], lon=res["centroid"]["lon"])

        observation = SpillObservation(
            polygon=polygon_points,
            detection_time=req.detection_time,
            oil_probability=res["oil_probability"],
            boundary_sigma_m=res["boundary_sigma_m"],
            source_product_id=req.source_product_id,
            source_uri=None,
            source_sha256=None,
        )

        return DetectionResponse(
            spill_observation=observation,
            centroid=centroid_point,
            slick_area_km2=res["slick_area_km2"],
            look_alike_risk=res["look_alike_risk"],
            model_info=res["model_info"],
        )
