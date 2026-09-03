"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileText,
  Printer,
  Download,
  CheckSquare,
  Square,
  ShieldCheck,
  FileCheck,
  CheckCircle2
} from "lucide-react";

export const ReportsScreen: React.FC = () => {
  const [reportType, setReportType] = useState<"summary" | "technical" | "evidence">("summary");
  const [format, setFormat] = useState<"pdf" | "html" | "docx">("pdf");
  const [sections, setSections] = useState<Record<string, boolean>>({
    detections: true,
    hindcast: true,
    vessels: true,
    forecast: true,
    sources: true,
  });

  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerated(true);
    setTimeout(() => {
      window.print();
      setGenerated(false);
    }, 400);
  };

  return (
    <div className="relative min-h-full p-6 space-y-6 font-mono text-slate-200">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <Image
          src="/images/carrier-discharge.png"
          alt="Carrier Discharge Backdrop"
          fill
          className="object-cover opacity-10 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/85 to-abyss-950/90" />
      </div>

      {/* Top Header Bar */}
      <div className="p-4 rounded-2xl bio-panel border border-biopunk-green/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-biopunk-green" />
            <span>Reports &amp; Legal Export</span>
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Compile court-admissible dossiers and executive operational briefings for maritime authorities.
          </p>
        </div>

        {/* Report Sub-Tabs */}
        <div className="flex bg-abyss-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setReportType("summary")}
            className={`px-3 py-1.5 rounded transition-all ${
              reportType === "summary"
                ? "bg-biopunk-green text-abyss-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Summary Report
          </button>
          <button
            onClick={() => setReportType("technical")}
            className={`px-3 py-1.5 rounded transition-all ${
              reportType === "technical"
                ? "bg-biopunk-green text-abyss-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Technical Report
          </button>
          <button
            onClick={() => setReportType("evidence")}
            className={`px-3 py-1.5 rounded transition-all ${
              reportType === "evidence"
                ? "bg-biopunk-green text-abyss-950 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Evidence Package
          </button>
        </div>
      </div>

      {/* Main Grid: Report Preview + Export Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Printable Report Document Sheet (8 cols) */}
        <div className="lg:col-span-8 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl font-sans space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-white font-mono font-bold text-xs">
                N
              </div>
              <div>
                <div className="font-mono font-black text-sm text-slate-900 tracking-wider">
                  NAUTRACE MARITIME INTEL
                </div>
                <div className="text-[10px] text-slate-500 font-mono">POLLUTION INCIDENT DOSSIER</div>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-500">
              <div>REPORT ID: NTRO-INC-2026-008</div>
              <div>DATE: 25 AUG 2026</div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              INCIDENT SUMMARY REPORT: INC-2026-008
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Automated Forensic Assessment of Hydrocarbon Spill Event via Satellite SAR &amp; Met-Ocean Backtracking.
            </p>
          </div>

          {/* Key Facts Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-100 font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">REGION</span>
              <span className="font-bold text-slate-900">Arabian Sea</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">DETECTED ON</span>
              <span className="font-bold text-slate-900">25 Aug 2026 14:32 UTC</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">STATUS / RISK</span>
              <span className="font-bold text-rose-700">Active • High Risk</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">SPILL EXTENT</span>
              <span className="font-bold text-slate-900">12.4 km²</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">PRIMARY SUSPECT</span>
              <span className="font-bold text-rose-700">OCEAN STAR (87%)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">ANALYST</span>
              <span className="font-bold text-slate-900">Team Samarth</span>
            </div>
          </div>

          {/* Detection Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              1. DETECTION OVERVIEW &amp; SAR RADAR MASK
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sentinel-1A C-band synthetic aperture radar acquired at 12:00 UTC captured a high-contrast dark slick anomaly measuring 12.4 km² with an irregular perimeter of 18.7 km. False-positive cross-validation against biogenic look-alikes yielded a mean confidence score of 0.86.
            </p>
          </div>

          {/* Origin & Attribution Findings */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              2. MET-OCEAN HINDCAST &amp; VESSEL ATTRIBUTION
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Backward Lagrangian particle tracking with OpenDrift isolated the release event to coordinate 14.35° N, 70.85° E between 11:00 – 13:00 UTC on 24 Aug 2026. AIS track reconstruction of tanker OCEAN STAR (MMSI 256789000) confirmed closest point of approach within 800m of the origin with a concurrent speed reduction and 22-minute transponder discontinuity.
            </p>
          </div>

          {/* Signoff */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <div>EVIDENCE READY FOR LEGAL ADMISSIBILITY</div>
            <div className="flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>SHA-256 VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Right Col: Export Options Panel (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bio-panel border border-biopunk-green/20 p-5 space-y-6">
          <div>
            <div className="text-xs font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
              <Download className="w-4 h-4 text-biopunk-green" />
              <span>EXPORT OPTIONS</span>
            </div>

            {/* Format Radios */}
            <div className="mt-4 space-y-2 text-xs">
              <span className="text-slate-400 text-[10px] block font-bold">REPORT FORMAT:</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    checked={format === "pdf"}
                    onChange={() => setFormat("pdf")}
                    className="accent-biopunk-green"
                  />
                  <span>PDF Document</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    checked={format === "html"}
                    onChange={() => setFormat("html")}
                    className="accent-biopunk-green"
                  />
                  <span>HTML Archive</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    checked={format === "docx"}
                    onChange={() => setFormat("docx")}
                    className="accent-biopunk-green"
                  />
                  <span>DOCX</span>
                </label>
              </div>
            </div>

            {/* Section Checkboxes */}
            <div className="mt-6 space-y-2 text-xs">
              <span className="text-slate-400 text-[10px] block font-bold">INCLUDE SECTIONS:</span>
              {[
                { key: "detections", label: "Detection Results & SAR Mask" },
                { key: "hindcast", label: "Hindcast & Origin Uncertainty" },
                { key: "vessels", label: "Vessel Attribution & Scores" },
                { key: "forecast", label: "48h Forward Plume Forecast" },
                { key: "sources", label: "Data Sources & Provenance" },
              ].map(({ key, label }) => {
                const active = (sections as any)[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSections((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className="flex items-center gap-2 text-slate-300 hover:text-white"
                  >
                    {active ? (
                      <CheckSquare className="w-4 h-4 text-biopunk-green" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full py-3 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-biopunk-green/20 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{generated ? "Printing..." : "Generate & Print Report"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
