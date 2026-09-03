"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileSearch,
  Satellite,
  Waves,
  Ship,
  Compass,
  Activity,
  MapPin,
  Clock,
  ShieldAlert,
  Download,
  Share2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { ScreenId } from "../BiopunkSidebar";
import { INCIDENTS_DATA } from "./mockData";

interface IncidentDetailsProps {
  incidentId: string;
  onNavigate: (screen: ScreenId) => void;
}

export const IncidentDetailsScreen: React.FC<IncidentDetailsProps> = ({
  incidentId,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "detections" | "hindcast" | "vessels" | "forecast" | "activity"
  >("overview");

  const incident = INCIDENTS_DATA.find((i) => i.id === incidentId) || INCIDENTS_DATA[0];

  return (
    <div className="relative min-h-full p-6 space-y-6 font-mono text-slate-200">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <Image
          src="/images/satellite-wake.png"
          alt="Satellite Wake Backdrop"
          fill
          className="object-cover opacity-12 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/85 to-abyss-950/90" />
      </div>

      {/* Top Incident Banner */}
      <div className="p-5 rounded-2xl bio-panel border border-biopunk-green/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-abyss-900 border border-biopunk-green/40 text-biopunk-green">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">{incident.id}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-600/40">
                {incident.risk} Risk
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-biopunk-green/20 text-biopunk-green border border-biopunk-green/40">
                {incident.status}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 font-sans">
              {incident.region} • Coords: {incident.lat}° N, {incident.lng}° E
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("reports")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-abyss-800 hover:bg-abyss-700 text-slate-300 text-xs transition-all border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
          <button
            onClick={() => onNavigate("sar-detection")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-biopunk-green/20"
          >
            <span>Run Pipeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-white/10 text-xs font-mono overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-biopunk-green text-biopunk-green"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onNavigate("sar-detection")}
          className="pb-2.5 px-3 font-bold border-b-2 border-transparent text-slate-400 hover:text-biopunk-green flex items-center gap-1.5 transition-all"
        >
          <Satellite className="w-3.5 h-3.5" />
          Detections (SAR)
        </button>
        <button
          onClick={() => onNavigate("hindcast")}
          className="pb-2.5 px-3 font-bold border-b-2 border-transparent text-slate-400 hover:text-biopunk-green flex items-center gap-1.5 transition-all"
        >
          <Waves className="w-3.5 h-3.5" />
          Hindcast
        </button>
        <button
          onClick={() => onNavigate("vessel-attribution")}
          className="pb-2.5 px-3 font-bold border-b-2 border-transparent text-slate-400 hover:text-biopunk-green flex items-center gap-1.5 transition-all"
        >
          <Ship className="w-3.5 h-3.5" />
          Vessels
        </button>
        <button
          onClick={() => onNavigate("forecast")}
          className="pb-2.5 px-3 font-bold border-b-2 border-transparent text-slate-400 hover:text-biopunk-green flex items-center gap-1.5 transition-all"
        >
          <Compass className="w-3.5 h-3.5" />
          Forecast
        </button>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Incident Summary & Data Sources (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Incident Summary Card */}
          <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-5 font-mono">
            <div className="text-xs font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
              <Activity className="w-4 h-4 text-biopunk-green" />
              <span>INCIDENT SUMMARY</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">REGION</span>
                <span className="text-white font-bold">{incident.region}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">DETECTED ON</span>
                <span className="text-slate-300">{incident.detectedOn}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">LAST UPDATED</span>
                <span className="text-slate-300">{incident.lastUpdated}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">SURFACE AREA</span>
                <span className="text-biopunk-cyan font-bold">{incident.area}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">RISK LEVEL</span>
                <span className="text-biopunk-crimson font-bold">{incident.risk}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">LEAD ANALYST</span>
                <span className="text-biopunk-green font-bold">{incident.analyst}</span>
              </div>
            </div>
          </div>

          {/* Sources Ingestion Card */}
          <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-5 font-mono">
            <div className="text-xs font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
              <Satellite className="w-4 h-4 text-biopunk-cyan" />
              <span>SENSOR &amp; TELEMETRY SOURCES</span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-abyss-900 border border-slate-800">
                <div>
                  <div className="text-white font-bold">SAR: Sentinel-1A IW GRDH</div>
                  <div className="text-[10px] text-slate-400">Acquired: 25 Aug 2026 12:00 UTC</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px]">
                  Calibrated
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-abyss-900 border border-slate-800">
                <div>
                  <div className="text-white font-bold">Wind: ERA5 10m Winds</div>
                  <div className="text-[10px] text-slate-400">ECMWF Atmospheric Model</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px]">
                  14.2 kn @ 045°
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-abyss-900 border border-slate-800">
                <div>
                  <div className="text-white font-bold">Currents: CMEMS Surface Currents</div>
                  <div className="text-[10px] text-slate-400">Copernicus Marine Global Analysis</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px]">
                  0.48 m/s @ 238°
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-abyss-900 border border-slate-800">
                <div>
                  <div className="text-white font-bold">AIS Data: MarineCadastre / Terrestrial</div>
                  <div className="text-[10px] text-slate-400">Time window: 24-25 Aug 2026</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px]">
                  5 Candidates
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Location Map & Latest Spill Footprint Mask (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Location Map */}
          <div className="rounded-2xl bio-panel border border-biopunk-green/20 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs">
              <span className="text-white font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-biopunk-crimson" />
                INCIDENT LOCATION
              </span>
              <span className="text-[11px] text-slate-400">14.35° N, 70.85° E</span>
            </div>

            <div className="relative aspect-[16/9] w-full bg-[#030910]">
              <svg viewBox="0 0 500 280" className="w-full h-full object-cover">
                <path
                  d="M 0 0 L 160 0 C 180 80, 220 160, 290 280 L 0 280 Z"
                  fill="#061826"
                  stroke="#0f344f"
                  strokeWidth="1.5"
                />
                <text x="50" y="100" fill="#1e4d6d" fontSize="12" fontFamily="monospace" transform="rotate(-30 50 100)">
                  ARABIAN COAST
                </text>

                {/* Hotspot Star */}
                <g transform="translate(320, 140)">
                  <circle cx="0" cy="0" r="16" fill="rgba(255, 51, 102, 0.3)" className="animate-ping" />
                  <circle cx="0" cy="0" r="7" fill="#ff3366" />
                  <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="#ffffff" />
                </g>
              </svg>
            </div>
          </div>

          {/* Spill Footprint Mask */}
          <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-5 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="text-white font-bold flex items-center gap-2">
                <Satellite className="w-4 h-4 text-biopunk-green" />
                SPILL FOOTPRINT (LATEST MASK)
              </span>
              <span className="text-biopunk-green font-bold text-xs">{incident.area}</span>
            </div>

            <div className="relative aspect-[16/7] w-full bg-abyss-950 rounded-xl overflow-hidden mt-3 border border-slate-800 flex items-center justify-center p-4">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                <path
                  d="M 40 60 C 60 40, 90 45, 120 50 C 150 55, 180 35, 210 45 C 240 55, 270 75, 240 85 C 210 95, 170 80, 140 75 C 110 70, 70 85, 40 60 Z"
                  fill="#ffffff"
                  filter="drop-shadow(0 0 10px rgba(0, 255, 135, 0.5))"
                />
                <circle cx="210" cy="45" r="3" fill="#ff3366" />
              </svg>
              <div className="absolute bottom-2 right-3 text-[10px] text-slate-400">
                Segmented via SegFormer (IoU 0.86)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
