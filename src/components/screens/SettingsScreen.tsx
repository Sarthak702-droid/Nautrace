"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Settings,
  Database,
  Radio,
  CheckCircle2,
  Key,
  RotateCcw,
  Shield,
  Server,
  Terminal,
  Save
} from "lucide-react";

export const SettingsScreen: React.FC = () => {
  const [tab, setTab] = useState<"profile" | "sources" | "notifications" | "system">("sources");
  const [apiKey, setApiKey] = useState("nt_live_894e2b9c71a3d5e0f182c4492a71d882");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [apiUrl, setApiUrl] = useState("https://api.nautrace.local/api");

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setApiKey("nt_live_" + Math.random().toString(36).substring(2, 18) + Math.random().toString(36).substring(2, 18));
      setIsRegenerating(false);
    }, 600);
  };

  return (
    <div className="relative min-h-full p-6 space-y-6 font-mono text-slate-200">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <Image
          src="/images/satellite-wake.png"
          alt="Satellite Wake"
          fill
          className="object-cover opacity-12 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/85 to-abyss-950/90" />
      </div>

      {/* Top Header */}
      <div className="p-4 rounded-2xl bio-panel border border-biopunk-green/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-biopunk-green" />
            <span>Platform Configuration &amp; Telemetry Data Sources</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Manage satellite orbits, met-ocean feeds, AIS transponder streams, and Go API gateway keys.
          </p>
        </div>

        {/* Settings Tabs */}
        <div className="flex bg-abyss-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setTab("profile")}
            className={`px-3 py-1.5 rounded transition-all ${
              tab === "profile" ? "bg-biopunk-green text-abyss-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setTab("sources")}
            className={`px-3 py-1.5 rounded transition-all ${
              tab === "sources" ? "bg-biopunk-green text-abyss-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Data Sources
          </button>
          <button
            onClick={() => setTab("notifications")}
            className={`px-3 py-1.5 rounded transition-all ${
              tab === "notifications" ? "bg-biopunk-green text-abyss-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setTab("system")}
            className={`px-3 py-1.5 rounded transition-all ${
              tab === "system" ? "bg-biopunk-green text-abyss-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Data Sources List (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bio-panel border border-biopunk-green/20 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="text-white font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-biopunk-green" />
              INTEGRATED DATA SOURCES
            </span>
            <span className="text-[10px] text-biopunk-green font-semibold">ALL FEEDS OPERATIONAL</span>
          </div>

          <div className="space-y-3 mt-4 text-xs">
            {[
              {
                name: "Sentinel-1 SAR (ESA / Copernicus)",
                desc: "C-Band Interferometric Wide Swath (VV/VH) radar scenes",
                latency: "NRT < 2 hours",
              },
              {
                name: "Copernicus Marine Service (CMEMS)",
                desc: "Global ocean surface currents, sea surface temperature, Stokes drift",
                latency: "Synchronized",
              },
              {
                name: "ERA5 / ECMWF Atmospheric Reanalysis",
                desc: "10m surface wind vectors and atmospheric pressure gradients",
                latency: "Hourly analysis",
              },
              {
                name: "AIS (MarineCadastre / AISStream)",
                desc: "Terrestrial + satellite vessel position, speed, and heading telemetry",
                latency: "Live websocket",
              },
            ].map((src, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-abyss-900 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-white font-bold">{src.name}</div>
                  <div className="text-[11px] text-slate-400 font-sans mt-0.5">{src.desc}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">Status: {src.latency}</div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 text-[10px] font-bold flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Connected</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* API Configuration & Gateway (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bio-panel border border-biopunk-green/20 p-5 space-y-5">
          <div className="text-xs font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
            <Server className="w-4 h-4 text-biopunk-cyan" />
            <span>API GATEWAY CONFIGURATION</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* API Base URL */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-bold">API BASE URL</label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-abyss-900 border border-slate-800 text-biopunk-cyan focus:outline-none focus:border-biopunk-green"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-bold">API SECRET KEY</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg bg-abyss-900 border border-slate-800 text-slate-300 font-mono focus:outline-none"
                />
                <button
                  onClick={handleRegenerate}
                  className="px-3 py-2 rounded-lg bg-abyss-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700 flex items-center gap-1.5"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* PostGIS Connection */}
            <div className="p-3 rounded-lg bg-abyss-900 border border-slate-800 text-xs">
              <div className="text-slate-400 text-[10px]">INTERNAL POSTGIS STORE</div>
              <div className="text-emerald-400 font-bold mt-0.5">postgres://nautrace_admin@db:5432/nautrace</div>
              <div className="text-[10px] text-slate-500 mt-1">Spatial extensions ST_DWithin &amp; ST_GeomFromGeoJSON verified.</div>
            </div>

            {/* Save Button */}
            <button className="w-full py-2.5 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-md shadow-biopunk-green/20">
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
