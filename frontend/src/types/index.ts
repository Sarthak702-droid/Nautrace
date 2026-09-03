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
  closestApproachKm: number;
  temporalOffsetMin: number;
  trajectoryCompatibility: string;
  aisContinuity: string;
  isUnknownSource?: boolean;
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
}
