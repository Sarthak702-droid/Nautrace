"use client";

import React from "react";
import { Ship, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { VesselCandidate } from "./types";

interface CandidateScorePanelProps {
  candidates: VesselCandidate[];
  selectedCandidate: VesselCandidate;
  onSelectCandidate: (candidate: VesselCandidate) => void;
  onOpenDossier: () => void;
}

export const CandidateScorePanel: React.FC<CandidateScorePanelProps> = ({
  candidates,
  selectedCandidate,
  onSelectCandidate,
  onOpenDossier,
}) => {
  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* Candidate List Card */}
      <div className="rounded-2xl glass-panel border border-cyan-500/20 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <Ship className="w-4 h-4 text-radar-cyan" />
            VESSEL CANDIDATES ({candidates.length})
          </span>
          <span className="text-slate-400 text-[10px]">MIN THRESHOLD: 60%</span>
        </div>

        {/* Candidate Cards */}
        <div className="flex flex-col gap-2 mt-3">
          {candidates.map((cand) => {
            const isSelected = selectedCandidate.mmsi === cand.mmsi;
            return (
              <button
                key={cand.mmsi}
                onClick={() => onSelectCandidate(cand)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? "bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-950/50"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[170px]">{cand.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      cand.score >= 60
                        ? "bg-rose-950/80 text-rose-300 border border-rose-600/40"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {cand.score.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>MMSI: {cand.mmsi}</span>
                  <span>{cand.type.split(" ")[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explainable Score Inspector for Selected Candidate */}
      <div className="rounded-2xl glass-panel border border-cyan-500/30 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="text-cyan-300 font-bold">6-FACTOR SCORE DECOMPOSITION</span>
          <span className="text-[10px] text-slate-400">{selectedCandidate.name}</span>
        </div>

        {/* Metric Breakdown Progress Bars */}
        <div className="space-y-2.5 mt-3 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Spatial Proximity</span>
              <span className="text-cyan-400 font-bold">{selectedCandidate.components.spatial}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all"
                style={{ width: `${selectedCandidate.components.spatial}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Temporal Synchronization</span>
              <span className="text-teal-400 font-bold">{selectedCandidate.components.temporal}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-teal-400 h-full rounded-full transition-all"
                style={{ width: `${selectedCandidate.components.temporal}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Heading Agreement</span>
              <span className="text-blue-400 font-bold">{selectedCandidate.components.heading}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-400 h-full rounded-full transition-all"
                style={{ width: `${selectedCandidate.components.heading}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Origin Overlap (Drift UQ)</span>
              <span className="text-amber-400 font-bold">{selectedCandidate.components.origin}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all"
                style={{ width: `${selectedCandidate.components.origin}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">AIS Quality &amp; Continuity</span>
              <span className="text-emerald-400 font-bold">{selectedCandidate.components.aisQuality}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${selectedCandidate.components.aisQuality}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Kinematic Behaviour (Speed drop)</span>
              <span className="text-rose-400 font-bold">{selectedCandidate.components.behaviour}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rose-400 h-full rounded-full transition-all"
                style={{ width: `${selectedCandidate.components.behaviour}%` }}
              />
            </div>
          </div>
        </div>

        {/* Forensic Rationale Box */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed font-sans">
          <span className="font-bold font-mono text-cyan-300 block mb-0.5">FORENSIC FINDING:</span>
          {selectedCandidate.notes}
        </div>

        {/* Action Button inside Panel */}
        <button
          onClick={onOpenDossier}
          className="w-full mt-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-marine-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 active:scale-95"
        >
          <span>EXPORT CASE DOSSIER</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
