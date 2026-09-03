"use client";

import React, { useState } from "react";
import { X, Satellite, Plus, MapPin, Calendar, CheckCircle2 } from "lucide-react";

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (incident: any) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [region, setRegion] = useState("Arabian Sea");
  const [lat, setLat] = useState("15.24");
  const [lng, setLng] = useState("71.12");
  const [area, setArea] = useState("9.5");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const newInc = {
        id: `INC-2026-009`,
        region,
        detectedOn: "Just now",
        lastUpdated: "Just now",
        status: "Active",
        risk: "High",
        area: `${area} km²`,
        perimeter: "15.4 km",
        analyst: "Team Samarth",
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      onCreated(newInc);
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono text-xs text-slate-200">
      <div className="relative w-full max-w-lg bg-abyss-950 border border-biopunk-green/40 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Satellite className="w-4 h-4 text-biopunk-green" />
            <span>MANUAL INCIDENT CREATION &amp; S1A TASKING</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-abyss-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-400 block mb-1">TARGET REGION / AOI</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-abyss-900 border border-slate-800 text-white focus:outline-none focus:border-biopunk-green"
            >
              <option value="Arabian Sea">Arabian Sea</option>
              <option value="Bay of Bengal">Bay of Bengal</option>
              <option value="Gulf of Mexico">Gulf of Mexico</option>
              <option value="South China Sea">South China Sea</option>
              <option value="Indian Ocean">Indian Ocean</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">LATITUDE (°N)</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-abyss-900 border border-slate-800 text-white focus:outline-none focus:border-biopunk-green"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">LONGITUDE (°E)</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-abyss-900 border border-slate-800 text-white focus:outline-none focus:border-biopunk-green"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">INITIAL ESTIMATED AREA (km²)</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-abyss-900 border border-slate-800 text-white focus:outline-none focus:border-biopunk-green"
            />
          </div>

          <div className="p-3 rounded-lg bg-abyss-900 border border-slate-800 text-[11px] text-slate-400">
            Tasking triggers Copernicus SciHub for nearest Sentinel-1 SAR swath and initiates OpenDrift particle cloud.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-abyss-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-biopunk-green text-abyss-950 font-bold hover:bg-emerald-400 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? "Tasking Orbit..." : "Create & Ingest SAR"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
