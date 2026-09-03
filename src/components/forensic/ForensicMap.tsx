"use client";

import React from "react";
import { Radar, Clock, Waves } from "lucide-react";
import { IncidentData, LayerState } from "./types";

interface ForensicMapProps {
  incident: IncidentData;
  layers: LayerState;
  timeOffset: number; // 0 (detection) to 100 (discharge origin)
  hoursBack: string;
}

export const ForensicMap: React.FC<ForensicMapProps> = ({
  incident,
  layers,
  timeOffset,
  hoursBack,
}) => {
  const progressRatio = timeOffset / 100;

  // Dynamic coordinates
  // Detection centroid at (360, 240) -> Origin at (220, 140)
  const slickX = 360 - (360 - 220) * progressRatio;
  const slickY = 240 - (240 - 140) * progressRatio;
  const slickScale = 1 - 0.45 * progressRatio;

  // Culprit position along track
  const culpritX = 480 - (480 - 220) * progressRatio;
  const culpritY = 290 - (290 - 140) * progressRatio;

  return (
    <div className="relative rounded-2xl glass-panel border border-cyan-500/30 overflow-hidden shadow-2xl bg-[#040b18]">
      {/* Top Map HUD Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-cyan-900/50 bg-marine-950/90 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Radar className="w-4 h-4 animate-spin text-cyan-400" style={{ animationDuration: "8s" }} />
            {incident.locationName}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{incident.coordinates}</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div>
            <span className="text-slate-500">WIND:</span>{" "}
            <span className="text-slate-200">{incident.windSpeed}</span>
          </div>
          <div>
            <span className="text-slate-500">DRIFT:</span>{" "}
            <span className="text-teal-300 font-semibold">{incident.currentDrift}</span>
          </div>
        </div>
      </div>

      {/* SVG Maritime Map Graphic */}
      <div className="relative aspect-[16/10] w-full select-none">
        <svg
          viewBox="0 0 640 400"
          className="w-full h-full object-cover"
          style={{ background: "radial-gradient(ellipse at 40% 40%, #061833 0%, #030a16 100%)" }}
        >
          <defs>
            <pattern id="forensicGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="0.8" />
            </pattern>

            <radialGradient id="slickGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#ff9900" stopOpacity="0.65" />
              <stop offset="85%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="originGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#00e5a3" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00e5a3" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Graticule Grid */}
          <rect width="640" height="400" fill="url(#forensicGrid)" />

          {/* Coastline */}
          <path
            d="M 0 0 L 140 0 C 130 60, 110 110, 80 150 C 60 180, 50 240, 30 290 C 10 330, 0 360, 0 400 Z"
            fill="#0a192f"
            stroke="#1e3a8a"
            strokeWidth="1.5"
          />
          <text x="30" y="80" fill="#475569" fontSize="9" fontFamily="monospace" transform="rotate(-45 30 80)">
            TERRITORIAL WATERS / EEZ
          </text>

          {/* Bathymetry contours */}
          <path
            d="M 120 0 Q 150 140, 100 280 T 60 400"
            fill="none"
            stroke="rgba(0, 240, 255, 0.12)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <path
            d="M 180 0 Q 220 160, 160 300 T 110 400"
            fill="none"
            stroke="rgba(0, 240, 255, 0.08)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Copernicus Drift Vectors */}
          {layers.driftVectors && (
            <g opacity="0.75">
              {[
                [260, 90], [340, 120], [420, 150],
                [220, 180], [300, 210], [380, 240], [460, 270],
                [260, 300], [340, 330],
              ].map(([vx, vy], idx) => (
                <g key={idx} transform={`translate(${vx}, ${vy}) rotate(48)`}>
                  <line x1="0" y1="0" x2="24" y2="0" stroke="#00e5a3" strokeWidth="1.2" strokeOpacity="0.8" />
                  <polygon points="24,0 18,-3 18,3" fill="#00e5a3" />
                </g>
              ))}
            </g>
          )}

          {/* Sentinel-1 Swath */}
          {layers.sarSwath && (
            <g>
              <polygon
                points="160,50 560,90 510,360 110,320"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="1.2"
                strokeDasharray="6 4"
                strokeOpacity="0.4"
              />
              <text x="175" y="70" fill="#00f0ff" fontSize="9" fontFamily="monospace" opacity="0.6">
                SENTINEL-1 SAR SWATH (IW_GRDH_1SDV)
              </text>
            </g>
          )}

          {/* OpenDrift Hindcast Trail */}
          {layers.hindcastTrail && (
            <g>
              <path
                d="M 360 240 C 320 210, 270 175, 220 140"
                fill="none"
                stroke="#ffb020"
                strokeWidth="2.5"
                strokeDasharray="5 3"
                className="animate-pulse"
              />
              <text x="270" y="180" fill="#ffb020" fontSize="9" fontFamily="monospace">
                ← REVERSE HINDCAST TRAIL
              </text>
            </g>
          )}

          {/* Origin Probability Ellipse */}
          {layers.originEllipse && (
            <g transform="translate(220, 140) rotate(-35)">
              <ellipse cx="0" cy="0" rx="42" ry="24" fill="url(#originGrad)" />
              <ellipse
                cx="0"
                cy="0"
                rx="42"
                ry="24"
                fill="none"
                stroke="#00e5a3"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <circle cx="0" cy="0" r="3" fill="#00f0ff" />
              <text x="8" y="4" fill="#00e5a3" fontSize="8" fontFamily="monospace" transform="rotate(35)">
                ORIGIN ZONE (T - 11.4h)
              </text>
            </g>
          )}

          {/* AIS Tracks */}
          {layers.aisTracks && (
            <g>
              {!incident.isUnknownSource && (
                <g>
                  <path
                    d="M 120 70 L 220 140 L 360 220 L 480 290 L 560 340"
                    fill="none"
                    stroke="#ff4d4d"
                    strokeWidth="2.2"
                    strokeOpacity="0.85"
                  />
                  {[
                    [120, 70], [220, 140], [360, 220], [480, 290]
                  ].map(([px, py], idx) => (
                    <circle key={idx} cx={Number(px)} cy={Number(py)} r="2.5" fill="#ff4d4d" />
                  ))}
                  <text x="485" y="305" fill="#ff4d4d" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    MT OCEAN CONQUEROR
                  </text>
                </g>
              )}

              {/* Decoy Vessel */}
              <path
                d="M 140 320 L 220 260 L 320 180 L 410 110"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                strokeOpacity="0.5"
              />
              <text x="415" y="105" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                MV SEA GULL (PASSING)
              </text>
            </g>
          )}

          {/* Culprit Vessel Icon at scrubbed time */}
          {!incident.isUnknownSource && (
            <g transform={`translate(${culpritX}, ${culpritY})`}>
              <circle cx="0" cy="0" r="10" fill="none" stroke="#ff4d4d" strokeWidth="1" className="animate-ping" />
              <circle cx="0" cy="0" r="5" fill="#ff4d4d" />
              <polygon points="0,-7 5,5 -5,5" fill="#ffffff" transform="rotate(45)" />
            </g>
          )}

          {/* Oil Slick Polygon */}
          {layers.spillPolygon && (
            <g transform={`translate(${slickX}, ${slickY}) scale(${slickScale})`}>
              <path
                d="M -30 -15 C -20 -35, 10 -40, 35 -20 C 55 -5, 60 20, 35 30 C 15 38, -10 32, -35 20 C -50 8, -45 -5, -30 -15 Z"
                fill="url(#slickGrad)"
                stroke="#ff4d4d"
                strokeWidth="1.8"
              />
              <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
              <text x="12" y="-20" fill="#ff9900" fontSize="9" fontFamily="monospace" fontWeight="bold">
                OIL SLICK ({incident.slickArea})
              </text>
            </g>
          )}

          {/* Compass Rose */}
          <g transform="translate(590, 45)" opacity="0.8">
            <circle cx="0" cy="0" r="15" fill="#061224" stroke="#00f0ff" strokeWidth="1" />
            <text x="-4" y="-4" fill="#00f0ff" fontSize="8" fontFamily="monospace" fontWeight="bold">N</text>
            <polygon points="0,-12 4,0 -4,0" fill="#00f0ff" />
            <polygon points="0,12 4,0 -4,0" fill="#475569" />
          </g>
        </svg>

        {/* Floating HUD Tag */}
        <div className="absolute bottom-3 left-3 px-3 py-2 rounded-lg bg-marine-950/85 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-radar-cyan font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>TIMELINE: T - {hoursBack}h</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300">
            {progressRatio > 0.85 ? (
              <span className="text-rose-400 font-semibold">DISCHARGE INTERCEPT DETECTED</span>
            ) : progressRatio > 0.3 ? (
              <span className="text-amber-400 font-semibold">REVERSE DRIFT SIMULATION</span>
            ) : (
              <span className="text-cyan-300 font-semibold">SAR OBSERVATION TIME (T₀)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
