from datetime import datetime, timezone
from app.algorithms.detection import SarOilDetector
from app.models import DetectionRequest
from app.services.detection import DetectionService

def test_detector_initialization():
    detector = SarOilDetector()
    info = detector.get_info()
    assert info["model_architecture"] == "SarUNet-ResNetLike"
    assert "device" in info
    assert info["input_channels"] == 3

def test_detection_synthetic_chip():
    detector = SarOilDetector()
    res = detector.detect(
        image_bytes=None,
        center_lat=18.25,
        center_lon=71.85,
        pixel_size_m=10.0,
        threshold=0.5
    )

    assert len(res["polygon"]) >= 3
    assert res["slick_area_km2"] > 0
    assert 0.0 <= res["oil_probability"] <= 1.0
    assert res["look_alike_risk"] in ["LOW", "MEDIUM", "HIGH"]
    assert "lat" in res["centroid"]
    assert "lon" in res["centroid"]

def test_detection_service_and_spill_observation():
    service = DetectionService()
    req = DetectionRequest(
        center_lat=18.25,
        center_lon=71.85,
        pixel_size_m=10.0,
        detection_time=datetime(2026, 8, 14, 4, 30, tzinfo=timezone.utc),
        source_product_id="S1A_TEST_CHIP_001",
        threshold=0.5
    )

    resp = service.detect(req)
    assert resp.slick_area_km2 > 0
    assert resp.spill_observation.source_product_id == "S1A_TEST_CHIP_001"
    assert len(resp.spill_observation.polygon) >= 3
    assert resp.spill_observation.oil_probability > 0
