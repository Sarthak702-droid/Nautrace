"use client";

import React from "react";
import { Shield, Anchor, Building2, Globe2, TrendingUp, Clock, Target, Lock, CheckCircle2 } from "lucide-react";

const STAKEHOLDERS = [
  {
    title: "For NTRO (National Technical Research Organisation)",
    icon: Shield,
    benefits: [
      "Faster identification of probable spill origin and evidence-backed vessel prioritization.",
      "Integration with national orbital intelligence and classified sensor telemetry.",
      "Comprehensive maritime situational awareness across India's Exclusive Economic Zone (EEZ).",
    ],
  },
  {
    title: "For Indian Coast Guard & Govt Agencies",
    icon: Anchor,
    benefits: [
      "Quicker suspect-vessel screening and targeted boarding inspections before ships exit Indian waters.",
      "Drastic reduction in manual patrol fuel expenditure by intercepting high-probability offenders.",
      "Direct feed into Search and Rescue (SAR) and pollution containment fleets.",
    ],
  },
  {
    title: "For Defence & Security Forces",
    icon: Lock,
    benefits: [
      "Real-time identification of dark fleet operations and AIS spoofing tactics near strategic sea lanes.",
      "Earlier spill drift assessment and predictive impact modeling on critical naval bases.",
      "Longitudinal tracking of hostile or non-compliant commercial maritime traffic.",
    ],
  },
  {
    title: "For International Maritime Courts & Tribunals",
    icon: Globe2,
    benefits: [
      "Clear vessel kinematic history and audit trail before suspects reach international waters.",
      "Cryptographically verified provenance matching precedents from EMSA CleanSeaNet and UK courts.",
      "Replaces subjective witness testimony with mathematical hindcast simulations.",
    ],
  },
];

const OUTCOMES = [
  {
    title: "Improved Threat Detection",
    metric: "< 8 MIN",
    desc: "Early identification of suspicious & dark vessels operating without active AIS transponders.",
    icon: Target,
  },
  {
    title: "Reduced Response Time",
    metric: "- 75%",
    desc: "Automated alerts replace days of manual satellite catalog browsing and drift analysis.",
    icon: Clock,
  },
  {
    title: "Multi-Source Accuracy",
    metric: "94.2%",
    desc: "Fusion of C-Band SAR, Copernicus currents, and AIS telemetry eliminates false accusations.",
    icon: CheckCircle2,
  },
  {
    title: "Resource Optimization",
    metric: "3.8x ROI",
    desc: "Targeted patrol dispatch eliminates blind ocean reconnaissance and cuts response costs.",
    icon: TrendingUp,
  },
];

export const StakeholderImpact: React.FC = () => {
  return (
    <section id="stakeholders" className="py-20 bg-marine-900 border-b border-cyan-950/80 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>B2G GOVERNMENT DEPLOYMENT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-sans">
            Impact, Benefits &amp; Strategic Stakeholders
          </h2>
          <p className="text-slate-400 text-sm mt-3 font-sans">
            Designed specifically for deployment across Indian defense, coast guard, and maritime port authorities through secure on-premises appliances or sovereign cloud enclaves.
          </p>
        </div>

        {/* Measurable Outcomes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {OUTCOMES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white">{item.metric}</span>
                    <Icon className="w-5 h-5 text-radar-cyan" />
                  </div>
                  <h4 className="text-sm font-bold text-cyan-300 mt-2 font-sans">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-sans leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stakeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {STAKEHOLDERS.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                    <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-radar-cyan">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white font-sans">{st.title}</h3>
                  </div>

                  <ul className="mt-4 space-y-2.5 text-xs text-slate-300 font-sans">
                    {st.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-radar-teal shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* B2G Deployment Model Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-marine-950 via-cyan-950/40 to-marine-950 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs text-radar-cyan font-bold">SOVEREIGN DEFENSE ARCHITECTURE</span>
            <h4 className="text-lg font-bold text-white font-sans">
              Air-Gapped On-Premises or NIC/AWS GovCloud Integration
            </h4>
            <p className="text-xs text-slate-400 font-sans max-w-2xl">
              NAUTRACE is provided with zero external third-party telemetry dependencies, adhering to Ministry of Defence cybersecurity compliance guidelines.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300">
              Annual Support &amp; SLA
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-cyan-500 text-marine-950 font-bold text-xs">
              B2G Deployment Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
