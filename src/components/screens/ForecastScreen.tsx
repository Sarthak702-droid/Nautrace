"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Compass,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Waves,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

interface ForecastProps {
  onBack: () => void;
  onProceedToReports: () => void;
}

export const ForecastScreen: React.FC<ForecastProps> = ({
  onBack,
  onProceedToReports,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [forecastHour, setForecastHour] = useState<number>(24);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setForecastHour((prev) => (prev >= 48 ? 0 : prev + 2));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="relative min-h-full p-6 space-y-6 font-mono text-slate-200">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <Image
          src="/images/spectral-slick.png"
          alt="Spectral Slick"
          fill
          className="object-cover opacity-15 mix-blend-screen scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/85 to-abyss-950/90" />
      </div>

      {/* Top Header Bar */}
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
              <Compass className="w-4 h-4 text-biopunk-green" />
              <span>Forecast (Drift Prediction) — INC-2026-008</span>
            </h2>
            <div className="text-[11px] text-slate-400">
              Forward Plume Dispersal • CMEMS Surface Currents + ERA5 10m Winds
            </div>
          </div>
        </div>

        <button
          onClick={onProceedToReports}
          className="px-4 py-2 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-biopunk-green/20"
        >
          Generate Report →
        </button>
      </div>

      {/* Main Forecast Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Parameters & Timeline (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-4 space-y-4">
            <div className="text-xs font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
              <Clock className="w-4 h-4 text-biopunk-green" />
              <span>FORECAST CONTROLS</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-2.5 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? "Pause" : "Play Forecast"}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setForecastHour(0);
                }}
                className="p-2.5 rounded-lg bg-abyss-900 border border-slate-800 text-slate-300 hover:text-white"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Forward Window</span>
                <span className="text-biopunk-cyan font-bold">T + {forecastHour}h</span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                step="1"
                value={forecastHour}
                onChange={(e) => {
                  setIsPlaying(false);
                  setForecastHour(Number(e.target.value));
                }}
                className="w-full accent-biopunk-green h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Config details */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Model:</span>
                <span className="text-white">Surface Drift</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Forcing:</span>
                <span className="text-biopunk-cyan font-bold">CMEMS + ERA5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="text-white">48 Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Particles:</span>
                <span className="text-biopunk-green font-bold">5,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Plume Dispersal Visualizer (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="rounded-2xl bio-panel border border-biopunk-green/30 overflow-hidden relative shadow-2xl">
            <div className="relative aspect-[16/9] w-full bg-[#02070e] select-none">
              <svg viewBox="0 0 700 400" className="w-full h-full object-cover">
                {/* Coastline */}
                <path
                  d="M 0 0 L 160 0 C 180 80, 220 160, 290 400 L 0 400 Z"
                  fill="#051420"
                  stroke="#0f344f"
                  strokeWidth="1.5"
                />
                <text x="35" y="100" fill="#1e4d6d" fontSize="12" fontFamily="monospace" transform="rotate(-35 35 100)">
                  ARABIAN COASTLINE
                </text>

                {/* Forward Dispersal Plume expanding with forecastHour */}
                <g transform="translate(360, 200)">
                  {/* Outer spread */}
                  <ellipse
                    cx={forecastHour * 2.5}
                    cy={forecastHour * -0.5}
                    rx={60 + forecastHour * 2}
                    ry={25 + forecastHour * 1.2}
                    fill="none"
                    stroke="#0077ff"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    strokeOpacity="0.4"
                  />
                  {/* Mid Green */}
                  <ellipse
                    cx={forecastHour * 2.2}
                    cy={forecastHour * -0.4}
                    rx={40 + forecastHour * 1.5}
                    ry={18 + forecastHour * 0.9}
                    fill="none"
                    stroke="#00ff87"
                    strokeWidth="2"
                    strokeOpacity="0.6"
                  />
                  {/* High Density Core */}
                  <ellipse
                    cx={forecastHour * 2.0}
                    cy={forecastHour * -0.3}
                    rx={25 + forecastHour * 1.0}
                    ry={12 + forecastHour * 0.6}
                    fill="rgba(255, 51, 102, 0.35)"
                    stroke="#ff3366"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </g>

                {/* Release Origin Reference */}
                <g transform="translate(360, 200)">
                  <circle cx="0" cy="0" r="5" fill="#ffffff" />
                  <text x="10" y="4" fill="#ffffff" fontSize="9" fontFamily="monospace">
                    CURRENT CENTROID (T₀)
                  </text>
                </g>
              </svg>

              {/* Colorbar */}
              <div className="absolute top-4 right-4 p-3 rounded-xl bg-abyss-950/90 border border-slate-800 text-[10px] font-mono space-y-1">
                <div className="text-slate-400 font-bold mb-1">Probability (%)</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-red-600" /> 90 - 100</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-amber-500" /> 70 - 90</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-yellow-400" /> 50 - 70</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-emerald-400" /> 30 - 50</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-cyan-400" /> 10 - 30</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-2 rounded bg-blue-600" /> 0 - 10</div>
              </div>
            </div>
          </div>

          {/* Shoreline Impact Warning Card */}
          <div className="p-4 rounded-xl bio-panel border border-biopunk-amber/40 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-biopunk-amber animate-pulse shrink-0" />
              <div>
                <span className="text-amber-300 font-bold">SHORELINE IMPACT ASSESSMENT</span>
                <p className="text-slate-300 font-sans text-xs mt-0.5">
                  Current drift vectors indicate potential beaching in 34 hours. Recommended containment boom placement at coastal sector B-4.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
