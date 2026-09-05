import React from 'react';
import type { CandidateScore, IncidentCase } from '../types';
import { HelpCircle, FileText, ChevronRight, ShieldCheck, Target } from 'lucide-react';

interface SuspectsPanelProps {
  incident: IncidentCase;
  selectedVesselId: string | null;
  onSelectVessel: (id: string) => void;
  onExplainVessel: (cand: CandidateScore) => void;
  onGenerateAiReport: () => void;
}

export const SuspectsPanel: React.FC<SuspectsPanelProps> = ({
  incident,
  selectedVesselId,
  onSelectVessel,
  onExplainVessel,
  onGenerateAiReport,
}) => {
  return (
    <aside className="sidebar-panel suspects-panel cyber-side-panel">
      {/* Panel Header HUD */}
      <div className="cyber-panel-header justify-between">
        <div className="cyber-panel-title">
          <Target className="w-4 h-4 text-rose-400" />
          <span>THREAT CLASSIFICATION</span>
        </div>
        <span className="cyber-badge-counter">{incident.candidates.length} CANDIDATES</span>
      </div>

      <div className="candidates-list cyber-candidates-list">
        {incident.candidates.map((c, index) => {
          const isSelected = selectedVesselId === c.id;
          const isUnknown = c.isUnknownSource;
          const isCritical = c.score >= 0.85;
          const isModerate = c.score >= 0.4 && c.score < 0.85;

          const threatBadgeClass = isUnknown 
            ? 'threat-stealth' 
            : isCritical 
            ? 'threat-critical' 
            : isModerate 
            ? 'threat-elevated' 
            : 'threat-cleared';

          const threatLabel = isUnknown
            ? 'STEALTH / DARK SHIP'
            : isCritical
            ? 'CRITICAL THREAT'
            : isModerate
            ? 'ELEVATED RISK'
            : 'EXONERATED';

          return (
            <div
              key={c.id}
              className={`candidate-card cyber-threat-card ${isSelected ? 'selected' : ''} ${isUnknown ? 'unknown-card' : ''} ${isCritical ? 'critical-card' : ''}`}
              onClick={() => onSelectVessel(c.id)}
            >
              {/* Threat Severity Badge Bar */}
              <div className="threat-header-bar">
                <div className={`threat-pill ${threatBadgeClass}`}>
                  <span className="threat-pulse-dot"></span>
                  <span className="threat-pill-text">{threatLabel}</span>
                </div>
                <div className="threat-score-display">
                  <span className="threat-score-num">{(c.score * 100).toFixed(1)}%</span>
                  <span className="threat-score-lbl">MATCH</span>
                </div>
              </div>

              {/* Vessel Identity Card */}
              <div className="candidate-header">
                <div className="candidate-rank cyber-rank-badge">
                  {isUnknown ? 'ALT' : `#${index + 1}`}
                </div>
                <div className="candidate-title-wrap">
                  <div className="candidate-name cyber-vessel-name">{c.name}</div>
                  <div className="candidate-type cyber-vessel-type">{c.type}</div>
                </div>
              </div>

              {/* Bayesian 90% Confidence Interval Gauge */}
              <div className="confidence-bar-wrap cyber-confidence-wrap">
                <div className="confidence-text">
                  <span>90% CI: [{(c.p05 * 100).toFixed(0)}% — {(c.p95 * 100).toFixed(0)}%]</span>
                  <span className={`continuity-pill ${c.aisContinuity.includes('Normal') ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {c.aisContinuity}
                  </span>
                </div>
                <div className="confidence-bar-bg cyber-conf-bar">
                  <div
                    className="confidence-bar-fill cyber-conf-fill"
                    style={{
                      left: `${c.p05 * 100}%`,
                      width: `${Math.max(4, (c.p95 - c.p05) * 100)}%`,
                    }}
                  ></div>
                  <div
                    className="confidence-bar-median cyber-conf-median"
                    style={{ left: `${c.score * 100}%` }}
                    title={`Posterior Mode: ${(c.score * 100).toFixed(1)}%`}
                  ></div>
                </div>
              </div>

              {/* Kinematic Telemetry Matrix */}
              {!isUnknown && (
                <div className="candidate-stats-grid cyber-stats-grid">
                  <div className="stat-box">
                    <span className="stat-lbl">CLOSEST APPROACH</span>
                    <span className="stat-val highlight-val">
                      {c.closestApproachKm === undefined ? '—' : `${c.closestApproachKm} km`}
                    </span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-lbl">TEMPORAL OFFSET</span>
                    <span className="stat-val">
                      {c.temporalOffsetMin === undefined ? '—' : `${c.temporalOffsetMin} min`}
                    </span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-lbl">DRIFT FIT</span>
                    <span className={`stat-val ${c.trajectoryCompatibility.includes('Strong') ? 'text-emerald-400' : 'text-cyan-300'}`}>
                      {c.trajectoryCompatibility}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="candidate-actions">
                <button
                  className="btn-explain cyber-explain-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExplainVessel(c);
                  }}
                  title="View Mathematical Likelihood & Shapley Attribution Decomposition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Explain Likelihood Score</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* IMO Resolution Compliance Shield */}
      <div className="imo-notice-box cyber-notice-box">
        <div className="notice-title">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>IMO Resolution A.1106(29) Compliance</span>
        </div>
        <p className="notice-body">
          AIS coverage is legally non-exhaustive. If candidate trajectories demonstrate weak hydro-overlap, 
          attribution shifts to <strong>UNKNOWN_NON_AIS</strong> rather than generating false positives.
        </p>
      </div>

      {/* AI Forensic Evidence Brief CTA */}
      <div className="ai-dossier-banner cyber-ai-banner">
        <button className="btn-ai-generate cyber-btn-generate" onClick={onGenerateAiReport}>
          <div className="btn-glow-accent"></div>
          <FileText className="w-4 h-4 text-cyan-300 mr-1.5" />
          <span>GENERATE DEFENSE EVIDENCE BRIEF</span>
        </button>
      </div>
    </aside>
  );
};
