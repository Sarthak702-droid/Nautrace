"use client";

import React, { useState, useEffect } from "react";
import { Shield, Radar, Satellite, Activity, FileCheck, Menu, X, ExternalLink } from "lucide-react";

interface NavbarProps {
  onOpenDossier: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDossier }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-marine-950/90 backdrop-blur-md border-b border-cyan-500/20 py-2.5 shadow-xl shadow-black/40"
          : "bg-gradient-to-b from-marine-950/95 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Hackathon Identity */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 group-hover:border-cyan-400 transition-colors">
                <Radar className="w-5 h-5 text-radar-cyan animate-spin" style={{ animationDuration: "10s" }} />
                <div className="absolute inset-0 rounded-lg bg-cyan-400/10 blur-sm"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-widest text-white font-mono">
                    NAU<span className="text-radar-cyan">TRACE</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
                    PS-26143
                  </span>
                </div>
                <span className="text-[10px] tracking-wider text-slate-400 font-mono">
                  MARITIME DOMAIN INTELLIGENCE
                </span>
              </div>
            </a>

            {/* SIH 2026 Team badge */}
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-radar-teal font-medium">SIH 2026</span>
              <span>•</span>
              <span className="text-slate-300">Team SAMARTH</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider">
            <a href="#forensic-map" className="text-slate-300 hover:text-radar-cyan transition-colors">
              FORENSIC CONSOLE
            </a>
            <a href="#intel-gallery" className="text-slate-300 hover:text-radar-cyan transition-colors">
              IMAGERY INTEL
            </a>
            <a href="#methodology" className="text-slate-300 hover:text-radar-cyan transition-colors">
              WORKFLOW
            </a>
            <a href="#usp-matrix" className="text-slate-300 hover:text-radar-cyan transition-colors">
              USP MATRIX
            </a>
            <a href="#architecture" className="text-slate-300 hover:text-radar-cyan transition-colors">
              SYSTEM ARCH
            </a>
            <a href="#stakeholders" className="text-slate-300 hover:text-radar-cyan transition-colors">
              IMPACT
            </a>
          </nav>

          {/* Right Action & Status */}
          <div className="flex items-center gap-3">
            {/* Live Telemetry Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-[11px] font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-semibold">SAR S1A/B READY</span>
            </div>

            {/* Dossier Report Trigger */}
            <button
              onClick={onOpenDossier}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-marine-950 font-mono text-xs font-bold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>EVIDENCE REPORT</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-2.5 pb-2 text-xs font-mono">
            <a
              href="#forensic-map"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 text-slate-300 hover:text-radar-cyan"
            >
              FORENSIC CONSOLE
            </a>
            <a
              href="#intel-gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 text-slate-300 hover:text-radar-cyan"
            >
              IMAGERY INTEL
            </a>
            <a
              href="#methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 text-slate-300 hover:text-radar-cyan"
            >
              WORKFLOW
            </a>
            <a
              href="#usp-matrix"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 text-slate-300 hover:text-radar-cyan"
            >
              USP MATRIX
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 text-slate-300 hover:text-radar-cyan"
            >
              SYSTEM ARCH
            </a>
            <a
              href="#stakeholders"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1 text-slate-300 hover:text-radar-cyan"
            >
              IMPACT
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
