import React from "react";
import type { IncidentCase } from "../types";
import { Shield, Satellite, Wind, Waves, Radio, Cpu, FileText, ChevronDown, BookOpen } from "lucide-react";
import { useConvexConfig } from "../convex/convexClient";

interface HeaderProps {
  currentCase: IncidentCase;
  allCases: IncidentCase[];
  onSelectCase: (c: IncidentCase) => void;
  onOpenReport: () => void;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCase,
  allCases,
  onSelectCase,
  onOpenReport,
  isAnalyzing,
  onRunAnalysis,
}) => {
  const { isConfigured } = useConvexConfig();

  return (
    <header className="header-container">
      <div className="header-left">
        <div className="logo-brand">
          <div className="logo-icon-wrap">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="logo-title">
              NAUTRACE <span className="version-tag">v2.1 FORENSIC</span>
            </div>
            <div className="logo-subtitle">
              Maritime Oil-Spill Attribution & Hindcasting Intelligence
            </div>
          </div>
        </div>

        <div className="case-dropdown-wrap">
          <span className="case-label">CASE:</span>
          <select
            className="case-select"
            value={currentCase.id}
            onChange={(e) => {
              const found = allCases.find((c) => c.id === e.target.value);
              if (found) onSelectCase(found);
            }}
          >
            {allCases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id}: {c.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 select-arrow" />
        </div>
      </div>

      <div className="header-center">
        <div className="telemetry-pill-group">
          <div className="telemetry-pill active">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sentinel-1 SAR</span>
            <span className="dot green"></span>
          </div>
          <div className="telemetry-pill active">
            <Waves className="w-3.5 h-3.5 text-indigo-400" />
            <span>CMEMS SMOC</span>
            <span className="dot green"></span>
          </div>
          <div className="telemetry-pill active">
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>ECMWF IFS</span>
            <span className="dot green"></span>
          </div>
          <div className="telemetry-pill active">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>AIS Stream</span>
            <span className="dot green"></span>
          </div>
          <div className={`telemetry-pill ${isConfigured ? 'active' : 'warn'}`}>
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>{isConfigured ? 'Convex Cloud' : 'Convex Local'}</span>
            <span className={`dot ${isConfigured ? 'green' : 'amber'}`}></span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <button
          className={`btn-primary ${isAnalyzing ? 'loading' : ''}`}
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <span className="spinner"></span>
              <span>Running Ensemble RK4...</span>
            </>
          ) : (
            <>
              <Cpu className="w-4 h-4" />
              <span>Run Hindcast Simulation</span>
            </>
          )}
        </button>

        <a
          href="/team-guide.html"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          title="Open Non-Technical Hindi Team Handbook & PDF"
          style={{ textDecoration: 'none', borderColor: 'rgba(245, 158, 11, 0.4)' }}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Team Handbook (Hindi)</span>
        </a>

        <a
          href="/guide.html"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          title="Open Scientific Architecture & Truth Dossier"
          style={{ textDecoration: 'none' }}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Tech Guide</span>
        </a>

        <button className="btn-secondary" onClick={onOpenReport}>
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Forensic Dossier</span>
        </button>
      </div>
    </header>
  );
};
