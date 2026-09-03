"use client";

import React, { useState } from "react";
import { Server, Database, Terminal, Code2, Cpu, ArrowDown, ArrowRight, CheckCircle, Copy, Check } from "lucide-react";

interface EndpointDoc {
  method: "GET" | "POST";
  path: string;
  service: string;
  description: string;
  response: string;
}

const ENDPOINTS: EndpointDoc[] = [
  {
    method: "GET",
    path: "/api/incidents/OS-001",
    service: "Go Gateway (nautrace-api)",
    description: "Returns incident metadata including detected timestamp, satellite scene ID, and slick extent.",
    response: JSON.stringify(
      {
        id: "OS-001",
        detected_at: "2026-03-02T04:15:00Z",
        satellite: "SENTINEL-1A_IW_GRDH_1SDV",
        confidence: 0.964,
        area_km2: 14.62,
        aoi: {
          type: "Point",
          coordinates: [78.1524, 8.7211],
        },
      },
      null,
      2
    ),
  },
  {
    method: "GET",
    path: "/api/incidents/OS-001/spill",
    service: "Go Gateway → PostGIS Store",
    description: "Fetches AI-segmented GeoJSON polygon of the oil slick for map canvas rendering.",
    response: JSON.stringify(
      {
        type: "Feature",
        properties: {
          incident_id: "OS-001",
          fill_color: "#ff4d4d",
          thickness_class: "heavy_slick",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [78.148, 8.718],
              [78.156, 8.726],
              [78.162, 8.721],
              [78.154, 8.714],
              [78.148, 8.718],
            ],
          ],
        },
      },
      null,
      2
    ),
  },
  {
    method: "GET",
    path: "/api/incidents/OS-001/hindcast",
    service: "Go Gateway → Python OpenDrift",
    description: "Origin probability zone and backward particle trajectories computed with Copernicus currents.",
    response: JSON.stringify(
      {
        incident_id: "OS-001",
        backtrack_duration_hours: 12,
        probable_origin: {
          coordinates: [78.0936, 8.4312],
          time_window: {
            start: "2026-03-01T16:00:00Z",
            end: "2026-03-01T17:00:00Z",
          },
          uncertainty_ellipse: {
            semi_major_km: 1.8,
            semi_minor_km: 0.9,
            azimuth_deg: 48,
          },
        },
        trajectory_steps: 24,
      },
      null,
      2
    ),
  },
  {
    method: "POST",
    path: "/attribution",
    service: "Python ML Service (nautrace-ml)",
    description: "Computes 6-factor explainable attribution scoring across candidate vessels with uncertainty propagation.",
    response: JSON.stringify(
      {
        incident_id: "OS-001",
        candidates: [
          {
            mmsi: "419001824",
            name: "MT OCEAN CONQUEROR",
            score: 89.4,
            components: {
              spatial: 94,
              temporal: 91,
              heading: 88,
              origin: 93,
              behaviour: 82,
              ais_quality: 95,
            },
          },
          {
            mmsi: "538006112",
            name: "MV SEA GULL",
            score: 44.2,
            components: {
              spatial: 58,
              temporal: 62,
              heading: 32,
              origin: 41,
              behaviour: 35,
              ais_quality: 78,
            },
          },
        ],
        unknown_source: false,
        threshold_used: 60,
      },
      null,
      2
    ),
  },
];

