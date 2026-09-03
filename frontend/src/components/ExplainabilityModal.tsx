import React from "react";
import type { CandidateScore } from "../types";
import { X, BarChart3, AlertTriangle } from "lucide-react";

interface ExplainabilityModalProps {
  candidate: CandidateScore | null;
  onClose: () => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({ candidate, onClose }) => {
  if (!candidate) return null;

  const sub = candidate.subscores || {
    spatial: 92,
    temporal: 86,
    heading: 73,
    originOverlap: 90,
    aisContinuity: 98,
    behaviourAnomaly: 40,
    ensembleStability: 88,
  };

  const metrics = [
    { label: "Spatial Compatibility", val: sub.spatial, desc: "Inverse geodesic distance to RK4 origin centroid (exp(-d²/2σ²))" },
    { label: "Temporal Compatibility", val: sub.temporal, desc: "Alignment with backward release-time probability prior" },
    { label: "Heading Agreement", val: sub.heading, desc: "(1 + cos(Δθ))/2 relative to inferred origin-to-slick bearing" },
    { label: "Origin Envelope Overlap", val: sub.originOverlap, desc: "Fraction of vessel trajectory intersecting 50% & 90% envelopes" },
    { label: "AIS Continuity", val: sub.aisContinuity, desc: "Gap penalty & valid geodesic speed continuity" },
    { label: "Behaviour Anomaly Signal", val: sub.behaviourAnomaly, desc: "Speed drop / course change detection near release window" },
    { label: "Ensemble Rank Stability", val: sub.ensembleStability, desc: "Percent of 500 stochastic RK4 realizations where vessel remained top candidate" },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window explain-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="modal-title">Score Decomposition & Attribution Rationale</div>
              <div className="modal-subtitle">{candidate.name} ({candidate.type})</div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-body">
          <div className="overall-score-banner">
            <div className="overall-left">
              <div className="score-large">{candidate.score.toFixed(2)}</div>
              <div className="score-large-label">Overall Investigative Compatibility</div>
            </div>
            <div className="overall-right">
              <div className="metric-row">
                <span>90% Uncertainty Interval:</span>
                <strong>[{candidate.p05.toFixed(2)} — {candidate.p95.toFixed(2)}]</strong>
              </div>
              <div className="metric-row">
                <span>Closest Geodesic Distance:</span>
                <strong>{candidate.closestApproachKm} km</strong>
              </div>
              <div className="metric-row">
                <span>Release Time Discrepancy:</span>
                <strong>{candidate.temporalOffsetMin} min</strong>
              </div>
            </div>
          </div>

          <div className="metrics-breakdown-list">
            {metrics.map((m, i) => (
              <div key={i} className="metric-item-card">
                <div className="metric-header">
                  <span className="metric-name">{m.label}</span>
                  <span className="metric-score">{m.val}/100</span>
                </div>
                <div className="metric-progress-bg">
                  <div
                    className="metric-progress-bar"
                    style={{
                      width: `${m.val}%`,
                      backgroundColor: m.val > 70 ? '#06b6d4' : m.val > 40 ? '#f59e0b' : '#ef4444',
                    }}
                  ></div>
                </div>
                <div className="metric-desc">{m.desc}</div>
              </div>
            ))}
          </div>

          <div className="legal-disclaimer-box">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Legal Evidence Constraint:</strong> Models must never state <em>"Ship ABC caused the spill"</em>.
              The correct evidentiary phrasing is <em>"{candidate.name} is the highest-ranked investigative candidate under the stated satellite, AIS and hindcast assumptions."</em>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
