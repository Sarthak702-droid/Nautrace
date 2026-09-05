import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import type { IncidentCase, Point } from '../types';
import { Maximize2, ZoomIn, ZoomOut, Crosshair } from 'lucide-react';

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
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const sweepAngleRef = useRef(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Dynamic bounding box computed from all incident coordinates
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

        // 1. Deep Obsidian Radar Background
        ctx.fillStyle = '#02050e';
        ctx.fillRect(0, 0, width, height);

        // Cosmic atmospheric ocean glow
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

        // Origin reference for radar rings and sweep
        const originCenter = incident.origin50?.center || { lat: (bounds.minLat + bounds.maxLat) / 2, lon: (bounds.minLon + bounds.maxLon) / 2 };
        const centerProj = project(originCenter, width, height);

        // 2. Nautical Coordinate Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const lonStep = (bounds.maxLon - bounds.minLon) / 5;
        for (let l = bounds.minLon; l <= bounds.maxLon; l += lonStep) {
          const p1 = project({ lat: bounds.minLat, lon: l }, width, height);
          const p2 = project({ lat: bounds.maxLat, lon: l }, width, height);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
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

          ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(la.toFixed(2) + '°N', 10, p1.y - 4);
        }

        // 3. Concentric Sonar Distance Rings
        const ringRadiiKm = [5, 10, 20, 35, 50];
        const kmToPixels = Math.max(14 * zoom, 4);

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

        // 4. Rotating 360° Radar Surveillance Sweep Beam
        sweepAngleRef.current = (sweepAngleRef.current + 0.015) % (Math.PI * 2);
        const sweepAngle = sweepAngleRef.current;
        const maxRadarRadius = 55 * kmToPixels;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerProj.x, centerProj.y);
        ctx.arc(centerProj.x, centerProj.y, maxRadarRadius, sweepAngle - 0.45, sweepAngle);
        ctx.closePath();

        const sweepGrad = ctx.createRadialGradient(
          centerProj.x,
          centerProj.y,
          0,
          centerProj.x,
          centerProj.y,
          maxRadarRadius
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

        // 5. SAR Backscatter Ortho Texture Simulation
        if (layerVisibility.sar) {
          const sarCenter = project(originCenter, width, height);
          const sarGrad = ctx.createRadialGradient(
            sarCenter.x,
            sarCenter.y,
            10,
            sarCenter.x,
            sarCenter.y,
            Math.max(160 * zoom, 20)
          );
          sarGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
          sarGrad.addColorStop(0.6, 'rgba(30, 41, 59, 0.35)');
          sarGrad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
          ctx.fillStyle = sarGrad;
          ctx.beginPath();
          ctx.arc(sarCenter.x, sarCenter.y, Math.max(160 * zoom, 20), 0, Math.PI * 2);
          ctx.fill();
        }

        // 6. Hindcast Backward RK4 Stochastic Particles
        if (layerVisibility.hindcastParticles && incident.particles && incident.particles.length > 0) {
          incident.particles.forEach((p) => {
            if (!p.trajectory || p.trajectory.length === 0) return;
            ctx.strokeStyle = 'rgba(192, 132, 252, 0.45)';
            ctx.lineWidth = 1.3;
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            p.trajectory.forEach((pt, i) => {
              const pr = project({ lat: pt.lat, lon: pt.lon }, width, height);
              if (i === 0) ctx.moveTo(pr.x, pr.y);
              else ctx.lineTo(pr.x, pr.y);
            });
            ctx.stroke();
            ctx.setLineDash([]);

            // Particle endpoint glow
            const endPt = project(p.trajectory[p.trajectory.length - 1], width, height);
            ctx.fillStyle = 'rgba(217, 70, 239, 0.85)';
            ctx.beginPath();
            ctx.arc(endPt.x, endPt.y, 2.2, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // 7. 90% Probable Origin Envelope (Mahalanobis Horizon)
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
          ctx.fillStyle = 'rgba(0, 242, 254, 0.06)';
          ctx.fill();
          ctx.setLineDash([]);
          ctx.restore();

          ctx.fillStyle = '#00f2fe';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText('90% ORIGIN HORIZON [MAHALANOBIS]', o90.x + 25 * zoom, o90.y - 18 * zoom);
        }

        // 8. 50% Probable Core Origin Envelope
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
          ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText('50% CORE ORIGIN REGION', o50.x + 20 * zoom, o50.y + 4);
        }

        // 9. Detected Oil Slick Polygon & Iridescent Sheen
        if (layerVisibility.slick && incident.slickPolygon && incident.slickPolygon.length > 0) {
          ctx.beginPath();
          incident.slickPolygon.forEach((pt, i) => {
            const pr = project(pt, width, height);
            if (i === 0) ctx.moveTo(pr.x, pr.y);
            else ctx.lineTo(pr.x, pr.y);
          });
          ctx.closePath();

          ctx.fillStyle = 'rgba(147, 51, 234, 0.28)';
          ctx.fill();
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Centroid marker
          const centroid = project(incident.slickPolygon[0], width, height);
          ctx.fillStyle = '#e879f9';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText(`SAR SLICK (${incident.slickAreaKm2} km²)`, centroid.x + 10, centroid.y - 10);
        }

        // 10. AIS Vessel Tracks & Kinematics
        if (layerVisibility.aisTracks && incident.tracks) {
          const currentEpoch = new Date(currentTimeStr).getTime();

          incident.tracks.forEach((trk) => {
            if (!trk.points || trk.points.length === 0) return;
            const isSelected = selectedVesselId === trk.id;
            const candidate = incident.candidates?.find((c) => c.id === trk.id);
            const isHighThreat = candidate ? candidate.score > 0.6 : false;

            // Draw Full Track Line
            ctx.strokeStyle = trk.color || '#38bdf8';
            ctx.lineWidth = isSelected ? 3 : 1.8;
            ctx.globalAlpha = isSelected ? 1.0 : 0.65;
            ctx.beginPath();
            trk.points.forEach((pt, idx) => {
              const pr = project(pt, width, height);
              if (idx === 0) ctx.moveTo(pr.x, pr.y);
              else ctx.lineTo(pr.x, pr.y);
            });
            ctx.stroke();
            ctx.globalAlpha = 1.0;

            // Interpolate active position at currentTimeStr
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

              // Threat target brackets
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
            ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
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

        // 11. Tactical Corner Brackets (Cyber HUD Overlay)
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

        // 12. Metocean Vector Inset HUD (Top-Right Floating Panel)
        const arrowX = width - 68;
        const arrowY = 68;
        ctx.fillStyle = 'rgba(6, 13, 26, 0.88)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.lineWidth = 1;
        drawRoundedRect(ctx, arrowX - 46, arrowY - 46, 92, 92, 8);
        ctx.fill();
        ctx.stroke();

        // Compass Ring
        ctx.beginPath();
        ctx.arc(arrowX, arrowY, 28, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.stroke();

        // Wind Vector
        const windRad = (((incident.windDirDeg || 0) + 180) * Math.PI) / 180;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + Math.sin(windRad) * 22, arrowY - Math.cos(windRad) * 22);
        ctx.stroke();

        // Current Vector
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
  }, [incident, currentTimeStr, layerVisibility, selectedVesselId, zoom, pan, project, bounds]);

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

      {/* Top Map HUD Bar */}
      <div className="map-top-hud">
        <div className="hud-status-badge">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>SURVEILLANCE RADAR ACTIVE</span>
          <span className="hud-coord-pill">{incident.region}</span>
        </div>
      </div>

      {/* Cyber Zoom Controls */}
      <div className="map-controls cyber-map-controls">
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
          title="Center Surveillance Reticle"
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
        <div className="legend-item">
          <span className="dot-legend radar-sweep-dot"></span> Radar Sweep (360°)
        </div>
      </div>
    </div>
  );
};
