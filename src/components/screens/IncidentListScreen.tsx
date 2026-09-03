"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Filter, Plus, ChevronRight, AlertTriangle, Layers, ExternalLink } from "lucide-react";
import { INCIDENTS_DATA, IncidentItem } from "./mockData";
import { ScreenId } from "../BiopunkSidebar";

interface IncidentListProps {
  onSelectIncident: (id: string) => void;
  onNewIncident: () => void;
}

export const IncidentListScreen: React.FC<IncidentListProps> = ({
  onSelectIncident,
  onNewIncident,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [regionFilter, setRegionFilter] = useState("All Regions");

  const filtered = INCIDENTS_DATA.filter((inc) => {
    if (statusFilter !== "All Status" && inc.status !== statusFilter) return false;
    if (regionFilter !== "All Regions" && inc.region !== regionFilter) return false;
    if (
      search &&
      !inc.id.toLowerCase().includes(search.toLowerCase()) &&
      !inc.region.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

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
        <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-abyss-950/90 to-abyss-950/95" />
      </div>

      {/* Header & Controls Bar */}
      <div className="p-4 rounded-2xl bio-panel border border-biopunk-green/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Incidents Directory</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time catalog of hydrocarbon anomaly events detected via Sentinel-1 SAR.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Incidents..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-abyss-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-biopunk-green/60"
            />
          </div>

          {/* Status Dropdown */}
          <div className="bg-abyss-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All Status" className="bg-abyss-950">All Status</option>
              <option value="Active" className="bg-abyss-950">Active</option>
              <option value="Closed" className="bg-abyss-950">Closed</option>
            </select>
          </div>

          {/* Region Dropdown */}
          <div className="bg-abyss-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All Regions" className="bg-abyss-950">All Regions</option>
              <option value="Arabian Sea" className="bg-abyss-950">Arabian Sea</option>
              <option value="Bay of Bengal" className="bg-abyss-950">Bay of Bengal</option>
              <option value="Gulf of Mexico" className="bg-abyss-950">Gulf of Mexico</option>
              <option value="South China Sea" className="bg-abyss-950">South China Sea</option>
              <option value="Mediterranean" className="bg-abyss-950">Mediterranean</option>
              <option value="Indian Ocean" className="bg-abyss-950">Indian Ocean</option>
              <option value="Gulf of Thailand" className="bg-abyss-950">Gulf of Thailand</option>
            </select>
          </div>

          {/* New Incident Button */}
          <button
            onClick={onNewIncident}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-biopunk-green text-abyss-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-biopunk-green/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Incident</span>
          </button>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="rounded-2xl bio-panel border border-biopunk-green/30 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-abyss-900/90 text-slate-400 border-b border-white/10">
                <th className="p-4">ID</th>
                <th className="p-4">REGION</th>
                <th className="p-4">DETECTED ON</th>
                <th className="p-4">STATUS</th>
                <th className="p-4">RISK</th>
                <th className="p-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  onClick={() => onSelectIncident(inc.id)}
                  className="hover:bg-abyss-900/60 cursor-pointer transition-colors group"
                >
                  <td className="p-4 font-mono font-bold text-biopunk-cyan group-hover:text-biopunk-green transition-colors">
                    {inc.id}
                  </td>
                  <td className="p-4 text-white font-medium">{inc.region}</td>
                  <td className="p-4 font-mono text-slate-400 text-[11px]">{inc.detectedOn}</td>
                  <td className="p-4 font-mono">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inc.status === "Active"
                          ? "bg-biopunk-green/10 text-biopunk-green border border-biopunk-green/40"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        inc.risk === "High"
                          ? "bg-rose-950/80 text-rose-300 border border-rose-600/40"
                          : inc.risk === "Medium"
                          ? "bg-amber-950/80 text-amber-300 border border-amber-600/40"
                          : "bg-emerald-950/80 text-emerald-300 border border-emerald-600/40"
                      }`}
                    >
                      {inc.risk}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectIncident(inc.id);
                      }}
                      className="px-3 py-1 rounded bg-abyss-800 hover:bg-biopunk-green hover:text-abyss-950 text-biopunk-green text-[11px] font-bold transition-all inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-abyss-900/60 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <div>Showing 1 to {filtered.length} of 24 incidents</div>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded bg-abyss-800 text-slate-400 hover:text-white">&lt;</button>
            <button className="px-2.5 py-1 rounded bg-biopunk-green text-abyss-950 font-bold">1</button>
            <button className="px-2.5 py-1 rounded bg-abyss-800 text-slate-400 hover:text-white">2</button>
            <button className="px-2.5 py-1 rounded bg-abyss-800 text-slate-400 hover:text-white">3</button>
            <button className="px-2.5 py-1 rounded bg-abyss-800 text-slate-400 hover:text-white">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};
