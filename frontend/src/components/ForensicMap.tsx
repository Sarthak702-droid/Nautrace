import React, { useRef, useEffect, useState } from "react";
import type { IncidentCase, Point } from "../types";
import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";

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
  void onSelectVessel;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Map Bounds for Arabian Sea scene
  const minLat = 17.95;
  const maxLat = 18.55;
  const minLon = 71.55;
  const maxLon = 72.45;

  const project = (pt: Point, width: number, height: number) => {
    const x = ((pt.lon - minLon) / (maxLon - minLon)) * width;
    const y = height - ((pt.lat - minLat) / (maxLat - minLat)) * height;
    return {
      x: (x - width / 2) * zoom + width / 2 + pan.x,
      y: (y - height / 2) * zoom + height / 2 + pan.y,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;

    // 1. Draw Deep Ocean Background
    ctx.fillStyle = "#080f1d";
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Nautical Coordinate Grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let lon = 71.6; lon <= 72.4; lon += 0.2) {
      const p1 = project({ lat: minLat, lon }, width, height);
      const p2 = project({ lat: maxLat, lon }, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.font = "10px monospace";
      ctx.fillText(lon.toFixed(1) + "°E", p1.x + 4, height - 10);
    }
    for (let lat = 18.0; lat <= 18.5; lat += 0.1) {
      const p1 = project({ lat, lon: minLon }, width, height);
      const p2 = project({ lat, lon: maxLon }, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.font = "10px monospace";
      ctx.fillText(lat.toFixed(1) + "°N", 10, p1.y - 4);
    }

    // 3. SAR Backscatter Ortho Layer (Simulation / Texture)
    if (layerVisibility.sar) {
      const sarCenter = project({ lat: 18.25, lon: 71.95 }, width, height);
      const sarGrad = ctx.createRadialGradient(
        sarCenter.x,
        sarCenter.y,
        10,
        sarCenter.x,
        sarCenter.y,
        160 * zoom
      );
      sarGrad.addColorStop(0, "rgba(15, 23, 42, 0.85)");
      sarGrad.addColorStop(0.6, "rgba(30, 41, 59, 0.4)");
      sarGrad.addColorStop(1, "rgba(15, 23, 42, 0.0)");
      ctx.fillStyle = sarGrad;
      ctx.beginPath();
      ctx.arc(sarCenter.x, sarCenter.y, 160 * zoom, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Draw Hindcast Backward Particles
    if (layerVisibility.hindcastParticles && incident.particles) {
      incident.particles.forEach((p) => {
        ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        p.trajectory.forEach((pt, i) => {
          const pr = project({ lat: pt.lat, lon: pt.lon }, width, height);
          if (i === 0) ctx.moveTo(pr.x, pr.y);
          else ctx.lineTo(pr.x, pr.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // 5. Draw 90% Probable Origin Envelope (Mahalanobis ellipse)
    if (layerVisibility.origin90) {
      const o90 = project(incident.origin90.center, width, height);
      ctx.save();
      ctx.translate(o90.x, o90.y);
      ctx.rotate((-incident.origin90.rotationDeg * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        incident.origin90.semiMajorKm * 18 * zoom,
        incident.origin90.semiMinorKm * 18 * zoom,
        0,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "rgba(6, 182, 212, 0.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.fillStyle = "rgba(6, 182, 212, 0.06)";
      ctx.fill();
      ctx.setLineDash([]);
      ctx.restore();

      // Label
      ctx.fillStyle = "#06b6d4";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText("90% Origin Horizon", o90.x + 35 * zoom, o90.y - 20 * zoom);
    }

    // 6. Draw 50% Probable Origin Envelope
    if (layerVisibility.origin50) {
      const o50 = project(incident.origin50.center, width, height);
      ctx.save();
      ctx.translate(o50.x, o50.y);
      ctx.rotate((-incident.origin50.rotationDeg * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        incident.origin50.semiMajorKm * 18 * zoom,
        incident.origin50.semiMinorKm * 18 * zoom,
        0,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "rgba(245, 158, 11, 0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
      ctx.fill();
      ctx.restore();

      // Label
      ctx.fillStyle = "#f59e0b";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText("50% Probable Origin", o50.x + 20 * zoom, o50.y);
    }

    // 7. Draw Detected Oil Slick Polygon
    if (layerVisibility.slick && incident.slickPolygon.length > 0) {
      ctx.beginPath();
      incident.slickPolygon.forEach((pt, i) => {
        const pr = project(pt, width, height);
        if (i === 0) ctx.moveTo(pr.x, pr.y);
        else ctx.lineTo(pr.x, pr.y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(147, 51, 234, 0.45)";
      ctx.fill();
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spill centroid tag
      const pFirst = project(incident.slickPolygon[0], width, height);
      ctx.fillStyle = "#f3e8ff";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText("Observed Oil Slick (04:30 UTC)", pFirst.x - 20, pFirst.y - 12);
    }

    // 8. Draw AIS Vessel Tracks and Dynamic Position at currentTimeStr
    if (layerVisibility.aisTracks) {
      const currentEpoch = new Date(currentTimeStr).getTime();

      incident.tracks.forEach((trk) => {
        const isSelected = selectedVesselId === trk.id;

        // Draw Full Historical Path
        ctx.strokeStyle = trk.color;
        ctx.lineWidth = isSelected ? 3 : 1.5;
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
            break;
          } else if (currentEpoch > t2 && i === trk.points.length - 2) {
            activePos = trk.points[trk.points.length - 1];
            heading = trk.points[trk.points.length - 1].cog;
          }
        }

        const prPos = project(activePos, width, height);

        // Vessel Ship Shape / Icon
        ctx.save();
        ctx.translate(prPos.x, prPos.y);
        ctx.rotate(((heading - 90) * Math.PI) / 180);

        ctx.fillStyle = trk.color;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;

        // Draw pointed ship chevron
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-8, -6);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-8, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Label
        ctx.fillStyle = "#ffffff";
        ctx.font = isSelected ? "bold 12px Inter, sans-serif" : "11px Inter, sans-serif";
        ctx.fillText(trk.name, prPos.x + 14, prPos.y + 4);
      });
    }

    // 9. Metocean Vector Inset (Wind & Current)
    const arrowX = width - 70;
    const arrowY = 70;
    ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.roundRect(arrowX - 45, arrowY - 45, 90, 90, 8);
    ctx.fill();
    ctx.stroke();

    // Wind vector (from SW -> pointing NE)
    const windRad = ((incident.windDirDeg + 180) * Math.PI) / 180;
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX + Math.sin(windRad) * 25, arrowY - Math.cos(windRad) * 25);
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "9px monospace";
    ctx.fillText("WIND " + incident.windSpeedMps + "m/s", arrowX - 35, arrowY + 36);
  }, [incident, currentTimeStr, layerVisibility, selectedVesselId, zoom, pan]);

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
    <div className="map-canvas-container">
      <canvas
        ref={canvasRef}
        className="map-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="map-controls">
        <button
          className="map-ctrl-btn"
          onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          className="map-ctrl-btn"
          onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          className="map-ctrl-btn"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      <div className="map-scale-legend">
        <div className="legend-scale-bar">
          <span>0</span>
          <div className="scale-segment"></div>
          <span>10 km</span>
        </div>
        <div className="legend-item">
          <span className="dot-legend origin50"></span> 50% Origin Contour
        </div>
        <div className="legend-item">
          <span className="dot-legend origin90"></span> 90% Origin Horizon
        </div>
      </div>
    </div>
  );
};
