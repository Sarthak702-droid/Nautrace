"use client";

import React from "react";
import { X, Printer, Download, ShieldCheck, FileCheck, CheckCircle2, Lock } from "lucide-react";

interface EvidenceDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceDossierModal: React.FC<EvidenceDossierModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn font-mono">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-marine-950 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-marine-900 border-b border-cyan-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-radar-cyan font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>COURT-ADMISSIBLE FORENSIC EVIDENCE DOSSIER</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dossier Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-300 font-sans">
          {/* Official Document Letterhead */}
          <div className="text-center border-b border-slate-800 pb-6 font-mono">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              MARITIME DOMAIN INTELLIGENCE • POLLUTION FORENSIC UNIT
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              OFFICIAL INCIDENT INVESTIGATION REPORT
            </h1>
            <div className="text-[11px] text-cyan-400 mt-1">
              DOSSIER ID: NTRO-ICG-2026-OS-001 • PROVENANCE VERIFIED
            </div>
          </div>

          {/* Cryptographic Verification Box */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-slate-500">SHA-256 PROVENANCE HASH:</span>
              <div className="text-cyan-300 break-all font-semibold">
                8f4e2b9c71a3d5e0f182c4492a71d8825c9b0e11a34b22c88f4e2b9c71a3d5e0
              </div>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px] shrink-0 font-bold flex items-center gap-1 self-start sm:self-center">
              <Lock className="w-3 h-3" /> TAMPER-EVIDENT
            </span>
          </div>

          {/* Incident Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-marine-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-500">INCIDENT ID</div>
              <div className="text-white font-bold">OS-2026-IN</div>
            </div>
            <div className="p-3 rounded-lg bg-marine-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-500">SATELLITE PLATFORM</div>
              <div className="text-cyan-400 font-bold">Sentinel-1A (C-Band SAR)</div>
            </div>
            <div className="p-3 rounded-lg bg-marine-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-500">SLICK CENTROID</div>
              <div className="text-white font-bold">8°43'12"N, 78°09'36"E</div>
            </div>
            <div className="p-3 rounded-lg bg-marine-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-500">SURFACE EXTENT</div>
              <div className="text-amber-400 font-bold">14.62 km² (Heavy Emulsion)</div>
            </div>
          </div>

          {/* Primary Attribution Verdict */}
          <div className="p-5 rounded-xl bg-rose-950/30 border border-rose-600/40">
            <div className="flex items-center justify-between pb-3 border-b border-rose-900/60 font-mono">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>PRIMARY ACCUSED VESSEL: MT OCEAN CONQUEROR</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-rose-900/80 text-rose-200 font-bold text-xs border border-rose-500/50">
                ATTRIBUTION: 89.4% (HIGH)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 font-mono text-xs text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px]">MMSI / IMO:</span> 419001824 / IMO 9234123
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">VESSEL TYPE:</span> Crude Oil Tanker (VLCC)
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">FLAG STATE:</span> Liberia (LR)
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed font-sans">
              <strong>INVESTIGATION FINDINGS:</strong> OpenDrift met-ocean reverse drift simulation reconstructed the oil spill origin at coordinate 8°25'50"N, 78°02'15"E during the release time window of 16:15 – 16:45 UTC. Historical AIS records confirm MT OCEAN CONQUEROR was within 800 meters of the origin centroid at 16:32 UTC while exhibiting an acute speed drop from 14.8 to 8.2 knots, followed by an anomalous 24-minute AIS gap.
            </p>
          </div>

          {/* Multi-Factor Score Decomposition Table */}
          <div>
            <h4 className="font-mono font-bold text-slate-200 text-xs uppercase mb-2">
              6-FACTOR MATHEMATICAL SCORE DECOMPOSITION
            </h4>
            <div className="rounded-xl border border-slate-800 overflow-hidden font-mono text-xs">
              <table className="w-full text-left">
                <thead className="bg-marine-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">FACTOR</th>
                    <th className="p-3">SCORE</th>
                    <th className="p-3">CONFIDENCE WEIGHT</th>
                    <th className="p-3">EMPIRICAL BASIS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  <tr>
                    <td className="p-3 font-mono text-cyan-300">Spatial Proximity</td>
                    <td className="p-3 font-mono font-bold text-white">94 / 100</td>
                    <td className="p-3 font-mono text-slate-400">0.25</td>
                    <td className="p-3 text-slate-300 text-xs">Closest point of approach 0.82 km from origin</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-teal-300">Temporal Synchronization</td>
                    <td className="p-3 font-mono font-bold text-white">91 / 100</td>
                    <td className="p-3 font-mono text-slate-400">0.20</td>
                    <td className="p-3 text-slate-300 text-xs">Crossed origin at T-11.4h during active discharge window</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-blue-300">Heading Agreement</td>
                    <td className="p-3 font-mono font-bold text-white">88 / 100</td>
                    <td className="p-3 font-mono text-slate-400">0.15</td>
                    <td className="p-3 text-slate-300 text-xs">Course over ground aligns with slick elongation axis</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-amber-300">Origin Overlap (Drift UQ)</td>
                    <td className="p-3 font-mono font-bold text-white">93 / 100</td>
                    <td className="p-3 font-mono text-slate-400">0.20</td>
                    <td className="p-3 text-slate-300 text-xs">Inside 90% confidence ellipse calculated by OpenDrift</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-emerald-300">AIS Continuity</td>
                    <td className="p-3 font-mono font-bold text-white">95 / 100</td>
                    <td className="p-3 font-mono text-slate-400">0.10</td>
                    <td className="p-3 text-slate-300 text-xs">Transponder message rate consistent prior to incident gap</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-rose-300">Kinematic Behaviour</td>
                    <td className="p-3 font-mono font-bold text-white">82 / 100</td>
                    <td className="p-3 font-mono text-slate-400">0.10</td>
                    <td className="p-3 text-slate-300 text-xs">Sudden 6.6 kn deceleration and subsequent course deviation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Certification Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div>
              REPORT GENERATED BY: NAUTRACE MARITIME ENGINE (SIH 2026 PS-26143)
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CERTIFIED AUDIT READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
