import React from 'react';
import type { IncidentCase } from '../types';
import { Satellite, Waves, Radio, Cpu, FileText, ChevronDown, Activity, ArrowLeft, ShieldAlert, Radar } from 'lucide-react';
import { useConvexConfig } from '../convex/convexClient';
import { NautraceLogo } from './NautraceLogo';

export type ActiveView = 'home' | 'console' | 'about';

interface HeaderProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  currentCase: IncidentCase;
  allCases: IncidentCase[];
  onSelectCase: (c: IncidentCase) => void;
  onOpenReport: () => void;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentCase,
  allCases,
  onSelectCase,
  onOpenReport,
  isAnalyzing,
  onRunAnalysis,
}) => {
  const { isConfigured } = useConvexConfig();

  return (
    <header className="header-container cyber-header">
      {/* Top micro scanline glow */}
      <div className="cyber-header-scanline"></div>

      <div className="header-left">
        {/* Return to Dashboard/Home */}
        <button 
          onClick={() => onNavigate('home')} 
          className="cyber-nav-back-btn"
          title="Return to Global Horizon"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>PORTAL</span>
        </button>

        {/* Brand Logo with Live Radar Indicator */}
        <div 
          onClick={() => onNavigate('home')} 
          className="cyber-brand-wrap"
          style={{ cursor: 'pointer' }}
          title="NAUTRACE Marine Forensic Intelligence"
        >
          <NautraceLogo size="sm" variant="light" showSubtitle={false} />
          <div className="radar-live-indicator" title="Active Surveillance Feed">
            <span className="radar-beacon-dot"></span>
            <span className="radar-beacon-ping"></span>
          </div>
        </div>

        {/* Tactical Case Selector */}
        <div className="cyber-case-selector">
          <div className="case-tag-indicator">
            <ShieldAlert className="w-3 h-3 text-cyan-400" />
            <span className="case-tag-label">TARGET CASE</span>
          </div>
          <div className="case-select-wrapper">
            <select
              className="cyber-case-select"
              value={currentCase.id}
              onChange={(e) => {
                const found = allCases.find((c) => c.id === e.target.value);
                if (found) onSelectCase(found);
              }}
            >
              {allCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id.toUpperCase()}: {c.title} [{c.region}]
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 cyber-select-arrow" />
          </div>
        </div>
      </div>

      {/* Center Telemetry HUD */}
      <div className="header-center">
        <div className="cyber-telemetry-hud">
          <div className="cyber-telemetry-item active">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <div className="telemetry-meta">
              <span className="telemetry-title">SENTINEL-1 SAR</span>
              <span className="telemetry-sub">VV/VH ORTHO</span>
            </div>
            <span className="cyber-led green"></span>
          </div>

          <div className="cyber-telemetry-divider"></div>

          <div className="cyber-telemetry-item active">
            <Waves className="w-3.5 h-3.5 text-sky-400" />
            <div className="telemetry-meta">
              <span className="telemetry-title">CMEMS SMOC</span>
              <span className="telemetry-sub">3D OCEAN DRIFT</span>
            </div>
            <span className="cyber-led green"></span>
          </div>

          <div className="cyber-telemetry-divider"></div>

          <div className="cyber-telemetry-item active">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <div className="telemetry-meta">
              <span className="telemetry-title">AIS SATELLITE</span>
              <span className="telemetry-sub">REAL-TIME FEED</span>
            </div>
            <span className="cyber-led green"></span>
          </div>

          <div className="cyber-telemetry-divider"></div>

          <div className={isConfigured ? 'cyber-telemetry-item active' : 'cyber-telemetry-item warn'}>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <div className="telemetry-meta">
              <span className="telemetry-title">CONVEX SYNC</span>
              <span className="telemetry-sub">{isConfigured ? 'CLOUD SECURE' : 'LOCAL CACHE'}</span>
            </div>
            <span className={isConfigured ? 'cyber-led green' : 'cyber-led amber'}></span>
          </div>
        </div>
      </div>

      {/* Right Action Station */}
      <div className="header-right">
        <button
          className={isAnalyzing ? 'cyber-btn-primary analyzing' : 'cyber-btn-primary'}
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          title="Execute Backward Lagrangian Runge-Kutta 4 Simulation"
        >
          <div className="btn-glow-layer"></div>
          {isAnalyzing ? (
            <>
              <Radar className="w-4 h-4 animate-spin text-cyan-200" />
              <span>COMPUTING RK4 DRIFT...</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4 text-cyan-300" />
              <span>RUN INVERSE ADVECTION</span>
            </>
          )}
        </button>

        <button 
          className="cyber-btn-secondary" 
          onClick={onOpenReport}
          title="Generate Defense-Grade Legal Dossier"
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>LEGAL DOSSIER</span>
        </button>

        <a
          href="/guide.html"
          target="_blank"
          rel="noopener noreferrer"
          className="cyber-btn-secondary cyber-guide-link"
          title="Open Scientific Architecture & Truth Dossier"
        >
          <FileText className="w-4 h-4 text-sky-400" />
          <span>GUIDE</span>
        </a>
      </div>
    </header>
  );
};
