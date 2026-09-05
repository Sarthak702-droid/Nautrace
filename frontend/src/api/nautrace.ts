/**
 * Client for the NAUTRACE intelligence service.
 *
 * The console sends the case it is displaying to the real hindcast/attribution engine
 * and maps the response back onto the view model. Nothing in this module fabricates
 * scientific values: origin envelopes, particle trajectories, compatibility scores and
 * provenance hashes all originate from the backend.
 */
import type {
  CandidateScore,
  HindcastParticle,
  IncidentCase,
  Point,
  VesselTrack,
} from '../types';

/** Requests go through the Vite dev proxy to the Go gateway by default. */
const API_BASE = (import.meta.env.VITE_NAUTRACE_API_BASE ?? '/api/v1').replace(/\/$/, '');

/** Trajectories drawn on the map. Kept modest so the response stays small. */
const PARTICLE_PATH_COUNT = 45;
const PARTICLE_PATH_SAMPLES = 12;

// --- Wire types (mirroring intelligence/app/models.py) ---

interface WireGeoPoint {
  lat: number;
  lon: number;
}

interface WirePolygonEnvelope {
  probability_mass: number;
  polygon: WireGeoPoint[];
  semi_major_km: number;
  semi_minor_km: number;
  bearing_deg: number;
}

interface WireScoreBreakdown {
  spatial: number;
  temporal_coverage: number;
  heading: number;
  origin_overlap_50: number;
  origin_overlap_90: number;
  behavior: number;
  ais_continuity: number;
  data_quality: number;
  gap_penalty: number;
}

interface WireCandidate {
  rank: number;
  vessel_id: string;
  mmsi: string | null;
  name: string | null;
  compatibility_median: number;
  compatibility_p05: number;
  compatibility_p95: number;
  top_rank_stability: number;
  minimum_origin_distance_km: number | null;
  valid_ensemble_fraction: number;
  breakdown: WireScoreBreakdown;
  explanation: string[];
}

interface WireAnalysisResponse {
  incident_id: string;
  spill_centroid: WireGeoPoint;
  spill_area_km2: number;
  hindcast: {
    engine: string;
    integration_method: string;
    ensemble_size: number;
    origin_centroid: WireGeoPoint;
    origin_50: WirePolygonEnvelope;
    origin_90: WirePolygonEnvelope;
    release_time: { p05: string; median: string; p95: string };
    spatial_bandwidth_km: number;
    failed_members: number;
    particle_paths: { member_index: number; samples: { timestamp: string; lat: number; lon: number }[] }[];
  };
  candidates: WireCandidate[];
  decision: {
    outcome: 'RANKED_CANDIDATES' | 'UNKNOWN_NON_AIS';
    top_candidate_vessel_id: string | null;
    top_candidate_median: number | null;
    unknown_median: number;
    unknown_p05: number;
    unknown_p95: number;
    message: string;
    disclaimer: string;
  };
  provenance: {
    analysis_version: string;
    algorithm_config_version: string;
    request_sha256: string;
    algorithm_config_sha256: string;
    random_seed: number;
    source_ids: string[];
    source_hashes: Record<string, string>;
    algorithms: string[];
    warnings: string[];
  };
}

export class AnalysisError extends Error {
  readonly detail?: unknown;
  constructor(message: string, detail?: unknown) {
    super(message);
    this.name = 'AnalysisError';
    this.detail = detail;
  }
}

// --- Request construction ---

/** The engine rejects malformed identifiers outright, so drop rather than invent them. */
const normaliseMmsi = (raw: string | undefined): string | null => {
  const digits = (raw ?? '').replace(/\D/g, '');
  return digits.length === 9 ? digits : null;
};

const toIsoUtc = (value: string): string => new Date(value).toISOString();

const buildWireTracks = (tracks: VesselTrack[]) =>
  tracks
    // Two points is the minimum the cleaner needs to establish motion.
    .filter((track) => track.points.length >= 2)
    .map((track) => ({
      vessel_id: track.id,
      mmsi: normaliseMmsi(track.mmsi),
      name: track.name,
      vessel_type: track.type,
      source_id: 'nautrace-console',
      points: track.points.map((point) => ({
        timestamp: toIsoUtc(point.timestamp),
        lat: point.lat,
        lon: point.lon,
        sog_knots: Number.isFinite(point.sog) ? Math.min(Math.max(point.sog, 0), 100) : null,
        cog_deg: Number.isFinite(point.cog) ? ((point.cog % 360) + 360) % 360 : null,
      })),
    }));