export const ArchitectureViewer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDoc>(ENDPOINTS[3]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedEndpoint.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="architecture" className="py-20 bg-marine-950 border-b border-cyan-950/80 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-radar-cyan text-xs font-semibold uppercase tracking-wider">
              <Server className="w-4 h-4" />
              <span>Production Architecture &amp; System Split</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 font-sans">
              Three-Tier Microservice Architecture
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl mt-1 font-sans">
              Separation of concerns directly from the Implementation Manual: High-performance Go Gateway owns public REST &amp; PostGIS data, Python FastAPI computes ML algorithms, and CesiumJS renders the interactive globe.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-marine-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>DOCKER-COMPOSE READY</span>
          </div>
        </div>

        {/* 3-Tier Architectural Diagram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Frontend Card */}
          <div className="rounded-2xl glass-panel border border-cyan-500/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="text-cyan-300 font-bold flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-radar-cyan" />
                  TIER 1: FRONTEND (JS)
                </span>
                <span className="text-[10px] text-slate-400">PORT 5173</span>
              </div>
              <div className="mt-3 text-xs space-y-2 text-slate-300 font-sans">
                <div className="font-bold text-white font-mono">CesiumJS + Vite / Next.js</div>
                <p className="text-slate-400 text-xs">
                  Pure consumer of REST JSON with zero business logic. Fork of God's Eye View rendering:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400 font-mono">
                  <li><code className="text-cyan-300">oilSpills.js</code> (polygon pulse)</li>
                  <li><code className="text-teal-300">hindcastLayer.js</code> (glow UQ)</li>
                  <li><code className="text-amber-300">vesselTrackLayer.js</code> (AIS)</li>
                  <li><code className="text-blue-300">evidencePanel.js</code> (Dossier)</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              CONSUMES REST JSON ONLY
            </div>
          </div>

          {/* Go Gateway Card */}
          <div className="rounded-2xl glass-panel border border-cyan-500/40 p-5 flex flex-col justify-between shadow-xl shadow-cyan-950/30">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="text-radar-cyan font-bold flex items-center gap-2">
                  <Server className="w-4 h-4 text-radar-cyan" />
                  TIER 2: GO API GATEWAY
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">PORT 8080 (PUBLIC)</span>
              </div>
              <div className="mt-3 text-xs space-y-2 text-slate-300 font-sans">
                <div className="font-bold text-white font-mono">nautrace-api (Golang)</div>
                <p className="text-slate-400 text-xs">
                  The only public-facing service with direct database connectivity:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400 font-mono">
                  <li>Owns public REST API routes</li>
                  <li>PostGIS spatial indexing (<code className="text-cyan-300">ST_DWithin</code>)</li>
                  <li>AISStream websocket ingestion &amp; proxy</li>
                  <li>Pre-warms ML cache &amp; orchestrates jobs</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-400">
              PUBLIC REST + POSTGIS OWNER
            </div>
          </div>

          {/* Python ML Service Card */}
          <div className="rounded-2xl glass-panel border border-teal-500/20 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="text-radar-teal font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-radar-teal" />
                  TIER 3: PYTHON ML SERVICE
                </span>
                <span className="text-[10px] text-slate-400">PORT 8001 (INTERNAL)</span>
              </div>
              <div className="mt-3 text-xs space-y-2 text-slate-300 font-sans">
                <div className="font-bold text-white font-mono">nautrace-ml (FastAPI)</div>
                <p className="text-slate-400 text-xs">
                  Stateless compute service isolated from the database and internet:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400 font-mono">
                  <li><code className="text-teal-300">/detect</code>: SegFormer/U-Net SAR inference</li>
                  <li><code className="text-amber-300">/hindcast</code>: OpenDrift met-ocean reverse</li>
                  <li><code className="text-rose-300">/attribution</code>: 6-factor scoring engine</li>
                  <li>Unknown Source threshold evaluation</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-400">
              STATELESS COMPUTE WORKER
            </div>
          </div>
        </div>

        {/* Interactive Endpoint Inspector & Schema Explorer */}
        <div className="rounded-2xl glass-panel border border-cyan-500/30 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-marine-950/90">
            <div className="flex items-center gap-2 text-xs">
              <Terminal className="w-4 h-4 text-radar-cyan" />
              <span className="text-slate-300 font-bold">API CONTRACT &amp; MOCK ENDPOINT EXPLORER</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ENDPOINTS.map((ep) => {
                const active = ep.path === selectedEndpoint.path;
                return (
                  <button
                    key={ep.path}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`px-2.5 py-1 rounded text-xs transition-all ${
                      active
                        ? "bg-cyan-500 text-marine-950 font-bold"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="font-bold mr-1">{ep.method}</span>
                    <span>{ep.path}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Endpoint Metadata */}
            <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedEndpoint.method === "GET"
                        ? "bg-blue-950 text-blue-300 border border-blue-600/40"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-white font-bold text-sm">{selectedEndpoint.path}</span>
                </div>
                <div className="text-[11px] text-cyan-400 mt-1">Responsible Service: {selectedEndpoint.service}</div>
                <p className="text-xs text-slate-300 mt-3 font-sans leading-relaxed">
                  {selectedEndpoint.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
                Data Format: application/json • PostGIS 4326 GeoJSON Compatible
              </div>
            </div>

            {/* Right: Code Response Display */}
            <div className="lg:col-span-7 bg-[#02050e] p-5 relative">
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "COPIED" : "COPY JSON"}</span>
              </button>
              <pre className="text-xs text-emerald-300/90 overflow-x-auto p-1 leading-relaxed">
                <code>{selectedEndpoint.response}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
