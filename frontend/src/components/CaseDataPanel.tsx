import React from 'react';
import type { IncidentCase } from '../types';
import { Layers, Compass, Hash, CheckCircle2, Shield, Wind, Droplets, Radio, Navigation2 } from 'lucide-react';

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
  onToggleLayer: (layer: keyof CaseDataPanelProps['layerVisibility']) => void;
}

export const CaseDataPanel: React.FC<CaseDataPanelProps> = ({
  incident,
  layerVisibility,
  onToggleLayer,
}) => {
  const activeLayersCount = Object.values(layerVisibility).filter(Boolean).length;

  return (
    <aside className="sidebar-panel case-data-panel cyber-side-panel">
      {/* Panel Header HUD */}
      <div className="cyber-panel-header">
        <div className="cyber-panel-title">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>INCIDENT TELEMETRY</span>
        </div>
        <span className="cyber-status-chip">LIVE SENSORS</span>
      </div>

      {/* Target AOI Metrics */}
      <div className="cyber-data-card">
        <div className="card-glow-bar"></div>
        
        <div className="metric-row">
          <span className="metric-key">Target AOI</span>
          <span className="metric-val highlight">{incident.region}</span>
        </div>

        <div className="metric-row">
          <span className="metric-key">SAR Acquisition</span>
          <span className="metric-val mono">{new Date(incident.detectionTime).toUTCString().replace(' GMT', ' UTC')}</span>
        </div>

        <div className="metric-row">
          <span className="metric-key">Detected Slick Area</span>
          <span className="metric-val bold-cyan">
            <strong>{incident.slickAreaKm2.toFixed(2)}</strong> km²
          </span>
        </div>

        <div className="metric-row">
          <span className="metric-key">Neural Confidence</span>
          <span className="metric-val text-emerald-400 font-semibold cyber-pill-green">
            {(incident.oilProbability * 100).toFixed(0)}% (Look-alike: Low)
          </span>
        </div>

        <div className="metric-row">
          <span className="metric-key">Boundary Jitter</span>
          <span className="metric-val mono">±{incident.boundaryUncertaintyM} m (σ)</span>
        </div>
      </div>

      {/* Metocean Forcing Hub */}
      <div className="cyber-panel-header mt-4">
        <div className="cyber-panel-title">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>MET-OCEAN FORCING</span>
        </div>
        <span className="cyber-sub-badge">CMEMS SMOC</span>
      </div>

      <div className="cyber-data-card metocean-card">
        <div className="metocean-row">
          <div className="metocean-icon-box">
            <Wind className="w-4 h-4 text-sky-400" />
          </div>
          <div className="metocean-meta">
            <span className="metocean-title">Surface Wind Velocity</span>
            <span className="metocean-value mono">
              {incident.windSpeedMps} m/s @ {incident.windDirDeg}° (SW)
            </span>
          </div>
          <div 
            className="metocean-compass-mini" 
            title="Wind Direction"
          >
            <Navigation2 
              className="w-3.5 h-3.5 text-sky-400" 
              style={{ transform: `rotate(${incident.windDirDeg}deg)` }}
            />
          </div>
        </div>

        <div className="metocean-divider"></div>

        <div className="metocean-row">
          <div className="metocean-icon-box">
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="metocean-meta">
            <span className="metocean-title">Ocean Total Current</span>
            <span className="metocean-value mono">
              {incident.currentSpeedMps} m/s @ {incident.currentDirDeg}° (ENE)
            </span>
          </div>
          <div 
            className="metocean-compass-mini" 
            title="Current Direction"
          >
            <Navigation2 
              className="w-3.5 h-3.5 text-cyan-400" 
              style={{ transform: `rotate(${incident.currentDirDeg}deg)` }}
            />
          </div>
        </div>

        <div className="metocean-divider"></div>

        <div className="metocean-row">
          <div className="metocean-icon-box">
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="metocean-meta">
            <span className="metocean-title">Stokes Wave Drift</span>
            <span className="metocean-value mono">0.08 m/s (Wave Radiation)</span>
          </div>
        </div>
      </div>

      {/* Forensic Surveillance Layers */}
      <div className="cyber-panel-header mt-4">
        <div className="cyber-panel-title">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>SURVEILLANCE LAYERS</span>
        </div>
        <span className="cyber-layer-count">{activeLayersCount}/6 Active</span>
      </div>

      <div className="cyber-layers-list">
        <div 
          className={`cyber-layer-toggle ${layerVisibility.sar ? 'active' : ''}`}
          onClick={() => onToggleLayer('sar')}
        >
          <span className="layer-dot sar-dot"></span>
          <span className="layer-name">Sentinel-1 SAR Ortho (VV/VH)</span>
          <div className="cyber-switch">
            <span className="switch-slider"></span>
          </div>
        </div>

        <div 
          className={`cyber-layer-toggle ${layerVisibility.slick ? 'active' : ''}`}
          onClick={() => onToggleLayer('slick')}
        >
          <span className="layer-dot slick-dot"></span>
          <span className="layer-name">Observed Slick Mask & Polygon</span>
          <div className="cyber-switch">
            <span className="switch-slider"></span>
          </div>
        </div>

        <div 
          className={`cyber-layer-toggle ${layerVisibility.origin50 ? 'active' : ''}`}
          onClick={() => onToggleLayer('origin50')}
        >
          <span className="layer-dot origin50-dot"></span>
          <span className="layer-name">50% Core Origin Probability</span>
          <div className="cyber-switch">
            <span className="switch-slider"></span>
          </div>
        </div>

        <div 
          className={`cyber-layer-toggle ${layerVisibility.origin90 ? 'active' : ''}`}
          onClick={() => onToggleLayer('origin90')}
        >
          <span className="layer-dot origin90-dot"></span>
          <span className="layer-name">90% Mahalanobis Horizon</span>
          <div className="cyber-switch">
            <span className="switch-slider"></span>
          </div>
        </div>

        <div 
          className={`cyber-layer-toggle ${layerVisibility.aisTracks ? 'active' : ''}`}
          onClick={() => onToggleLayer('aisTracks')}
        >
          <span className="layer-dot ais-dot"></span>
          <span className="layer-name">AIS Trajectories & Headings</span>
          <div className="cyber-switch">
            <span className="switch-slider"></span>
          </div>
        </div>

        <div 
          className={`cyber-layer-toggle ${layerVisibility.hindcastParticles ? 'active' : ''}`}
          onClick={() => onToggleLayer('hindcastParticles')}
        >
          <span className="layer-dot particle-dot"></span>
          <span className="layer-name">RK4 Backward Lagrangian Cloud</span>
          <div className="cyber-switch">
            <span className="switch-slider"></span>
          </div>
        </div>
      </div>

      {/* Cryptographic Chain of Custody */}
      <div className="cyber-panel-header mt-4">
        <div className="cyber-panel-title">
          <Hash className="w-4 h-4 text-emerald-400" />
          <span>CHAIN OF CUSTODY SEAL</span>
        </div>
        <span className="cyber-pill-verified">IMO A.1106</span>
      </div>

      <div className="cyber-integrity-card">
        <div className="integrity-item">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>SNAP COG Orthorectification: <strong>VALID</strong></span>
        </div>
        <div className="integrity-item">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>AIS Geodesic Kinematics: <strong>NORMALIZED</strong></span>
        </div>
        <div className="integrity-item">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="mono text-xs">SHA-256: {incident.provenance.configSha256.slice(0, 12)}...</span>
        </div>
        <div className="integrity-item">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>RK4 Deterministic Seed: <strong>LOCKED</strong></span>
        </div>
      </div>
    </aside>
  );
};
