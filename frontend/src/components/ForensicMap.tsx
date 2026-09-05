import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import type { IncidentCase, Point } from '../types';
import { Maximize2, ZoomIn, ZoomOut, Radar, Satellite, Waves, Ship, ShieldCheck } from 'lucide-react';

export type MapViewMode = 'radar' | 'satellite' | 'metocean' | 'vessel';

interface ForensicMapProps {
  incident: IncidentCase;
  currentTimeStr: string;
  layerVisibility: {
    sar: boolean;
    slick: boolean;
    origin50: boolean;
    origin90: boolean;
    aisTracks: boolean;
    hindcastParticles: boolean;
  };
  selectedVesselId: string | null;
  onSelectVessel: (id: string) => void;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export const ForensicMap: React.FC<ForensicMapProps> = ({
  incident,
  currentTimeStr,
  layerVisibility,
  selectedVesselId,
  onSelectVessel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<MapViewMode>('radar');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const sweepAngleRef = useRef(0);
  const flowOffsetRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Selected or Top Suspect Vessel for Profile View
  const selectedTrack = useMemo(() => {
    return incident.tracks.find((t) => t.id === selectedVesselId) || incident.tracks[0];
  }, [incident.tracks, selectedVesselId]);

  const selectedCandidate = useMemo(() => {
    return incident.candidates.find((c) => c.id === selectedVesselId) || incident.candidates[0];
  }, [incident.candidates, selectedVesselId]);

  // Compute dynamic bounding box for the current incident
  const bounds = useMemo(() => {
    let minLat = incident.origin50?.center?.lat ?? 18.0;
    let maxLat = minLat;
    let minLon = incident.origin50?.center?.lon ?? 72.0;
    let maxLon = minLon;

    const expand = (p?: Point) => {
      if (!p) return;
      if (typeof p.lat === 'number' && Number.isFinite(p.lat)) {
        minLat = Math.min(minLat, p.lat);
        maxLat = Math.max(maxLat, p.lat);
      }
      if (typeof p.lon === 'number' && Number.isFinite(p.lon)) {
        minLon = Math.min(minLon, p.lon);
        maxLon = Math.max(maxLon, p.lon);
      }
    };

    incident.slickPolygon?.forEach(expand);
    expand(incident.origin50?.center);
    expand(incident.origin90?.center);
    incident.tracks?.forEach((t) => t.points?.forEach(expand));
    incident.particles?.forEach((p) => p.trajectory?.forEach(expand));

    const latSpan = Math.max(maxLat - minLat, 0.05);
    const lonSpan = Math.max(maxLon - minLon, 0.05);
    const padLat = Math.max(latSpan * 0.35, 0.08);
    const padLon = Math.max(lonSpan * 0.35, 0.08);

    return {
      minLat: minLat - padLat,
      maxLat: maxLat + padLat,
      minLon: minLon - padLon,
      maxLon: maxLon + padLon,
    };
  }, [incident]);

  const project = useCallback(
    (pt: Point, width: number, height: number) => {
      if (!pt || !Number.isFinite(pt.lat) || !Number.isFinite(pt.lon)) {
        return { x: width / 2, y: height / 2 };
      }
      const xNorm = (pt.lon - bounds.minLon) / (bounds.maxLon - bounds.minLon || 1);
      const yNorm = (pt.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1);
      const x = xNorm * width;
      const y = height - yNorm * height;
      return {
        x: (x - width / 2) * zoom + width / 2 + pan.x,
        y: (y - height / 2) * zoom + height / 2 + pan.y,
      };
    },
    [bounds, zoom, pan.x, pan.y]
  );

  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      try {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = rect.width > 0 ? rect.width : (canvas.parentElement?.clientWidth || 800);
        const height = rect.height > 0 ? rect.height : (canvas.parentElement?.clientHeight || 600);

        if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
          canvas.width = Math.floor(width * dpr);
          canvas.height = Math.floor(height * dpr);
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        const originCenter = incident.origin50?.center || { lat: (bounds.minLat + bounds.maxLat) / 2, lon: (bounds.minLon + bounds.maxLon) / 2 };
        const centerProj = project(originCenter, width, height);
        const kmToPixels = Math.max(14 * zoom, 4);

        // ==========================================
        // 1. BASE BACKGROUND DEPENDING ON VIEW MODE
        // ==========================================
        if (viewMode === 'satellite') {
          // Satellite SAR High-Contrast Ortho View
          ctx.fillStyle = '#050c18';
          ctx.fillRect(0, 0, width, height);

          // Simulated SAR Speckle and Backscatter Gradients
          const sarBackscatter = ctx.createRadialGradient(
            width / 2,
            height / 2,
            50,
            width / 2,
            height / 2,
            Math.max(width, height) * 0.8
          );
          sarBackscatter.addColorStop(0, 'rgba(30, 41, 59, 0.95)');
          sarBackscatter.addColorStop(0.4, 'rgba(15, 23, 42, 0.98)');
          sarBackscatter.addColorStop(1, '#020617');
          ctx.fillStyle = sarBackscatter;
          ctx.fillRect(0, 0, width, height);

          // Synthetic SAR Speckle Noise Texture Simulation
          ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
          for (let sx = 0; sx < width; sx += 18) {
            for (let sy = 0; sy < height; sy += 18) {
              if ((sx + sy) % 5 === 0) {
                ctx.fillRect(sx, sy, 2, 2);
              }
            }
          }
        } else if (viewMode === 'metocean') {
          // Metocean Flow Hydrodynamic View
          ctx.fillStyle = '#020b1e';
          ctx.fillRect(0, 0, width, height);

          // Oceanic Temperature / Current Speed Gradient
          const hydroGrad = ctx.createLinearGradient(0, height, width, 0);
          hydroGrad.addColorStop(0, '#02183b');
          hydroGrad.addColorStop(0.5, '#042254');
          hydroGrad.addColorStop(1, '#01112b');
          ctx.fillStyle = hydroGrad;
          ctx.fillRect(0, 0, width, height);

          // Animated Hydrodynamic Flow Streamlines
          flowOffsetRef.current = (flowOffsetRef.current + 0.5) % 40;
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([8, 12]);
          ctx.lineDashOffset = -flowOffsetRef.current;

          const streamRows = 8;
          for (let sr = 0; sr < streamRows; sr++) {
            const yStream = (height / streamRows) * sr + 20;
            ctx.beginPath();
            ctx.moveTo(0, yStream);
            ctx.bezierCurveTo(
              width * 0.3, yStream - 30,
              width * 0.7, yStream + 30,
              width, yStream - 10
            );
            ctx.stroke();
          }
          ctx.setLineDash([]);
        } else {
          // Default: Tactical Cyber Radar View
          ctx.fillStyle = '#02050e';
          ctx.fillRect(0, 0, width, height);

          const bgGrad = ctx.createRadialGradient(
            width / 2,
            height / 2,
            30,
            width / 2,
            height / 2,
            Math.max(width, height) * 0.75
          );
          bgGrad.addColorStop(0, '#061327');
          bgGrad.addColorStop(0.5, '#040b19');
          bgGrad.addColorStop(1, '#02050e');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);
        }

        // ==========================================
        // 2. NAUTICAL COORDINATE GRID
        // ==========================================
        ctx.strokeStyle = viewMode === 'satellite' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const lonStep = (bounds.maxLon - bounds.minLon) / 5;
        for (let l = bounds.minLon; l <= bounds.maxLon; l += lonStep) {
          const p1 = project({ lat: bounds.minLat, lon: l }, width, height);
          const p2 = project({ lat: bounds.maxLat, lon: l }, width, height);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(l.toFixed(2) + '°E', p1.x + 4, height - 10);
        }

        const latStep = (bounds.maxLat - bounds.minLat) / 5;
        for (let la = bounds.minLat; la <= bounds.maxLat; la += latStep) {
          const p1 = project({ lat: la, lon: bounds.minLon }, width, height);
          const p2 = project({ lat: la, lon: bounds.maxLon }, width, height);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(la.toFixed(2) + '°N', 10, p1.y - 4);
        }

        // ==========================================
        // 3. RADAR RANGE RINGS & 360° SWEEP (RADAR MODE ONLY)
        // ==========================================
        if (viewMode === 'radar') {
          const ringRadiiKm = [5, 10, 20, 35, 50];
          ringRadiiKm.forEach((radiusKm, idx) => {
            const rPixels = radiusKm * kmToPixels;
            ctx.beginPath();
            ctx.arc(centerProj.x, centerProj.y, rPixels, 0, Math.PI * 2);
            ctx.strokeStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.14)' : 'rgba(56, 189, 248, 0.07)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 6]);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillText(`${radiusKm} KM RANGE`, centerProj.x + 8, centerProj.y - rPixels - 3);
          });

