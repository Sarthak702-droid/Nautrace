from __future__ import annotations

import hashlib
import json

import numpy as np

from app.algorithms.ais import AISTemporalSpatialIndex, AISTrackCleaner, AISTrajectory
from app.algorithms.attribution import rank_vessels
from app.algorithms.geo import polygon_area_km2, polygon_centroid
from app.algorithms.hindcast import EnsembleLagrangianHindcast
from app.algorithms.metocean import RegularGridMetoceanField
from app.config import LoadedConfig
from app.models import AnalysisRequest, AnalysisResponse, Provenance

ANALYSIS_VERSION = "0.2.0-research"


def _canonical_request_bytes(request: AnalysisRequest) -> bytes:
    payload = request.model_dump(mode="json", exclude_none=False)
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode("utf-8")


def _seed_from_hash(request_sha256: str) -> int:
    return int(request_sha256[:16], 16) & ((1 << 63) - 1)


class AnalysisService:
    def __init__(self, loaded_config: LoadedConfig) -> None:
        self.loaded_config = loaded_config
        self.config = loaded_config.config
        self.cleaner = AISTrackCleaner(self.config.ais)
        self.hindcast_engine = EnsembleLagrangianHindcast(self.config.hindcast)

    def analyze(self, request: AnalysisRequest) -> AnalysisResponse:
        request_bytes = _canonical_request_bytes(request)
        request_sha256 = hashlib.sha256(request_bytes).hexdigest()
        seed = request.random_seed if request.random_seed is not None else _seed_from_hash(request_sha256)
        rng = np.random.default_rng(seed)

        spill_centroid = polygon_centroid(request.spill.polygon)
        spill_area = polygon_area_km2(request.spill.polygon)
        forcing = RegularGridMetoceanField(request.metocean)

        ensemble_size = request.ensemble_size or self.config.hindcast.ensemble_size
        hindcast = self.hindcast_engine.run(
            spill=request.spill,
            prior=request.release_prior,
            forcing=forcing,
            ensemble_size=ensemble_size,
            rng=rng,
        )

        trajectories: dict[str, AISTrajectory] = {}
        warnings: list[str] = []
        for raw_track in request.ais_tracks:
            try:
                cleaned = self.cleaner.clean(raw_track)
            except ValueError as exc:
                warnings.append(str(exc))
                continue
            trajectories[cleaned.vessel_id] = AISTrajectory(cleaned, self.config.ais)

        index = AISTemporalSpatialIndex(trajectories)
        attribution = rank_vessels(
            trajectories=trajectories,
            index=index,
            hindcast=hindcast,
            spill_centroid=spill_centroid,
            ais_config=self.config.ais,
            attribution_config=self.config.attribution,
        )

        source_ids = [request.spill.source_product_id, request.metocean.source_id]
        source_ids.extend(sorted({track.source_id for track in request.ais_tracks}))
        source_hashes: dict[str, str] = {}
        if request.spill.source_sha256:
            source_hashes[request.spill.source_product_id] = request.spill.source_sha256.lower()
        if request.metocean.source_sha256:
            source_hashes[request.metocean.source_id] = request.metocean.source_sha256.lower()

        if request.metocean.stokes_east_mps is None or request.metocean.stokes_north_mps is None:
            warnings.append(
                "No separate Stokes-drift field was supplied. This is acceptable when the selected current product "
                "already represents the required surface drift components; otherwise forcing is incomplete."
            )
        warnings.append(
            "Compatibility values are relative evidence masses under the configured model, not calibrated probabilities of legal responsibility."
        )

        provenance = Provenance(
            analysis_version=ANALYSIS_VERSION,
            algorithm_config_version=self.config.version,
            request_sha256=request_sha256,
            algorithm_config_sha256=self.loaded_config.sha256,
            random_seed=seed,
            source_ids=source_ids,
            source_hashes=source_hashes,
            algorithms=[
                "WGS84 geodesic spill geometry",
                "trilinear met-ocean interpolation in time/latitude/longitude",
                "RK4 backward Lagrangian advection",
                "stochastic horizontal diffusion",
                "ensemble parameter uncertainty propagation",
                "empirical covariance origin envelopes",
                "AIS deduplication and impossible-motion rejection",
                "binary-search geodesic AIS trajectory interpolation",
                "time-bisect + KD-tree candidate retrieval",
                "ensemble explainable evidence fusion with explicit unknown hypothesis",
            ],
            warnings=warnings,
        )

        return AnalysisResponse(
            incident_id=request.incident_id,
            spill_centroid=spill_centroid,
            spill_area_km2=spill_area,
            hindcast=hindcast.summary,
            candidates=attribution.candidates,
            decision=attribution.decision,
            provenance=provenance,
        )
