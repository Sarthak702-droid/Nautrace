"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Bell,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Filter,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { ALERTS_DATA } from "./mockData";
import { ScreenId } from "../BiopunkSidebar";

interface AlertsProps {
  onSelectIncident: (id: string) => void;
}

export const AlertsScreen: React.FC<AlertsProps> = ({ onSelectIncident }) => {
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  return (
    <div className="relative min-h-full p-6 space-y-6 font-mono text-slate-200">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <Image
          src="/images/carrier-discharge.png"
          alt="Discharge Backdrop"
          fill
          className="object-cover opacity-10 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/85 to-abyss-950/90" />
      </div>

      {/* Header Bar */}
      <div className="p-4 rounded-2xl bio-panel border border-biopunk-green/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-biopunk-amber animate-pulse" />
            <span>Real-Time Alerts &amp; Sensor Feeds</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Automated detection alerts, threshold triggers, and vessel kinematic anomalies.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="bg-abyss-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All Types" className="bg-abyss-950">All Types</option>
              <option value="Vessel Risk" className="bg-abyss-950">Vessel Risk</option>
              <option value="Spill Detection" className="bg-abyss-950">Spill Detection</option>
              <option value="Forecast Alert" className="bg-abyss-950">Forecast Alert</option>
            </select>
          </div>

          <div className="bg-abyss-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All Status" className="bg-abyss-950">All Status</option>
              <option value="Unread" className="bg-abyss-950">Unread</option>
              <option value="Resolved" className="bg-abyss-950">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-5 space-y-4">
        {ALERTS_DATA.map((alt) => (
          <div
            key={alt.id}
            onClick={() => onSelectIncident(alt.incidentId)}
            className="p-4 rounded-xl bg-abyss-900/80 border border-slate-800 hover:border-biopunk-green/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  alt.level === "High"
                    ? "bg-rose-950/80 text-rose-300 border border-rose-600/40"
                    : alt.level === "Medium"
                    ? "bg-amber-950/80 text-amber-300 border border-amber-600/40"
                    : "bg-emerald-950/80 text-emerald-300 border border-emerald-600/40"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-biopunk-green transition-colors">
                    {alt.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">• {alt.timeAgo}</span>
                </div>
                <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed max-w-2xl">{alt.desc}</p>
                <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-biopunk-cyan">
                  <span>Incident: {alt.incidentId}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center shrink-0 font-mono">
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  alt.level === "High"
                    ? "bg-rose-950 text-rose-300 border border-rose-600/40"
                    : alt.level === "Medium"
                    ? "bg-amber-950 text-amber-300 border border-amber-600/40"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                }`}
              >
                {alt.level.toUpperCase()}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-biopunk-green transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