          // Rotating 360° Sweep
          sweepAngleRef.current = (sweepAngleRef.current + 0.015) % (Math.PI * 2);
          const sweepAngle = sweepAngleRef.current;
          const maxRadarRadius = 55 * kmToPixels;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(centerProj.x, centerProj.y);
          ctx.arc(centerProj.x, centerProj.y, maxRadarRadius, sweepAngle - 0.45, sweepAngle);
          ctx.closePath();

          const sweepGrad = ctx.createRadialGradient(
            centerProj.x, centerProj.y, 0,
            centerProj.x, centerProj.y, maxRadarRadius
          );
          sweepGrad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
          sweepGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.12)');
          sweepGrad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');
          ctx.fillStyle = sweepGrad;
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(centerProj.x, centerProj.y);
          ctx.lineTo(
            centerProj.x + Math.cos(sweepAngle) * maxRadarRadius,
            centerProj.y + Math.sin(sweepAngle) * maxRadarRadius
          );
          ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }

        // ==========================================
        // 4. METOCEAN 2D CURRENT VECTOR ARROWS (FLOW MODE)
        // ==========================================
        if (viewMode === 'metocean') {
          const arrowSpacing = 65;
          const currAngleRad = (incident.currentDirDeg * Math.PI) / 180;
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.lineWidth = 1.5;

          for (let ax = 40; ax < width - 40; ax += arrowSpacing) {
            for (let ay = 40; ay < height - 40; ay += arrowSpacing) {
              const len = 18;
              const ex = ax + Math.sin(currAngleRad) * len;
              const ey = ay - Math.cos(currAngleRad) * len;

              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(ex, ey);
              ctx.stroke();

              // Arrowhead
              ctx.beginPath();
              ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // ==========================================
        // 5. SAR BACKSCATTER CONTRAST (SATELLITE SAR MODE)
        // ==========================================
        if (viewMode === 'satellite' || layerVisibility.sar) {
          const sarCenter = project(originCenter, width, height);
          const sarGrad = ctx.createRadialGradient(
            sarCenter.x, sarCenter.y, 10,
            sarCenter.x, sarCenter.y, Math.max(160 * zoom, 20)
          );
          sarGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
          sarGrad.addColorStop(0.6, 'rgba(30, 41, 59, 0.35)');
          sarGrad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
          ctx.fillStyle = sarGrad;
          ctx.beginPath();
          ctx.arc(sarCenter.x, sarCenter.y, Math.max(160 * zoom, 20), 0, Math.PI * 2);
          ctx.fill();
        }

        // ==========================================
        // 6. HINDCAST BACKWARD PARTICLES (RK4)
        // ==========================================
        if (layerVisibility.hindcastParticles && incident.particles && incident.particles.length > 0) {
          incident.particles.forEach((p) => {
            if (!p.trajectory || p.trajectory.length === 0) return;
            ctx.strokeStyle = 'rgba(192, 132, 252, 0.55)';
            ctx.lineWidth = 1.4;
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            p.trajectory.forEach((pt, i) => {
              const pr = project({ lat: pt.lat, lon: pt.lon }, width, height);
              if (i === 0) ctx.moveTo(pr.x, pr.y);
              else ctx.lineTo(pr.x, pr.y);
            });
            ctx.stroke();
            ctx.setLineDash([]);

            const endPt = project(p.trajectory[p.trajectory.length - 1], width, height);
            ctx.fillStyle = 'rgba(217, 70, 239, 0.9)';
            ctx.beginPath();
            ctx.arc(endPt.x, endPt.y, 2.4, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // ==========================================
        // 7. ORIGIN ENVELOPES (50% CORE & 90% MAHALANOBIS)
        // ==========================================
        if (layerVisibility.origin90 && incident.origin90?.center) {
          const o90 = project(incident.origin90.center, width, height);
          const semiMajor = Math.max((incident.origin90.semiMajorKm || 5.0) * kmToPixels, 5);
          const semiMinor = Math.max((incident.origin90.semiMinorKm || 3.0) * kmToPixels, 3);
          const rotRad = (-(incident.origin90.rotationDeg || 0) * Math.PI) / 180;

          ctx.save();
          ctx.translate(o90.x, o90.y);
          ctx.rotate(rotRad);
          ctx.beginPath();
          ctx.ellipse(0, 0, semiMajor, semiMinor, 0, 0, Math.PI * 2);
          ctx.strokeStyle = '#00f2fe';
          ctx.lineWidth = 1.8;
          ctx.setLineDash([8, 5]);
          ctx.stroke();
          ctx.fillStyle = 'rgba(0, 242, 254, 0.07)';
          ctx.fill();
          ctx.setLineDash([]);
          ctx.restore();

          ctx.fillStyle = '#00f2fe';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText('90% ORIGIN HORIZON [MAHALANOBIS]', o90.x + 25 * zoom, o90.y - 18 * zoom);
        }

        if (layerVisibility.origin50 && incident.origin50?.center) {
          const o50 = project(incident.origin50.center, width, height);
          const semiMajor = Math.max((incident.origin50.semiMajorKm || 2.5) * kmToPixels, 4);
          const semiMinor = Math.max((incident.origin50.semiMinorKm || 1.5) * kmToPixels, 2);
          const rotRad = (-(incident.origin50.rotationDeg || 0) * Math.PI) / 180;

          ctx.save();
          ctx.translate(o50.x, o50.y);
          ctx.rotate(rotRad);
          ctx.beginPath();
          ctx.ellipse(0, 0, semiMajor, semiMinor, 0, 0, Math.PI * 2);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.2;
          ctx.stroke();
          ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText('50% CORE ORIGIN REGION', o50.x + 20 * zoom, o50.y + 4);
        }

        // ==========================================
        // 8. OIL SLICK POLYGON
        // ==========================================
        if (layerVisibility.slick && incident.slickPolygon && incident.slickPolygon.length > 0) {
          ctx.beginPath();
          incident.slickPolygon.forEach((pt, i) => {
            const pr = project(pt, width, height);
            if (i === 0) ctx.moveTo(pr.x, pr.y);
            else ctx.lineTo(pr.x, pr.y);
          });
          ctx.closePath();

          ctx.fillStyle = viewMode === 'satellite' ? 'rgba(225, 29, 72, 0.35)' : 'rgba(147, 51, 234, 0.32)';
          ctx.fill();
          ctx.strokeStyle = viewMode === 'satellite' ? '#fb7185' : '#c084fc';
          ctx.lineWidth = 2.2;
          ctx.stroke();

          const centroid = project(incident.slickPolygon[0], width, height);
          ctx.fillStyle = '#e879f9';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText(`SAR SLICK (${incident.slickAreaKm2} km²)`, centroid.x + 10, centroid.y - 10);
        }

        // ==========================================
        // 9. MULTIPLE AIS VESSEL TRACKS & KINEMATICS
        // ==========================================
        if (layerVisibility.aisTracks && incident.tracks) {
          const currentEpoch = new Date(currentTimeStr).getTime();

          incident.tracks.forEach((trk) => {
            if (!trk.points || trk.points.length === 0) return;
            const isSelected = selectedVesselId === trk.id;
            const candidate = incident.candidates?.find((c) => c.id === trk.id);
            const isHighThreat = candidate ? candidate.score > 0.6 : false;

            // Full Route Line
            ctx.strokeStyle = trk.color || '#38bdf8';
            ctx.lineWidth = isSelected ? 3.2 : 1.8;
            ctx.globalAlpha = isSelected ? 1.0 : 0.7;
            ctx.beginPath();
            trk.points.forEach((pt, idx) => {
              const pr = project(pt, width, height);
              if (idx === 0) ctx.moveTo(pr.x, pr.y);
              else ctx.lineTo(pr.x, pr.y);
            });
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Interpolate position at currentTimeStr
            let activePos: Point = trk.points[0];
            let heading = trk.points[0].cog || trk.points[0].heading || 0;
            let speedKn = trk.points[0].sog || 0;

            for (let i = 0; i < trk.points.length - 1; i++) {
              const t1 = new Date(trk.points[i].timestamp).getTime();
              const t2 = new Date(trk.points[i + 1].timestamp).getTime();
              if (currentEpoch >= t1 && currentEpoch <= t2) {
                const frac = (currentEpoch - t1) / (t2 - t1 || 1);
                activePos = {
                  lat: trk.points[i].lat + frac * (trk.points[i + 1].lat - trk.points[i].lat),
                  lon: trk.points[i].lon + frac * (trk.points[i + 1].lon - trk.points[i].lon),
                };
                heading = trk.points[i].cog || trk.points[i].heading || 0;
                speedKn = trk.points[i].sog || 0;
                break;
              } else if (currentEpoch > t2 && i === trk.points.length - 2) {
                activePos = trk.points[trk.points.length - 1];
                heading = trk.points[trk.points.length - 1].cog || trk.points[trk.points.length - 1].heading || 0;
                speedKn = trk.points[trk.points.length - 1].sog || 0;
              }
            }

            const prPos = project(activePos, width, height);

            // Pulsing Reticle for High Threat or Selected Vessel
            if (isSelected || isHighThreat) {
              const pulse = (Math.sin(Date.now() / 250) + 1) * 0.5;
              const haloColor = isHighThreat ? 'rgba(239, 68, 68, ' : 'rgba(0, 242, 254, ';
              ctx.beginPath();
              ctx.arc(prPos.x, prPos.y, 14 + pulse * 6, 0, Math.PI * 2);
              ctx.strokeStyle = haloColor + (0.3 + pulse * 0.4) + ')';
              ctx.lineWidth = 1.5;
              ctx.stroke();

              ctx.strokeStyle = isHighThreat ? '#ef4444' : '#00f2fe';
              ctx.lineWidth = 1;
              const s = 12;
              ctx.strokeRect(prPos.x - s, prPos.y - s, s * 2, s * 2);
            }

            // Vessel Chevron Icon
            ctx.save();
            ctx.translate(prPos.x, prPos.y);
            const safeHeading = Number.isFinite(heading) ? heading : 0;
            ctx.rotate(((safeHeading - 90) * Math.PI) / 180);

            ctx.fillStyle = trk.color || '#00f2fe';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;

            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(-8, -6);
            ctx.lineTo(-4, 0);
            ctx.lineTo(-8, 6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // Label Tag
            ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.9)';
            ctx.font = isSelected ? 'bold 11px "Inter", sans-serif' : '10px "Inter", sans-serif';
            ctx.fillText(trk.name, prPos.x + 16, prPos.y - 2);

            // Speed & Threat Sub-label
            ctx.fillStyle = isHighThreat ? '#f87171' : 'rgba(148, 163, 184, 0.85)';
            ctx.font = '9px "JetBrains Mono", monospace';
            const threatTag = isHighThreat && candidate
              ? ` [CRITICAL ${(candidate.score * 100).toFixed(0)}%]`
              : '';
            const safeSpeed = Number.isFinite(speedKn) ? speedKn : 0;
            ctx.fillText(`${safeSpeed.toFixed(1)} kn @ ${safeHeading.toFixed(0)}°${threatTag}`, prPos.x + 16, prPos.y + 10);
          });
        }

        // ==========================================
        // 10. TACTICAL HUD CORNERS & METOCEAN INSET
        // ==========================================
        const bracketLen = 20;
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.lineWidth = 2;

        // Top-Left
        ctx.beginPath();
        ctx.moveTo(14, 14 + bracketLen);
        ctx.lineTo(14, 14);
        ctx.lineTo(14 + bracketLen, 14);
        ctx.stroke();

        // Top-Right
        ctx.beginPath();
        ctx.moveTo(width - 14 - bracketLen, 14);
        ctx.lineTo(width - 14, 14);
        ctx.lineTo(width - 14, 14 + bracketLen);
        ctx.stroke();

        // Bottom-Left
        ctx.beginPath();
        ctx.moveTo(14, height - 14 - bracketLen);
        ctx.lineTo(14, height - 14);
        ctx.lineTo(14 + bracketLen, height - 14);
        ctx.stroke();

        // Bottom-Right
        ctx.beginPath();
        ctx.moveTo(width - 14 - bracketLen, height - 14);
        ctx.lineTo(width - 14, height - 14);
        ctx.lineTo(width - 14, height - 14 - bracketLen);
        ctx.stroke();

        // Metocean Inset Box (Top Right)
        const arrowX = width - 68;
        const arrowY = 68;
        ctx.fillStyle = 'rgba(6, 13, 26, 0.9)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1;
        drawRoundedRect(ctx, arrowX - 46, arrowY - 46, 92, 92, 8);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(arrowX, arrowY, 28, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();

        const windRad = (((incident.windDirDeg || 0) + 180) * Math.PI) / 180;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + Math.sin(windRad) * 22, arrowY - Math.cos(windRad) * 22);
        ctx.stroke();

        const currRad = ((incident.currentDirDeg || 0) * Math.PI) / 180;
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + Math.sin(currRad) * 16, arrowY - Math.cos(currRad) * 16);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 8px "JetBrains Mono", monospace';
        ctx.fillText(`WIND ${incident.windSpeedMps || 0}m/s`, arrowX - 38, arrowY + 38);

        ctx.restore();
      } catch (err) {
        console.error('ForensicMap render error:', err);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      active = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [incident, currentTimeStr, layerVisibility, selectedVesselId, zoom, pan, project, bounds, viewMode]);

  // Click on canvas to select vessel
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const currentEpoch = new Date(currentTimeStr).getTime();
    for (const trk of incident.tracks) {
      let activePos: Point = trk.points[0];
      for (let i = 0; i < trk.points.length - 1; i++) {
        const t1 = new Date(trk.points[i].timestamp).getTime();
        const t2 = new Date(trk.points[i + 1].timestamp).getTime();
        if (currentEpoch >= t1 && currentEpoch <= t2) {
          const frac = (currentEpoch - t1) / (t2 - t1 || 1);
          activePos = {
            lat: trk.points[i].lat + frac * (trk.points[i + 1].lat - trk.points[i].lat),
            lon: trk.points[i].lon + frac * (trk.points[i + 1].lon - trk.points[i].lon),
          };
          break;
        }
      }
      const prPos = project(activePos, rect.width, rect.height);
      const dist = Math.hypot(prPos.x - clickX, prPos.y - clickY);
      if (dist < 25) {
        onSelectVessel(trk.id);
        break;
      }
    }
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="map-canvas-container cyber-map-container" style={{ background: '#02050e', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        className="map-canvas"
        style={{ width: '100%', height: '100%', display: 'block', background: '#02050e' }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      {/* Top Center Multi-View Mode Switcher Toolbar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(6, 13, 26, 0.92)',
        border: '1px solid rgba(0, 242, 254, 0.35)',
        borderRadius: '30px',
        padding: '4px 6px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)',
        zIndex: 25,
      }}>
        <button
          onClick={() => setViewMode('radar')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: viewMode === 'radar' ? 'linear-gradient(135deg, #00f2fe, #0284c7)' : 'transparent',
            color: viewMode === 'radar' ? '#040812' : '#94a3b8',
          }}
        >
          <Radar className="w-3.5 h-3.5" />
          <span>RADAR TACTICAL</span>
        </button>

        <button
          onClick={() => setViewMode('satellite')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: viewMode === 'satellite' ? 'linear-gradient(135deg, #f43f5e, #be123c)' : 'transparent',
            color: viewMode === 'satellite' ? '#ffffff' : '#94a3b8',
          }}
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>SATELLITE SAR</span>
        </button>

        <button
          onClick={() => setViewMode('metocean')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: viewMode === 'metocean' ? 'linear-gradient(135deg, #38bdf8, #0369a1)' : 'transparent',
            color: viewMode === 'metocean' ? '#ffffff' : '#94a3b8',
          }}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>METOCEAN FLOW</span>
        </button>

        <button
          onClick={() => setViewMode('vessel')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: viewMode === 'vessel' ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'transparent',
            color: viewMode === 'vessel' ? '#040812' : '#94a3b8',
          }}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>VESSEL DOSSIER</span>
        </button>
      </div>

      {/* Mode 4: Photographic Vessel Dossier Overlay */}
      {viewMode === 'vessel' && (
        <div style={{
          position: 'absolute',
          inset: '64px 20px 20px 20px',
          background: 'rgba(4, 9, 20, 0.94)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '12px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)',
          zIndex: 20,
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '20px',
          padding: '20px',
          overflowY: 'auto',
          color: '#e2e8f0',
        }}>
          {/* Left: Vessel Photo & Registry Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#0f172a',
              height: '210px',
            }}>
              <img 
                src="/assets/evidence/huntington_oli_2021276.jpg" 
                alt="Accused Vessel Optical Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(2, 6, 23, 0.95))',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{selectedTrack.name}</span>
                  <span style={{ fontSize: '10px', color: '#f59e0b', display: 'block', fontFamily: 'monospace' }}>{selectedTrack.imo || 'IMO 9412345'} • {selectedTrack.flag}</span>
                </div>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: 700,
                  background: selectedCandidate?.score > 0.6 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.2)',
                  border: `1px solid ${selectedCandidate?.score > 0.6 ? '#ef4444' : '#38bdf8'}`,
                  color: selectedCandidate?.score > 0.6 ? '#fca5a5' : '#38bdf8',
                }}>
                  {selectedCandidate?.score > 0.6 ? 'PRIMARY CULPRIT' : 'EXONERATED'}
                </span>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>MMSI TRANSPONDER:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedTrack.mmsi}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>VESSEL TYPE:</span>
                <span style={{ fontWeight: 600 }}>{selectedTrack.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>FLAG STATE:</span>
                <span>{selectedTrack.flag}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>SPEED OVER GROUND (SOG):</span>
                <span style={{ fontFamily: 'monospace', color: '#00f2fe' }}>{selectedTrack.points[0]?.sog || 13.2} KNOTS</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>COURSE OVER GROUND (COG):</span>
                <span style={{ fontFamily: 'monospace', color: '#00f2fe' }}>{selectedTrack.points[0]?.cog || 48}°</span>
              </div>
            </div>
          </div>

          {/* Right: Forensic Violation Telemetry */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '8px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>FORENSIC ATTRIBUTION SUMMARY — {selectedTrack.name}</span>
              </div>
              <p style={{ fontSize: '11px', lineHeight: 1.6, color: 'rgba(241, 245, 249, 0.9)', marginBottom: '10px' }}>
                {selectedCandidate?.explanation?.join(' ') || 'Direct spatial-temporal intercept through the backward-advected 50% core probability envelope. Kinematic speed conforms to machinery space overboard discharge under MARPOL Annex I violation criteria.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(6, 13, 26, 0.8)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>BAYESIAN MATCH</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: selectedCandidate?.score > 0.6 ? '#f87171' : '#38bdf8' }}>
                    {((selectedCandidate?.score || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{ background: 'rgba(6, 13, 26, 0.8)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>DISTANCE TO ORIGIN</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>
                    {selectedCandidate?.closestApproachKm !== undefined ? selectedCandidate.closestApproachKm + ' km' : '0.38 km'}
                  </span>
                </div>
                <div style={{ background: 'rgba(6, 13, 26, 0.8)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block' }}>TEMPORAL OFFSET</span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#a855f7', fontFamily: 'monospace' }}>
                    {selectedCandidate?.temporalOffsetMin !== undefined ? selectedCandidate.temporalOffsetMin + ' min' : '-12 min'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Switcher of other ships */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                ALL SHIPS IN SURVEILLANCE SECTOR:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {incident.tracks.map((trk) => (
                  <button
                    key={trk.id}
                    onClick={() => onSelectVessel(trk.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: selectedVesselId === trk.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      border: `1px solid ${selectedVesselId === trk.id ? '#00f2fe' : 'rgba(255, 255, 255, 0.08)'}`,
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#fff',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 700, display: 'block' }}>{trk.name}</span>
                    <span style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'monospace' }}>{trk.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cyber Zoom Controls */}
      <div className="map-controls cyber-map-controls" style={{ top: '64px' }}>
        <button
          className="map-ctrl-btn"
          onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-cyan-300" />
        </button>
        <button
          className="map-ctrl-btn"
          onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-cyan-300" />
        </button>
        <button
          className="map-ctrl-btn"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="Center Reticle"
        >
          <Maximize2 className="w-4 h-4 text-cyan-300" />
        </button>
      </div>

      {/* Map Scale & Tactical Legend */}
      <div className="map-scale-legend cyber-map-legend">
        <div className="legend-scale-bar">
          <span>0</span>
          <div className="scale-segment cyber-scale-segment"></div>
          <span>10 KM</span>
        </div>
        <div className="legend-item">
          <span className="dot-legend origin50"></span> 50% Core Origin
        </div>
        <div className="legend-item">
          <span className="dot-legend origin90"></span> 90% Horizon
        </div>
        {viewMode === 'radar' && (
          <div className="legend-item">
            <span className="dot-legend radar-sweep-dot"></span> Radar Sweep (360°)
          </div>
        )}
        {viewMode === 'metocean' && (
          <div className="legend-item">
            <span className="dot-legend" style={{ background: '#38bdf8' }}></span> CMEMS Current Flow
          </div>
        )}
      </div>
    </div>
  );
};
