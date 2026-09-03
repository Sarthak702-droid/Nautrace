"use client";

import React, { useState, useEffect } from "react";
import {
  Crosshair,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Layers,
} from "lucide-react";
import { IncidentData, VesselCandidate, LayerState } from "./forensic/types";
import { MOCK_INCIDENTS } from "./forensic/data";
import { ForensicMap } from "./forensic/ForensicMap";
import { CandidateScorePanel } from "./forensic/CandidateScorePanel";

export const ForensicSimulator: React.FC<{ onOpenDossier: () => void }> = ({ onOpenDossier }) => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentData>(MOCK_INCIDENTS[0]);
  const [selectedCandidate, setSelectedCandidate] = useState<VesselCandidate>(MOCK_INCIDENTS[0].candidates[0]);

  // Scrubber: 0 to 100
  const [timeOffset, setTimeOffset] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Layers
  const [layers, setLayers] = useState<LayerState>({
    sarSwath: true,
    spillPolygon: true,
    driftVectors: true,
    hindcastTrail: true,
    aisTracks: true,
    originEllipse: true,
  });

  const handleSelectIncident = (incident: IncidentData) => {
    setSelectedIncident(incident);
    setSelectedCandidate(incident.candidates[0]);
    setTimeOffset(100);
    setIsPlaying(false);
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeOffset((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const progressRatio = timeOffset / 100;
  const hoursBack = (progressRatio * selectedIncident.backtrackHours).toFixed(1);

  return (
    <section id="forensic-map" className="py-20 bg-marine-950 border-b border-cyan-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-radar-cyan font-mono text-xs font-semibold uppercase tracking-wider">
              <Crosshair className="w-4 h-4" />
              <span>Interactive Maritime Investigation Console</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Forensic Map &amp; Origin Attribution
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Simulate the complete investigation pipeline. Reconstruct oil drift trajectories with Copernicus currents and evaluate explainable vessel kinematic scores.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-marine-900/90 p-1.5 rounded-lg border border-slate-800">
            {MOCK_INCIDENTS.map((inc) => {
              const active = inc.id === selectedIncident.id;
              return (
                <button
                  key={inc.id}
                  onClick={() => handleSelectIncident(inc)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                    active
                      ? "bg-radar-cyan text-marine-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {inc.name.split(":")[0]}: {inc.id}
                  {inc.isUnknownSource && (
                    <span className="ml-1.5 px-1 py-0.2 text-[9px] rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      NON-AIS
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* USP Alert Banner if Unknown Source is active */}
        {selectedIncident.isUnknownSource && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 shadow-lg shadow-amber-950/20">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs font-mono">
              <div className="text-amber-300 font-bold text-sm">
                NAUTRACE USP TRIGGERED: EXPLICIT UNKNOWN / NON-AIS SOURCE HYPOTHESIS
              </div>
              <p className="text-amber-200/80 mt-1">
                Highest candidate compatibility is{" "}
                <span className="text-white font-bold">41.3%</span>, which falls below the legal attribution threshold (
                {selectedIncident.thresholdUsed}%). Unlike legacy monitoring systems that force attribution onto innocent passing vessels, NAUTRACE classifies this incident as an{" "}
                <span className="text-amber-300 font-bold underline">Unregistered / Dark Vessel Discharge</span> and preserves forensic provenance.
              </p>
            </div>
          </div>
        )}

        {/* Main Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map + Scrubber */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <ForensicMap
              incident={selectedIncident}
              layers={layers}
              timeOffset={timeOffset}
              hoursBack={hoursBack}
            />

            {/* Bottom Scrubber & Layer Controls Bar */}
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-lg bg-cyan-500 text-marine-950 hover:bg-cyan-400 font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                  title={isPlaying ? "Pause Simulation" : "Auto-play Hindcast Backtrack"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setTimeOffset(0);
                  }}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                  title="Reset to T_0 (SAR Detection)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>T₀ SAR Scan (04:15 UTC)</span>
                    <span className="text-cyan-300 font-bold">Reconstructing Hindcast: T - {hoursBack} Hours</span>
                    <span>Discharge Intercept (16:30 UTC)</span>
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
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                  />
                </div>
              </div>

              {/* Layer Toggles */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1 mr-1">
                  <Layers className="w-3.5 h-3.5 text-radar-cyan" /> LAYERS:
                </span>
                {[
                  { key: "spillPolygon", label: "Oil Spill Polygon" },
                  { key: "hindcastTrail", label: "OpenDrift Backtrack" },
                  { key: "originEllipse", label: "Origin Uncertainty Zone" },
                  { key: "aisTracks", label: "AIS Vessel Tracks" },
                  { key: "driftVectors", label: "Copernicus Currents" },
                  { key: "sarSwath", label: "Sentinel-1 Swath" },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setLayers((prev: any) => ({ ...prev, [key]: !prev[key] }))}
                    className={`px-2.5 py-1 rounded border transition-all ${
                      (layers as any)[key]
                        ? "bg-cyan-950/70 border-cyan-500/50 text-cyan-300"
                        : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    {(layers as any)[key] ? "✓" : "×"} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scoring & Candidates */}
          <div className="lg:col-span-4">
            <CandidateScorePanel
              candidates={selectedIncident.candidates}
              selectedCandidate={selectedCandidate}
              onSelectCandidate={setSelectedCandidate}
              onOpenDossier={onOpenDossier}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
