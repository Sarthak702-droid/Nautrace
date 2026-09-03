"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, Satellite, Layers, ZoomIn, ShieldCheck, Sparkles } from "lucide-react";

interface IntelItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  category: string;
  meta: {
    sensor: string;
    resolution: string;
    polarization: string;
    thickness: string;
    confidence: string;
  };
  description: string;
  forensicNote: string;
}

const INTEL_ITEMS: IntelItem[] = [
  {
    id: "spectral",
    title: "Optical Sheen & Thin-Film Refraction",
    subtitle: "Spectral Verification & Look-Alike Rejection",
    src: "/images/spectral-slick.png",
    category: "SPECTRAL OPTICAL ANALYSIS",
    meta: {
      sensor: "Multi-Spectral Sentinel-2 / MSI",
      resolution: "10 m / pixel",
      polarization: "RGB + NIR Band 8",
      thickness: "0.15 µm – 5.0 µm (Rainbow Sheen)",
      confidence: "96.4% Hydrocarbon",
    },
    description:
      "High-resolution multispectral analysis capturing constructive light interference on surface slicks. Essential for rejecting biogenic false positives (algal blooms and natural plant oils) using the PANGAEA / Eastern Mediterranean slick benchmark.",
    forensicNote:
      "Differentiates mineral crude oil from biogenic look-alikes by cross-referencing shortwave infrared absorption dips with radar backscatter damping.",
  },
  {
    id: "satellite-wake",
    title: "Orbital SAR Surveillance: Plume & Wake",
    subtitle: "High-Altitude Sentinel-1 C-Band Detection",
    src: "/images/satellite-wake.png",
    category: "C-BAND SAR RADAR",
    meta: {
      sensor: "Sentinel-1A SAR (IW Mode)",
      resolution: "5 m × 20 m spatial",
      polarization: "VV + VH Cross-Pol",
      thickness: "Heavy Emulsion Plume",
      confidence: "98.1% Vessel Wake Correlated",
    },
    description:
      "Synthetic Aperture Radar detects dampening of capillary waves. The dark contrast signature clearly demarcates an elongated oil slick trailing directly in the hydrodynamic wake of an underway vessel.",
    forensicNote:
      "The dark backscatter depression aligns with the vessel's AIS velocity vector, establishing the operational discharge trajectory.",
  },
  {
    id: "carrier-discharge",
    title: "Ground-Truth Vessel Grounding & Discharge",
    subtitle: "Forensic Evidence & Coastal Containment",
    src: "/images/carrier-discharge.png",
    category: "LEGAL EVIDENCE & GROUND TRUTH",
    meta: {
      sensor: "Aerial Tactical Reconnaissance",
      resolution: "0.2 m / pixel Ortho",
      polarization: "Optical High-Dynamic",
      thickness: "> 100 µm (Heavy Fuel Oil / Crude)",
      confidence: "100% Attribution Ground Truth",
    },
    description:
      "High-definition aerial surveillance documenting acute bunker fuel leakage from a grounded bulk carrier. Used to calibrate the SegFormer AI segmentation boundaries and validate OpenDrift dispersal models against real shoreline impact points.",
    forensicNote:
      "Validates court-admissible standards established in the EMSA satellite evidence precedent for maritime prosecution.",
  },
];

