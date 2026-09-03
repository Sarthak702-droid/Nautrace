from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import timedelta

import numpy as np
from shapely.geometry import Point, Polygon

from app.algorithms.ais import AISTemporalSpatialIndex, AISTrajectory
from app.algorithms.geo import bearing_deg, circular_difference_deg, haversine_m
from app.algorithms.hindcast import HindcastComputation
from app.config import AISConfig, AttributionConfig
from app.models import (
    Decision,
    GeoPoint,
    ScoreBreakdown,
    VesselCandidate,
)


@dataclass(frozen=True)
class AttributionComputation:
    candidates: list[VesselCandidate]
    decision: Decision
    unknown_samples: np.ndarray


def _softmax(logits: np.ndarray) -> np.ndarray:
    max_logit = float(np.max(logits))
    shifted = np.exp(logits - max_logit)
    denominator = float(np.sum(shifted))
    if not math.isfinite(denominator) or denominator <= 0.0:
        raise RuntimeError("numerically invalid attribution softmax")
    return shifted / denominator


def _quantiles(values: np.ndarray) -> tuple[float, float, float]:
    if values.size == 0:
        return 0.0, 0.0, 0.0
    p05, median, p95 = np.quantile(values, [0.05, 0.50, 0.95])
    return float(p05), float(median), float(p95)


def _quality_score(trajectory: AISTrajectory) -> float:
    points = trajectory.track.points
    motion_fields = sum(1 for p in points if p.sog_knots is not None or p.cog_deg is not None)
    motion_fraction = motion_fields / len(points) if points else 0.0
    return float(math.sqrt(max(0.0, trajectory.track.quality.valid_fraction * motion_fraction)))


def _candidate_ids(
    index: AISTemporalSpatialIndex,
    hindcast: HindcastComputation,
    ais_config: AISConfig,
) -> set[str]:
    release_times = [m.release_time for m in hindcast.members]
    start = min(release_times) - timedelta(minutes=ais_config.candidate_time_margin_minutes)
    end = max(release_times) + timedelta(minutes=ais_config.candidate_time_margin_minutes)
    radius_m = (
        hindcast.summary.origin_90.semi_major_km + ais_config.candidate_margin_km
    ) * 1000.0
    return index.query(start, end, hindcast.summary.origin_centroid, radius_m)


