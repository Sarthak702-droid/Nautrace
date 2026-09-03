"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Globe,
  AlertTriangle,
  Flame,
  Radio,
  Ship,
  Eye,
  ChevronRight,
  Filter,
  Calendar,
  Layers,
  CheckCircle2
} from "lucide-react";
import { INCIDENTS_DATA, ALERTS_DATA, IncidentItem } from "./mockData";
import { ScreenId } from "../BiopunkSidebar";

interface DashboardProps {
  onNavigate: (screen: ScreenId, incidentId?: string) => void;
}

export const DashboardScreen: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [periodFilter, setPeriodFilter] = useState("Last 7 Days");

  const filteredIncidents = INCIDENTS_DATA.filter((inc) => {
    if (regionFilter !== "All Regions" && inc.region !== regionFilter) return false;
    if (statusFilter !== "All Status" && inc.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="relative min-h-full p-6 space-y-6 font-mono text-slate-200">
      {/* Background Image Overlay with Biopunk Vignette */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <Image
          src="/images/satellite-wake.png"
          alt="Satellite Ocean Backdrop"
          fill
          className="object-cover opacity-15 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/85 to-abyss-950/90" />
        <div className="absolute inset-0 biopunk-scanline opacity-40" />
      </div>

      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bio-panel border border-biopunk-green/20">
        <div className="flex items-center gap-2 text-xs text-biopunk-green font-bold">
          <Globe className="w-4 h-4 text-biopunk-green" />
          <span>MARITIME DOMAIN OVERVIEW</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Region */}
          <div className="flex items-center gap-1.5 bg-abyss-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <Filter className="w-3 h-3 text-slate-500" />
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All Regions" className="bg-abyss-950">All Regions</option>
              <option value="Arabian Sea" className="bg-abyss-950">Arabian Sea</option>
              <option value="Bay of Bengal" className="bg-abyss-950">Bay of Bengal</option>
              <option value="Gulf of Mexico" className="bg-abyss-950">Gulf of Mexico</option>
              <option value="South China Sea" className="bg-abyss-950">South China Sea</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 bg-abyss-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All Status" className="bg-abyss-950">All Status</option>
              <option value="Active" className="bg-abyss-950">Active</option>
              <option value="Closed" className="bg-abyss-950">Closed</option>
            </select>
          </div>

          {/* Period */}
          <div className="flex items-center gap-1.5 bg-abyss-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-biopunk-cyan">
            <Calendar className="w-3 h-3" />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Last 7 Days" className="bg-abyss-950 text-slate-300">Last 7 Days</option>
              <option value="Last 24 Hours" className="bg-abyss-950 text-slate-300">Last 24 Hours</option>
              <option value="Last 30 Days" className="bg-abyss-950 text-slate-300">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bio-panel border border-biopunk-green/20 bio-panel-hover transition-all">
          <div className="text-[11px] text-slate-400">Total Incidents</div>
          <div className="text-3xl font-black text-white mt-1 tracking-tight">24</div>
          <div className="text-[10px] text-biopunk-green/80 mt-1 flex items-center gap-1">
            <span>+3 new this week</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bio-panel border border-biopunk-cyan/20 bio-panel-hover transition-all">
          <div className="text-[11px] text-slate-400">Active Incidents</div>
          <div className="text-3xl font-black text-biopunk-cyan mt-1 tracking-tight">7</div>
          <div className="text-[10px] text-biopunk-cyan/80 mt-1 flex items-center gap-1">
            <span>Under live monitoring</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bio-panel border border-biopunk-emerald/20 bio-panel-hover transition-all">
          <div className="text-[11px] text-slate-400">Detections</div>
          <div className="text-3xl font-black text-biopunk-green mt-1 tracking-tight">18</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>SAR SegFormer validated</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bio-panel border border-biopunk-crimson/30 bio-panel-hover transition-all">
          <div className="text-[11px] text-slate-400">High Risk Vessels</div>
          <div className="text-3xl font-black text-biopunk-crimson mt-1 tracking-tight">5</div>
          <div className="text-[10px] text-rose-400 mt-1 flex items-center gap-1">
            <span>Compatibility &gt; 0.80</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bio-panel border border-biopunk-amber/20 bio-panel-hover transition-all">
          <div className="text-[11px] text-slate-400">Alerts</div>
          <div className="text-3xl font-black text-biopunk-amber mt-1 tracking-tight">3</div>
          <div className="text-[10px] text-amber-400 mt-1 flex items-center gap-1">
            <span>Requiring analyst sign-off</span>
          </div>
        </div>
      </div>

      {/* Global Overview Map Container */}
      <div className="rounded-2xl bio-panel border border-biopunk-green/30 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <Radio className="w-4 h-4 text-biopunk-green animate-pulse" />
            <span>GLOBAL OVERVIEW &amp; ACTIVE INCIDENT HOTSPOTS</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-biopunk-crimson" /> High Risk
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-biopunk-amber" /> Medium
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-biopunk-green" /> Low
            </span>
          </div>
        </div>

        {/* World Map SVG with Hotspots */}
        <div className="relative aspect-[21/9] w-full bg-[#030910] overflow-hidden select-none">
          <svg viewBox="0 0 1000 450" className="w-full h-full object-cover">
            <defs>
              <pattern id="dashGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 135, 0.05)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="1000" height="450" fill="url(#dashGrid)" />

            {/* Stylized World Continents */}
            {/* Americas */}
            <path
              d="M 150 70 Q 220 60, 280 90 T 260 180 T 320 280 T 340 380 T 290 410 L 260 380 Q 210 260, 160 210 Z"
              fill="#061520"
              stroke="#0a2a3f"
              strokeWidth="1"
            />
            {/* Eurasia / Africa */}
            <path
              d="M 440 60 Q 560 40, 720 70 T 880 120 T 780 220 T 680 160 T 560 160 T 500 240 T 540 380 T 480 360 T 450 200 Z"
              fill="#061520"
              stroke="#0a2a3f"
              strokeWidth="1"
            />
            {/* Australia */}
            <path
              d="M 780 290 Q 860 280, 890 330 T 830 380 T 770 340 Z"
              fill="#061520"
              stroke="#0a2a3f"
              strokeWidth="1"
            />

            {/* Incident Pins */}
            {/* Arabian Sea (INC-2026-008) */}
            <g
              transform="translate(630, 190)"
              className="cursor-pointer group"
              onClick={() => onNavigate("incident-details", "INC-2026-008")}
            >
              <circle cx="0" cy="0" r="14" fill="rgba(255, 51, 102, 0.25)" className="animate-ping" />
              <circle cx="0" cy="0" r="6" fill="#ff3366" />
              <circle cx="0" cy="0" r="2" fill="#ffffff" />
              <rect x="12" y="-12" width="130" height="24" rx="4" fill="#040b10" stroke="#ff3366" strokeWidth="1" />
              <text x="18" y="4" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                INC-2026-008 (HIGH)
              </text>
            </g>

            {/* Bay of Bengal (INC-2026-007) */}
            <g
              transform="translate(685, 205)"
              className="cursor-pointer group"
              onClick={() => onNavigate("incident-details", "INC-2026-007")}
            >
              <circle cx="0" cy="0" r="10" fill="rgba(245, 158, 11, 0.25)" className="animate-pulse" />
              <circle cx="0" cy="0" r="5" fill="#f59e0b" />
              <text x="10" y="4" fill="#f59e0b" fontSize="9" fontFamily="monospace">
                INC-2026-007
              </text>
            </g>

            {/* Gulf of Mexico (INC-2026-006) */}
            <g transform="translate(240, 175)" className="cursor-pointer">
              <circle cx="0" cy="0" r="4" fill="#00ff87" />
              <text x="8" y="3" fill="#00ff87" fontSize="8" fontFamily="monospace">
                INC-006 (CLOSED)
              </text>
            </g>

            {/* South China Sea */}
            <g transform="translate(760, 220)" className="cursor-pointer">
              <circle cx="0" cy="0" r="5" fill="#f59e0b" />
            </g>

            {/* Mediterranean */}
            <g transform="translate(510, 140)" className="cursor-pointer">
              <circle cx="0" cy="0" r="4" fill="#00ff87" />
            </g>
          </svg>
        </div>
      </div>

      {/* Lower Row: Recent Incidents Table & Alerts List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Incidents (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bio-panel border border-biopunk-green/20 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="text-white font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-biopunk-green" />
                RECENT INCIDENTS
              </span>
              <button
                onClick={() => onNavigate("incident-list")}
                className="text-biopunk-green hover:underline text-xs"
              >
                View All →
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">REGION</th>
                    <th className="pb-2">DETECTED ON</th>
                    <th className="pb-2">RISK</th>
                    <th className="pb-2 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredIncidents.slice(0, 4).map((inc) => (
                    <tr key={inc.id} className="hover:bg-abyss-900/60 transition-colors">
                      <td className="py-2.5 font-mono text-biopunk-cyan font-semibold">{inc.id}</td>
                      <td className="py-2.5 text-slate-300">{inc.region}</td>
                      <td className="py-2.5 text-slate-400 text-[11px] font-mono">{inc.detectedOn}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            inc.risk === "High"
                              ? "bg-rose-950/80 text-rose-300 border border-rose-600/40"
                              : inc.risk === "Medium"
                              ? "bg-amber-950/80 text-amber-300 border border-amber-600/40"
                              : "bg-emerald-950/80 text-emerald-300 border border-emerald-600/40"
                          }`}
                        >
                          {inc.risk}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-mono">
                        <button
                          onClick={() => onNavigate("incident-details", inc.id)}
                          className="px-2 py-1 rounded bg-abyss-800 text-biopunk-green hover:bg-biopunk-green hover:text-abyss-950 text-[11px] transition-all font-bold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Alerts Feed (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bio-panel border border-biopunk-green/20 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="text-white font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-biopunk-amber" />
                SYSTEM ALERTS
              </span>
              <button
                onClick={() => onNavigate("alerts")}
                className="text-biopunk-amber hover:underline text-xs"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {ALERTS_DATA.slice(0, 3).map((alt) => (
                <div
                  key={alt.id}
                  className="p-3 rounded-xl bg-abyss-900/80 border border-slate-800 hover:border-biopunk-green/30 transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{alt.title}</span>
                    <span className="text-[10px] text-slate-500">{alt.timeAgo}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] font-sans mt-1 leading-snug">{alt.desc}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                    <span className="text-biopunk-cyan font-mono">{alt.incidentId}</span>
                    <span
                      className={`font-bold ${
                        alt.level === "High" ? "text-biopunk-crimson" : "text-biopunk-amber"
                      }`}
                    >
                      {alt.level.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
