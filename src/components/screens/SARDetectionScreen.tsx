"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Satellite,
  ArrowLeft,
  Layers,
  Sparkles,
  Sliders,
  CheckSquare,
  Square,
  ZoomIn,
  Activity
} from "lucide-react";
import { ScreenId } from "../BiopunkSidebar";

interface SARDetectionProps {
  onBack: () => void;
  onProceedToHindcast: () => void;
}

export const SARDetectionScreen: React.FC<SARDetectionProps> = ({
  onBack,
  onProceedToHindcast,
}) => {
  const [layers, setLayers] = useState({
    vv: true,
    vh: true,
    prob: true,
    mask: true,
    coastline: true,
  });

  const [threshold, setThreshold] = useState<number>(0.5);

  return (
    <div className="relative min-h-full p-6 space-y-6 font-mono text-slate-200">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <Image
          src="/images/satellite-wake.png"
          alt="Satellite Wake"
          fill
          className="object-cover opacity-15 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/85 to-abyss-950/90" />
      </div>

      {/* Top Header Bar */}
      <div className="p-4 rounded-2xl bio-panel border border-biopunk-green/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-abyss-900 border border-slate-800 text-slate-400 hover:text-white hover:border-biopunk-green/40 transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Incident</span>
          </button>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Satellite className="w-4 h-4 text-biopunk-green" />
              <span>Detection — INC-2026-008</span>
            </h2>
            <div className="text-[11px] text-slate-400">
              SAR Acquisition: 25 Aug 2026 12:00 UTC • Sentinel-1A C-Band IW Mode
            </div>
          </div>
        </div>

        <button
          onClick={onProceedToHindcast}
          className="px-4 py-2 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-biopunk-green/20 self-start sm:self-auto"
        >
          Run Drift Hindcast →
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Layers Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white pb-3 border-b border-white/10">
              <Layers className="w-4 h-4 text-biopunk-green" />
              <span>ACTIVE LAYERS</span>
            </div>

            <div className="space-y-2 mt-3 text-xs">
              {[
                { key: "vv", label: "VV (dB) Co-Pol" },
                { key: "vh", label: "VH (dB) Cross-Pol" },
                { key: "prob", label: "Oil Probability (AI)" },
                { key: "mask", label: "Detected Mask Contour" },
                { key: "coastline", label: "Shoreline / EEZ Vectors" },
              ].map(({ key, label }) => {
                const active = (layers as any)[key];
                return (
                  <button
                    key={key}
                    onClick={() => setLayers((prev: any) => ({ ...prev, [key]: !prev[key] }))}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-all text-left ${
                      active
                        ? "bg-biopunk-green/15 text-biopunk-green border border-biopunk-green/40 font-semibold"
                        : "bg-abyss-900/60 text-slate-400 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {active ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Threshold Slider */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Decision Threshold</span>
                <span className="text-biopunk-cyan font-bold">{threshold}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-biopunk-green h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Col: 4 Multi-Polarization Panels (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Panel 1: VV (dB) */}
            <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="text-white font-bold">VV (dB) — Single Polarization</span>
                <span className="text-[10px] text-slate-500">-22 dB to -8 dB</span>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mt-2 border border-slate-800 flex items-center justify-center">
                {/* Grayscale radar effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-900" />
                <div className="relative w-48 h-24 bg-black/80 rounded-full blur-[2px] border border-white/10 flex items-center justify-center" />
                <span className="absolute bottom-2 left-2 text-[9px] text-slate-500 font-mono">
                  BACKSCATTER DAMPING DETECTED
                </span>
              </div>
            </div>

            {/* Panel 2: VH (dB) */}
            <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="text-white font-bold">VH (dB) — Cross Polarization</span>
                <span className="text-[10px] text-slate-500">-30 dB to -14 dB</span>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mt-2 border border-slate-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950" />
                <div className="relative w-44 h-20 bg-black/90 rounded-full blur-[3px] border border-white/10" />
                <span className="absolute bottom-2 left-2 text-[9px] text-slate-500 font-mono">
                  CROSS-POL WAKE SUPPRESSION
                </span>
              </div>
            </div>

            {/* Panel 3: Oil Probability Heatmap */}
            <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="text-biopunk-green font-bold">Oil Probability (SegFormer)</span>
                <span className="text-[10px] text-biopunk-cyan font-bold">0.0 → 1.0</span>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-abyss-950 mt-2 border border-slate-800 flex items-center justify-center">
                {/* Heatmap visualization */}
                <div className="w-48 h-24 rounded-full bg-gradient-to-r from-blue-600 via-emerald-400 via-amber-400 to-rose-600 opacity-80 blur-sm shadow-xl shadow-rose-600/30" />
                <span className="absolute bottom-2 left-2 text-[9px] text-slate-300 font-mono">
                  PEAK CONFIDENCE: 0.86
                </span>
                {/* Colorbar */}
                <div className="absolute top-2 right-2 w-28 h-2 rounded bg-gradient-to-r from-blue-700 via-cyan-400 via-yellow-400 to-red-600" />
              </div>
            </div>

            {/* Panel 4: Detected Oil Mask */}
            <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                <span className="text-white font-bold">Detected Oil Mask (Binary)</span>
                <span className="text-[10px] text-emerald-400 font-bold">Area: 12.4 km²</span>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mt-2 border border-slate-800 flex items-center justify-center p-4">
                <svg viewBox="0 0 240 120" className="w-full h-full">
                  <path
                    d="M 30 60 C 50 40, 80 45, 110 50 C 140 55, 170 35, 190 45 C 220 55, 230 75, 210 85 C 180 95, 150 80, 120 75 C 90 70, 50 85, 30 60 Z"
                    fill="#ffffff"
                    filter="drop-shadow(0 0 8px rgba(0, 255, 135, 0.6))"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Detection Statistics Bar */}
          <div className="p-4 rounded-xl bio-panel border border-biopunk-green/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">CONFIDENCE (MEAN)</span>
              <span className="text-white font-bold text-base">0.86</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">SURFACE AREA</span>
              <span className="text-biopunk-cyan font-bold text-base">12.4 km²</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">PERIMETER</span>
              <span className="text-biopunk-green font-bold text-base">18.7 km</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">THRESHOLD</span>
              <span className="text-biopunk-amber font-bold text-base">{threshold}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
