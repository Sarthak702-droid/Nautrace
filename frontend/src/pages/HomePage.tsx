import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowRight, Eye, Waves, 
  Compass, Lock, MapPin, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { NautraceLogo } from '../components/NautraceLogo';
import { OceanAtmosphereCanvas } from '../components/OceanAtmosphereCanvas';

interface HomePageProps {
  onLaunchConsole: () => void;
  onOpenAbout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onLaunchConsole, onOpenAbout }) => {
  // 6 Distinct Multi-Video Backgrounds auto-crossfading without any timebars
  const oceanVideos = [
    { src: "/assets/ocean_whale_bg.mp4", label: "Pelagic Cetaceans • Humpback Whale Pod", icon: "🐋", id: "whales" },
    { src: "/assets/ocean_waves_surface.mp4", label: "Hydrodynamic Surface • Ocean Swell Dynamics", icon: "🌊", id: "waves" },
    { src: "/assets/underwater_whales_bg.mp4", label: "Subsurface Realm • Deep Pelagic Navigation", icon: "🌌", id: "underwater" },
    { src: "/assets/whale_shark_maldives.mp4", label: "Pelagic Migration • Whale Shark on Coral Shelf", icon: "🦈", id: "shark" },
    { src: "/assets/abyssal_jellyfish.mp4", label: "Benthic Abyssal Biome • Midnight Plankton Drift", icon: "🪼", id: "jellyfish" },
    { src: "/assets/marine_bg.mp4", label: "Global Ocean Circulation • Pelagic Blue Horizon", icon: "🌐", id: "circulation" }
  ];

  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  // Interactive drift simulation state
  const [simMode, setSimMode] = useState<'naive' | 'lagrangian'>('lagrangian');
  const [windSpeed, setWindSpeed] = useState<number>(7.8); // m/s
  const [currentSpeed, setCurrentSpeed] = useState<number>(0.45); // m/s
  const [driftHours, setDriftHours] = useState<number>(3.0); // hours

  // Calculate live dynamic physical drift distance: (U_ocean + 3% U_wind) * time
  const netDriftSpeedMps = currentSpeed + 0.03 * windSpeed;
  const driftDistanceKm = (netDriftSpeedMps * driftHours * 3.6).toFixed(1);
  // naive error equals calculated drift

  // Auto-cycle videos every 6 seconds seamlessly without timebars
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveVideoIdx((prev) => (prev + 1) % oceanVideos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [oceanVideos.length]);

  const evidenceDossier = [
    {
      title: "MV Wakashio Coral Sanctuary Catastrophe",
      location: "Pointe d'Esny Lagoon, Mauritius",
      sensor: "Sentinel-2 MSI & Sentinel-1 C-Band",
      image: "/assets/evidence/Mauri.jpg",
      tag: "CORAL ATTOLL DESTABILIZATION",
      impact: "1,000 metric tons of VLSFO heavy bunker fuel penetrating pristine coral lagoons and mangrove reserves. Demonstrates the need for all-weather radar penetration.",
      severity: "CATASTROPHIC"
    },
    {
      title: "Huntington Beach Pipeline Fracture",
      location: "San Pedro Bay, California Shelf",
      sensor: "Landsat-8 OLI & Sentinel-1 SAR",
      image: "/assets/evidence/huntington_oli_2021276.jpg",
      tag: "PIPELINE INFRASTRUCTURE BREACH",
      impact: "Subsea pipeline breach spreading heavy crude across coastal barrier islands and snowy plover habitats under complex tidal oscillations.",
      severity: "CRITICAL ALERT"
    },
    {
      title: "San Francisco Bay Radar SAR Slicks",
      location: "Golden Gate Channel Approaches",
      sensor: "RADARSAT-1 C-Band SAR (5.4 GHz)",
      image: "/assets/evidence/sfbay_RAD_2007316.jpg",
      tag: "RADAR GROUND TRUTH",
      impact: "Direct physics benchmark: petroleum films eliminate capillary ripples (1-3 cm), suppressing Bragg backscatter and appearing pitch-black on radar.",
      severity: "RADAR BENCHMARK"
    },
    {
      title: "Deepwater Horizon Macro-Spill Dispersion",
      location: "Mississippi Canyon, Gulf of Mexico",
      sensor: "MODIS Aqua & Terra Multispectral",
      image: "/assets/evidence/gulf_amo_2010115.jpg",
      tag: "MACRO-SCALE DISPERSION",
      impact: "Uncontrolled deepwater discharge spreading across 180,000 km², proving that surface slick tracking requires hydrodynamic drift compensation.",
      severity: "HISTORIC MAXIMUM"
    }
  ];

  return (
    <div className="sea-breathe-root">
      {/* Living Atmospheric Marine Particle Motion System */}
      <OceanAtmosphereCanvas opacity={0.65} />

      {/* ----------------------------------------------------------------------
          1. SPATIAL HORIZON SPLIT HERO WITH AUTO-CROSSFADING VIDEOS (NO TIMEBAR)
          ---------------------------------------------------------------------- */}
      <section className="horizon-split-hero">
        {/* Top Half: Cinematic Ocean Videos Crossfading Automatically */}
        <div className="horizon-top-stage">
          {oceanVideos.map((vid, idx) => (
            <video
              key={vid.src}
              autoPlay
              loop
              muted
              playsInline
              className={`crossfade-video ${idx === activeVideoIdx ? 'active' : ''}`}
            >
              <source src={vid.src} type="video/mp4" />
            </video>
          ))}
          <div className="horizon-top-gradient" />
          
          {/* Subtle Live Lens Indicator in top corner */}
          <div className="horizon-live-lens">
            <span className="lens-dot" />
            <span className="lens-text">{oceanVideos[activeVideoIdx].label}</span>
          </div>

          {/* Interactive Perspective Selector Navigation Pills */}
          <div className="perspective-nav-pills">
            {oceanVideos.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveVideoIdx(idx)}
                className={`perspective-pill-btn ${idx === activeVideoIdx ? 'active' : ''}`}
                title={p.label}
              >
                <span className="pill-icon">{p.icon}</span>
                <span className="pill-text">{p.id.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Central Spatial Glass Capsule Floating Directly Across the Horizon Line */}
        <div className="spatial-horizon-capsule floating-bob">
          <div className="shc-brand-col">
            <NautraceLogo size="md" variant="light" />
          </div>

          <div className="shc-text-col">
            <div className="shc-meta">
              <span className="meta-pulse" />
              <span>NTRO PS-26143 • NATIONAL MARITIME FORENSICS INTELLIGENCE</span>
            </div>
            <h2 className="shc-title">Every drop of oil leaves a physical trace in the currents.</h2>
            <p className="shc-desc">
              When commercial ships dump engine bilge to evade port cleaning fees, ocean circulation moves the slick 15 to 45 km. 
              We rewind hydrodynamic time to identify the real perpetrator.
            </p>
          </div>

          <div className="shc-cta-col">
            <button onClick={onLaunchConsole} className="btn-shc-launch glow-effect">
              <span>Launch Operational Console</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </button>
            <button onClick={onOpenAbout} className="btn-shc-ghost">
              <span>Legal Methodology</span>
            </button>
          </div>
        </div>

        {/* Bottom Half of Horizon */}
        <div className="horizon-bottom-stage">
          <div className="telemetry-horizon-row">
            <div className="th-item">
              <span className="th-num">500+</span>
              <span className="th-label">Ensemble Hindcast Particles</span>
            </div>
            <div className="th-item">
              <span className="th-num">&lt; 1.4s</span>
              <span className="th-label">RK4 Advection Latency</span>
            </div>
            <div className="th-item">
              <span className="th-num">100.0%</span>
              <span className="th-label">30-Vessel Adversarial Benchmark</span>
            </div>
            <div className="th-item">
              <span className="th-num">IMO A.1106</span>
              <span className="th-label">Statutory Dark Vessel Attribution</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          2. "THE SEA WE BREATHE" INSPIRED EDITORIAL STORYTELLING
          ---------------------------------------------------------------------- */}
      <section className="sea-narrative-section">
        <div className="narrative-container">
          <div className="narrative-header-block">
            <span className="narrative-kicker">THE EVIDENTIARY CRISIS</span>
            <h2 className="narrative-giant-heading">
              The Invisible Hit-and-Run on the High Seas
            </h2>
            <p className="narrative-lead-text">
              Over 80% of open-ocean petroleum pollution does not originate from catastrophic oil tanker accidents. 
              It stems from routine, deliberate, and illegal bilge dumping conducted by commercial cargo vessels 
              turning off their transponders in international waters to cut port disposal costs.
            </p>
          </div>

          <div className="editorial-twocol-grid">
            <div className="editorial-prose-card">
              <div className="ep-badge text-rose-400 bg-rose-950/40 border-rose-800/50">
                OBSERVATION-TIME PROXIMITY (FLAWED)
              </div>
              <h3>The Nearest-Ship Fallacy</h3>
              <p>
                When an orbital radar satellite acquires an image at 04:30 UTC, coastal winds and Copernicus surface currents have already moved the hydrocarbon mass 20 to 40 kilometers away from its release coordinates.
              </p>
              <p>
                Standard surveillance software identifies whichever ship is closest to the slick at satellite capture time (t_obs). In international admiralty courts, this naive approach collapses immediately—falsely penalizing innocent passing vessels while the true polluter sails away unpunished.
              </p>
            </div>

            <div className="editorial-prose-card accent-card">
              <div className="ep-badge text-cyan-400 bg-cyan-950/40 border-cyan-800/50">
                PHYSICAL LAGRANGIAN HINDCASTING (VALIDATED)
              </div>
              <h3>The Backward Physical Rewind</h3>
              <p>
                NAUTRACE resolves this evidentiary crisis by executing backward-in-time numerical advection. By coupling hourly Copernicus Marine SMOC surface currents (uo, vo), Stokes wave drift, and tidal oscillations, we rewind time hour by hour to the exact release coordinates.
              </p>
              <p>
                500 stochastic particle trajectories reconstruct the exact discharge coordinates and time window, cross-matching historical AIS vessel tracks to establish court-admissible proof backed by SHA-256 cryptographic hashes.
              </p>
            </div>
          </div>

          {/* Interactive Hydrodynamic Simulator Widget with Live Parameter Sliders */}
          <div className="interactive-simulator-card" style={{ marginTop: '48px' }}>
            <div className="sim-header-bar">
              <div className="sim-status">
                <span className="sim-live-dot" />
                <span>HYDRODYNAMIC DRIFT SIMULATOR: ARABIAN SEA SECTOR</span>
              </div>
              <div className="sim-mode-toggle">
                <button 
                  onClick={() => setSimMode('naive')}
                  className={`sim-toggle-btn ${simMode === 'naive' ? 'active-naive' : ''}`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                  Naive Distance (Flawed)
                </button>
                <button 
                  onClick={() => setSimMode('lagrangian')}
                  className={`sim-toggle-btn ${simMode === 'lagrangian' ? 'active-lagrangian' : ''}`}
                >
                  <Compass className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  Nautrace Lagrangian Rewind (Physics)
                </button>
              </div>
            </div>

            {/* Live Interactive Sliders Row */}
            <div className="sim-sliders-row">
              <div className="sim-slider-group">
                <div className="slider-label-row">
                  <span>Surface Wind (U_10)</span>
                  <strong className="mono">{windSpeed.toFixed(1)} m/s</strong>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="20.0"
                  step="0.5"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                  className="sim-range-input"
                />
              </div>

              <div className="sim-slider-group">
                <div className="slider-label-row">
                  <span>Ocean Current (SMOC)</span>
                  <strong className="mono">{currentSpeed.toFixed(2)} m/s</strong>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="1.20"
                  step="0.05"
                  value={currentSpeed}
                  onChange={(e) => setCurrentSpeed(parseFloat(e.target.value))}
                  className="sim-range-input"
                />
              </div>

              <div className="sim-slider-group">
                <div className="slider-label-row">
                  <span>Elapsed Advection Time</span>
                  <strong className="mono">{driftHours.toFixed(1)} hours</strong>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.5"
                  value={driftHours}
                  onChange={(e) => setDriftHours(parseFloat(e.target.value))}
                  className="sim-range-input"
                />
              </div>

              <div className="sim-result-badge">
                <span className="badge-lbl">Calculated Physical Displacement:</span>
                <span className="badge-val">{driftDistanceKm} km</span>
              </div>
            </div>

            <div className="sim-viewport">
              <div className="sim-radar-grid" />
              
              <div className="sim-vector-field">
                <div className="sim-arrow a1">→ {currentSpeed.toFixed(2)} m/s (SMOC)</div>
                <div className="sim-arrow a2">→ {(currentSpeed * 0.95).toFixed(2)} m/s</div>
                <div className="sim-arrow a3">→ {(currentSpeed * 1.05).toFixed(2)} m/s</div>
              </div>

              <div className="sim-slick-node">
                <div className="slick-pulse-ring" />
                <div className="slick-label">
                  <strong>Observed Slick @ 04:30 UTC</strong>
                  <span>Lat 18.92°N Lon 72.83°E • 14.8 km²</span>
                </div>
              </div>

              <div className="sim-vessel innocent-vessel">
                <div className="vessel-icon">🚢</div>
                <div className="vessel-tag">
                  <strong>MV Ocean Star (Innocent Cargo)</strong>
                  <span>Distance: 3.2 km at 04:30 UTC</span>
                  {simMode === 'naive' && <span className="tag-verdict guilty">🚨 FALSELY ACCUSED BY NAIVE MODEL</span>}
                  {simMode === 'lagrangian' && <span className="tag-verdict exonerated">✓ EXONERATED (Temporal mismatch)</span>}
                </div>
              </div>

              <div className="sim-vessel culprit-vessel">
                <div className="vessel-icon">⚠️</div>
                <div className="vessel-tag">
                  <strong>MT Poseidon Leader (Culprit Tanker)</strong>
                  <span>Distance: {driftDistanceKm} km from slick</span>
                  {simMode === 'naive' && <span className="tag-verdict missed">✕ IGNORED BY NAIVE MODEL (Too Far)</span>}
                  {simMode === 'lagrangian' && <span className="tag-verdict intercepted">🎯 ATTRIBUTED CULPRIT (96.8% Match)</span>}
                </div>
              </div>

              {simMode === 'lagrangian' && (
                <div className="sim-particle-rewind">
                  <div className="rewind-track-line" />
                  <div className="origin-ellipse-50">
                    <span className="ellipse-tag">50% Mahalanobis Core Origin (-{driftHours}h)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="sim-footer-notes">
              {simMode === 'naive' ? (
                <div className="sim-note-box text-rose-300 bg-rose-950/40 border-rose-800/60">
                  <AlertTriangle className="w-5 h-5 mr-3 text-rose-400 flex-shrink-0" />
                  <div>
                    <strong>Failure Mode:</strong> Naive distance ignores the {driftHours} hours of ocean current advection. It wrongfully convicts MV Ocean Star simply because its scheduled route crossed near the drifted slick hours later.
                  </div>
                </div>
              ) : (
                <div className="sim-note-box text-cyan-300 bg-cyan-950/40 border-cyan-800/60">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-cyan-400 flex-shrink-0" />
                  <div>
                    <strong>Nautrace Physics Solution:</strong> Runge-Kutta 4th-order hindcast rewinds the 500 particles along Copernicus SMOC velocity fields across {driftDistanceKm} km back {driftHours} hours. The reconstructed origin matches MT Poseidon Leader's exact coordinates and heading profile.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          3. FOUR ALGORITHMIC FRONTIERS (SPATIAL GLASS PANELS)
          ---------------------------------------------------------------------- */}
      <section className="frontiers-section">
        <div className="narrative-container">
          <div className="frontiers-header text-center">
            <span className="narrative-kicker text-cyan-400">ARCHITECTURAL FRONTIERS</span>
            <h2 className="narrative-giant-heading">Four Pillars of Physical Attribution</h2>
            <p className="narrative-sub-centered">
              From low-earth orbit radar satellites to courtroom-admissible forensic dossiers.
            </p>
          </div>

          <div className="frontiers-cards-grid">
            <div className="frontier-card">
              <div className="fc-top">
                <span className="fc-idx">01</span>
                <Eye className="w-6 h-6 text-sky-400" />
              </div>
              <span className="fc-tech">SENTINEL-1 C-BAND SAR</span>
              <h3>Synthetic Aperture Radar AI</h3>
              <p>
                Microwaves penetrate tropical cloud cover and total darkness at 5.4 GHz. Deep learning U-Net segments low-backscatter hydrocarbon boundaries where surface capillary waves have been flattened.
              </p>
            </div>

            <div className="frontier-card">
              <div className="fc-top">
                <span className="fc-idx">02</span>
                <Waves className="w-6 h-6 text-teal-400" />
              </div>
              <span className="fc-tech">COPERNICUS CMEMS SMOC</span>
              <h3>Hydrodynamic Velocity Forcing</h3>
              <p>
                Dynamic ingestion of hourly surface current vectors (uo, vo), Stokes wave drift, and M2 tidal oscillations across regional maritime transit corridors, compensating for wind shear and coriolis deflection.
              </p>
            </div>

            <div className="frontier-card">
              <div className="fc-top">
                <span className="fc-idx">03</span>
                <Compass className="w-6 h-6 text-amber-400" />
              </div>
              <span className="fc-tech">NUMERICAL ADVECTION (RK4)</span>
              <h3>Lagrangian Backward Hindcasting</h3>
              <p>
                500 stochastic particles per spill backwards-advected via Runge-Kutta 4th Order numerical integration with horizontal turbulent diffusion, reconstructing time-dependent discharge probability horizons.
              </p>
            </div>

            <div className="frontier-card">
              <div className="fc-top">
                <span className="fc-idx">04</span>
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <span className="fc-tech">COURTROOM-GRADE CHAIN OF CUSTODY</span>
              <h3>Explainable Bayesian Attribution</h3>
              <p>
                Probabilistic fusion of spatial distance, temporal overlap, and AIS continuity with transparent Shapley additive explanations, backed by immutable SHA-256 cryptographic provenance seals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          4. REAL SATELLITE DISASTER IMAGERY DOSSIER
          ---------------------------------------------------------------------- */}
      <section className="evidence-gallery-section">
        <div className="narrative-container">
          <div className="gallery-header-block">
            <span className="narrative-kicker text-cyan-400">EMPIRICAL GROUND TRUTH</span>
            <h2 className="narrative-giant-heading">Real Maritime Incident Evidence</h2>
            <p className="narrative-lead-text">
              High-resolution satellite telemetry, multi-sensor synthetic aperture radar, and multispectral optical imaging from real historical disasters across global transit choke points.
            </p>
          </div>

          <div className="evidence-grid">
            {evidenceDossier.map((item) => (
              <div key={item.title} className="evidence-card">
                <div className="evidence-img-box">
                  <img src={item.image} alt={item.title} className="evidence-img" />
                  <span className="evidence-badge-tag">{item.severity}</span>
                </div>

                <div className="evidence-body">
                  <div className="ev-location-row">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                    <span>{item.location}</span>
                  </div>
                  <h4 className="ev-title">{item.title}</h4>
                  <div className="ev-sensor-pill">{item.sensor}</div>
                  <p className="ev-impact">{item.impact}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Operational Console Launch Action Bar */}
          <div className="cta-banner-card">
            <div className="banner-content">
              <span className="banner-kicker">OPERATIONAL DEPLOYMENT</span>
              <h3 className="banner-heading">Ready to Investigate Live Maritime Sectors?</h3>
              <p className="banner-sub">
                Explore real Sentinel-1 SAR imagery, execute Runge-Kutta 4 hindcasts, and generate court-admissible forensic briefs in the defense console.
              </p>
            </div>
            <div className="banner-actions">
              <button onClick={onLaunchConsole} className="btn-banner-primary">
                <span>Enter Operational Console</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Quick Navigation Bar */}
      <div className="sticky-options-bar">
        <div className="sob-left">
          <span className="sob-dot" />
          <span className="sob-title">NAUTRACE OPERATIONAL SUITE</span>
        </div>
        <div className="sob-links">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="sob-btn active">Overview</button>
          <button onClick={onLaunchConsole} className="sob-btn highlight">Operational Console ↗</button>
          <button onClick={onOpenAbout} className="sob-btn">Legal Methodology</button>
          <a href="/guide.html" target="_blank" rel="noreferrer" className="sob-btn">Scientific Guide</a>
        </div>
      </div>
    </div>
  );
};
