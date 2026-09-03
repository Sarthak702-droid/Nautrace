"use client";

import React from "react";
import {
  LayoutDashboard,
  ListFilter,
  FileSearch,
  Satellite,
  Waves,
  Ship,
  Compass,
  FileText,
  Bell,
  Settings,
  Shield,
  Radio,
  Flame
} from "lucide-react";

export type ScreenId =
  | "dashboard"
  | "incident-list"
  | "incident-details"
  | "sar-detection"
  | "hindcast"
  | "vessel-attribution"
  | "forecast"
  | "reports"
  | "alerts"
  | "settings";

interface SidebarProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  activeIncidentsCount: number;
  alertsCount: number;
}

const MENU_ITEMS: { id: ScreenId; num: string; label: string; icon: any }[] = [
  { id: "dashboard", num: "01", label: "Dashboard", icon: LayoutDashboard },
  { id: "incident-list", num: "02", label: "Incidents", icon: ListFilter },
  { id: "incident-details", num: "03", label: "Incident Details", icon: FileSearch },
  { id: "sar-detection", num: "04", label: "Detections (SAR)", icon: Satellite },
  { id: "hindcast", num: "05", label: "Hindcast & Origin", icon: Waves },
  { id: "vessel-attribution", num: "06", label: "Vessels", icon: Ship },
  { id: "forecast", num: "07", label: "Forecast", icon: Compass },
  { id: "reports", num: "08", label: "Reports", icon: FileText },
  { id: "alerts", num: "09", label: "Alerts", icon: Bell },
  { id: "settings", num: "10", label: "Settings", icon: Settings },
];

export const BiopunkSidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onSelectScreen,
  activeIncidentsCount,
  alertsCount,
}) => {
  return (
    <aside className="w-64 shrink-0 bg-abyss-950/95 border-r border-biopunk-green/20 flex flex-col justify-between select-none z-30 font-mono">
      {/* Brand & Identity */}
      <div>
        <div className="p-4 border-b border-biopunk-green/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-lg bg-abyss-900 border border-biopunk-green/40 flex items-center justify-center shadow-lg shadow-biopunk-green/20">
              <Radio className="w-5 h-5 text-biopunk-green animate-pulse" />
              <div className="absolute inset-0 rounded-lg bg-biopunk-green/10 blur-xs pointer-events-none" />
            </div>
            <div>
              <div className="text-base font-black tracking-widest text-white">
                NAU<span className="text-biopunk-green">TRACE</span>
              </div>
              <div className="text-[9px] tracking-wider text-biopunk-cyan/70 font-semibold">
                MARITIME DOMAIN INTEL
              </div>
            </div>
          </div>
        </div>

        {/* System Status Banner */}
        <div className="px-4 py-2 bg-abyss-900/60 border-b border-white/5 flex items-center justify-between text-[10px]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-biopunk-green animate-ping" />
            <span>BIO-RADAR ONLINE</span>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-biopunk-green/10 text-biopunk-green border border-biopunk-green/30 text-[9px]">
            SIH 2026
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 text-xs">
          {MENU_ITEMS.map((item) => {
            const active = currentScreen === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                  active
                    ? "bg-biopunk-green/20 text-biopunk-green border border-biopunk-green/50 shadow-md shadow-biopunk-green/10 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-abyss-900/70 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-biopunk-green" : "text-slate-400"}`} />
                  <span className="tracking-wide text-xs">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.id === "alerts" && alertsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-biopunk-crimson/90 text-white text-[9px] font-bold">
                      {alertsCount}
                    </span>
                  )}
                  {item.id === "incident-list" && (
                    <span className="px-1.5 py-0.2 rounded bg-abyss-800 text-slate-400 text-[9px]">
                      {activeIncidentsCount}
                    </span>
                  )}
                  <span className={`text-[10px] ${active ? "text-biopunk-green" : "text-slate-600"}`}>
                    {item.num}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User & Analyst Tag */}
      <div className="p-4 border-t border-biopunk-green/20 bg-abyss-900/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-biopunk-green/20 border border-biopunk-green/40 flex items-center justify-center text-biopunk-green text-xs font-bold">
              TS
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-none">Analyst Session</div>
              <div className="text-[10px] text-biopunk-green/80 mt-0.5">Team Samarth (SIH)</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-biopunk-green" title="Active Connection" />
        </div>
      </div>
    </aside>
  );
};
