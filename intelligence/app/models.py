from __future__ import annotations

from datetime import datetime
from typing import Literal, Any

from pydantic import BaseModel, Field, model_validator


class GeoPoint(BaseModel):
    lat: float = Field(ge=-90.0, le=90.0)
    lon: float = Field(ge=-180.0, le=180.0)


class SpillObservation(BaseModel):
    polygon: list[GeoPoint] = Field(min_length=3)
    detection_time: datetime
    oil_probability: float = Field(ge=0.0, le=1.0)
    boundary_sigma_m: float = Field(gt=0.0, description="1-sigma geolocation/segmentation boundary uncertainty")
    source_product_id: str = Field(min_length=1)
    source_uri: str | None = None
    source_sha256: str | None = Field(default=None, pattern=r"^[a-fA-F0-9]{64}$")

    @model_validator(mode="after")
    def validate_time(self) -> "SpillObservation":
        if self.detection_time.tzinfo is None:
            raise ValueError("detection_time must be timezone-aware")
        return self


class ReleaseTimePrior(BaseModel):
    distribution: Literal["uniform", "truncated_normal"]
    min_age_hours: float = Field(gt=0.0, le=240.0)
    max_age_hours: float = Field(gt=0.0, le=240.0)
    mean_age_hours: float | None = Field(default=None, gt=0.0, le=240.0)
    std_age_hours: float | None = Field(default=None, gt=0.0, le=120.0)

    @model_validator(mode="after")
    def validate_prior(self) -> "ReleaseTimePrior":
        if self.max_age_hours <= self.min_age_hours:
            raise ValueError("max_age_hours must be greater than min_age_hours")
        if self.distribution == "truncated_normal":
            if self.mean_age_hours is None or self.std_age_hours is None:
                raise ValueError("truncated_normal requires mean_age_hours and std_age_hours")
            if not (self.min_age_hours <= self.mean_age_hours <= self.max_age_hours):
                raise ValueError("mean_age_hours must lie inside [min_age_hours, max_age_hours]")
        return self


class MetoceanGridInput(BaseModel):
    source_id: str = Field(min_length=1)
    source_uri: str | None = None
    source_sha256: str | None = Field(default=None, pattern=r"^[a-fA-F0-9]{64}$")
    times: list[datetime] = Field(min_length=2)
    latitudes: list[float] = Field(min_length=2)
    longitudes: list[float] = Field(min_length=2)
    current_east_mps: list[list[list[float]]]
    current_north_mps: list[list[list[float]]]
    wind_east_mps: list[list[list[float]]]
    wind_north_mps: list[list[list[float]]]
    stokes_east_mps: list[list[list[float]]] | None = None
    stokes_north_mps: list[list[list[float]]] | None = None

    @model_validator(mode="after")
    def validate_grid(self) -> "MetoceanGridInput":
        if any(t.tzinfo is None for t in self.times):
            raise ValueError("all metocean times must be timezone-aware")
        if any(b <= a for a, b in zip(self.latitudes, self.latitudes[1:])):
            raise ValueError("latitudes must be strictly increasing")
        if any(b <= a for a, b in zip(self.longitudes, self.longitudes[1:])):
            raise ValueError("longitudes must be strictly increasing")
        if any(b <= a for a, b in zip(self.times, self.times[1:])):
            raise ValueError("metocean times must be strictly increasing")

        expected = (len(self.times), len(self.latitudes), len(self.longitudes))
        for name in (
            "current_east_mps",
            "current_north_mps",
            "wind_east_mps",
            "wind_north_mps",
            "stokes_east_mps",
            "stokes_north_mps",
        ):
            values = getattr(self, name)
            if values is None:
                continue
            shape = (
                len(values),
                len(values[0]) if values else 0,
                len(values[0][0]) if values and values[0] else 0,
            )
            if shape != expected:
                raise ValueError(f"{name} shape {shape} must equal {expected}")
        return self


