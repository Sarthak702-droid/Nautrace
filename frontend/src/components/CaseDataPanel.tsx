import React from "react";
import type { IncidentCase } from "../types";
import { Layers, Eye, Compass, Hash, CheckCircle } from "lucide-react";

interface CaseDataPanelProps {
  incident: IncidentCase;
  layerVisibility: {
    sar: boolean;
    slick: boolean;
    origin50: boolean;
    origin90: boolean;
    aisTracks: boolean;
    hindcastParticles: boolean;
  };
  onToggleLayer: (layer: keyof CaseDataPanelProps["layerVisibility"]) => void;
}

export const CaseDataPanel: React.FC<CaseDataPanelProps> = ({
  incident,
  layerVisibility,
  onToggleLayer,
}) => {
  return (
    <aside className="sidebar-panel case-data-panel">
      <div className="panel-section-header">
        <Layers className="w-4 h-4 text-cyan-400" />
        <span>INCIDENT METRICS & FORCING</span>
      </div>

      <div className="metrics-card">
        <div className="metric-row">
          <span className="metric-key">AOI Location</span>
          <span className="metric-val highlight">{incident.region}</span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Detection Time</span>
          <span className="metric-val mono">{new Date(incident.detectionTime).toUTCString()}</span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Slick Area</span>
          <span className="metric-val">
            <strong>{incident.slickAreaKm2.toFixed(2)}</strong> km²
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Oil Probability</span>
          <span className="metric-val text-emerald-400 font-semibold">
            {(incident.oilProbability * 100).toFixed(0)}% (Look-alike: Low)
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Boundary Jitter</span>
          <span className="metric-val mono">±{incident.boundaryUncertaintyM} m (σ)</span>
        </div>
      </div>

      <div className="panel-section-header mt-4">
        <Compass className="w-4 h-4 text-amber-400" />
        <span>MET-OCEAN FORCING</span>
      </div>

      <div className="metrics-card">
        <div className="metric-row">
          <span className="metric-key">Surface Wind</span>
          <span className="metric-val mono">
            {incident.windSpeedMps} m/s @ {incident.windDirDeg}° (SW)
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Ocean Total Current</span>
          <span className="metric-val mono">
            {incident.currentSpeedMps} m/s @ {incident.currentDirDeg}° (ENE)
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Stokes Wave Drift</span>
          <span className="metric-val mono">0.08 m/s (Included in SMOC)</span>
        </div>
      </div>

      <div className="panel-section-header mt-4">
        <Eye className="w-4 h-4 text-purple-400" />
        <span>FORENSIC MAP LAYERS</span>
      </div>

      <div className="layers-list">
        <label className="layer-item">
          <input
            type="checkbox"
            checked={layerVisibility.sar}
            onChange={() => onToggleLayer("sar")}
          />
          <span className="layer-dot sar-dot"></span>
          <span className="layer-name">Sentinel-1 SAR Ortho (VV/VH)</span>
        </label>

        <label className="layer-item">
          <input
            type="checkbox"
            checked={layerVisibility.slick}
            onChange={() => onToggleLayer("slick")}
          />
          <span className="layer-dot slick-dot"></span>
          <span className="layer-name">Observed Slick Mask & Polygon</span>
        </label>

        <label className="layer-item">
          <input
            type="checkbox"
            checked={layerVisibility.origin50}
            onChange={() => onToggleLayer("origin50")}
          />
          <span className="layer-dot origin50-dot"></span>
          <span className="layer-name">50% Probable Origin Envelope</span>
        </label>

        <label className="layer-item">
          <input
            type="checkbox"
            checked={layerVisibility.origin90}
            onChange={() => onToggleLayer("origin90")}
          />
          <span className="layer-dot origin90-dot"></span>
          <span className="layer-name">90% Probable Origin Envelope</span>
        </label>

        <label className="layer-item">
          <input
            type="checkbox"
            checked={layerVisibility.aisTracks}
            onChange={() => onToggleLayer("aisTracks")}
          />
          <span className="layer-dot ais-dot"></span>
          <span className="layer-name">AIS Trajectories & Headings</span>
        </label>

        <label className="layer-item">
          <input
            type="checkbox"
            checked={layerVisibility.hindcastParticles}
            onChange={() => onToggleLayer("hindcastParticles")}
          />
          <span className="layer-dot particle-dot"></span>
          <span className="layer-name">RK4 Backward Lagrangian Cloud</span>
        </label>
      </div>

      <div className="panel-section-header mt-4">
        <Hash className="w-4 h-4 text-emerald-400" />
        <span>CHAIN OF CUSTODY INTEGRITY</span>
      </div>

      <div className="integrity-card">
        <div className="integrity-item">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>SAR Preprocessed via SNAP (COG)</span>
        </div>
        <div className="integrity-item">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>AIS Normalized (Speed Geodesic Filter)</span>
        </div>
        <div className="integrity-item">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Config Hash: {incident.provenance.configSha256.slice(0, 10)}...</span>
        </div>
        <div className="integrity-item">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>RK4 Deterministic Seed Synchronized</span>
        </div>
      </div>
    </aside>
  );
};