/**
 * Derives the release-age prior from AIS coverage. Searching further back than the
 * tracks extend would only manufacture gap penalties, so the window is bounded by the
 * observed data rather than by a fixed constant.
 */
const deriveReleaseWindow = (incident: IncidentCase) => {
  const detection = new Date(incident.detectionTime).getTime();
  const earliest = incident.tracks
    .flatMap((track) => track.points)
    .reduce((min, point) => Math.min(min, new Date(point.timestamp).getTime()), detection);

  const coverageHours = (detection - earliest) / 3_600_000;
  const maxAgeHours = Math.min(Math.max(coverageHours * 0.9, 1.5), 24);
  return {
    minAgeHours: Math.max(0.5, maxAgeHours * 0.15),
    maxAgeHours,
  };
};

const centroidOf = (polygon: Point[]): Point => {
  if (polygon.length === 0) return { lat: 0, lon: 0 };
  const sum = polygon.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lon: acc.lon + p.lon }),
    { lat: 0, lon: 0 },
  );
  return { lat: sum.lat / polygon.length, lon: sum.lon / polygon.length };
};

// --- Response mapping ---

const band = (value: number, strong: string, moderate: string, weak: string): string =>
  value >= 0.66 ? strong : value >= 0.33 ? moderate : weak;

const pct = (value: number): number => Math.round(value * 100);

const mapCandidates = (payload: WireAnalysisResponse, incident: IncidentCase): CandidateScore[] => {
  const typeByVesselId = new Map(incident.tracks.map((track) => [track.id, track.type]));
  const ensembleSize = payload.hindcast.ensemble_size;

  const vessels: CandidateScore[] = payload.candidates.map((candidate) => ({
    id: candidate.vessel_id,
    name: candidate.name ?? candidate.vessel_id,
    type: typeByVesselId.get(candidate.vessel_id) ?? 'Unclassified',
    score: candidate.compatibility_median,
    p05: candidate.compatibility_p05,
    p95: candidate.compatibility_p95,
    closestApproachKm:
      candidate.minimum_origin_distance_km === null
        ? undefined
        : Number(candidate.minimum_origin_distance_km.toFixed(2)),
    trajectoryCompatibility: band(candidate.breakdown.spatial, 'Strong', 'Moderate', 'Weak'),
    aisContinuity: band(candidate.breakdown.ais_continuity, 'Normal', 'Intermittent', 'Sparse'),
    ensembleSize,
    explanation: candidate.explanation,
    subscores: {
      spatial: pct(candidate.breakdown.spatial),
      temporal: pct(candidate.breakdown.temporal_coverage),
      heading: pct(candidate.breakdown.heading),
      originOverlap: pct(
        (candidate.breakdown.origin_overlap_50 + candidate.breakdown.origin_overlap_90) / 2,
      ),
      aisContinuity: pct(candidate.breakdown.ais_continuity),
      behaviourAnomaly: pct(candidate.breakdown.behavior),
      ensembleStability: pct(candidate.top_rank_stability),
    },
  }));

  // The Unknown/Non-AIS hypothesis competes in the same softmax, so it belongs in the
  // same ranked list rather than being presented as an afterthought.
  vessels.push({
    id: 'unknown-non-ais',
    name: 'Unknown / Non-AIS Source',
    type: 'Dark vessel hypothesis',
    score: payload.decision.unknown_median,
    p05: payload.decision.unknown_p05,
    p95: payload.decision.unknown_p95,
    trajectoryCompatibility: 'Not applicable',
    aisContinuity: 'No AIS evidence',
    isUnknownSource: true,
    ensembleSize,
  });

  return vessels;
};

const mapParticles = (payload: WireAnalysisResponse): HindcastParticle[] =>
  payload.hindcast.particle_paths.map((path, index) => ({
    id: index + 1,
    trajectory: path.samples.map((sample) => ({
      t: sample.timestamp,
      lat: sample.lat,
      lon: sample.lon,
    })),
  }));

const describeForcing = (sourceIds: string[], fallback: string): string =>
  sourceIds.find((id) => id.startsWith('CMEMS')) ?? fallback;

