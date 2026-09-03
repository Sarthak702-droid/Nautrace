import React from "react";
import type { CandidateScore, IncidentCase } from "../types";
import { AlertCircle, HelpCircle, FileText, ChevronRight, UserCheck } from "lucide-react";

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
    <aside className="sidebar-panel suspects-panel">
      <div className="panel-section-header justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>INVESTIGATIVE CANDIDATES</span>
        </div>
        <span className="badge-counter">{incident.candidates.length} Ranked</span>
      </div>

      <div className="candidates-list">
        {incident.candidates.map((c, index) => {
          const isSelected = selectedVesselId === c.id;
          const isUnknown = c.isUnknownSource;

          return (
            <div
              key={c.id}
              className={`candidate-card ${isSelected ? 'selected' : ''} ${isUnknown ? 'unknown-card' : ''}`}
              onClick={() => onSelectVessel(c.id)}
            >
              <div className="candidate-header">
                <div className="candidate-rank">
                  {isUnknown ? 'ALT' : `#${index + 1}`}
                </div>
                <div className="candidate-title-wrap">
                  <div className="candidate-name">{c.name}</div>
                  <div className="candidate-type">{c.type}</div>
                </div>
                <div className="candidate-score-wrap">
                  <div className="score-number">{c.score.toFixed(2)}</div>
                  <div className="score-label">Likelihood</div>
                </div>
              </div>

              <div className="confidence-bar-wrap">
                <div className="confidence-text">
                  <span>90% Interval: [{c.p05.toFixed(2)} — {c.p95.toFixed(2)}]</span>
                  <span className="continuity-pill">{c.aisContinuity}</span>
                </div>
                <div className="confidence-bar-bg">
                  <div
                    className="confidence-bar-fill"
                    style={{
                      left: `${c.p05 * 100}%`,
                      width: `${(c.p95 - c.p05) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="confidence-bar-median"
                    style={{ left: `${c.score * 100}%` }}
                  ></div>
                </div>
              </div>

              {!isUnknown && (
                <div className="candidate-stats-grid">
                  <div className="stat-box">
                    <span className="stat-lbl">Closest Approach</span>
                    <span className="stat-val">{c.closestApproachKm} km</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-lbl">Temporal Offset</span>
                    <span className="stat-val">{c.temporalOffsetMin} min</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-lbl">Trajectory Fit</span>
                    <span className="stat-val highlight">{c.trajectoryCompatibility}</span>
                  </div>
                </div>
              )}

              <div className="candidate-actions">
                <button
                  className="btn-explain"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExplainVessel(c);
                  }}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Explain Score</span>
                  <ChevronRight className="w-3 h-3 ml-auto" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="imo-notice-box">
        <div className="notice-title">
          <UserCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>IMO Resolution A.1106(29) Compliance</span>
        </div>
        <p className="notice-body">
          AIS is not assumed complete. If all vessels exhibit weak spatial overlap, the system attributes to 
          <strong> UNKNOWN_NON_AIS</strong> rather than falsely accusing rank #1.
        </p>
      </div>

      <div className="ai-dossier-banner">
        <button className="btn-ai-generate" onClick={onGenerateAiReport}>
          <FileText className="w-4 h-4 text-purple-300" />
          <span>Generate AI Evidence Brief</span>
        </button>
      </div>
    </aside>
  );
};