def rank_vessels(
    trajectories: dict[str, AISTrajectory],
    index: AISTemporalSpatialIndex,
    hindcast: HindcastComputation,
    spill_centroid: GeoPoint,
    ais_config: AISConfig,
    attribution_config: AttributionConfig,
) -> AttributionComputation:
    members = hindcast.members
    ensemble_n = len(members)
    candidate_ids = sorted(_candidate_ids(index, hindcast, ais_config))

    if not candidate_ids:
        unknown = np.ones(ensemble_n, dtype=float)
        decision = Decision(
            outcome="UNKNOWN_NON_AIS",
            top_candidate_vessel_id=None,
            top_candidate_median=None,
            unknown_median=1.0,
            unknown_p05=1.0,
            unknown_p95=1.0,
            message="No AIS-observed trajectory intersects the configured origin space-time search region.",
        )
        return AttributionComputation(candidates=[], decision=decision, unknown_samples=unknown)

    epsilon = attribution_config.epsilon
    weights = attribution_config.feature_weights
    unknown_cfg = attribution_config.unknown
    known_prior_mass = 1.0 - unknown_cfg.prior_mass
    candidate_prior = known_prior_mass / len(candidate_ids)
    log_candidate_prior = math.log(max(epsilon, candidate_prior))
    log_unknown_prior = math.log(max(epsilon, unknown_cfg.prior_mass))

    spatial_bandwidth_m = max(
        attribution_config.min_spatial_bandwidth_m,
        hindcast.summary.spatial_bandwidth_km * 1000.0,
    )
    max_gap_seconds = ais_config.max_interpolation_gap_minutes * 60.0
    env50 = Polygon([(p.lon, p.lat) for p in hindcast.summary.origin_50.polygon])
    env90 = Polygon([(p.lon, p.lat) for p in hindcast.summary.origin_90.polygon])

    release_start = hindcast.summary.release_time.p05
    release_end = hindcast.summary.release_time.p95
    release_median = hindcast.summary.release_time.median

    vessel_logits = np.full((len(candidate_ids), ensemble_n), -np.inf, dtype=float)
    spatial_matrix = np.zeros_like(vessel_logits)
    temporal_matrix = np.zeros_like(vessel_logits)
    heading_matrix = np.zeros_like(vessel_logits)
    overlap50_matrix = np.zeros_like(vessel_logits)
    overlap90_matrix = np.zeros_like(vessel_logits)
    valid_matrix = np.zeros_like(vessel_logits)
    distance_matrix = np.full_like(vessel_logits, np.nan)
    gap_matrix = np.ones_like(vessel_logits)

    global_features: dict[str, dict[str, float]] = {}

    for vessel_idx, vessel_id in enumerate(candidate_ids):
        trajectory = trajectories[vessel_id]
        continuity = trajectory.continuity_score(release_start, release_end)
        quality = _quality_score(trajectory)
        behavior_raw = trajectory.behavior_score(release_median)
        behavior = float(behavior_raw) if behavior_raw is not None else 0.0
        global_features[vessel_id] = {
            "continuity": continuity,
            "quality": quality,
            "behavior": behavior,
        }

        for member_idx, member in enumerate(members):
            interpolated = trajectory.interpolate(member.release_time)
            if interpolated is None:
                ls = epsilon
                lt = epsilon
                lh = 0.5
                o50 = 0.0
                o90 = 0.0
                gap_penalty = 1.0
            else:
                valid_matrix[vessel_idx, member_idx] = 1.0
                distance_m = haversine_m(interpolated.position, member.origin)
                distance_matrix[vessel_idx, member_idx] = distance_m
                ls = math.exp(-(distance_m * distance_m) / (2.0 * spatial_bandwidth_m * spatial_bandwidth_m))

                if interpolated.bracket_gap_seconds <= 0.0:
                    lt = 1.0
                    gap_penalty = 0.0
                else:
                    gap_fraction = min(1.0, interpolated.bracket_gap_seconds / max_gap_seconds)
                    lt = math.exp(-(gap_fraction * gap_fraction) / 2.0)
                    gap_penalty = gap_fraction

                if interpolated.cog_deg is None:
                    lh = 0.5
                else:
                    inferred_direction = bearing_deg(member.origin, spill_centroid)
                    delta = circular_difference_deg(interpolated.cog_deg, inferred_direction)
                    # Expected value for an uninformative uniformly distributed heading is 0.5.
                    lh = (1.0 + math.cos(math.radians(delta))) / 2.0

                o50 = 1.0 if env50.covers(Point(interpolated.position.lon, interpolated.position.lat)) else 0.0
                o90 = 1.0 if env90.covers(Point(interpolated.position.lon, interpolated.position.lat)) else 0.0

            spatial_matrix[vessel_idx, member_idx] = ls
            temporal_matrix[vessel_idx, member_idx] = lt
            heading_matrix[vessel_idx, member_idx] = lh
            overlap50_matrix[vessel_idx, member_idx] = o50
            overlap90_matrix[vessel_idx, member_idx] = o90
            gap_matrix[vessel_idx, member_idx] = gap_penalty

            z = log_candidate_prior
            z += weights.get("spatial", 0.0) * math.log(max(epsilon, ls))
            z += weights.get("temporal", 0.0) * math.log(max(epsilon, lt))
            z += weights.get("heading", 0.0) * lh
            z += weights.get("overlap50", 0.0) * o50
            z += weights.get("overlap90", 0.0) * o90
            z += weights.get("behavior", 0.0) * behavior
            z += weights.get("continuity", 0.0) * continuity
            z += weights.get("data_quality", 0.0) * quality
            z -= weights.get("gap_penalty", 0.0) * gap_penalty
            vessel_logits[vessel_idx, member_idx] = z

    posterior = np.zeros((len(candidate_ids), ensemble_n), dtype=float)
    unknown_samples = np.zeros(ensemble_n, dtype=float)

    for member_idx in range(ensemble_n):
        best_spatial = float(np.max(spatial_matrix[:, member_idx]))
        any_valid = float(np.max(valid_matrix[:, member_idx]))
        unknown_logit = log_unknown_prior
        unknown_logit += unknown_cfg.low_match_weight * (1.0 - best_spatial)
        unknown_logit += unknown_cfg.missing_coverage_weight * (1.0 - any_valid)

        logits = np.concatenate((vessel_logits[:, member_idx], np.array([unknown_logit], dtype=float)))
        probabilities = _softmax(logits)
        posterior[:, member_idx] = probabilities[:-1]
        unknown_samples[member_idx] = probabilities[-1]

    top_hypothesis_per_member = np.argmax(
        np.vstack((posterior, unknown_samples.reshape(1, -1))), axis=0
    )

    candidates: list[VesselCandidate] = []
    for vessel_idx, vessel_id in enumerate(candidate_ids):
        trajectory = trajectories[vessel_id]
        probs = posterior[vessel_idx]
        p05, median, p95 = _quantiles(probs)
        stability = float(np.mean(top_hypothesis_per_member == vessel_idx))
        valid_fraction = float(np.mean(valid_matrix[vessel_idx]))
        finite_distances = distance_matrix[vessel_idx][np.isfinite(distance_matrix[vessel_idx])]
        minimum_distance_km = (
            float(np.min(finite_distances) / 1000.0) if finite_distances.size > 0 else None
        )
        features = global_features[vessel_id]

        spatial = float(np.mean(spatial_matrix[vessel_idx]))
        temporal = float(np.mean(temporal_matrix[vessel_idx]))
        heading = float(np.mean(heading_matrix[vessel_idx]))
        overlap50 = float(np.mean(overlap50_matrix[vessel_idx]))
        overlap90 = float(np.mean(overlap90_matrix[vessel_idx]))
        gap_penalty = float(np.mean(gap_matrix[vessel_idx]))

        explanations: list[str] = []
        explanations.append(
            f"Valid AIS interpolation for {valid_fraction:.1%} of hindcast ensemble release hypotheses."
        )
        if minimum_distance_km is not None:
            explanations.append(
                f"Minimum reconstructed vessel-to-origin distance: {minimum_distance_km:.2f} km."
            )
        explanations.append(
            f"Origin-envelope overlap: 50%={overlap50:.1%}, 90%={overlap90:.1%}."
        )
        explanations.append(
            f"AIS continuity={features['continuity']:.2f}; cleaned-data quality={features['quality']:.2f}."
        )
        if trajectory.behavior_score(release_median) is None:
            explanations.append("Behavioral anomaly evidence unavailable; no behavior bonus was applied.")
        else:
            explanations.append(f"Behavioral compatibility signal={features['behavior']:.2f}.")

        candidates.append(
            VesselCandidate(
                rank=0,
                vessel_id=vessel_id,
                mmsi=trajectory.track.mmsi,
                name=trajectory.track.name,
                compatibility_median=median,
                compatibility_p05=p05,
                compatibility_p95=p95,
                top_rank_stability=stability,
                minimum_origin_distance_km=minimum_distance_km,
                valid_ensemble_fraction=valid_fraction,
                breakdown=ScoreBreakdown(
                    spatial=spatial,
                    temporal_coverage=temporal,
                    heading=heading,
                    origin_overlap_50=overlap50,
                    origin_overlap_90=overlap90,
                    behavior=features["behavior"],
                    ais_continuity=features["continuity"],
                    data_quality=features["quality"],
                    gap_penalty=gap_penalty,
                ),
                ais_quality=trajectory.track.quality,
                explanation=explanations,
            )
        )

    candidates.sort(key=lambda c: (c.compatibility_median, c.top_rank_stability), reverse=True)
    for rank, candidate in enumerate(candidates, start=1):
        candidate.rank = rank

    unknown_p05, unknown_median, unknown_p95 = _quantiles(unknown_samples)
    top = candidates[0] if candidates else None
    decision_cfg = attribution_config.decision

    defensible = top is not None
    if top is not None:
        defensible = defensible and top.compatibility_median >= decision_cfg.minimum_top_median
        defensible = defensible and top.top_rank_stability >= decision_cfg.minimum_top_rank_stability
        if decision_cfg.require_top_exceeds_unknown:
            defensible = defensible and top.compatibility_median > unknown_median

    if defensible and top is not None:
        decision = Decision(
            outcome="RANKED_CANDIDATES",
            top_candidate_vessel_id=top.vessel_id,
            top_candidate_median=top.compatibility_median,
            unknown_median=unknown_median,
            unknown_p05=unknown_p05,
            unknown_p95=unknown_p95,
            message=(
                "The top vessel is the highest-ranked investigative candidate under the supplied satellite, "
                "met-ocean, AIS, model, and uncertainty assumptions."
            ),
        )
    else:
        decision = Decision(
            outcome="UNKNOWN_NON_AIS",
            top_candidate_vessel_id=top.vessel_id if top else None,
            top_candidate_median=top.compatibility_median if top else None,
            unknown_median=unknown_median,
            unknown_p05=unknown_p05,
            unknown_p95=unknown_p95,
            message=(
                "Observed AIS evidence does not satisfy the configured compatibility and stability thresholds; "
                "retain an Unknown/Non-AIS source hypothesis."
            ),
        )

    return AttributionComputation(
        candidates=candidates,
        decision=decision,
        unknown_samples=unknown_samples,
    )
