"use client";

import React, { useState } from "react";
import {
  Satellite,
  Cpu,
  Waves,
  Ship,
  FileCheck,
  ChevronRight,
  Shield,
  Layers,
  Database,
  Cloud
} from "lucide-react";

interface PipelineStep {
  number: string;
  title: string;
  shortDesc: string;
  icon: any;
  inputs: string[];
  outputs: string[];
  techUsed: string[];
  details: string;
}

const STEPS: PipelineStep[] = [
  {
    number: "01",
    title: "Sentinel-1 SAR Detection & Preprocessing",
    shortDesc: "Acquires radar imagery, applies speckle suppression, and extracts slick contours.",
    icon: Satellite,
    inputs: ["Incident AOI Coordinates", "Time Window", "Sentinel-1 C-Band SAR (Copernicus SciHub)"],
    outputs: ["Speckle-Filtered Backscatter", "Noise-Reduced Radiometric Grids"],
    techUsed: ["Python", "GDAL", "SNAP / snappy", "Rasterio"],
    details:
      "Fetches dual-polarization (VV/VH) interferometric wide-swath (IW) SAR scenes. Applies calibrated Lee speckle filtering to suppress ocean wave backscatter noise while enhancing low-backscatter hydrocarbon dark patches.",
  },
  {
    number: "02",
    title: "AI Segmentation & False-Positive Rejection",
    shortDesc: "SegFormer/U-Net segmentation with PANGAEA look-alike verification.",
    icon: Cpu,
    inputs: ["Preprocessed SAR backscatter", "Eastern Mediterranean Slick Benchmark"],
    outputs: ["Verified Spill Polygon GeoJSON", "Confidence Score", "Analyst Review Flag"],
    techUsed: ["PyTorch", "SegFormer", "U-Net", "Scikit-learn"],
    details:
      "Deep convolutional and transformer networks segment oil slicks while rejecting look-alike natural phenomena (low-wind calm zones, upwelling, algal blooms, and internal waves). Human analyst review is flagged for ambiguous boundaries.",
  },
  {
    number: "03",
    title: "Met-Ocean Drift Hindcasting (OpenDrift)",
    shortDesc: "Reverses wind and ocean currents to reconstruct the release point and time.",
    icon: Waves,
    inputs: ["Copernicus Marine Surface Currents", "ECMWF 10m Wind Fields", "Spill Polygon"],
    outputs: ["Origin Probability Ellipse", "Discharge Time Window", "Backtrack Drift Vectors"],
    techUsed: ["OpenDrift", "Xarray", "Copernicus API", "Docker"],
    details:
      "Simulates backward Lagrangian particle transport using actual ocean currents and wind-driven surface drift. Accounts for turbulent dispersion to generate a spatiotemporal uncertainty envelope identifying where and when the release occurred.",
  },
  {
    number: "04",
    title: "Explainable Attribution & Provenance Dossier",
    shortDesc: "Ranks candidate AIS vessels and exports court-admissible legal reports.",
    icon: Ship,
    inputs: ["Historical AIS Tracks", "Origin Uncertainty Ellipse", "Vessel Kinematic Specs"],
    outputs: ["Ranked Vessel Scores", "Unknown Source Flag (if < 60%)", "Audit-Ready Legal Dossier"],
    techUsed: ["Golang", "PostGIS (ST_DWithin)", "FastAPI", "GeoPandas"],
    details:
      "Filters vessels within the origin zone via PostGIS spatial indexing. Evaluates 6-factor kinematic scores (spatial, temporal, heading, origin overlap, AIS continuity, and speed anomalies). Produces an audit-ready dossier for maritime enforcement.",
  },
];

const TECH_STACK_ITEMS = [
  { category: "Frontend", tools: "React, TypeScript, Tailwind CSS, CesiumJS / Leaflet" },
  { category: "Backend APIs", tools: "Golang (nautrace-api), FastAPI (nautrace-ml), REST" },
  { category: "AI / ML Models", tools: "Python, PyTorch, SegFormer, U-Net, Scikit-learn" },
  { category: "Geospatial & Data", tools: "PostGIS, PostgreSQL, GDAL, GeoPandas, Rasterio, Xarray" },
  { category: "Simulation Engine", tools: "OpenDrift, SNAP / snappy, Docker Containers" },
  { category: "Cloud & DevOps", tools: "AWS S3, EC2, GitHub Actions, Docker Compose" },
];

export const MethodologyPipeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="methodology" className="py-20 bg-marine-950 border-b border-cyan-950/80 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>END-TO-END PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-sans">
            Methodology &amp; Product Workflow
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-sans">
            From initial satellite tasking to forensic courtroom evidence: four mathematically rigorous stages that eliminate guesswork in maritime disaster response.
          </p>
        </div>

        {/* Step Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STEPS.map((step, idx) => {
            const active = idx === activeStep;
            const Icon = step.icon;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`p-5 rounded-xl text-left border transition-all relative ${
                  active
                    ? "bg-cyan-950/70 border-cyan-400 shadow-xl shadow-cyan-950/50 scale-[1.02]"
                    : "bg-marine-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-black ${active ? "text-radar-cyan" : "text-slate-600"}`}>
                    {step.number}
                  </span>
                  <div
                    className={`p-2 rounded-lg ${
                      active ? "bg-cyan-500 text-marine-950" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mt-3 font-sans leading-snug">{step.title}</h3>
                <p className="text-xs text-slate-400 mt-1 font-sans line-clamp-2">{step.shortDesc}</p>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Showcase */}
        <div className="rounded-2xl glass-panel border border-cyan-500/30 p-6 md:p-8 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs text-radar-cyan">
                <span>STAGE {STEPS[activeStep].number} IN-DEPTH</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">HIGH FIDELITY INTELLIGENCE</span>
              </div>
              <h3 className="text-2xl font-black text-white font-sans">{STEPS[activeStep].title}</h3>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">{STEPS[activeStep].details}</p>

              {/* Technologies used in this stage */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-2 font-bold">LIBRARIES &amp; PROTOCOLS:</span>
                <div className="flex flex-wrap gap-2">
                  {STEPS[activeStep].techUsed.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Input / Output Spec Box */}
            <div className="lg:col-span-5 bg-marine-950/80 rounded-xl p-5 border border-slate-800 space-y-4 text-xs">
              <div>
                <span className="text-[11px] text-teal-400 font-bold block mb-1">INPUT STREAMS:</span>
                <ul className="space-y-1 text-slate-300 font-sans">
                  {STEPS[activeStep].inputs.map((inp) => (
                    <li key={inp} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] text-radar-cyan font-bold block mb-1">OUTPUT ARTIFACTS:</span>
                <ul className="space-y-1 text-slate-300 font-sans">
                  {STEPS[activeStep].outputs.map((out) => (
                    <li key={out} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-radar-cyan"></span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Tech Stack Table directly from Slide 3 */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-4 h-4 text-radar-cyan" />
            <h3 className="text-lg font-bold text-white font-sans">Comprehensive Technical Stack</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK_ITEMS.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl glass-panel border border-slate-800">
                <div className="text-xs text-radar-cyan font-bold mb-1">{item.category}</div>
                <div className="text-xs text-slate-300 font-sans">{item.tools}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
