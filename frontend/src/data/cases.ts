import type { IncidentCase } from "../types";

export const CASES: IncidentCase[] = [
  {
    id: "CASE-001",
    title: "Incident 043 — Arabian Sea Offshore Bunker Dumping",
    region: "Arabian Sea (18.25°N, 71.85°E)",
    detectionTime: "2026-08-14T04:30:00Z",
    slickAreaKm2: 14.82,
    oilProbability: 0.94,
    boundaryUncertaintyM: 45.0,
    windSpeedMps: 7.8,
    windDirDeg: 245,
    currentSpeedMps: 0.42,
    currentDirDeg: 65,
    slickPolygon: [
      { lat: 18.28, lon: 71.89 },
      { lat: 18.31, lon: 71.93 },
      { lat: 18.32, lon: 71.97 },
      { lat: 18.30, lon: 72.01 },
      { lat: 18.27, lon: 71.98 },
      { lat: 18.25, lon: 71.92 },
      { lat: 18.28, lon: 71.89 }
    ],
    origin50: {
      center: { lat: 18.21, lon: 71.81 },
      semiMajorKm: 2.8,
      semiMinorKm: 1.4,
      rotationDeg: 55
    },
    origin90: {
      center: { lat: 18.21, lon: 71.81 },
      semiMajorKm: 5.6,
      semiMinorKm: 3.1,
      rotationDeg: 55
    },
    provenance: {
      rawProductId: "S1A_IW_GRDH_1SDV_20260814T043012_043210_052A18_9F41",
      requestSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      configSha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      algorithmVersion: "nautrace-hindcast-v2.1-rk4",
      oceanForcing: "Copernicus Marine SMOC Hourly (1/12° Merged UV + Stokes)",
      windForcing: "ECMWF Open Data High-Res 10m Wind"
    },
    tracks: [
      {
        id: "vessel-a",
        name: "MT Poseidon Leader",
        mmsi: "419001234",
        imo: "IMO 9412345",
        type: "Crude Oil Tanker (VLCC)",
        flag: "Panama",
        color: "#ef4444",
        points: [
          { timestamp: "2026-08-14T02:00:00Z", lat: 18.05, lon: 71.65, sog: 13.8, cog: 48, heading: 49 },
          { timestamp: "2026-08-14T02:30:00Z", lat: 18.12, lon: 71.72, sog: 13.4, cog: 48, heading: 48 },
          { timestamp: "2026-08-14T03:00:00Z", lat: 18.19, lon: 71.79, sog: 12.1, cog: 50, heading: 50 },
          { timestamp: "2026-08-14T03:30:00Z", lat: 18.26, lon: 71.86, sog: 12.8, cog: 47, heading: 47 },
          { timestamp: "2026-08-14T04:00:00Z", lat: 18.33, lon: 71.93, sog: 13.2, cog: 46, heading: 46 },
          { timestamp: "2026-08-14T04:30:00Z", lat: 18.40, lon: 72.01, sog: 13.5, cog: 45, heading: 45 },
          { timestamp: "2026-08-14T05:00:00Z", lat: 18.47, lon: 72.08, sog: 13.6, cog: 45, heading: 45 }
        ]
      },
      {
        id: "vessel-b",
        name: "MV Ocean Star",
        mmsi: "419005678",
        imo: "IMO 9823456",
        type: "Container Carrier (Panamax)",
        flag: "Liberia",
        color: "#38bdf8",
        points: [
          { timestamp: "2026-08-14T02:00:00Z", lat: 18.38, lon: 71.55, sog: 18.2, cog: 110, heading: 110 },
          { timestamp: "2026-08-14T02:30:00Z", lat: 18.34, lon: 71.68, sog: 18.0, cog: 110, heading: 110 },
          { timestamp: "2026-08-14T03:00:00Z", lat: 18.30, lon: 71.81, sog: 18.1, cog: 108, heading: 108 },
          { timestamp: "2026-08-14T03:30:00Z", lat: 18.26, lon: 71.94, sog: 17.9, cog: 110, heading: 110 },
          { timestamp: "2026-08-14T04:00:00Z", lat: 18.22, lon: 72.07, sog: 18.3, cog: 110, heading: 110 },
          { timestamp: "2026-08-14T04:30:00Z", lat: 18.18, lon: 72.20, sog: 18.0, cog: 112, heading: 112 },
          { timestamp: "2026-08-14T05:00:00Z", lat: 18.14, lon: 72.33, sog: 18.1, cog: 110, heading: 110 }
        ]
      }
    ],
    candidates: [
      {
        id: "vessel-a",
        name: "MT Poseidon Leader (IMO 9412345)",
        type: "Crude Oil Tanker (VLCC)",
        score: 0.942,
        p05: 0.88,
        p95: 0.98,
        closestApproachKm: 0.42,
        temporalOffsetMin: -12.0,
        trajectoryCompatibility: "Strong Match (Intersection 98%)",
        aisContinuity: "Normal Transponder Stream",
        subscores: {
          spatial: 96,
          temporal: 94,
          heading: 92,
          originOverlap: 98,
          aisContinuity: 99,
          behaviourAnomaly: 85,
          ensembleStability: 96
        }
      },
      {
        id: "vessel-b",
        name: "MV Ocean Star (IMO 9823456)",
        type: "Container Carrier (Panamax)",
        score: 0.124,
        p05: 0.04,
        p95: 0.22,
        closestApproachKm: 18.6,
        temporalOffsetMin: 98.0,
        trajectoryCompatibility: "Incompatible Course & Timing",
        aisContinuity: "Normal Transponder Stream",
        subscores: {
          spatial: 14,
          temporal: 10,
          heading: 18,
          originOverlap: 6,
          aisContinuity: 98,
          behaviourAnomaly: 12,
          ensembleStability: 15
        }
      },
      {
        id: "unknown-source",
        name: "UNKNOWN / Non-AIS Alternative Hypothesis",
        type: "Unobserved Dark Vessel / Subsea Infrastructure",
        score: 0.058,
        p05: 0.02,
        p95: 0.12,
        closestApproachKm: 0,
        temporalOffsetMin: 0,
        trajectoryCompatibility: "Low Residual Prior (AIS Traffic Accounted)",
        aisContinuity: "Exonerated by Confirmed Target Overlap",
        isUnknownSource: true,
        subscores: {
          spatial: 8,
          temporal: 12,
          heading: 10,
          originOverlap: 12,
          aisContinuity: 80,
          behaviourAnomaly: 5,
          ensembleStability: 10
        }
      }
    ],
    particles: [
      {
        id: 1,
        trajectory: [
          { t: "2026-08-14T03:00:00Z", lat: 18.28, lon: 71.89 },
          { t: "2026-08-14T03:00:00Z", lat: 18.26, lon: 71.86 },
          { t: "2026-08-14T03:00:00Z", lat: 18.24, lon: 71.83 },
          { t: "2026-08-14T03:00:00Z", lat: 18.21, lon: 71.81 }
        ]
      },
      {
        id: 2,
        trajectory: [
          { t: "2026-08-14T03:00:00Z", lat: 18.31, lon: 71.93 },
          { t: "2026-08-14T03:00:00Z", lat: 18.28, lon: 71.89 },
          { t: "2026-08-14T03:00:00Z", lat: 18.25, lon: 71.85 },
          { t: "2026-08-14T03:00:00Z", lat: 18.22, lon: 71.82 }
        ]
      },
      {
        id: 3,
        trajectory: [
          { t: "2026-08-14T03:00:00Z", lat: 18.32, lon: 71.97 },
          { t: "2026-08-14T03:00:00Z", lat: 18.29, lon: 71.92 },
          { t: "2026-08-14T03:00:00Z", lat: 18.26, lon: 71.87 },
          { t: "2026-08-14T03:00:00Z", lat: 18.23, lon: 71.83 }
        ]
      },
      {
        id: 4,
        trajectory: [
          { t: "2026-08-14T03:00:00Z", lat: 18.25, lon: 71.92 },
          { t: "2026-08-14T03:00:00Z", lat: 18.23, lon: 71.88 },
          { t: "2026-08-14T03:00:00Z", lat: 18.21, lon: 71.84 },
          { t: "2026-08-14T03:00:00Z", lat: 18.19, lon: 71.80 }
        ]
      }
    ]
  },
  {
    id: "CASE-002-UNKNOWN",
    title: "Incident 068 — Singapore Strait Malacca Transit",
    region: "Singapore Strait Approaches (1.20°N, 103.85°E)",
    detectionTime: "2026-08-20T06:15:00Z",
    slickAreaKm2: 9.75,
    oilProbability: 0.96,
    boundaryUncertaintyM: 35.0,
    windSpeedMps: 4.2,
    windDirDeg: 190,
    currentSpeedMps: 0.85,
    currentDirDeg: 80,
    slickPolygon: [
      { lat: 18.28, lon: 71.95 },
      { lat: 18.32, lon: 71.98 },
      { lat: 18.35, lon: 72.03 },
      { lat: 18.32, lon: 72.08 },
      { lat: 18.28, lon: 72.04 },
      { lat: 18.28, lon: 71.95 }
    ],
    origin50: {
      center: { lat: 18.18, lon: 71.78 },
      semiMajorKm: 3.4,
      semiMinorKm: 1.8,
      rotationDeg: 40
    },
    origin90: {
      center: { lat: 18.18, lon: 71.78 },
      semiMajorKm: 6.8,
      semiMinorKm: 3.9,
      rotationDeg: 40
    },
    provenance: {
      rawProductId: "S1B_IW_GRDH_1SDV_20260820T061510_061708_0391A2_F112",
      requestSha256: "4a712e0f8bc991823901a1c90ff39182ab912831bba91829031899ff123901ab",
      configSha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      algorithmVersion: "nautrace-hindcast-v2.1-rk4",
      oceanForcing: "Copernicus Marine SMOC Hourly (Tidal Current Dominant)",
      windForcing: "ECMWF High-Res 10m Wind"
    },
    tracks: [
      {
        id: "vessel-c",
        name: "Ocean Pioneer",
        mmsi: "419009988",
        imo: "IMO 9110022",
        type: "Bulk Carrier",
        flag: "India",
        color: "#38bdf8",
        points: [
          { timestamp: "2026-08-20T03:00:00Z", lat: 18.45, lon: 71.50, sog: 12.0, cog: 70, heading: 70 },
          { timestamp: "2026-08-20T04:00:00Z", lat: 18.48, lon: 71.65, sog: 12.0, cog: 70, heading: 70 },
          { timestamp: "2026-08-20T05:00:00Z", lat: 18.51, lon: 71.80, sog: 12.0, cog: 70, heading: 70 },
          { timestamp: "2026-08-20T06:00:00Z", lat: 18.54, lon: 71.95, sog: 12.0, cog: 70, heading: 70 }
        ]
      }
    ],
    candidates: [
      {
        id: "unknown-source",
        name: "UNKNOWN_NON_AIS (Attributed Culprit)",
        type: "Unidentified Stealth Dark Ship (Transponder Gap)",
        score: 0.884,
        p05: 0.78,
        p95: 0.96,
        closestApproachKm: 0,
        temporalOffsetMin: 0,
        trajectoryCompatibility: "Attributed under IMO A.1106(29) Statutory Standard",
        aisContinuity: "Complete Transponder Non-Emission",
        isUnknownSource: true,
        subscores: {
          spatial: 88,
          temporal: 90,
          heading: 85,
          originOverlap: 92,
          aisContinuity: 95,
          behaviourAnomaly: 30,
          ensembleStability: 96
        }
      },
      {
        id: "vessel-c",
        name: "Ocean Pioneer (IMO 9110022)",
        type: "Bulk Carrier",
        score: 0.116,
        p05: 0.04,
        p95: 0.22,
        closestApproachKm: 22.8,
        temporalOffsetMin: 145.0,
        trajectoryCompatibility: "Exonerated (Outside 90% Horizon)",
        aisContinuity: "Continuous AIS Broadcast",
        subscores: {
          spatial: 10,
          temporal: 8,
          heading: 12,
          originOverlap: 4,
          aisContinuity: 99,
          behaviourAnomaly: 6,
          ensembleStability: 14
        }
      }
    ],
    particles: [
      {
        id: 1,
        trajectory: [
          { t: "2026-08-14T03:00:00Z", lat: 18.30, lon: 71.98 },
          { t: "2026-08-14T03:00:00Z", lat: 18.26, lon: 71.92 },
          { t: "2026-08-14T03:00:00Z", lat: 18.22, lon: 71.85 },
          { t: "2026-08-14T03:00:00Z", lat: 18.18, lon: 71.78 }
        ]
      },
      {
        id: 2,
        trajectory: [
          { t: "2026-08-14T03:00:00Z", lat: 18.33, lon: 72.04 },
          { t: "2026-08-14T03:00:00Z", lat: 18.28, lon: 71.96 },
          { t: "2026-08-14T03:00:00Z", lat: 18.23, lon: 71.88 },
          { t: "2026-08-14T03:00:00Z", lat: 18.19, lon: 71.80 }
        ]
      }
    ]
  },
  {
    id: "CASE-003-NORTHSEA",
    title: "Incident 089 — North Sea Ekofisk Transit",
    region: "North Sea (56.40°N, 3.20°E)",
    detectionTime: "2026-08-25T08:00:00Z",
    slickAreaKm2: 18.50,
    oilProbability: 0.98,
    boundaryUncertaintyM: 30.0,
    windSpeedMps: 11.4,
    windDirDeg: 310,
    currentSpeedMps: 0.55,
    currentDirDeg: 140,
    slickPolygon: [
      { lat: 18.35, lon: 71.90 },
      { lat: 18.38, lon: 71.96 },
      { lat: 18.39, lon: 72.02 },
      { lat: 18.36, lon: 72.06 },
      { lat: 18.32, lon: 72.00 },
      { lat: 18.35, lon: 71.90 }
    ],
    origin50: {
      center: { lat: 18.26, lon: 71.76 },
      semiMajorKm: 3.1,
      semiMinorKm: 1.6,
      rotationDeg: 35
    },
    origin90: {
      center: { lat: 18.26, lon: 71.76 },
      semiMajorKm: 6.2,
      semiMinorKm: 3.5,
      rotationDeg: 35
    },
    provenance: {
      rawProductId: "S1A_IW_GRDH_1SDV_20260825T080014_080212_0411B3_A019",
      requestSha256: "9102ab3910c8129ffb129031899ff123901ab4a712e0f8bc991823901a1c90ff",
      configSha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      algorithmVersion: "nautrace-hindcast-v2.1-rk4",
      oceanForcing: "Copernicus Marine SMOC Arctic/North-Sea 3D Model",
      windForcing: "ECMWF High-Res Storm-Scale Wind"
    },
    tracks: [
      {
        id: "vessel-d",
        name: "Nordic Explorer",
        mmsi: "219004521",
        imo: "IMO 9731100",
        type: "Chemical Tanker",
        flag: "Denmark",
        color: "#ef4444",
        points: [
          { timestamp: "2026-08-25T05:00:00Z", lat: 18.15, lon: 71.60, sog: 15.2, cog: 55, heading: 55 },
          { timestamp: "2026-08-25T06:00:00Z", lat: 18.22, lon: 71.70, sog: 14.8, cog: 54, heading: 54 },
          { timestamp: "2026-08-25T07:00:00Z", lat: 18.30, lon: 71.82, sog: 15.5, cog: 55, heading: 55 },
          { timestamp: "2026-08-25T08:00:00Z", lat: 18.38, lon: 71.95, sog: 15.7, cog: 56, heading: 56 }
        ]
      }
    ],
    candidates: [
      {
        id: "vessel-d",
        name: "Nordic Explorer (IMO 9731100)",
        type: "Chemical Tanker (Double-Hull)",
        score: 0.892,
        p05: 0.81,
        p95: 0.95,
        closestApproachKm: 0.85,
        temporalOffsetMin: -18.0,
        trajectoryCompatibility: "Direct Origin Intersect (96% Match)",
        aisContinuity: "Continuous AIS Broadcast",
        subscores: {
          spatial: 91,
          temporal: 89,
          heading: 88,
          originOverlap: 94,
          aisContinuity: 98,
          behaviourAnomaly: 78,
          ensembleStability: 92
        }
      },
      {
        id: "unknown-source",
        name: "UNKNOWN / Alternative Sources",
        type: "Unobserved Spill",
        score: 0.108,
        p05: 0.05,
        p95: 0.19,
        closestApproachKm: 0,
        temporalOffsetMin: 0,
        trajectoryCompatibility: "Unlikely Prior Given Target Match",
        aisContinuity: "Standard Residual",
        isUnknownSource: true,
        subscores: {
          spatial: 15,
          temporal: 12,
          heading: 10,
          originOverlap: 10,
          aisContinuity: 85,
          behaviourAnomaly: 10,
          ensembleStability: 12
        }
      }
    ],
    particles: [
      {
        id: 1,
        trajectory: [
          { t: "2026-08-14T03:00:00Z", lat: 18.36, lon: 71.98 },
          { t: "2026-08-14T03:00:00Z", lat: 18.32, lon: 71.90 },
          { t: "2026-08-14T03:00:00Z", lat: 18.29, lon: 71.83 },
          { t: "2026-08-14T03:00:00Z", lat: 18.26, lon: 71.76 }
        ]
      }
    ]
  },
  {
    id: "CASE-004-GOMEX",
    title: "Incident 112 — Gulf of Mexico Mississippi Canyon",
    region: "Gulf of Mexico Shelf (28.75°N, 88.40°W)",
    detectionTime: "2026-08-30T14:20:00Z",
    slickAreaKm2: 22.40,
    oilProbability: 0.99,
    boundaryUncertaintyM: 40.0,
    windSpeedMps: 6.5,
    windDirDeg: 120,
    currentSpeedMps: 0.62,
    currentDirDeg: 290,
    slickPolygon: [
      { lat: 18.22, lon: 71.85 },
      { lat: 18.26, lon: 71.89 },
      { lat: 18.28, lon: 71.96 },
      { lat: 18.25, lon: 72.02 },
      { lat: 18.20, lon: 71.95 },
      { lat: 18.22, lon: 71.85 }
    ],
    origin50: {
      center: { lat: 18.30, lon: 72.06 },
      semiMajorKm: 3.8,
      semiMinorKm: 2.1,
      rotationDeg: 110
    },
    origin90: {
      center: { lat: 18.30, lon: 72.06 },
      semiMajorKm: 7.2,
      semiMinorKm: 4.2,
      rotationDeg: 110
    },
    provenance: {
      rawProductId: "S1A_IW_GRDH_1SDV_20260830T142018_142216_0428C1_F098",
      requestSha256: "bba91829031899ff123901ab9102ab3910c8129ffb129031899ff123901ab4a7",
      configSha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      algorithmVersion: "nautrace-hindcast-v2.1-rk4",
      oceanForcing: "Copernicus Marine SMOC Loop-Current Eddy Forcing",
      windForcing: "ECMWF High-Res 10m Wind"
    },
    tracks: [
      {
        id: "vessel-e",
        name: "Starlight Glory",
        mmsi: "354002911",
        imo: "IMO 9642011",
        type: "Suezmax Crude Tanker",
        flag: "Marshall Islands",
        color: "#ef4444",
        points: [
          { timestamp: "2026-08-30T11:00:00Z", lat: 18.42, lon: 72.22, sog: 14.1, cog: 235, heading: 235 },
          { timestamp: "2026-08-30T12:00:00Z", lat: 18.34, lon: 72.12, sog: 13.9, cog: 234, heading: 234 },
          { timestamp: "2026-08-30T13:00:00Z", lat: 18.26, lon: 72.02, sog: 14.0, cog: 235, heading: 235 },
          { timestamp: "2026-08-30T14:00:00Z", lat: 18.18, lon: 71.92, sog: 14.2, cog: 235, heading: 235 }
        ]
      }
    ],
    candidates: [
      {
        id: "vessel-e",
        name: "Starlight Glory (IMO 9642011)",
        type: "Suezmax Crude Tanker",
        score: 0.925,
        p05: 0.86,
        p95: 0.97,
        closestApproachKm: 0.52,
        temporalOffsetMin: -14.0,
        trajectoryCompatibility: "Exact Intersect with Loop Current Advection",
        aisContinuity: "Continuous AIS Broadcast",
        subscores: {
          spatial: 95,
          temporal: 93,
          heading: 90,
          originOverlap: 96,
          aisContinuity: 98,
          behaviourAnomaly: 82,
          ensembleStability: 94
        }
      },
      {
        id: "unknown-source",
        name: "Subsea Pipeline Rupture Hypothesis",
        type: "Subsurface Infrastructure",
        score: 0.075,
        p05: 0.03,
        p95: 0.14,
        closestApproachKm: 0,
        temporalOffsetMin: 0,
        trajectoryCompatibility: "Unlikely Continuous Release Signature",
        aisContinuity: "Subsurface Baseline",
        isUnknownSource: true,
        subscores: {
          spatial: 12,
          temporal: 8,
          heading: 10,
          originOverlap: 8,
          aisContinuity: 90,
          behaviourAnomaly: 5,
          ensembleStability: 8
        }
      }
    ],
    particles: [
      {
        id: 1,
        trajectory: [
          { t: "2026-08-14T03:00:00Z", lat: 18.24, lon: 71.94 },
          { t: "2026-08-14T03:00:00Z", lat: 18.26, lon: 71.98 },
          { t: "2026-08-14T03:00:00Z", lat: 18.28, lon: 72.02 },
          { t: "2026-08-14T03:00:00Z", lat: 18.30, lon: 72.06 }
        ]
      }
    ]
  }
];
