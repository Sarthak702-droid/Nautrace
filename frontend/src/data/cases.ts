import type { IncidentCase } from "../types";

export const CASES: IncidentCase[] = [
  {
    id: "CASE-PITCH-MUMBAI",
    title: "Flagship Demonstration: Operation Crimson Wake — Mumbai High-Density Corridor",
    region: "Arabian Sea / Mumbai Approaches (18.85°N, 72.35°E)",
    detectionTime: "2026-09-04T05:30:00Z",
    slickAreaKm2: 18.65,
    oilProbability: 0.985,
    boundaryUncertaintyM: 35.0,
    windSpeedMps: 8.4,
    windDirDeg: 235,
    currentSpeedMps: 0.52,
    currentDirDeg: 65,
    slickPolygon: [
      { lat: 18.31, lon: 71.90 },
      { lat: 18.35, lon: 71.95 },
      { lat: 18.33, lon: 72.03 },
      { lat: 18.28, lon: 72.01 },
      { lat: 18.26, lon: 71.93 },
      { lat: 18.31, lon: 71.90 }
    ],
    origin50: {
      center: { lat: 18.245, lon: 71.825 },
      semiMajorKm: 2.8,
      semiMinorKm: 1.4,
      rotationDeg: 42
    },
    origin90: {
      center: { lat: 18.245, lon: 71.825 },
      semiMajorKm: 5.6,
      semiMinorKm: 3.1,
      rotationDeg: 42
    },
    provenance: {
      rawProductId: "S1A_IW_GRDH_1SDV_20260904T053012_053145_043129_A021",
      requestSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      configSha256: "39ba708ee737ac01241f8dd6b895c1f89d1115e0c88fc487fee4039147c04b0c",
      algorithmVersion: "nautrace-ensemble-lagrangian-v2.1",
      oceanForcing: "Copernicus Marine SMOC Global Reanalysis 3D",
      windForcing: "ECMWF High-Res IFS 10m Atmospheric Forcing"
    },
    tracks: [
      {
        id: "vessel-culprit",
        name: "M/T Poseidon Leader",
        mmsi: "941234567",
        imo: "IMO 9412345",
        type: "Suezmax Crude Oil Tanker",
        flag: "Panama",
        color: "#ef4444",
        points: [
          { timestamp: "2026-09-04T02:00:00Z", lat: 18.12, lon: 71.68, sog: 13.6, cog: 48, heading: 48 },
          { timestamp: "2026-09-04T02:30:00Z", lat: 18.17, lon: 71.74, sog: 13.4, cog: 48, heading: 48 },
          { timestamp: "2026-09-04T03:00:00Z", lat: 18.21, lon: 71.79, sog: 13.2, cog: 47, heading: 47 },
          { timestamp: "2026-09-04T03:30:00Z", lat: 18.25, lon: 71.83, sog: 12.8, cog: 48, heading: 48 },
          { timestamp: "2026-09-04T04:00:00Z", lat: 18.29, lon: 71.88, sog: 13.5, cog: 49, heading: 49 },
          { timestamp: "2026-09-04T04:30:00Z", lat: 18.34, lon: 71.93, sog: 13.6, cog: 48, heading: 48 },
          { timestamp: "2026-09-04T05:00:00Z", lat: 18.39, lon: 71.98, sog: 13.7, cog: 48, heading: 48 },
          { timestamp: "2026-09-04T05:30:00Z", lat: 18.43, lon: 72.03, sog: 13.8, cog: 48, heading: 48 }
        ]
      },
      {
        id: "vessel-container",
        name: "MV Ocean Star",
        mmsi: "982345678",
        imo: "IMO 9823456",
        type: "Container Carrier (Panamax)",
        flag: "Singapore",
        color: "#38bdf8",
        points: [
          { timestamp: "2026-09-04T02:00:00Z", lat: 18.42, lon: 71.65, sog: 19.8, cog: 115, heading: 115 },
          { timestamp: "2026-09-04T02:30:00Z", lat: 18.38, lon: 71.74, sog: 19.5, cog: 115, heading: 115 },
          { timestamp: "2026-09-04T03:00:00Z", lat: 18.34, lon: 71.84, sog: 19.6, cog: 114, heading: 114 },
          { timestamp: "2026-09-04T03:30:00Z", lat: 18.30, lon: 71.94, sog: 19.4, cog: 115, heading: 115 },
          { timestamp: "2026-09-04T04:00:00Z", lat: 18.26, lon: 72.03, sog: 19.5, cog: 115, heading: 115 },
          { timestamp: "2026-09-04T04:30:00Z", lat: 18.22, lon: 72.13, sog: 19.7, cog: 116, heading: 116 },
          { timestamp: "2026-09-04T05:00:00Z", lat: 18.18, lon: 72.22, sog: 19.5, cog: 115, heading: 115 },
          { timestamp: "2026-09-04T05:30:00Z", lat: 18.14, lon: 72.31, sog: 19.6, cog: 115, heading: 115 }
        ]
      },
      {
        id: "vessel-chemical",
        name: "Nordic Explorer",
        mmsi: "973110012",
        imo: "IMO 9731100",
        type: "Chemical Tanker (Double Hull)",
        flag: "Denmark",
        color: "#10b981",
        points: [
          { timestamp: "2026-09-04T02:00:00Z", lat: 18.05, lon: 71.85, sog: 14.8, cog: 350, heading: 350 },
          { timestamp: "2026-09-04T02:30:00Z", lat: 18.12, lon: 71.84, sog: 14.5, cog: 350, heading: 350 },
          { timestamp: "2026-09-04T03:00:00Z", lat: 18.18, lon: 71.83, sog: 14.6, cog: 351, heading: 351 },
          { timestamp: "2026-09-04T03:30:00Z", lat: 18.25, lon: 71.82, sog: 14.7, cog: 350, heading: 350 },
          { timestamp: "2026-09-04T04:00:00Z", lat: 18.32, lon: 71.81, sog: 14.9, cog: 350, heading: 350 },
          { timestamp: "2026-09-04T04:30:00Z", lat: 18.39, lon: 71.80, sog: 14.8, cog: 350, heading: 350 },
          { timestamp: "2026-09-04T05:00:00Z", lat: 18.45, lon: 71.79, sog: 15.0, cog: 350, heading: 350 },
          { timestamp: "2026-09-04T05:30:00Z", lat: 18.52, lon: 71.78, sog: 14.8, cog: 350, heading: 350 }
        ]
      },
      {
        id: "vessel-crude-carrier",
        name: "Starlight Glory",
        mmsi: "964201134",
        imo: "IMO 9642011",
        type: "VLCC Supertanker",
        flag: "Marshall Islands",
        color: "#f59e0b",
        points: [
          { timestamp: "2026-09-04T02:00:00Z", lat: 18.08, lon: 71.95, sog: 15.2, cog: 42, heading: 42 },
          { timestamp: "2026-09-04T02:30:00Z", lat: 18.14, lon: 72.00, sog: 15.0, cog: 42, heading: 42 },
          { timestamp: "2026-09-04T03:00:00Z", lat: 18.20, lon: 72.06, sog: 15.1, cog: 43, heading: 43 },
          { timestamp: "2026-09-04T03:30:00Z", lat: 18.26, lon: 72.12, sog: 15.3, cog: 42, heading: 42 },
          { timestamp: "2026-09-04T04:00:00Z", lat: 18.32, lon: 72.18, sog: 15.2, cog: 42, heading: 42 },
          { timestamp: "2026-09-04T04:30:00Z", lat: 18.38, lon: 72.24, sog: 15.0, cog: 42, heading: 42 },
          { timestamp: "2026-09-04T05:00:00Z", lat: 18.44, lon: 72.30, sog: 15.4, cog: 43, heading: 43 },
          { timestamp: "2026-09-04T05:30:00Z", lat: 18.50, lon: 72.36, sog: 15.1, cog: 42, heading: 42 }
        ]
      },
      {
        id: "vessel-bulk-carrier",
        name: "MV Phoenix Carrier",
        mmsi: "938452145",
        imo: "IMO 9384521",
        type: "Capesize Bulk Ore Carrier",
        flag: "Liberia",
        color: "#a855f7",
        points: [
          { timestamp: "2026-09-04T02:00:00Z", lat: 18.48, lon: 72.15, sog: 11.2, cog: 215, heading: 215 },
          { timestamp: "2026-09-04T02:30:00Z", lat: 18.42, lon: 72.10, sog: 11.0, cog: 215, heading: 215 },
          { timestamp: "2026-09-04T03:00:00Z", lat: 18.36, lon: 72.05, sog: 10.8, cog: 216, heading: 216 },
          { timestamp: "2026-09-04T03:30:00Z", lat: 18.30, lon: 72.00, sog: 10.9, cog: 215, heading: 215 },
          { timestamp: "2026-09-04T04:00:00Z", lat: 18.24, lon: 71.95, sog: 10.7, cog: 215, heading: 215 },
          { timestamp: "2026-09-04T04:30:00Z", lat: 18.18, lon: 71.90, sog: 10.8, cog: 215, heading: 215 },
          { timestamp: "2026-09-04T05:00:00Z", lat: 18.12, lon: 71.85, sog: 10.6, cog: 216, heading: 216 },
          { timestamp: "2026-09-04T05:30:00Z", lat: 18.06, lon: 71.80, sog: 10.5, cog: 215, heading: 215 }
        ]
      }
    ],
    candidates: [
      {
        id: "vessel-culprit",
        name: "M/T Poseidon Leader (IMO 9412345)",
        type: "Suezmax Crude Oil Tanker",
        score: 0.964,
        p05: 0.912,
        p95: 0.988,
        closestApproachKm: 0.38,
        temporalOffsetMin: -12.0,
        trajectoryCompatibility: "Direct Origin Intersect (98% Match)",
        aisContinuity: "Continuous AIS Broadcast",
        ensembleSize: 192,
        explanation: [
          "Direct spatial intercept through 50% core probability envelope at t - 1.8h.",
          "Speed over ground (12.8 kn) matches machinery slop tank overboard discharge signature.",
          "Vessel heading (48°) collinear with SAR slick major elongation axis.",
          "Zero transponder spoofing anomalies or dropout gaps detected."
        ],
        subscores: {
          spatial: 98,
          temporal: 96,
          heading: 94,
          originOverlap: 99,
          aisContinuity: 99,
          behaviourAnomaly: 88,
          ensembleStability: 96
        }
      },
      {
        id: "vessel-container",
        name: "MV Ocean Star (IMO 9823456)",
        type: "Container Carrier (Panamax)",
        score: 0.021,
        p05: 0.005,
        p95: 0.048,
        closestApproachKm: 16.4,
        temporalOffsetMin: 98.0,
        trajectoryCompatibility: "Incompatible Transit Lane & Speed",
        aisContinuity: "Normal Transponder Stream",
        subscores: {
          spatial: 6,
          temporal: 4,
          heading: 12,
          originOverlap: 0,
          aisContinuity: 98,
          behaviourAnomaly: 5,
          ensembleStability: 8
        }
      },
      {
        id: "vessel-chemical",
        name: "Nordic Explorer (IMO 9731100)",
        type: "Chemical Tanker (Double Hull)",
        score: 0.008,
        p05: 0.002,
        p95: 0.022,
        closestApproachKm: 14.8,
        temporalOffsetMin: -45.0,
        trajectoryCompatibility: "Crossed North of Origin Window",
        aisContinuity: "Continuous AIS Broadcast",
        subscores: {
          spatial: 4,
          temporal: 5,
          heading: 8,
          originOverlap: 0,
          aisContinuity: 99,
          behaviourAnomaly: 4,
          ensembleStability: 6
        }
      },
      {
        id: "vessel-crude-carrier",
        name: "Starlight Glory (IMO 9642011)",
        type: "VLCC Supertanker",
        score: 0.004,
        p05: 0.001,
        p95: 0.015,
        closestApproachKm: 22.1,
        temporalOffsetMin: 35.0,
        trajectoryCompatibility: "Parallel Traffic Lane (22km East)",
        aisContinuity: "Continuous AIS Broadcast",
        subscores: {
          spatial: 2,
          temporal: 3,
          heading: 10,
          originOverlap: 0,
          aisContinuity: 98,
          behaviourAnomaly: 3,
          ensembleStability: 4
        }
      },
      {
        id: "vessel-bulk-carrier",
        name: "MV Phoenix Carrier (IMO 9384521)",
        type: "Capesize Bulk Ore Carrier",
        score: 0.002,
        p05: 0.001,
        p95: 0.008,
        closestApproachKm: 26.5,
        temporalOffsetMin: -110.0,
        trajectoryCompatibility: "Inbound Anchorage Approach",
        aisContinuity: "Continuous AIS Broadcast",
        subscores: {
          spatial: 1,
          temporal: 2,
          heading: 4,
          originOverlap: 0,
          aisContinuity: 97,
          behaviourAnomaly: 2,
          ensembleStability: 3
        }
      },
      {
        id: "unknown-source",
        name: "UNKNOWN / Non-AIS Alternative Hypothesis",
        type: "Unobserved Dark Vessel / Subsea Infrastructure",
        score: 0.001,
        p05: 0.001,
        p95: 0.005,
        closestApproachKm: 0,
        temporalOffsetMin: 0,
        trajectoryCompatibility: "Exonerated by Confirmed Target Overlap",
        aisContinuity: "Statistical Residual Prior",
        isUnknownSource: true,
        subscores: {
          spatial: 2,
          temporal: 2,
          heading: 1,
          originOverlap: 0,
          aisContinuity: 95,
          behaviourAnomaly: 1,
          ensembleStability: 2
        }
      }
    ],
    particles: Array.from({ length: 48 }, (_, idx) => {
      const angle = (idx / 48) * Math.PI * 2;
      const r = 0.015 + Math.sin(idx * 3) * 0.008;
      const startLat = 18.31 + Math.sin(angle) * r;
      const startLon = 71.95 + Math.cos(angle) * r;
      const originLat = 18.245;
      const originLon = 71.825;
      const steps = 6;
      return {
        id: idx + 1,
        trajectory: Array.from({ length: steps }, (__, sIdx) => {
          const frac = sIdx / (steps - 1);
          const turbLat = Math.sin(idx + sIdx) * 0.004;
          const turbLon = Math.cos(idx + sIdx) * 0.004;
          return {
            t: new Date(new Date("2026-09-04T05:30:00Z").getTime() - (steps - 1 - sIdx) * 2100000).toISOString(),
            lat: Number((startLat + frac * (originLat - startLat) + turbLat).toFixed(4)),
            lon: Number((startLon + frac * (originLon - startLon) + turbLon).toFixed(4)),
          };
        })
      };
    })
  },
  {
    id: "CASE-002-UNKNOWN",
    title: "Incident 062 — Singapore Strait Unmonitored Dark Spill",
    region: "Singapore Strait Eastern Approaches (1.25°N, 104.20°E)",
    detectionTime: "2026-08-20T11:45:00Z",
    slickAreaKm2: 9.80,
    oilProbability: 0.96,
    boundaryUncertaintyM: 45.0,
    windSpeedMps: 4.8,
    windDirDeg: 190,
    currentSpeedMps: 0.85,
    currentDirDeg: 80,
    slickPolygon: [
      { lat: 1.25, lon: 104.22 },
      { lat: 1.28, lon: 104.26 },
      { lat: 1.26, lon: 104.30 },
      { lat: 1.23, lon: 104.27 },
      { lat: 1.25, lon: 104.22 }
    ],
    origin50: {
      center: { lat: 1.21, lon: 104.14 },
      semiMajorKm: 2.4,
      semiMinorKm: 1.1,
      rotationDeg: 75
    },
    origin90: {
      center: { lat: 1.21, lon: 104.14 },
      semiMajorKm: 4.9,
      semiMinorKm: 2.3,
      rotationDeg: 75
    },
    provenance: {
      rawProductId: "S1A_IW_GRDH_1SDV_20260820T114532_114704_0419A2_F018",
      requestSha256: "7a8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
      configSha256: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
      algorithmVersion: "nautrace-hindcast-v2.1-rk4",
      oceanForcing: "Copernicus Marine SMOC Malacca-Strait Tide High-Res Grid",
      windForcing: "ECMWF High-Res 10m Wind"
    },
    tracks: [
      {
        id: "vessel-b",
        name: "MV Pacific Dawn",
        mmsi: "563001890",
        imo: "IMO 9324510",
        type: "Bulk Carrier",
        flag: "Singapore",
        color: "#10b981",
        points: [
          { timestamp: "2026-08-20T08:00:00Z", lat: 1.35, lon: 104.10, sog: 12.1, cog: 110, heading: 110 },
          { timestamp: "2026-08-20T09:00:00Z", lat: 1.30, lon: 104.25, sog: 12.4, cog: 110, heading: 110 },
          { timestamp: "2026-08-20T10:00:00Z", lat: 1.25, lon: 104.40, sog: 12.0, cog: 110, heading: 110 }
        ]
      }
    ],
    candidates: [
      {
        id: "unknown-source",
        name: "UNKNOWN / Non-AIS Dark Vessel Hypothesis",
        type: "Non-Cooperative Dark Vessel (Transponder Off)",
        score: 0.884,
        p05: 0.79,
        p95: 0.94,
        closestApproachKm: 0,
        temporalOffsetMin: 0,
        trajectoryCompatibility: "Unobserved Non-AIS Source Highly Probable",
        aisContinuity: "No Correlated AIS Broadcasts",
        isUnknownSource: true,
        subscores: {
          spatial: 85,
          temporal: 80,
          heading: 75,
          originOverlap: 90,
          aisContinuity: 95,
          behaviourAnomaly: 40,
          ensembleStability: 88
        }
      },
      {
        id: "vessel-b",
        name: "MV Pacific Dawn (IMO 9324510)",
        type: "Bulk Carrier",
        score: 0.116,
        p05: 0.06,
        p95: 0.21,
        closestApproachKm: 18.2,
        temporalOffsetMin: 140.0,
        trajectoryCompatibility: "Exonerated (Course Incompatible)",
        aisContinuity: "Continuous AIS Broadcast",
        subscores: {
          spatial: 8,
          temporal: 6,
          heading: 10,
          originOverlap: 2,
          aisContinuity: 98,
          behaviourAnomaly: 5,
          ensembleStability: 10
        }
      }
    ],
    particles: []
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
      { lat: 56.45, lon: 3.15 },
      { lat: 56.48, lon: 3.22 },
      { lat: 56.46, lon: 3.30 },
      { lat: 56.42, lon: 3.25 },
      { lat: 56.45, lon: 3.15 }
    ],
    origin50: {
      center: { lat: 56.38, lon: 3.05 },
      semiMajorKm: 3.1,
      semiMinorKm: 1.6,
      rotationDeg: 35
    },
    origin90: {
      center: { lat: 56.38, lon: 3.05 },
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
          { timestamp: "2026-08-25T05:00:00Z", lat: 56.28, lon: 2.88, sog: 15.2, cog: 55, heading: 55 },
          { timestamp: "2026-08-25T06:00:00Z", lat: 56.35, lon: 2.98, sog: 14.8, cog: 54, heading: 54 },
          { timestamp: "2026-08-25T07:00:00Z", lat: 56.42, lon: 3.10, sog: 15.5, cog: 55, heading: 55 },
          { timestamp: "2026-08-25T08:00:00Z", lat: 56.50, lon: 3.22, sog: 15.7, cog: 56, heading: 56 }
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
      }
    ],
    particles: []
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
      { lat: 28.70, lon: -88.45 },
      { lat: 28.76, lon: -88.38 },
      { lat: 28.78, lon: -88.32 },
      { lat: 28.73, lon: -88.35 },
      { lat: 28.70, lon: -88.45 }
    ],
    origin50: {
      center: { lat: 28.82, lon: -88.25 },
      semiMajorKm: 3.8,
      semiMinorKm: 2.1,
      rotationDeg: 110
    },
    origin90: {
      center: { lat: 28.82, lon: -88.25 },
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
          { timestamp: "2026-08-30T11:00:00Z", lat: 28.92, lon: -88.10, sog: 14.1, cog: 235, heading: 235 },
          { timestamp: "2026-08-30T12:00:00Z", lat: 28.85, lon: -88.20, sog: 13.9, cog: 234, heading: 234 },
          { timestamp: "2026-08-30T13:00:00Z", lat: 28.78, lon: -88.32, sog: 14.0, cog: 235, heading: 235 },
          { timestamp: "2026-08-30T14:00:00Z", lat: 28.70, lon: -88.45, sog: 14.2, cog: 235, heading: 235 }
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
      }
    ],
    particles: []
  }
];