export const IntelGallery: React.FC = () => {
  const [activeItem, setActiveItem] = useState<IntelItem>(INTEL_ITEMS[0]);
  const [filterMode, setFilterMode] = useState<"raw" | "speckle" | "mask">("raw");

  return (
    <section id="intel-gallery" className="py-20 bg-marine-900 border-b border-cyan-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-radar-cyan font-mono text-xs font-semibold uppercase tracking-wider">
              <Satellite className="w-4 h-4" />
              <span>Multi-Sensor Imagery &amp; Spectral Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">
              Satellite &amp; Aerial Evidence Showcase
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Inspection of optical, synthetic aperture radar (SAR), and tactical aerial imagery used to train NAUTRACE AI models and validate forensic drift simulations.
            </p>
          </div>

          {/* AI Filter Mode Controls */}
          <div className="flex items-center gap-2 bg-marine-950 p-1.5 rounded-lg border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-radar-cyan" /> FILTER:
            </span>
            <button
              onClick={() => setFilterMode("raw")}
              className={`px-3 py-1.5 rounded transition-all ${
                filterMode === "raw"
                  ? "bg-cyan-500 text-marine-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Raw Sensor
            </button>
            <button
              onClick={() => setFilterMode("speckle")}
              className={`px-3 py-1.5 rounded transition-all ${
                filterMode === "speckle"
                  ? "bg-cyan-500 text-marine-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Speckle Filter (Lee)
            </button>
            <button
              onClick={() => setFilterMode("mask")}
              className={`px-3 py-1.5 rounded transition-all ${
                filterMode === "mask"
                  ? "bg-radar-teal text-marine-950 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              SegFormer AI Mask
            </button>
          </div>
        </div>

        {/* Featured Inspection Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl glass-panel border border-cyan-500/20 p-6 shadow-2xl">
          {/* Main Visual Display */}
          <div className="lg:col-span-7 relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-black group">
            {/* Image with filter applied */}
            <div className="relative w-full h-full">
              <Image
                src={activeItem.src}
                alt={activeItem.title}
                fill
                className={`object-cover transition-all duration-500 ${
                  filterMode === "speckle"
                    ? "contrast-125 saturate-50 brightness-95"
                    : filterMode === "mask"
                    ? "hue-rotate-90 saturate-200 contrast-150"
                    : "saturate-100"
                }`}
              />

              {/* AI Segmentation Mask Overlay if mode is mask */}
              {filterMode === "mask" && (
                <div className="absolute inset-0 bg-cyan-500/20 mix-blend-color-dodge border-2 border-radar-cyan pointer-events-none flex items-center justify-center">
                  <div className="px-3 py-1 rounded bg-black/80 border border-radar-cyan font-mono text-xs text-radar-cyan font-bold animate-pulse">
                    AI OIL SPILL MASK EXTRACTED (CONFIDENCE: {activeItem.meta.confidence})
                  </div>
                </div>
              )}

              {/* HUD Target Brackets */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 border border-cyan-500/40 text-[10px] font-mono text-cyan-300">
                {activeItem.category}
              </div>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/70 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>EVIDENCE INTEGRITY VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Metadata & Analysis Details */}
          <div className="lg:col-span-5 flex flex-col gap-4 font-mono">
            <div>
              <span className="text-xs text-radar-cyan font-bold tracking-wider">{activeItem.category}</span>
              <h3 className="text-2xl font-black text-white mt-1 font-sans">{activeItem.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{activeItem.subtitle}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeItem.description}</p>

            {/* Technical Parameters Table */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-marine-950/80 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block">SENSOR PLATFORM</span>
                <span className="text-slate-200 font-semibold">{activeItem.meta.sensor}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">SPATIAL RESOLUTION</span>
                <span className="text-slate-200 font-semibold">{activeItem.meta.resolution}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">POLARIZATION / BANDS</span>
                <span className="text-cyan-300 font-semibold">{activeItem.meta.polarization}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">ESTIMATED THICKNESS</span>
                <span className="text-amber-300 font-semibold">{activeItem.meta.thickness}</span>
              </div>
            </div>

            {/* Forensic Finding */}
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200/90 leading-relaxed">
              <span className="font-bold text-cyan-300 block mb-0.5">FORENSIC SIGNIFICANCE:</span>
              {activeItem.forensicNote}
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex gap-3 pt-2">
              {INTEL_ITEMS.map((item) => {
                const active = item.id === activeItem.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      active ? "border-radar-cyan scale-105 shadow-md shadow-cyan-500/30" : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={item.src} alt={item.title} fill className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
