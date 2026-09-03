"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Shield, Clock, Plus, Filter, Sparkles } from "lucide-react";
import { ScreenId } from "./BiopunkSidebar";

interface HeaderProps {
  currentScreen: ScreenId;
  onNewIncident: () => void;
  onOpenAlerts: () => void;
  alertsCount: number;
}

const SCREEN_TITLES: Record<ScreenId, { title: string; subtitle: string }> = {
  dashboard: { title: "01 DASHBOARD", subtitle: "Global Maritime Overview & Situational Awareness" },
  "incident-list": { title: "02 INCIDENTS DIRECTORY", subtitle: "Filter & Monitor Active Hydrocarbon Spills" },
  "incident-details": { title: "03 INCIDENT DETAILS (INC-2026-008)", subtitle: "Arabian Sea • Multi-Source Sensor Telemetry" },
  "sar-detection": { title: "04 OIL SPILL DETECTION (SAR)", subtitle: "Sentinel-1 C-Band Dual-Pol & SegFormer AI Mask" },
  hindcast: { title: "05 HINDCAST & ORIGIN TRACE", subtitle: "OpenDrift Backward Lagrangian Particle Transport" },
  "vessel-attribution": { title: "06 VESSEL ATTRIBUTION", subtitle: "Explainable 5-Factor Kinematic Scoring Engine" },
  forecast: { title: "07 FORECAST (DRIFT PREDICTION)", subtitle: "Forward Met-Ocean Dispersal & Shoreline Impact" },
  reports: { title: "08 REPORTS & EXPORT", subtitle: "Court-Admissible Legal Investigation Packages" },
  alerts: { title: "09 ALERTS & NOTIFICATIONS", subtitle: "Real-Time Threat Detection & Sensor Anomalies" },
  settings: { title: "10 SYSTEM SETTINGS", subtitle: "Copernicus, ECMWF, AIS Connectors & API Gateways" },
};

export const BiopunkHeader: React.FC<HeaderProps> = ({
  currentScreen,
  onNewIncident,
  onOpenAlerts,
  alertsCount,
}) => {
  const [timeUTC, setTimeUTC] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUTC(
        now.toISOString().replace("T", " ").substring(0, 19) + " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const meta = SCREEN_TITLES[currentScreen];

  return (
    <header className="h-16 shrink-0 bg-abyss-950/90 border-b border-biopunk-green/20 px-6 flex items-center justify-between select-none z-20 font-mono">
      {/* Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-white tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-biopunk-green" />
            {meta.title}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-sans">
            {meta.subtitle}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* UTC Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-abyss-900 border border-slate-800 text-[11px] text-biopunk-cyan font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeUTC || "2026-08-25 16:45:00 UTC"}</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden lg:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Incidents, MMSI, AOI..."
            className="w-56 pl-8 pr-3 py-1 text-xs rounded-lg bg-abyss-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-biopunk-green/60"
          />
        </div>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2 rounded-lg bg-abyss-900 border border-slate-800 text-slate-400 hover:text-white hover:border-biopunk-green/50 transition-colors"
          title="View Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-biopunk-crimson text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
              {alertsCount}
            </span>
          )}
        </button>

        {/* New Incident Action */}
        <button
          onClick={onNewIncident}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-biopunk-green/20 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">NEW INCIDENT</span>
        </button>
      </div>
    </header>
  );
};