class AISTrackPoint(BaseModel):
    timestamp: datetime
    lat: float = Field(ge=-90.0, le=90.0)
    lon: float = Field(ge=-180.0, le=180.0)
    sog_knots: float | None = Field(default=None, ge=0.0, le=100.0)
    cog_deg: float | None = Field(default=None, ge=0.0, lt=360.0)

    @model_validator(mode="after")
    def validate_time(self) -> "AISTrackPoint":
        if self.timestamp.tzinfo is None:
            raise ValueError("AIS timestamps must be timezone-aware")
        return self


class VesselTrack(BaseModel):
    vessel_id: str = Field(min_length=1)
    mmsi: str | None = Field(default=None, pattern=r"^[0-9]{9}$")
    name: str | None = None
    vessel_type: str | None = None
    source_id: str = Field(default="unspecified", min_length=1)
    points: list[AISTrackPoint] = Field(min_length=2)


class AnalysisRequest(BaseModel):
    incident_id: str = Field(min_length=1)
    spill: SpillObservation
    release_prior: ReleaseTimePrior
    metocean: MetoceanGridInput
    ais_tracks: list[VesselTrack]
    ensemble_size: int | None = Field(default=None, ge=32, le=4096)
    random_seed: int | None = Field(default=None, ge=0, le=(2**63 - 1))
    particle_path_count: int = Field(
        default=0,
        ge=0,
        le=256,
        description="Number of ensemble member trajectories to return for visualization.",
    )
    particle_path_samples: int = Field(
        default=12,
        ge=2,
        le=128,
        description="Waypoints retained per returned trajectory after downsampling.",
    )


class PolygonEnvelope(BaseModel):
    probability_mass: float = Field(gt=0.0, lt=1.0)
    polygon: list[GeoPoint]
    semi_major_km: float
    semi_minor_km: float
    bearing_deg: float


class ReleaseTimeSummary(BaseModel):
    p05: datetime
    median: datetime
    p95: datetime


class ParticleSample(BaseModel):
    timestamp: datetime
    lat: float
    lon: float


class ParticlePath(BaseModel):
    member_index: int
    samples: list[ParticleSample]


class HindcastSummary(BaseModel):
    engine: str
    integration_method: str
    ensemble_size: int
    origin_centroid: GeoPoint
    origin_50: PolygonEnvelope
    origin_90: PolygonEnvelope
    release_time: ReleaseTimeSummary
    spatial_bandwidth_km: float
    failed_members: int
    particle_paths: list[ParticlePath] = Field(
        default_factory=list,
        description=(
            "Backward RK4 trajectories for a subset of ensemble members, ordered "
            "detection-time first. Empty unless the caller requests paths."
        ),
    )


class AISQualitySummary(BaseModel):
    input_points: int
    kept_points: int
    duplicate_points_removed: int
    impossible_motion_points_removed: int
    median_cadence_seconds: float | None
    max_gap_minutes: float | None
    valid_fraction: float


class ScoreBreakdown(BaseModel):
    spatial: float
    temporal_coverage: float
    heading: float
    origin_overlap_50: float
    origin_overlap_90: float
    behavior: float
    ais_continuity: float
    data_quality: float
    gap_penalty: float


class VesselCandidate(BaseModel):
    rank: int
    vessel_id: str
    mmsi: str | None = None
    name: str | None = None
    compatibility_median: float = Field(ge=0.0, le=1.0)
    compatibility_p05: float = Field(ge=0.0, le=1.0)
    compatibility_p95: float = Field(ge=0.0, le=1.0)
    top_rank_stability: float = Field(ge=0.0, le=1.0)
    minimum_origin_distance_km: float | None
    valid_ensemble_fraction: float = Field(ge=0.0, le=1.0)
    breakdown: ScoreBreakdown
    ais_quality: AISQualitySummary
    explanation: list[str]


