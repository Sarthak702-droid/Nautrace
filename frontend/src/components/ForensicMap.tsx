import React, { useRef, useEffect, useState, useCallback } from 'react';
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

  // Map Bounds for Arabian Sea scene
  const minLat = 17.95;
  const maxLat = 18.55;
  const minLon = 71.55;
  const maxLon = 72.45;

  const project = useCallback((pt: Point, width: number, height: number) => {
    const x = ((pt.lon - minLon) / (maxLon - minLon)) * width;
    const y = height - ((pt.lat - minLat) / (maxLat - minLat)) * height;
    return {
      x: (x - width / 2) * zoom + width / 2 + pan.x,
      y: (y - height / 2) * zoom + height / 2 + pan.y,
    };
  }, [zoom, pan.x, pan.y]);

  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle high DPI
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);
      const width = rect.width;
      const height = rect.height;

      // 1. Deep Cyber Obsidian Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric ocean radial gradient
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, Math.max(width, height) * 0.7);
      bgGrad.addColorStop(0, '#07152d');
      bgGrad.addColorStop(0.5, '#040b1a');
      bgGrad.addColorStop(1, '#02050e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Calculate origin center for radar rings and sweep
      const centerProj = project(incident.origin50.center, width, height);

      // 2. Concentric Sonar / Surveillance Distance Rings
      const ringRadiiKm = [5, 10, 20, 30, 45];
      const kmToPixels = 18 * zoom;

      ringRadiiKm.forEach((radiusKm, idx) => {
        const rPixels = radiusKm * kmToPixels;
        ctx.beginPath();
        ctx.arc(centerProj.x, centerProj.y, rPixels, 0, Math.PI * 2);
        ctx.strokeStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(56, 189, 248, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ring distance label
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`${radiusKm} KM RANGE`, centerProj.x + 8, centerProj.y - rPixels - 3);
      });

      // 3. Rotating 360° Radar Surveillance Sweep Beam
      sweepAngleRef.current = (sweepAngleRef.current + 0.015) % (Math.PI * 2);
      const sweepAngle = sweepAngleRef.current;
      const maxRadarRadius = 48 * kmToPixels;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerProj.x, centerProj.y);
      ctx.arc(centerProj.x, centerProj.y, maxRadarRadius, sweepAngle - 0.45, sweepAngle);
      ctx.closePath();

      const sweepGrad = ctx.createRadialGradient(centerProj.x, centerProj.y, 0, centerProj.x, centerProj.y, maxRadarRadius);
      sweepGrad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
      sweepGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.12)');
      sweepGrad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      // Leading beam edge
      ctx.beginPath();
      ctx.moveTo(centerProj.x, centerProj.y);
      ctx.lineTo(centerProj.x + Math.cos(sweepAngle) * maxRadarRadius, centerProj.y + Math.sin(sweepAngle) * maxRadarRadius);
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.75)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // 4. Nautical Coordinate Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      for (let lon = 71.6; lon <= 72.4; lon += 0.2) {
        const p1 = project({ lat: minLat, lon }, width, height);
        const p2 = project({ lat: maxLat, lon }, width, height);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(lon.toFixed(1) + '°E', p1.x + 4, height - 12);
      }
      for (let lat = 18.0; lat <= 18.5; lat += 0.1) {
        const p1 = project({ lat, lon: minLon }, width, height);
        const p2 = project({ lat, lon: maxLon }, width, height);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(lat.toFixed(1) + '°N', 12, p1.y - 4);
      }

      // 5. SAR Backscatter Ortho Texture Simulation
      if (layerVisibility.sar) {
        const sarCenter = project({ lat: 18.25, lon: 71.95 }, width, height);
        const sarGrad = ctx.createRadialGradient(sarCenter.x, sarCenter.y, 10, sarCenter.x, sarCenter.y, 180 * zoom);
        sarGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
        sarGrad.addColorStop(0.6, 'rgba(30, 41, 59, 0.35)');
        sarGrad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
        ctx.fillStyle = sarGrad;
        ctx.beginPath();
        ctx.arc(sarCenter.x, sarCenter.y, 180 * zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Hindcast Backward Particles (RK4 cloud)
      if (layerVisibility.hindcastParticles && incident.particles) {
        incident.particles.forEach((p) => {
          ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
          ctx.lineWidth = 1.2;
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
          if (p.trajectory.length > 0) {
            const endPt = project(p.trajectory[p.trajectory.length - 1], width, height);
            ctx.fillStyle = 'rgba(217, 70, 239, 0.7)';
            ctx.beginPath();
            ctx.arc(endPt.x, endPt.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // 7. 90% Probable Origin Envelope (Mahalanobis Dispersion Horizon)
      if (layerVisibility.origin90) {
        const o90 = project(incident.origin90.center, width, height);
        ctx.save();
        ctx.translate(o90.x, o90.y);
        ctx.rotate((-incident.origin90.rotationDeg * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, incident.origin90.semiMajorKm * 18 * zoom, incident.origin90.semiMinorKm * 18 * zoom, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([8, 5]);
        ctx.shadowColor = 'rgba(0, 242, 254, 0.6)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0, 242, 254, 0.05)';
        ctx.fill();
        ctx.setLineDash([]);
        ctx.restore();

        // Origin 90 Label Badge
        ctx.fillStyle = '#00f2fe';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText('90% ORIGIN HORIZON [MAHALANOBIS]', o90.x + 35 * zoom, o90.y - 20 * zoom);
      }

      // 8. 50% Probable Core Origin Envelope
      if (layerVisibility.origin50) {
        const o50 = project(incident.origin50.center, width, height);
        ctx.save();
        ctx.translate(o50.x, o50.y);
        ctx.rotate((-incident.origin50.rotationDeg * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, incident.origin50.semiMajorKm * 18 * zoom, incident.origin50.semiMinorKm * 18 * zoom, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
        ctx.fill();
        ctx.restore();

        // Origin 50 Label
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText('50% CORE ORIGIN REGION', o50.x + 22 * zoom, o50.y + 4);
      }

      // 9. Detected Oil Slick Polygon & Glow
      if (layerVisibility.slick && incident.slickPolygon.length > 0) {
        ctx.beginPath();
        incident.slickPolygon.forEach((pt, i) => {
          const pr = project(pt, width, height);
          if (i === 0) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        });
        ctx.closePath();

        // Holographic Slick Fill
        ctx.fillStyle = 'rgba(168, 85, 247, 0.45)';
        ctx.fill();
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(192, 132, 252, 0.7)';
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Centroid Target Reticle
        const pFirst = project(incident.slickPolygon[0], width, height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(pFirst.x - 6, pFirst.y - 6, 12, 12);

        ctx.fillStyle = '#f3e8ff';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillText('OBSERVED SLICK [04:30 UTC]', pFirst.x - 16, pFirst.y - 14);
      }

      // 10. AIS Vessel Tracks, Threat Halos, and Kinematic Heading Vectors
      if (layerVisibility.aisTracks) {
        const currentEpoch = new Date(currentTimeStr).getTime();

        incident.tracks.forEach((trk) => {
          const isSelected = selectedVesselId === trk.id;
          const candidate = incident.candidates.find((c) => c.id === trk.id);
          const isHighThreat = candidate && candidate.score >= 0.85;

          // Full Historical Path with glowing line
          ctx.strokeStyle = trk.color;
          ctx.lineWidth = isSelected ? 3 : 1.6;
          ctx.globalAlpha = isSelected ? 1.0 : 0.65;
          ctx.beginPath();
          trk.points.forEach((pt, idx) => {
            const pr = project(pt, width, height);
            if (idx === 0) ctx.moveTo(pr.x, pr.y);
            else ctx.lineTo(pr.x, pr.y);
          });
          ctx.stroke();
          ctx.globalAlpha = 1.0;

          // Interpolate current position based on currentTimeStr
          let activePos: Point = trk.points[0];
          let heading = trk.points[0].cog;
          let speedKn = trk.points[0].sog;

          for (let i = 0; i < trk.points.length - 1; i++) {
            const t1 = new Date(trk.points[i].timestamp).getTime();
            const t2 = new Date(trk.points[i + 1].timestamp).getTime();
            if (currentEpoch >= t1 && currentEpoch <= t2) {
              const frac = (currentEpoch - t1) / (t2 - t1);
              activePos = {
                lat: trk.points[i].lat + frac * (trk.points[i + 1].lat - trk.points[i].lat),
                lon: trk.points[i].lon + frac * (trk.points[i + 1].lon - trk.points[i].lon),
              };
              heading = trk.points[i].cog;
              speedKn = trk.points[i].sog;
              break;
            } else if (currentEpoch > t2 && i === trk.points.length - 2) {
              activePos = trk.points[trk.points.length - 1];
              heading = trk.points[trk.points.length - 1].cog;
              speedKn = trk.points[trk.points.length - 1].sog;
            }
          }

          const prPos = project(activePos, width, height);

          // Threat Pulsing Halo for high risk / selected vessel
          if (isSelected || isHighThreat) {
            const pulse = (Math.sin(Date.now() / 250) + 1) * 0.5;
            const haloColor = isHighThreat ? 'rgba(239, 68, 68, ' : 'rgba(0, 242, 254, ';
            ctx.beginPath();
            ctx.arc(prPos.x, prPos.y, 16 + pulse * 8, 0, Math.PI * 2);
            ctx.strokeStyle = haloColor + (0.3 + pulse * 0.4) + ')';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Threat target brackets
            ctx.strokeStyle = isHighThreat ? '#ef4444' : '#00f2fe';
            ctx.lineWidth = 1;
            const s = 14;
            ctx.strokeRect(prPos.x - s, prPos.y - s, s * 2, s * 2);
          }

          // Vessel Icon Chevron
          ctx.save();
          ctx.translate(prPos.x, prPos.y);
          ctx.rotate(((heading - 90) * Math.PI) / 180);

          ctx.fillStyle = trk.color;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.moveTo(14, 0);
          ctx.lineTo(-9, -7);
          ctx.lineTo(-5, 0);
          ctx.lineTo(-9, 7);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Target Info Chip Tag
          ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
          ctx.font = isSelected ? 'bold 12px "Inter", sans-serif' : '11px "Inter", sans-serif';
          ctx.fillText(trk.name, prPos.x + 18, prPos.y - 2);

          // Speed and Threat Sub-label
          ctx.fillStyle = isHighThreat ? '#f87171' : 'rgba(148, 163, 184, 0.9)';
          ctx.font = '9px "JetBrains Mono", monospace';
          const threatTag = isHighThreat ? ' [CRITICAL 94%]' : '';
          ctx.fillText(`${speedKn.toFixed(1)} kn @ ${heading.toFixed(0)}°${threatTag}`, prPos.x + 18, prPos.y + 11);
        });
      }

      // 11. Tactical Corner Brackets (Cyber HUD Overlay)
      const bracketLen = 22;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 2;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(16, 16 + bracketLen);
      ctx.lineTo(16, 16);
      ctx.lineTo(16 + bracketLen, 16);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(width - 16 - bracketLen, 16);
      ctx.lineTo(width - 16, 16);
      ctx.lineTo(width - 16, 16 + bracketLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(16, height - 16 - bracketLen);
      ctx.lineTo(16, height - 16);
      ctx.lineTo(16 + bracketLen, height - 16);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(width - 16 - bracketLen, height - 16);
      ctx.lineTo(width - 16, height - 16);
      ctx.lineTo(width - 16, height - 16 - bracketLen);
      ctx.stroke();

      // 12. Metocean Vector Inset HUD (Top-Right Floating Panel)
      const arrowX = width - 80;
      const arrowY = 80;
      ctx.fillStyle = 'rgba(6, 13, 26, 0.88)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(arrowX - 52, arrowY - 52, 104, 104, 10);
      ctx.fill();
      ctx.stroke();

      // Compass Ring
      ctx.beginPath();
      ctx.arc(arrowX, arrowY, 34, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      // Wind Vector
      const windRad = ((incident.windDirDeg + 180) * Math.PI) / 180;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX + Math.sin(windRad) * 26, arrowY - Math.cos(windRad) * 26);
      ctx.stroke();

      // Current Vector
      const currRad = (incident.currentDirDeg * Math.PI) / 180;
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX + Math.sin(currRad) * 20, arrowY - Math.cos(currRad) * 20);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillText(`WIND ${incident.windSpeedMps}m/s`, arrowX - 44, arrowY + 44);

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      active = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [incident, currentTimeStr, layerVisibility, selectedVesselId, zoom, pan, project]);

  // Click on canvas to select vessel
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const currentEpoch = new Date(currentTimeStr).getTime();
    for (const trk of incident.tracks) {
      // Find position at current time
      let activePos: Point = trk.points[0];
      for (let i = 0; i < trk.points.length - 1; i++) {
        const t1 = new Date(trk.points[i].timestamp).getTime();
        const t2 = new Date(trk.points[i + 1].timestamp).getTime();
        if (currentEpoch >= t1 && currentEpoch <= t2) {
          const frac = (currentEpoch - t1) / (t2 - t1);
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
    <div className="map-canvas-container cyber-map-container">
      <canvas
        ref={canvasRef}
        className="map-canvas"
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
