"use client";

import React from "react";
import { Shield, Radar, Satellite, Compass, ArrowRight, CheckCircle2, ChevronRight, Waves, AlertTriangle } from "lucide-react";

interface HeroProps {
  onOpenDossier: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDossier }) => {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden radar-grid border-b border-cyan-950/60">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[250px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hackathon Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-semibold">SMART INDIA HACKATHON 2026</span>
              <span className="text-slate-500">•</span>
              <span>PROBLEM STATEMENT #26143</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">TEAM SAMARTH</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Satellite Oil-Spill <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-radar-cyan via-teal-300 to-blue-500">
                Detection, Hindcasting
              </span>{" "}
              &amp; Vessel Attribution
            </h1>

            {/* Sub-headline / System Overview */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-sans">
              <span className="text-white font-semibold font-mono">NAUTRACE</span> turns raw Sentinel-1 SAR satellite scans and Copernicus oceanographic currents into court-admissible maritime forensics. By backtracking oil drift and scoring vessel kinematics with end-to-end uncertainty propagation, it pinpoints polluters—or explicitly proves non-AIS dark vessel operations.
            </p>

            {/* Key Differentiator Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/70 border border-cyan-500/20 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-radar-cyan shrink-0" />
                <span>End-to-End Uncertainty Quantification (UQ)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/70 border border-emerald-500/20 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-radar-teal shrink-0" />
                <span>Explicit Non-AIS / Dark Vessel Branch</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-900/70 border border-blue-500/20 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>6-Factor Explainable Scoring</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#forensic-map"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-gradient-to-r from-radar-cyan via-cyan-500 to-blue-600 text-marine-950 font-mono font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
              >
                <Radar className="w-4 h-4" />
                <span>LAUNCH FORENSIC CONSOLE</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#intel-gallery"
                className="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-marine-900/90 hover:bg-marine-850 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 font-mono text-sm transition-all"
              >
                <Satellite className="w-4 h-4 text-cyan-400" />
                <span>INSPECT SAR IMAGERY</span>
              </a>

              <button
                onClick={onOpenDossier}
                className="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-marine-900/90 hover:bg-marine-850 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 font-mono text-sm transition-all"
              >
                <Shield className="w-4 h-4 text-radar-teal" />
                <span>GENERATE EVIDENCE DOSSIER</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tactical Radar Telemetry Widget */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl glass-panel p-5 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40">
              {/* Corner brackets for military HUD look */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

              {/* Header inside HUD */}
              <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3 mb-4 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-cyan-300 font-bold tracking-wider">LIVE MARITIME TELEMETRY</span>
                </div>
                <span className="text-slate-400">SENTINEL-1 C-BAND SAR</span>
              </div>

              {/* Radar Circle Visualization */}
              <div className="relative aspect-square max-w-[340px] mx-auto rounded-full border border-cyan-500/30 bg-gradient-to-b from-marine-900 to-marine-950 overflow-hidden flex items-center justify-center">
                {/* Concentric rings */}
                <div className="absolute w-3/4 h-3/4 rounded-full border border-cyan-500/20" />
                <div className="absolute w-1/2 h-1/2 rounded-full border border-cyan-500/20" />
                <div className="absolute w-1/4 h-1/4 rounded-full border border-cyan-500/20" />
                {/* Crosshairs */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/20" />
                <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/20" />

                {/* Radar Sweep Effect */}
                <div className="radar-sweep-effect animate-radar-sweep" />

                {/* Simulated Target Blips */}
                {/* Target Culprit */}
                <div className="absolute top-[28%] left-[62%] group cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-500/50" />
                  <div className="absolute -top-6 -left-12 px-1.5 py-0.5 rounded bg-rose-950/90 border border-rose-500/60 text-[9px] font-mono text-rose-200 whitespace-nowrap">
                    CULPRIT: 89.4%
                  </div>
                </div>

                {/* Slick centroid */}
                <div className="absolute top-[42%] left-[45%]">
                  <div className="w-8 h-4 rounded-full bg-cyan-400/20 border border-cyan-400/60 animate-pulse" />
                  <span className="absolute -bottom-4 -left-6 text-[8px] font-mono text-cyan-300">
                    SLICK CENTROID
                  </span>
                </div>

                {/* Neutral vessel blip */}
                <div className="absolute top-[68%] left-[32%]">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-[8px] font-mono text-slate-400 block ml-3 -mt-2">MV SEA GULL</span>
                </div>

                {/* Met-Ocean Drift Vectors */}
                <div className="absolute bottom-6 right-8 text-[9px] font-mono text-teal-400/80 flex items-center gap-1">
                  <Waves className="w-3 h-3" />
                  <span>DRIFT 0.42 m/s @ 245°</span>
                </div>
              </div>

              {/* Status Feed below radar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">SAR S1A INCIDENT AOI</div>
                  <div className="text-cyan-400 font-bold">8.72° N, 78.15° E</div>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">SLICK EXTENT</div>
                  <div className="text-emerald-400 font-bold">14.62 km² (SegFormer)</div>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">HINDCAST RECONSTRUCTION</div>
                  <div className="text-amber-400 font-bold">T - 11.4h Drift Backtrack</div>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400">ATTRIBUTION OUTCOME</div>
                  <div className="text-rose-400 font-bold">MT OCEAN CONQUEROR</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Counter Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass-panel-subtle border border-cyan-500/10">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              &lt; 8 <span className="text-radar-cyan">MIN</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">End-to-End Investigation Latency</div>
          </div>
          <div className="p-4 rounded-xl glass-panel-subtle border border-cyan-500/10">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              94.2<span className="text-radar-teal">%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">Look-Alike False Positive Rejection</div>
          </div>
          <div className="p-4 rounded-xl glass-panel-subtle border border-cyan-500/10">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              ± 1.4 <span className="text-blue-400">KM</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">OpenDrift Origin Ellipse Precision</div>
          </div>
          <div className="p-4 rounded-xl glass-panel-subtle border border-cyan-500/10">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              100<span className="text-amber-400">%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">Court-Admissible Provenance Audit</div>
          </div>
        </div>
      </div>
    </section>
  );
};
