export interface Point {
  lat: number;
  lon: number;
}

export interface AISPoint extends Point {
  timestamp: string;
  sog: number;
  cog: number;
  heading?: number;
}

export interface VesselTrack {
  id: string;
  name: string;
  mmsi: string;
  imo?: string;
  type: string;
  flag: string;
  points: AISPoint[];
  color: string;
}

export interface CandidateScore {
  id: string;
  name: string;
  type: string;
  score: number;
  p05: number;
  p95: number;
  /** Absent when the engine could not reconstruct a position for any ensemble member. */
  closestApproachKm?: number;
  /** Absent for backend-computed candidates; the engine reports gaps, not a signed offset. */
  temporalOffsetMin?: number;
  trajectoryCompatibility: string;
  aisContinuity: string;
  isUnknownSource?: boolean;
  /** Ensemble members actually integrated, used to describe rank stability honestly. */
  ensembleSize?: number;
  /** Human-readable evidence lines produced by the attribution engine. */
  explanation?: string[];
  subscores?: {
    spatial: number;
    temporal: number;
    heading: number;
    originOverlap: number;
    aisContinuity: number;
    behaviourAnomaly: number;
    ensembleStability: number;
  };
}

export interface EllipseParams {
  center: Point;
  semiMajorKm: number;
  semiMinorKm: number;
  rotationDeg: number;
}

export interface HindcastParticle {
  id: number;
  trajectory: { t: string; lat: number; lon: number }[];
}

export interface AnalysisDecision {
  outcome: 'RANKED_CANDIDATES' | 'UNKNOWN_NON_AIS';
  message: string;
  disclaimer: string;
  topCandidateVesselId: string | null;
}

export interface HindcastMeta {
  engine: string;
  integrationMethod: string;
  ensembleSize: number;
  failedMembers: number;
  spatialBandwidthKm: number;
  releaseP05: string;
  releaseMedian: string;
  releaseP95: string;
}

export interface IncidentCase {
  id: string;
  title: string;
  region: string;
  detectionTime: string;
  slickPolygon: Point[];
  slickAreaKm2: number;
  oilProbability: number;
  boundaryUncertaintyM: number;
  origin50: EllipseParams;
  origin90: EllipseParams;
  windSpeedMps: number;
  windDirDeg: number;
  currentSpeedMps: number;
  currentDirDeg: number;
  tracks: VesselTrack[];
  candidates: CandidateScore[];
  particles: HindcastParticle[];
  provenance: {
    rawProductId: string;
    requestSha256: string;
    configSha256: string;
    algorithmVersion: string;
    oceanForcing: string;
    windForcing: string;
  };
  /** Populated once the case has been analysed by the intelligence service. */
  decision?: AnalysisDecision;
  hindcastMeta?: HindcastMeta;
  warnings?: string[];
}
