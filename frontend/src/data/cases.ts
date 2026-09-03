import type { IncidentCase } from "../types";

export const CASES: IncidentCase[] = [
  {
    id: "CASE-001",
    title: "Incident 043 — Arabian Sea Pipeline Sector",
    region: "Arabian Sea (18.25°N, 71.85°E)",
    detectionTime: "2026-08-14T04:30:00Z",
    slickAreaKm2: 8.42,
    oilProbability: 0.91,
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
          { timestamp: "2026-08-14T05:00:00Z", lat: 18.47, lon: 72.09, sog: 13.5, cog: 45, heading: 45 }
        ]
      },
      {
        id: "vessel-b",
        name: "Pacific Voyager",
        mmsi: "538009876",
        imo: "IMO 9283451",
        type: "Container Vessel",
        flag: "Marshall Islands",
        color: "#f59e0b",
        points: [
          { timestamp: "2026-08-14T02:00:00Z", lat: 18.42, lon: 71.60, sog: 18.5, cog: 110, heading: 112 },
          { timestamp: "2026-08-14T02:30:00Z", lat: 18.38, lon: 71.72, sog: 18.2, cog: 112, heading: 113 },
          { timestamp: "2026-08-14T03:00:00Z", lat: 18.34, lon: 71.84, sog: 18.0, cog: 110, heading: 110 },
          { timestamp: "2026-08-14T03:30:00Z", lat: 18.30, lon: 71.96, sog: 17.8, cog: 111, heading: 111 },
          { timestamp: "2026-08-14T04:00:00Z", lat: 18.26, lon: 72.08, sog: 18.1, cog: 112, heading: 112 },
          { timestamp: "2026-08-14T04:30:00Z", lat: 18.22, lon: 72.20, sog: 18.3, cog: 110, heading: 110 },
          { timestamp: "2026-08-14T05:00:00Z", lat: 18.18, lon: 72.32, sog: 18.2, cog: 110, heading: 110 }
        ]
      }
    ],
    candidates: [
      {
        id: "vessel-a",
        name: "MT Poseidon Leader (IMO 9412345)",
        type: "Crude Oil Tanker",
        score: 0.79,
        p05: 0.63,
        p95: 0.88,
        closestApproachKm: 1.32,
        temporalOffsetMin: 11.2,
        trajectoryCompatibility: "High",
        aisContinuity: "98% (Good)",
        subscores: {
          spatial: 92,
          temporal: 86,
          heading: 73,
          originOverlap: 90,
          aisContinuity: 98,
          behaviourAnomaly: 40,
          ensembleStability: 88
        }
      },
      {
        id: "vessel-b",
        name: "Pacific Voyager (IMO 9283451)",
        type: "Container Vessel",
        score: 0.31,
        p05: 0.15,
        p95: 0.54,
        closestApproachKm: 9.45,
        temporalOffsetMin: 48.6,
        trajectoryCompatibility: "Low (Perpendicular)",
        aisContinuity: "95% (Good)",
        subscores: {
          spatial: 34,
          temporal: 28,
          heading: 25,
          originOverlap: 15,
          aisContinuity: 95,
          behaviourAnomaly: 12,
          ensembleStability: 42
        }
      },
      {
        id: "unknown-source",
        name: "Unknown / Non-AIS Hypothesis",
        type: "Unidentified / Dark Craft / Facility",
        score: 0.18,
        p05: 0.09,
        p95: 0.36,
        closestApproachKm: 0,
        temporalOffsetMin: 0,
        trajectoryCompatibility: "Uncorrelated",
        aisContinuity: "N/A",
        isUnknownSource: true,
        subscores: {
          spatial: 50,
          temporal: 50,
          heading: 50,
          originOverlap: 50,
          aisContinuity: 0,
          behaviourAnomaly: 0,
          ensembleStability: 65
        }
      }
    ],
    particles: [
      {
        id: 1,
        trajectory: [
          { t: "2026-08-14T04:30:00Z", lat: 18.29, lon: 71.95 },
          { t: "2026-08-14T04:00:00Z", lat: 18.27, lon: 71.91 },
          { t: "2026-08-14T03:30:00Z", lat: 18.25, lon: 71.87 },
          { t: "2026-08-14T03:00:00Z", lat: 18.22, lon: 71.82 },
          { t: "2026-08-14T02:30:00Z", lat: 18.20, lon: 71.78 },
          { t: "2026-08-14T02:00:00Z", lat: 18.17, lon: 71.73 }
        ]
      },
      {
        id: 2,
        trajectory: [
          { t: "2026-08-14T04:30:00Z", lat: 18.31, lon: 71.98 },
          { t: "2026-08-14T04:00:00Z", lat: 18.28, lon: 71.93 },
          { t: "2026-08-14T03:30:00Z", lat: 18.25, lon: 71.88 },
          { t: "2026-08-14T03:00:00Z", lat: 18.21, lon: 71.82 },
          { t: "2026-08-14T02:30:00Z", lat: 18.18, lon: 71.77 },
          { t: "2026-08-14T02:00:00Z", lat: 18.15, lon: 71.71 }
        ]
      },
      {
        id: 3,
        trajectory: [
          { t: "2026-08-14T04:30:00Z", lat: 18.27, lon: 71.92 },
          { t: "2026-08-14T04:00:00Z", lat: 18.24, lon: 71.88 },
          { t: "2026-08-14T03:30:00Z", lat: 18.22, lon: 71.84 },
          { t: "2026-08-14T03:00:00Z", lat: 18.19, lon: 71.79 },
          { t: "2026-08-14T02:30:00Z", lat: 18.16, lon: 71.74 },
          { t: "2026-08-14T02:00:00Z", lat: 18.14, lon: 71.69 }
        ]
      },
      {
        id: 4,
        trajectory: [
          { t: "2026-08-14T04:30:00Z", lat: 18.30, lon: 71.94 },
          { t: "2026-08-14T04:00:00Z", lat: 18.27, lon: 71.90 },
          { t: "2026-08-14T03:30:00Z", lat: 18.23, lon: 71.85 },
          { t: "2026-08-14T03:00:00Z", lat: 18.20, lon: 71.80 },
          { t: "2026-08-14T02:30:00Z", lat: 18.17, lon: 71.75 },
          { t: "2026-08-14T02:00:00Z", lat: 18.15, lon: 71.70 }
        ]
      }
    ]
  },
  {
    id: "CASE-002-UNKNOWN",
    title: "Incident 089 — Offshore Mumbai Deepwater (Non-AIS Event)",
    region: "Mumbai High Offshore (19.40°N, 71.20°E)",
    detectionTime: "2026-08-20T06:15:00Z",
    slickAreaKm2: 5.14,
    oilProbability: 0.88,
    boundaryUncertaintyM: 52.0,
    windSpeedMps: 9.4,
    windDirDeg: 210,
    currentSpeedMps: 0.58,
    currentDirDeg: 45,
    slickPolygon: [
      { lat: 19.42, lon: 71.25 },
      { lat: 19.45, lon: 71.29 },
      { lat: 19.43, lon: 71.32 },
      { lat: 19.40, lon: 71.28 },
      { lat: 19.42, lon: 71.25 }
    ],
    origin50: {
      center: { lat: 19.34, lon: 71.16 },
      semiMajorKm: 3.2,
      semiMinorKm: 1.8,
      rotationDeg: 40
    },
    origin90: {
      center: { lat: 19.34, lon: 71.16 },
      semiMajorKm: 6.4,
      semiMinorKm: 3.6,
      rotationDeg: 40
    },
    provenance: {
      rawProductId: "S1B_IW_GRDH_1SDV_20260820T061510_061708_041B20_3A12",
      requestSha256: "7a14f89d3810...a41c",
      configSha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      algorithmVersion: "nautrace-hindcast-v2.1-rk4",
      oceanForcing: "Copernicus Marine SMOC Hourly (1/12° Merged UV + Stokes)",
      windForcing: "ECMWF Open Data High-Res 10m Wind"
    },
    tracks: [
      {
        id: "vessel-c",
        name: "Ocean Pioneer (Distant)",
        mmsi: "419009999",
        imo: "IMO 9110022",
        type: "Bulk Carrier",
        flag: "India",
        color: "#64748b",
        points: [
          { timestamp: "2026-08-20T03:00:00Z", lat: 19.65, lon: 71.40, sog: 12.0, cog: 220, heading: 220 },
          { timestamp: "2026-08-20T04:00:00Z", lat: 19.58, lon: 71.30, sog: 12.0, cog: 220, heading: 220 },
          { timestamp: "2026-08-20T05:00:00Z", lat: 19.50, lon: 71.20, sog: 12.0, cog: 220, heading: 220 },
          { timestamp: "2026-08-20T06:00:00Z", lat: 19.42, lon: 71.10, sog: 12.0, cog: 220, heading: 220 }
        ]
      }
    ],
    candidates: [
      {
        id: "unknown-source",
        name: "UNKNOWN / Non-AIS Source (Attributed)",
        type: "Unidentified / AIS Inactive / Subsea",
        score: 0.86,
        p05: 0.74,
        p95: 0.94,
        closestApproachKm: 0,
        temporalOffsetMin: 0,
        trajectoryCompatibility: "High Confidence Non-AIS",
        aisContinuity: "No Correlating AIS Track",
        isUnknownSource: true,
        subscores: {
          spatial: 85,
          temporal: 88,
          heading: 80,
          originOverlap: 89,
          aisContinuity: 92,
          behaviourAnomaly: 20,
          ensembleStability: 95
        }
      },
      {
        id: "vessel-c",
        name: "Ocean Pioneer (IMO 9110022)",
        type: "Bulk Carrier",
        score: 0.14,
        p05: 0.06,
        p95: 0.26,
        closestApproachKm: 21.4,
        temporalOffsetMin: 112.0,
        trajectoryCompatibility: "Excluded (Beyond 90% Horizon)",
        aisContinuity: "99% (Good)",
        subscores: {
          spatial: 12,
          temporal: 10,
          heading: 15,
          originOverlap: 5,
          aisContinuity: 99,
          behaviourAnomaly: 8,
          ensembleStability: 18
        }
      }
    ],
    particles: []
  }
];
