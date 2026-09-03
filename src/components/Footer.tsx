"use client";

import React from "react";
import { Radar, Shield, ExternalLink, Github, Terminal } from "lucide-react";

export const Footer: React.FC<{ onOpenDossier: () => void }> = ({ onOpenDossier }) => {
  return (
    <footer className="bg-marine-950 border-t border-cyan-950/80 pt-16 pb-12 font-mono text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-900">
          {/* Col 1: Identity & Hackathon Details */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-radar-cyan">
                <Radar className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white font-mono tracking-wider">
                NAU<span className="text-radar-cyan">TRACE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-sm">
              Autonomous satellite oil-spill detection, Copernicus met-ocean hindcasting, and explainable AIS vessel attribution with end-to-end uncertainty propagation.
            </p>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-[11px]">
              <div>
                <span className="text-slate-500">EVENT:</span>{" "}
                <span className="text-white font-bold">SMART INDIA HACKATHON 2026</span>
              </div>
              <div>
                <span className="text-slate-500">PROBLEM STATEMENT ID:</span>{" "}
                <span className="text-cyan-400 font-bold">26143 (Disaster Management)</span>
              </div>
              <div>
                <span className="text-slate-500">TEAM NAME:</span>{" "}
                <span className="text-emerald-400 font-bold">SAMARTH</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">PLATFORM CONSOLE</div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#forensic-map" className="hover:text-cyan-300 transition-colors">
                  Interactive Forensic Map
                </a>
              </li>
              <li>
                <a href="#intel-gallery" className="hover:text-cyan-300 transition-colors">
                  Satellite Imagery &amp; Spectrograms
                </a>
              </li>
              <li>
                <a href="#methodology" className="hover:text-cyan-300 transition-colors">
                  4-Stage Investigation Workflow
                </a>
              </li>
              <li>
                <a href="#usp-matrix" className="hover:text-cyan-300 transition-colors">
                  USP Benchmark Matrix
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-cyan-300 transition-colors">
                  Three-Tier System Architecture
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Research & Manual */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-white font-bold text-xs uppercase tracking-wider">FORENSIC STANDARDS</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenDossier} className="hover:text-cyan-300 transition-colors text-left">
                  Generate Court-Admissible Dossier
                </button>
              </li>
              <li>
                <a
                  href="https://www.emsa.europa.eu/csn-menu/csn-service/122/2360.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>EMSA CleanSeaNet Precedent</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://doi.pangaea.de/10.1594/PANGAEA.980773"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>PANGAEA Slick Dataset</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.marine.copernicus.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <span>Copernicus Global Ocean Physics</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 NAUTRACE • Built by Team SAMARTH for Smart India Hackathon.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400/80">AIR-GAPPED SOVEREIGN MARITIME INTELLIGENCE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
