import React from 'react';
import type { IncidentCase } from '../types';
import { hasAnalysisResults } from '../lib/caseInput';
import { Layers, Compass, Wind, Droplets, Info } from 'lucide-react';

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
  isAnalyzing?: boolean;
}

const LAYERS: { key: keyof CaseDataPanelProps['layerVisibility']; label: string }[] = [
  { key: 'slick', label: 'Observed slick' },
  { key: 'origin50', label: '50% origin envelope' },
  { key: 'origin90', label: '90% origin envelope' },
  { key: 'aisTracks', label: 'AIS tracks' },
  { key: 'hindcastParticles', label: 'Hindcast particles' },
];

export const CaseDataPanel: React.FC<CaseDataPanelProps> = ({
  incident,
  layerVisibility,
  onToggleLayer,
  isAnalyzing = false,
}) => {
  const analysed = hasAnalysisResults(incident);

  return (
    <aside className="sidebar-panel case-data-panel cyber-side-panel">
      <div className="cyber-panel-header">
        <div className="cyber-panel-title">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>INCIDENT INPUT</span>
        </div>
        <span className="cyber-status-chip">{isAnalyzing ? 'RUNNING' : analysed ? 'ANALYSED' : 'READY'}</span>
      </div>

      <div className="cyber-data-card">
        <div className="metric-row">
          <span className="metric-key">Region</span>
          <span className="metric-val highlight">{incident.region}</span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Detection</span>
          <span className="metric-val mono">
            {new Date(incident.detectionTime).toUTCString().replace(' GMT', ' UTC')}
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Slick area</span>
          <span className="metric-val bold-cyan">
            <strong>{incident.slickAreaKm2.toFixed(2)}</strong> km²
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Oil probability</span>
          <span className="metric-val">{(incident.oilProbability * 100).toFixed(0)}%</span>
        </div>
        <div className="metric-row">
          <span className="metric-key">Boundary σ</span>
          <span className="metric-val mono">±{incident.boundaryUncertaintyM} m</span>
        </div>
        <div className="metric-row">
          <span className="metric-key">AIS tracks</span>
          <span className="metric-val">{incident.tracks.length}</span>
        </div>
      </div>

      <div className="cyber-panel-header mt-4">
        <div className="cyber-panel-title">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>METOCEAN</span>
        </div>
      </div>

      <div className="cyber-data-card metocean-card">
        <div className="metocean-row">
          <div className="metocean-icon-box">
            <Wind className="w-4 h-4 text-sky-400" />
          </div>
          <div className="metocean-meta">
            <span className="metocean-title">Wind</span>
            <span className="metocean-value mono">
              {incident.windSpeedMps} m/s @ {incident.windDirDeg}°
            </span>
          </div>
        </div>
        <div className="metocean-divider"></div>
        <div className="metocean-row">
          <div className="metocean-icon-box">
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="metocean-meta">
            <span className="metocean-title">Current</span>
            <span className="metocean-value mono">
              {incident.currentSpeedMps} m/s @ {incident.currentDirDeg}°
            </span>
          </div>
        </div>
      </div>

      <div className="cyber-panel-header mt-4">
        <div className="cyber-panel-title">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>MAP LAYERS</span>
        </div>
      </div>

      <div className="cyber-layers-list">
        {LAYERS.map(({ key, label }) => (
          <div
            key={key}
            className={`cyber-layer-toggle ${layerVisibility[key] ? 'active' : ''}`}
            onClick={() => onToggleLayer(key)}
          >
            <span className={`layer-dot ${key === 'slick' ? 'slick-dot' : key === 'origin50' ? 'origin50-dot' : key === 'origin90' ? 'origin90-dot' : key === 'aisTracks' ? 'ais-dot' : 'particle-dot'}`}></span>
            <span className="layer-name">{label}</span>
            <div className="cyber-switch">
              <span className="switch-slider"></span>
            </div>
          </div>
        ))}
      </div>

      {analysed && incident.hindcastMeta && (
        <>
          <div className="cyber-panel-header mt-4">
            <div className="cyber-panel-title">
              <span>BACKEND PROVENANCE</span>
            </div>
          </div>
          <div className="cyber-data-card">
            <div className="metric-row">
              <span className="metric-key">Engine</span>
              <span className="metric-val mono">{incident.hindcastMeta.engine}</span>
            </div>
            <div className="metric-row">
              <span className="metric-key">Method</span>
              <span className="metric-val mono">{incident.hindcastMeta.integrationMethod}</span>
            </div>
            <div className="metric-row">
              <span className="metric-key">Ensemble</span>
              <span className="metric-val">
                {incident.hindcastMeta.ensembleSize}
                {incident.hindcastMeta.failedMembers > 0
                  ? ` (${incident.hindcastMeta.failedMembers} failed)`
                  : ''}
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-key">Config hash</span>
              <span className="metric-val mono">
                {incident.provenance.configSha256.slice(0, 12)}…
              </span>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};
