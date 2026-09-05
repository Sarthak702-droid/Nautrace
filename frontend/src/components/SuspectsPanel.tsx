import React from 'react';
import type { CandidateScore, IncidentCase } from '../types';
import { hasAnalysisResults } from '../lib/caseInput';
import { HelpCircle, FileText, ChevronRight, Target, Activity } from 'lucide-react';

interface SuspectsPanelProps {
  incident: IncidentCase;
  selectedVesselId: string | null;
  onSelectVessel: (id: string) => void;
  onExplainVessel: (cand: CandidateScore) => void;
  onGenerateAiReport: () => void;
  isAnalyzing?: boolean;
  onRunAnalysis?: () => void;
}

export const SuspectsPanel: React.FC<SuspectsPanelProps> = ({
  incident,
  selectedVesselId,
  onSelectVessel,
  onExplainVessel,
  onGenerateAiReport,
  isAnalyzing = false,
  onRunAnalysis,
}) => {
  const analysed = hasAnalysisResults(incident);
  const ranked = [...incident.candidates].sort((a, b) => b.score - a.score);

  return (
    <aside className="sidebar-panel suspects-panel cyber-side-panel">
      <div className="cyber-panel-header justify-between">
        <div className="cyber-panel-title">
          <Target className="w-4 h-4 text-rose-400" />
          <span>ATTRIBUTION</span>
        </div>
        <span className="cyber-badge-counter">
          {analysed ? `${ranked.length} ranked` : 'awaiting run'}
        </span>
      </div>

      {incident.decision && (
        <div className="cyber-data-card" style={{ marginBottom: 12 }}>
          <div className="metric-row">
            <span className="metric-key">Decision</span>
            <span className="metric-val highlight">{incident.decision.outcome.replace(/_/g, ' ')}</span>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '8px 0 0', lineHeight: 1.4 }}>
            {incident.decision.message}
          </p>
        </div>
      )}

      {!analysed && !isAnalyzing && (
        <div className="cyber-data-card" style={{ textAlign: 'center', padding: '28px 16px' }}>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16, lineHeight: 1.5 }}>
            No attribution yet. Run analysis to get ranked vessel scores from the intelligence service.
          </p>
          {onRunAnalysis && (
            <button className="cyber-btn-primary" onClick={onRunAnalysis} style={{ width: '100%' }}>
              <Activity className="w-4 h-4 text-cyan-300" />
              <span>Run Analysis</span>
            </button>
          )}
        </div>
      )}

      {isAnalyzing && (
        <div className="cyber-data-card" style={{ textAlign: 'center', padding: '28px 16px' }}>
          <p style={{ fontSize: 13, color: '#67e8f9' }}>Computing hindcast and vessel ranking…</p>
        </div>
      )}

      {analysed && (
        <div className="candidates-list cyber-candidates-list">
          {ranked.map((c, index) => {
            const isSelected = selectedVesselId === c.id;
            const isUnknown = Boolean(c.isUnknownSource);

            return (
              <div
                key={c.id}
                className={`candidate-card cyber-threat-card ${isSelected ? 'selected' : ''} ${isUnknown ? 'unknown-card' : ''}`}
                onClick={() => onSelectVessel(c.id)}
              >
                <div className="threat-header-bar">
                  <div className="threat-pill threat-elevated">
                    <span className="threat-pill-text">
                      {isUnknown ? 'UNKNOWN / NON-AIS' : `RANK #${index + 1}`}
                    </span>
                  </div>
                  <div className="threat-score-display">
                    <span className="threat-score-num">{(c.score * 100).toFixed(1)}%</span>
                    <span className="threat-score-lbl">COMPAT</span>
                  </div>
                </div>

                <div className="candidate-header">
                  <div className="candidate-rank cyber-rank-badge">
                    {isUnknown ? '?' : `#${index + 1}`}
                  </div>
                  <div className="candidate-title-wrap">
                    <div className="candidate-name cyber-vessel-name">{c.name}</div>
                    <div className="candidate-type cyber-vessel-type">{c.type}</div>
                  </div>
                </div>

                <div className="confidence-bar-wrap cyber-confidence-wrap">
                  <div className="confidence-text">
                    <span>
                      90% CI: [{(c.p05 * 100).toFixed(0)}% — {(c.p95 * 100).toFixed(0)}%]
                    </span>
                    <span className="continuity-pill text-cyan-300">{c.aisContinuity}</span>
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
                    ></div>
                  </div>
                </div>

                {!isUnknown && (
                  <div className="candidate-stats-grid cyber-stats-grid">
                    <div className="stat-box">
                      <span className="stat-lbl">CLOSEST</span>
                      <span className="stat-val highlight-val">
                        {c.closestApproachKm === undefined ? '—' : `${c.closestApproachKm} km`}
                      </span>
                    </div>
                    <div className="stat-box">
                      <span className="stat-lbl">DRIFT FIT</span>
                      <span className="stat-val">{c.trajectoryCompatibility}</span>
                    </div>
                  </div>
                )}

                <div className="candidate-actions">
                  <button
                    className="btn-explain cyber-explain-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExplainVessel(c);
                    }}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Explain score</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto text-cyan-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {analysed && (
        <div className="ai-dossier-banner cyber-ai-banner">
          <button className="btn-ai-generate cyber-btn-generate" onClick={onGenerateAiReport}>
            <div className="btn-glow-accent"></div>
            <FileText className="w-4 h-4 text-cyan-300 mr-1.5" />
            <span>Generate evidence brief</span>
          </button>
        </div>
      )}
    </aside>
  );
};
