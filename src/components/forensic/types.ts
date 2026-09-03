export interface VesselCandidate {
  mmsi: string;
  name: string;
  flag: string;
  type: string;
  score: number;
  isCulprit: boolean;
  components: {
    spatial: number;
    temporal: number;
    heading: number;
    origin: number;
    aisQuality: number;
    behaviour: number;
  };
  notes: string;
}

export interface IncidentData {
  id: string;
  name: string;
  locationName: string;
  coordinates: string;
  detectedAt: string;
  slickArea: string;
  isUnknownSource: boolean;
  thresholdUsed: number;
  candidates: VesselCandidate[];
  backtrackHours: number;
  windSpeed: string;
  currentDrift: string;
}

export interface LayerState {
  sarSwath: boolean;
  spillPolygon: boolean;
  driftVectors: boolean;
  hindcastTrail: boolean;
  aisTracks: boolean;
  originEllipse: boolean;
}
