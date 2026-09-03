"use client";

import React from "react";
import { Check, X, Shield, Sparkles, HelpCircle, AlertCircle } from "lucide-react";

interface MatrixRow {
  capability: string;
  legacy: boolean | string;
  nautrace: boolean | string;
  detail: string;
}

const COMPARISON_DATA: MatrixRow[] = [
  {
    capability: "Unified SAR + AIS + Drift Backtracking",
    legacy: "Fragmented / Manual",
    nautrace: "Fully Automated Pipeline",
    detail: "Mature systems require separate GIS, met-ocean, and AIS tools. NAUTRACE orchestrates all three through a synchronized microservice engine.",
  },
  {
    capability: "End-to-End Uncertainty Quantification (UQ)",
    legacy: false,
    nautrace: true,
    detail: "Carries spatial uncertainty from satellite segmentation through ocean drift diffusion into the final compatibility confidence score.",
  },
  {
    capability: "Explicit Unknown / Non-AIS Source Hypothesis",
    legacy: false,
    nautrace: true,
    detail: "When no observed AIS track meets legal standards, NAUTRACE explicitly reports an Unknown/Dark Polluter instead of forcing false attribution on innocent passing ships.",
  },
  {
    capability: "Explainable Vessel Ranking Decomposition",
    legacy: false,
    nautrace: true,
    detail: "Decomposes attribution into 6 transparent factors: spatial distance, temporal sync, heading vectors, origin overlap, AIS continuity, and speed anomalies.",
  },
  {
    capability: "Court-Admissible Evidence Audit Trail",
    legacy: "Manual Report Prep",
    nautrace: "Instant Cryptographic Dossier",
    detail: "Generates tamper-evident dossiers with cryptographic hashes and satellite metadata ready for national coast guards and international maritime tribunals.",
  },
];

export const USPComparison: React.FC = () => {
  return (
    <section id="usp-matrix" className="py-20 bg-marine-900 border-b border-cyan-950/80 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMPETITIVE BENCHMARK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-sans">
            Why NAUTRACE is Fundamentally Different
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-sans">
            Existing systems either produce false positives by forcing attribution onto the nearest innocent vessel, or lack the mathematical rigor required for court prosecution.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="rounded-2xl glass-panel border border-cyan-500/30 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-cyan-950/80 bg-marine-950/90 text-slate-400">
                  <th className="p-4 sm:p-5 w-2/5 text-slate-300 font-bold">CAPABILITY / CAPABILITY METRIC</th>
                  <th className="p-4 sm:p-5 w-1/4 text-slate-400">MATURE SYSTEMS (CleanSeaNet / KSAT)</th>
                  <th className="p-4 sm:p-5 w-1/3 text-radar-cyan font-bold bg-cyan-950/30 border-l border-cyan-500/20">
                    NAUTRACE (SIH 2026)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {COMPARISON_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="font-bold text-white font-mono text-sm">{row.capability}</div>
                      <div className="text-xs text-slate-400 mt-1 leading-relaxed">{row.detail}</div>
                    </td>

                    <td className="p-4 sm:p-5 text-slate-300 font-mono">
                      {typeof row.legacy === "boolean" ? (
                        row.legacy ? (
                          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <Check className="w-4 h-4" /> Available
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                            <X className="w-4 h-4" /> Not Supported
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 font-semibold">{row.legacy}</span>
                      )}
                    </td>

                    <td className="p-4 sm:p-5 bg-cyan-950/20 border-l border-cyan-500/20 font-mono">
                      {typeof row.nautrace === "boolean" ? (
                        row.nautrace ? (
                          <span className="flex items-center gap-2 text-radar-cyan font-bold text-sm">
                            <Check className="w-5 h-5 text-radar-cyan" /> Supported (Native)
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-rose-400">
                            <X className="w-4 h-4" />
                          </span>
                        )
                      ) : (
                        <span className="text-radar-teal font-bold text-sm flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-radar-teal" />
                          {row.nautrace}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Highlight Callout Box */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
            <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              END-TO-END UNCERTAINTY PROPAGATION
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
              Unlike static distance checks, NAUTRACE treats segmentation noise, satellite orbit error, wind-drift variance, and AIS transponder jitter as probability distributions, propagating them mathematically to ensure defensible attribution scores.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              PREVENTING FALSE MARITIME PROSECUTION
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
              Dark fleet vessels frequently disable AIS when pumping bilge or cleaning cargo tanks. When no AIS vessel satisfies the origin ellipse criteria, NAUTRACE explicitly flags the incident as "Unknown Source" rather than misattributing guilt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
