from __future__ import annotations

import hashlib
import os
from pathlib import Path

import yaml
from pydantic import BaseModel, Field


class WindageConfig(BaseModel):
    mean: float = Field(ge=0.0, le=0.2)
    std: float = Field(ge=0.0, le=0.2)
    min: float = Field(ge=0.0, le=0.2)
    max: float = Field(ge=0.0, le=0.2)


class HindcastConfig(BaseModel):
    ensemble_size: int = Field(ge=32, le=4096)
    integration_step_seconds: int = Field(ge=30, le=3600)
    horizontal_diffusivity_m2_s: float = Field(ge=0.0, le=1000.0)
    current_scale_std: float = Field(ge=0.0, le=1.0)
    wind_scale_std: float = Field(ge=0.0, le=1.0)
    windage: WindageConfig
    envelope_vertices: int = Field(ge=24, le=720)
    min_covariance_variance_m2: float = Field(gt=0.0)
    max_failed_fraction: float = Field(ge=0.0, lt=1.0)
    min_successful_members: int = Field(ge=8, le=4096)


class AISConfig(BaseModel):
    max_implied_speed_knots: float = Field(gt=0.0, le=200.0)
    max_interpolation_gap_minutes: float = Field(gt=0.0, le=1440.0)
    candidate_margin_km: float = Field(gt=0.0, le=1000.0)
    candidate_time_margin_minutes: float = Field(gt=0.0, le=1440.0)
    behavior_window_minutes: float = Field(gt=0.0, le=1440.0)
    baseline_window_minutes: float = Field(gt=0.0, le=10080.0)


class UnknownConfig(BaseModel):
    prior_mass: float = Field(gt=0.0, lt=1.0)
    low_match_weight: float = Field(ge=0.0, le=10.0)
    missing_coverage_weight: float = Field(ge=0.0, le=10.0)


class DecisionConfig(BaseModel):
    minimum_top_median: float = Field(ge=0.0, le=1.0)
    minimum_top_rank_stability: float = Field(ge=0.0, le=1.0)
    require_top_exceeds_unknown: bool = True


class AttributionConfig(BaseModel):
    epsilon: float = Field(gt=0.0, lt=1.0)
    min_spatial_bandwidth_m: float = Field(gt=0.0)
    heading_kappa: float = Field(ge=0.0, le=100.0)
    feature_weights: dict[str, float]
    unknown: UnknownConfig
    decision: DecisionConfig


class AlgorithmConfig(BaseModel):
    version: str
    hindcast: HindcastConfig
    ais: AISConfig
    attribution: AttributionConfig


class LoadedConfig(BaseModel):
    path: str
    sha256: str
    config: AlgorithmConfig


def load_algorithm_config() -> LoadedConfig:
    default_path = Path(__file__).resolve().parents[1] / "config" / "algorithm.yaml"
    path = Path(os.getenv("NAUTRACE_ALGORITHM_CONFIG", str(default_path))).expanduser().resolve()
    raw = path.read_bytes()
    data = yaml.safe_load(raw)
    parsed = AlgorithmConfig.model_validate(data)
    return LoadedConfig(
        path=str(path),
        sha256=hashlib.sha256(raw).hexdigest(),
        config=parsed,
    )
