"use client";

import React from "react";
import { BookOpen, ExternalLink, Award, FileText, CheckCircle } from "lucide-react";

interface ReferenceItem {
  number: string;
  source: string;
  institution: string;
  url: string;
  provides: string;
  researchValue: string;
  useInNautrace: string;
}

const REFERENCES: ReferenceItem[] = [
  {
    number: "01",
    source: "EMSA CleanSeaNet — Operational Benchmark",
    institution: "European Maritime Safety Agency (EMSA)",
    url: "https://www.emsa.europa.eu/csn-menu/csn-service/122/2360.html",
    provides: "Operational satellite-based oil-spill monitoring combining SAR, AIS, met-ocean data and drift forecasting.",
    researchValue: "Closest mature operational architecture; proves viability of satellite monitoring + contextual fusion.",
    useInNautrace: "Benchmarking, architecture validation and justification for our advanced differentiation.",
  },
  {
    number: "02",
    source: "EMSA Case Study — Satellite Evidence Precedent",
    institution: "European Maritime Safety Agency (EMSA)",
    url: "https://emsa.europa.eu/csn-menu/use-cases/item/1873-satellite-images-as-primary-evidence-in-uk-court.html",
    provides: "Real enforcement case showing how satellite imagery supported investigation and court proceedings in the UK.",
    researchValue: "Validates evidence-readiness and supports human-in-the-loop legal admissibility approach.",
    useInNautrace: "Evidence / provenance module, audit trail, confidence scoring and analyst review.",
  },
  {
    number: "03",
    source: "KSAT Oil Spill Detection Service",
    institution: "Kongsberg Satellite Services (KSAT)",
    url: "https://www.ksat.no/earth-observation/environmental-monitoring/oil-spill-detection-service/",
    provides: "Commercial near-real-time SAR oil-spill monitoring with multi-satellite data and QC workflows.",
    researchValue: "Shows operational maturity and services-level benchmarking standards in the aerospace industry.",
    useInNautrace: "Latency & operations benchmark; alerts, QC workflow and human-in-the-loop review.",
  },
  {
    number: "04",
    source: "Sentinel-1 SAR Oil Spill Dataset — Part I",
    institution: "Zenodo (Open Research Dataset)",
    url: "https://zenodo.org/records/8346860",
    provides: "Georeferenced Sentinel-1 SAR oil-spill imagery with ground-truth masks for model training & validation.",
    researchValue: "Primary verified dataset for building and validating oil-slick segmentation models.",
    useInNautrace: "Train segmentation models (U-Net / SegFormer); evaluate performance and robustness.",
  },
  {
    number: "05",
    source: "Eastern Mediterranean Oil Slick & Look-Alike Benchmark",
    institution: "PANGAEA (Scientific Dataset)",
    url: "https://doi.pangaea.de/10.1594/PANGAEA.980773",
    provides: "SAR dataset with oil slicks + look-alike classes to test false positive rejection.",
    researchValue: "Critical for real-world performance — not every dark ocean patch is oil; builds reliability and trust.",
    useInNautrace: "Look-alike rejection, false-alarm metrics and domain-shift validation.",
  },
  {
    number: "06",
    source: "Copernicus Marine — Ocean Physics / Surface Currents",
    institution: "Copernicus Marine Service",
    url: "https://data.marine.copernicus.eu/product/GLOBAL_ANALYSISFORECAST_PHY_001_024/services",
    provides: "Global ocean current analysis and forecast products for drift and trajectory modeling.",
    researchValue: "Enables reverse-drift modeling to probable origin area and time window.",
    useInNautrace: "Drift backtracking, uncertainty quantification (UQ) and trajectory visualization.",
  },
];

export const ResearchReferences: React.FC = () => {
  return (
    <section id="research" className="py-20 bg-marine-950 border-b border-cyan-950/80 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>SCIENTIFIC FOUNDATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-sans">
            Research, Datasets &amp; Legal Precedents
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-sans">
            NAUTRACE stands on trusted operational systems, peer-reviewed scientific datasets, and proven maritime court methodologies.
          </p>
        </div>

        {/* References Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REFERENCES.map((ref) => (
            <div
              key={ref.number}
              className="rounded-2xl glass-panel border border-slate-800 p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs text-radar-cyan font-bold">SOURCE #{ref.number}</span>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                    title="Open external source"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <h3 className="text-sm font-bold text-white mt-3 font-sans leading-snug group-hover:text-cyan-300 transition-colors">
                  {ref.source}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5">{ref.institution}</div>

                <div className="mt-3 text-xs text-slate-300 font-sans space-y-2">
                  <p className="text-slate-400">
                    <strong className="text-slate-300 font-mono text-[10px] block text-cyan-400">WHAT IT PROVIDES:</strong>
                    {ref.provides}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-sans">
                <span className="text-[10px] text-teal-400 font-mono block font-bold">USE IN NAUTRACE:</span>
                <span className="text-slate-300 text-xs">{ref.useInNautrace}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
