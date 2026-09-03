"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Waves,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Crosshair,
  Clock,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { ScreenId } from "../BiopunkSidebar";

interface HindcastProps {
  onBack: () => void;
  onProceedToVessels: () => void;
}

export const HindcastScreen: React.FC<HindcastProps> = ({
  onBack,
  onProceedToVessels,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeOffset, setTimeOffset] = useState<number>(50); // 0 to 100
  const [particles, setParticles] = useState<number>(5000);
  const [duration, setDuration] = useState<string>("24 Hours");

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeOffset((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 100);
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
          className="object-cover opacity-15 mix-blend-color-dodge scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/85 to-abyss-950/90" />
      </div>

      {/* Top Header Controls Bar */}
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
              <Waves className="w-4 h-4 text-biopunk-green" />
              <span>Hindcast &amp; Origin Trace — INC-2026-008</span>
            </h2>
            <div className="text-[11px] text-slate-400">
              OpenDrift Backward Lagrangian Particle Transport • ERA5 Wind + CMEMS Currents
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-abyss-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 mr-2">Method:</span>
            <span className="text-biopunk-cyan font-bold">Backward (Hindcast)</span>
          </div>

          <div className="bg-abyss-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 mr-2">Duration:</span>
            <span className="text-white">{duration}</span>
          </div>

          <div className="bg-abyss-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 mr-2">Particles:</span>
            <span className="text-biopunk-green font-bold">5,000</span>
          </div>

          <button
            onClick={onProceedToVessels}
            className="px-4 py-2 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-biopunk-green/20"
          >
            Inspect Vessels →
          </button>
        </div>
      </div>

      {/* Main Simulation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Animation & Scrubber Controls (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl bio-panel border border-biopunk-green/20 p-4 space-y-4">
            <div className="text-xs font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
              <Clock className="w-4 h-4 text-biopunk-green" />
              <span>SIMULATION TIMELINE</span>
            </div>

            {/* Play/Pause */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-2.5 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? "Pause" : "Play Hindcast"}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setTimeOffset(0);
                }}
                className="p-2.5 rounded-lg bg-abyss-900 border border-slate-800 text-slate-300 hover:text-white"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Reverse Time</span>
                <span className="text-biopunk-cyan font-bold">
                  {((timeOffset / 100) * 24).toFixed(1)}h Backtrack
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={timeOffset}
                onChange={(e) => {
                  setIsPlaying(false);
                  setTimeOffset(Number(e.target.value));
                }}
                className="w-full accent-biopunk-green h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Current Timestamp */}
            <div className="p-3 rounded-lg bg-abyss-900 border border-slate-800 text-xs text-center">
              <div className="text-[10px] text-slate-500">RECONSTRUCTED TIMESTEP</div>
              <div className="text-white font-bold mt-0.5">24 Aug 2026 12:00 UTC</div>
            </div>
          </div>
        </div>

        {/* Center & Right: Simulation Map + Origin Probability (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="rounded-2xl bio-panel border border-biopunk-green/30 overflow-hidden shadow-2xl relative">
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

                {/* Particle Dispersion Fan (5,000 particles reverse trajectory) */}
                <g opacity="0.85">
                  {/* Outer Blue streams */}
                  <path d="M 520 220 C 420 210, 340 180, 220 150" fill="none" stroke="#0077ff" strokeWidth="3" strokeOpacity="0.4" />
                  <path d="M 520 220 C 440 250, 360 210, 230 160" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeOpacity="0.5" />
                  {/* Mid Green/Yellow streams */}
                  <path d="M 520 220 C 450 200, 370 170, 240 145" fill="none" stroke="#00ff87" strokeWidth="3.5" strokeOpacity="0.7" />
                  <path d="M 520 220 C 430 190, 350 160, 235 140" fill="none" stroke="#a3e635" strokeWidth="4" strokeOpacity="0.8" />
                  {/* Inner Red/Orange High Probability Core */}
                  <path d="M 520 220 C 420 195, 330 155, 230 140" fill="none" stroke="#ff9900" strokeWidth="5" strokeOpacity="0.9" />
                  <path d="M 520 220 C 400 190, 310 150, 225 140" fill="none" stroke="#ff3366" strokeWidth="6" strokeOpacity="0.95" />
                </g>

                {/* Detection Point (Slick at T0) */}
                <g transform="translate(520, 220)">
                  <circle cx="0" cy="0" r="14" fill="rgba(0, 255, 135, 0.2)" className="animate-pulse" />
                  <circle cx="0" cy="0" r="6" fill="#00ff87" />
                  <text x="12" y="4" fill="#00ff87" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    SAR DETECTION (T₀)
                  </text>
                </g>

                {/* Most Likely Origin Point (Red Star at T - 24h) */}
                <g transform="translate(225, 140)">
                  <circle cx="0" cy="0" r="22" fill="rgba(255, 51, 102, 0.25)" className="animate-ping" />
                  <ellipse cx="0" cy="0" rx="35" ry="20" fill="none" stroke="#ff3366" strokeWidth="1.5" strokeDasharray="4 2" />
                  <polygon points="0,-10 3,-3 10,-3 4,2 6,9 0,5 -6,9 -4,2 -10,-3 -3,-3" fill="#ff3366" />
                  <text x="12" y="-12" fill="#ff3366" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    MOST LIKELY ORIGIN (14.35° N, 70.85° E)
                  </text>
                </g>
              </svg>

              {/* Floating Colorbar in Corner */}
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

          {/* Origin Probability Verdict Card */}
          <div className="p-5 rounded-xl bio-panel border border-biopunk-green/30 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 block">MOST LIKELY ORIGIN</span>
              <span className="text-white font-bold text-sm">14.35° N, 70.85° E</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">CONFIDENCE (90%)</span>
              <span className="text-biopunk-green font-bold text-sm">78% Confidence</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">CONFIDENCE (50%)</span>
              <span className="text-biopunk-cyan font-bold text-sm">46% Inner Core</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">ORIGIN TIME (EST.)</span>
              <span className="text-biopunk-amber font-bold text-sm">24 Aug 11:00 – 13:00 UTC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