class Decision(BaseModel):
    outcome: Literal["RANKED_CANDIDATES", "UNKNOWN_NON_AIS"]
    top_candidate_vessel_id: str | None
    top_candidate_median: float | None
    unknown_median: float = Field(ge=0.0, le=1.0)
    unknown_p05: float = Field(ge=0.0, le=1.0)
    unknown_p95: float = Field(ge=0.0, le=1.0)
    message: str
    disclaimer: str = (
        "Investigative compatibility only. This output is not a legal determination of responsibility."
    )


class Provenance(BaseModel):
    analysis_version: str
    algorithm_config_version: str
    request_sha256: str
    algorithm_config_sha256: str
    random_seed: int
    source_ids: list[str]
    source_hashes: dict[str, str]
    algorithms: list[str]
    warnings: list[str]


class AnalysisResponse(BaseModel):
    incident_id: str
    spill_centroid: GeoPoint
    spill_area_km2: float
    hindcast: HindcastSummary
    candidates: list[VesselCandidate]
    decision: Decision
    provenance: Provenance


# --- Detection Models for Milestone 2 ---
class DetectionRequest(BaseModel):
    center_lat: float = Field(ge=-90.0, le=90.0)
    center_lon: float = Field(ge=-180.0, le=180.0)
    pixel_size_m: float = Field(default=10.0, gt=0.0)
    detection_time: datetime
    source_product_id: str = Field(min_length=1)
    image_base64: str | None = None
    threshold: float = Field(default=0.5, ge=0.0, le=1.0)

    @model_validator(mode="after")
    def validate_det_time(self) -> "DetectionRequest":
        if self.detection_time.tzinfo is None:
            raise ValueError("detection_time must be timezone-aware")
        return self


class DetectionResponse(BaseModel):
    spill_observation: SpillObservation
    centroid: GeoPoint
    slick_area_km2: float
    look_alike_risk: str
    model_info: dict[str, Any]


class LiveCaseRequest(BaseModel):
    incident_id: str = Field(min_length=1)
    aoi_lat: float = Field(ge=-90.0, le=90.0)
    aoi_lon: float = Field(ge=-180.0, le=180.0)
    detection_time: datetime
    image_base64: str | None = None

    # A caller that already holds a delineated slick (an analyst-drawn polygon, or the
    # output of a previous /detect call) supplies it here. Only when it is absent does
    # the orchestrator invoke the SAR detector to derive geometry.
    spill_polygon: list[GeoPoint] | None = Field(default=None, min_length=3)
    oil_probability: float | None = Field(default=None, ge=0.0, le=1.0)
    boundary_sigma_m: float | None = Field(default=None, gt=0.0)
    source_product_id: str | None = Field(default=None, min_length=1)

    # Met-ocean forcing. Supplied values override the adapter defaults; directions are
    # meteorological convention, i.e. the direction the flow/wind is coming FROM.
    wind_speed_mps: float | None = Field(default=None, ge=0.0, le=80.0)
    wind_dir_deg: float | None = Field(default=None, ge=0.0, lt=360.0)
    current_speed_mps: float | None = Field(default=None, ge=0.0, le=10.0)
    current_dir_deg: float | None = Field(default=None, ge=0.0, lt=360.0)

    vessel_tracks: list[VesselTrack] = Field(min_length=1)
    min_age_hours: float = Field(default=1.0, gt=0.0)
    max_age_hours: float = Field(default=6.0, gt=0.0)
    ensemble_size: int = Field(default=200, ge=32, le=1000)
    random_seed: int | None = Field(default=None, ge=0, le=(2**63 - 1))
    particle_path_count: int = Field(default=0, ge=0, le=256)
    particle_path_samples: int = Field(default=12, ge=2, le=128)

    @model_validator(mode="after")
    def validate_live_req(self) -> "LiveCaseRequest":
        if self.detection_time.tzinfo is None:
            raise ValueError("detection_time must be timezone-aware")
        if self.max_age_hours <= self.min_age_hours:
            raise ValueError("max_age_hours must be greater than min_age_hours")
        return self
