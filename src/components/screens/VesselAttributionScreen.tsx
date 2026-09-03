"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Ship,
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Activity
} from "lucide-react";
import { CANDIDATE_VESSELS } from "./mockData";

interface VesselAttributionProps {
  onBack: () => void;
  onProceedToForecast: () => void;
}

export const VesselAttributionScreen: React.FC<VesselAttributionProps> = ({
  onBack,
  onProceedToForecast,
}) => {
  const [selectedVessel, setSelectedVessel] = useState(CANDIDATE_VESSELS[0]);
  const [vesselTypeFilter, setVesselTypeFilter] = useState("All");

  return (
    <div className="relative min-h-full p-6 space-y-6 font-mono text-slate-200">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <Image
          src="/images/carrier-discharge.png"
          alt="Carrier Discharge Backdrop"
          fill
          className="object-cover opacity-12 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/85 to-abyss-950/90" />
      </div>

      {/* Header Bar */}
      <div className="p-4 rounded-2xl bio-panel border border-biopunk-green/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-abyss-900 border border-slate-800 text-slate-400 hover:text-white hover:border-biopunk-green/40 transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Ship className="w-4 h-4 text-biopunk-green" />
              <span>Vessel Attribution — INC-2026-008</span>
            </h2>
            <div className="text-[11px] text-slate-400">
              5-Factor Kinematic Scoring Engine • Time Window: 24 Aug 00:00 – 25 Aug 12:00 UTC
            </div>
          </div>
        </div>

        <button
          onClick={onProceedToForecast}
          className="px-4 py-2 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-biopunk-green/20"
        >
          Forward Forecast →
        </button>
      </div>

      {/* Main Attribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Candidate Vessels Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bio-panel border border-biopunk-green/20 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="text-white font-bold flex items-center gap-2">
              <Ship className="w-4 h-4 text-biopunk-green" />
              CANDIDATE VESSELS ({CANDIDATE_VESSELS.length})
            </span>
            <div className="text-[10px] text-slate-400">MIN THRESHOLD: 0.60</div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-2">RANK</th>
                  <th className="pb-2">MMSI</th>
                  <th className="pb-2">VESSEL NAME</th>
                  <th className="pb-2">TYPE</th>
                  <th className="pb-2">COMPATIBILITY</th>
                  <th className="pb-2">RISK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {CANDIDATE_VESSELS.map((v) => {
                  const isSelected = selectedVessel.mmsi === v.mmsi;
                  return (
                    <tr
                      key={v.mmsi}
                      onClick={() => setSelectedVessel(v)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-biopunk-green/20" : "hover:bg-abyss-900/60"
                      }`}
                    >
                      <td className="py-3 font-mono font-bold text-slate-400">#{v.rank}</td>
                      <td className="py-3 font-mono text-biopunk-cyan">{v.mmsi}</td>
                      <td className="py-3 font-bold text-white">{v.name}</td>
                      <td className="py-3 text-slate-400 text-xs">{v.type}</td>
                      <td className="py-3 font-mono font-bold text-white">{v.score.toFixed(2)}</td>
                      <td className="py-3 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            v.risk === "High"
                              ? "bg-rose-950 text-rose-300 border border-rose-600/40"
                              : v.risk === "Medium"
                              ? "bg-amber-950 text-amber-300 border border-amber-600/40"
                              : "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                          }`}
                        >
                          {v.risk}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Track Viewer & Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4 font-mono">
          {/* Vessel Track Map */}
          <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="text-white font-bold">Vessel Track — {selectedVessel.name}</span>
              <span className="text-biopunk-cyan text-[10px]">AIS Kinematics</span>
            </div>

            <div className="relative aspect-[16/9] w-full bg-[#030910] rounded-xl overflow-hidden mt-3 border border-slate-800">
              <svg viewBox="0 0 320 180" className="w-full h-full object-cover">
                {/* AIS Route Line */}
                <path
                  d="M 40 140 L 90 110 L 160 80 L 230 60 L 290 40"
                  fill="none"
                  stroke="#00ff87"
                  strokeWidth="2.5"
                />
                {/* Waypoints */}
                {[
                  [40, 140],
                  [90, 110],
                  [160, 80],
                  [230, 60],
                  [290, 40],
                ].map(([px, py], i) => (
                  <circle
                    key={i}
                    cx={px}
                    cy={py}
                    r="4"
                    fill={i === 2 ? "#ff3366" : "#00ff87"}
                    className={i === 2 ? "animate-ping" : ""}
                  />
                ))}
                {/* Origin Intercept Marker */}
                <g transform="translate(160, 80)">
                  <circle cx="0" cy="0" r="14" fill="rgba(255, 51, 102, 0.3)" />
                  <circle cx="0" cy="0" r="5" fill="#ff3366" />
                  <text x="10" y="-8" fill="#ff3366" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    DISCHARGE POINT
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Compatibility Breakdown */}
          <div className="rounded-2xl bio-panel border border-biopunk-green/30 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
              <span className="text-biopunk-green font-bold">COMPATIBILITY BREAKDOWN</span>
              <span className="text-white font-bold">{selectedVessel.name}</span>
            </div>

            <div className="space-y-2 mt-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">Spatial Overlap</span>
                  <span className="text-white font-bold">{selectedVessel.spatial}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-biopunk-green h-full rounded-full" style={{ width: `${selectedVessel.spatial * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">Temporal Match</span>
                  <span className="text-white font-bold">{selectedVessel.temporal}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-biopunk-cyan h-full rounded-full" style={{ width: `${selectedVessel.temporal * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">Trajectory Consistency</span>
                  <span className="text-white font-bold">{selectedVessel.trajectory}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${selectedVessel.trajectory * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">Speed Consistency</span>
                  <span className="text-white font-bold">{selectedVessel.speed}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-biopunk-amber h-full rounded-full" style={{ width: `${selectedVessel.speed * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-slate-400">Behavioral Match</span>
                  <span className="text-white font-bold">{selectedVessel.behavior}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-biopunk-crimson h-full rounded-full" style={{ width: `${selectedVessel.behavior * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Overall Score Box */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">OVERALL SCORE:</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{selectedVessel.score.toFixed(2)}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedVessel.risk === "High" ? "bg-rose-950 text-rose-300" : "bg-emerald-950 text-emerald-300"
                  }`}
                >
                  {selectedVessel.risk} Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