/** Folds a completed analysis into the case currently displayed by the console. */
export const applyAnalysis = (
  incident: IncidentCase,
  payload: WireAnalysisResponse,
): IncidentCase => {
  const centre: Point = payload.hindcast.origin_centroid;

  return {
    ...incident,
    slickAreaKm2: Number(payload.spill_area_km2.toFixed(2)),
    origin50: {
      center: centre,
      semiMajorKm: payload.hindcast.origin_50.semi_major_km,
      semiMinorKm: payload.hindcast.origin_50.semi_minor_km,
      rotationDeg: payload.hindcast.origin_50.bearing_deg,
    },
    origin90: {
      center: centre,
      semiMajorKm: payload.hindcast.origin_90.semi_major_km,
      semiMinorKm: payload.hindcast.origin_90.semi_minor_km,
      rotationDeg: payload.hindcast.origin_90.bearing_deg,
    },
    candidates: mapCandidates(payload, incident),
    particles: mapParticles(payload),
    provenance: {
      rawProductId: payload.provenance.source_ids[0] ?? incident.provenance.rawProductId,
      requestSha256: payload.provenance.request_sha256,
      configSha256: payload.provenance.algorithm_config_sha256,
      algorithmVersion: `${payload.provenance.analysis_version} / cfg ${payload.provenance.algorithm_config_version}`,
      oceanForcing: describeForcing(payload.provenance.source_ids, incident.provenance.oceanForcing),
      windForcing: incident.provenance.windForcing,
    },
    decision: {
      outcome: payload.decision.outcome,
      message: payload.decision.message,
      disclaimer: payload.decision.disclaimer,
      topCandidateVesselId: payload.decision.top_candidate_vessel_id,
    },
    hindcastMeta: {
      engine: payload.hindcast.engine,
      integrationMethod: payload.hindcast.integration_method,
      ensembleSize: payload.hindcast.ensemble_size,
      failedMembers: payload.hindcast.failed_members,
      spatialBandwidthKm: payload.hindcast.spatial_bandwidth_km,
      releaseP05: payload.hindcast.release_time.p05,
      releaseMedian: payload.hindcast.release_time.median,
      releaseP95: payload.hindcast.release_time.p95,
    },
    warnings: payload.provenance.warnings,
  };
};

// --- Transport ---

/**
 * Runs the real hindcast + attribution pipeline for a case.
 *
 * The gateway wraps successful results in an envelope; a bare intelligence response is
 * also accepted so the console works when pointed straight at the FastAPI service.
 */
export const runAnalysis = async (
  incident: IncidentCase,
  signal?: AbortSignal,
): Promise<IncidentCase> => {
  const tracks = buildWireTracks(incident.tracks);
  if (tracks.length === 0) {
    throw new AnalysisError(
      'This case has no AIS track with at least two positions, so attribution cannot run.',
    );
  }

  const { minAgeHours, maxAgeHours } = deriveReleaseWindow(incident);
  const centre = centroidOf(incident.slickPolygon);

  const body = {
    incident_id: incident.id,
    aoi_lat: centre.lat,
    aoi_lon: centre.lon,
    detection_time: toIsoUtc(incident.detectionTime),
    spill_polygon: incident.slickPolygon.map((p) => ({ lat: p.lat, lon: p.lon })),
    oil_probability: incident.oilProbability,
    boundary_sigma_m: incident.boundaryUncertaintyM,
    source_product_id: incident.provenance.rawProductId,
    wind_speed_mps: incident.windSpeedMps,
    wind_dir_deg: incident.windDirDeg,
    current_speed_mps: incident.currentSpeedMps,
    current_dir_deg: incident.currentDirDeg,
    vessel_tracks: tracks,
    min_age_hours: Number(minAgeHours.toFixed(2)),
    max_age_hours: Number(maxAgeHours.toFixed(2)),
    ensemble_size: 192,
    particle_path_count: PARTICLE_PATH_COUNT,
    particle_path_samples: PARTICLE_PATH_SAMPLES,
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/cases/live-analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw new AnalysisError(
      'Could not reach the intelligence service. Start it with "uvicorn app.main:app --port 8000" and the gateway on :8080.',
      cause,
    );
  }

  const raw: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      raw && typeof raw === 'object' && 'message' in raw
        ? String((raw as { message: unknown }).message)
        : `Analysis failed with HTTP ${response.status}.`;
    throw new AnalysisError(detail, raw);
  }

  const envelope = raw as { analysis?: WireAnalysisResponse } | WireAnalysisResponse | null;
  const payload =
    envelope && 'analysis' in envelope && envelope.analysis
      ? envelope.analysis
      : (envelope as WireAnalysisResponse | null);

  if (!payload?.hindcast || !payload.provenance) {
    throw new AnalysisError('The intelligence service returned an unrecognised response.', raw);
  }

  return applyAnalysis(incident, payload);
};
