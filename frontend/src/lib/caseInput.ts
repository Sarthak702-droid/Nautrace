import type { IncidentCase, Point } from '../types';

const centroidOf = (polygon: Point[]): Point => {
  if (polygon.length === 0) return { lat: 0, lon: 0 };
  const sum = polygon.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lon: acc.lon + p.lon }),
    { lat: 0, lon: 0 },
  );
  return { lat: sum.lat / polygon.length, lon: sum.lon / polygon.length };
};

/**
 * Keeps observation inputs (slick, AIS tracks, metocean) and clears any
 * pre-baked attribution / hindcast outputs until the intelligence service runs.
 */
export function toInputCase(incident: IncidentCase): IncidentCase {
  const center =
    incident.slickPolygon.length > 0
      ? centroidOf(incident.slickPolygon)
      : incident.origin50.center;

  return {
    ...incident,
    candidates: [],
    particles: [],
    origin50: { center, semiMajorKm: 0, semiMinorKm: 0, rotationDeg: 0 },
    origin90: { center, semiMajorKm: 0, semiMinorKm: 0, rotationDeg: 0 },
    decision: undefined,
    hindcastMeta: undefined,
    warnings: undefined,
  };
}

export function hasAnalysisResults(incident: IncidentCase): boolean {
  return Boolean(incident.decision) || incident.candidates.length > 0;
}
