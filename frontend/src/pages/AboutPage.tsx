import React from 'react';
import { 
  Fish, Skull, Droplets, Scale, ArrowLeft, Lock, ArrowRight, ShieldCheck
} from 'lucide-react';
import { NautraceLogo } from '../components/NautraceLogo';
import { OceanAtmosphereCanvas } from '../components/OceanAtmosphereCanvas';

interface AboutPageProps {
  onBackToHome: () => void;
  onLaunchConsole: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToHome, onLaunchConsole }) => {
  const hazardPillars = [
    {
      icon: <Fish className="w-6 h-6 text-cyan-400" />,
      title: "Coral Reef & Mangrove Suffocation",
      badge: "BENTHIC HABITAT COLLAPSE",
      image: "/assets/evidence/Mauri.jpg",
      desc: "Petroleum hydrocarbons settle across reef ecosystems, blocking sunlight essential for symbiotic zooxanthellae photosynthesis. In coastal estuaries, heavy residues coat mangrove pneumatophores, terminating root respiration and collapsing benthic nursery habitats."
    },
    {
      icon: <Skull className="w-6 h-6 text-rose-400" />,
      title: "Hydrocarbon Toxicity & Avian Hypothermia",
      badge: "AVIAN HYPOTHERMIA",
      image: "/assets/evidence/oilspill_drone.jpg",
      desc: "Surface slicks dismantle the microscopic barbules of marine plumage, causing fatal loss of buoyancy and thermal regulation in seabirds. Chemical toxicity from Polycyclic Aromatic Hydrocarbons (PAHs) induces acute organ failure across marine mammalian species."
    },
    {
      icon: <Droplets className="w-6 h-6 text-amber-400" />,
      title: "Pelagic Food Chain Contamination",
      badge: "FISHERY COLLAPSE",
      image: "/assets/evidence/maracaibo_oli_2021253.webp",
      desc: "Water-soluble aromatic fractions (benzene, toluene, xylene) partition rapidly into surface phytoplankton and zooplankton. Bioaccumulation cascades through commercial fisheries, triggering extended fishing bans and severe economic destabilization for coastal communities."
    },
    {
      icon: <Scale className="w-6 h-6 text-purple-400" />,
      title: "The Bilge Discharge Economic Incentive",
      badge: "OWS TARIFF EVASION",
      image: "/assets/evidence/sfbay_RAD_2007316.jpg",
      desc: "Commercial cargo vessels generate between 2,000 and 5,000 liters of oily bilge water daily. Legal discharge at port reception facilities incurs fees ranging from $50,000 to $200,000. Operators frequently bypass Oily Water Separators (OWS) under cover of darkness to evade port disposal tariffs."
    }
  ];

  return (
    <div className="sea-breathe-root about-page-root">
      {/* Living Atmospheric Marine Particle Motion System */}
      <OceanAtmosphereCanvas opacity={0.5} />

      {/* Floating Spatial Nav Bar */}
      <nav className="about-spatial-nav">
        <button onClick={onBackToHome} className="btn-spatial-back">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Return to Overview</span>
        </button>

        <NautraceLogo size="sm" variant="light" />

        <button onClick={onLaunchConsole} className="btn-spatial-launch glow-effect">
          <span>Open Console</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </button>
      </nav>

      {/* Hero Header */}
      <header className="about-hero-header">
        <div className="narrative-container">
          <div className="shc-meta text-center" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="meta-pulse" />
            <span>STATUTORY MARITIME METHODOLOGY &amp; ECOLOGICAL SAFEGUARDS</span>
          </div>
          <h1 className="about-grand-title text-center">
            Admiralty Jurisprudence &amp; <br />
            <span className="gradient-cyan-text">Marine Biosphere Protection</span>
          </h1>
          <p className="about-deck-text text-center">
            Establishing legally defensible chain of custody under IMO MARPOL Annex I, solving the Nearest-Ship Fallacy with physical Lagrangian advection, and safeguarding vulnerable marine sanctuaries.
          </p>
        </div>
      </header>

      {/* Section 1: Ecological Threats (Photojournalistic Cards) */}
      <section className="about-hazards-section">
        <div className="narrative-container">
          <div className="narrative-header-block">
            <span className="narrative-kicker text-rose-400">BIOSPHERE IMPACT</span>
            <h2 className="narrative-giant-heading">Four Vectors of Environmental Ruin</h2>
            <p className="narrative-lead-text">
              Unregulated petroleum discharges devastate marine biospheres from microscopic zooxanthellae to apex cetaceans.
            </p>
          </div>

          <div className="about-hazards-grid">
            {hazardPillars.map((h, i) => (
              <div key={i} className="about-hazard-card">
                <div className="ah-image-box">
                  <img src={h.image} alt={h.title} className="ah-photo" />
                  <div className="ah-scrim" />
                  <span className="ah-badge">{h.badge}</span>
                </div>
                <div className="ah-body">
                  <div className="ah-icon-row">
                    {h.icon}
                    <h3>{h.title}</h3>
                  </div>
                  <p>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Court of Admiralty Legal Admissibility Dossier */}
      <section className="about-legal-section">
        <div className="narrative-container">
          <div className="legal-dossier-box">
            <div className="ld-header">
              <Lock className="w-6 h-6 text-emerald-400" />
              <div>
                <h2>Admiralty Court Admissibility Framework</h2>
                <span className="ld-sub">Compliant with IMO Resolution A.1106(29) &amp; MARPOL 73/78 Annex I</span>
              </div>
            </div>

            <div className="ld-content-grid">
              <div className="ld-col">
                <h4>1. The Statutory Evidentiary Dilemma</h4>
                <p>
                  Conventional satellite surveillance systems identify the vessel geometrically closest to an oil slick at the time of satellite acquisition (t_obs). In admiralty jurisdictions (e.g., UK High Court of Justice Admiralty Division, US Federal Maritime Courts), this evidence is routinely dismissed:
                </p>
                <ul className="ld-list">
                  <li>Disregards hydrodynamic drift (0.3–0.8 m/s) and Stokes wave drift over the elapsed time window.</li>
                  <li>Falsely incriminates innocent passing commercial ships operating lawfully.</li>
                  <li>Fails the Daubert legal admissibility standard for scientific reliability.</li>
                </ul>
              </div>

              <div className="ld-col">
                <h4>2. The NAUTRACE Forensic Protocol</h4>
                <p>
                  NAUTRACE produces a mathematically deterministic, court-admissible forensic dossier by executing:
                </p>
                <ul className="ld-list">
                  <li><strong>Lagrangian Runge-Kutta 4th Order Hindcasting:</strong> Advects 500 stochastic particles backward along Copernicus SMOC velocity fields to compute the 50% and 90% Mahalanobis origin covariance envelopes.</li>
                  <li><strong>Kinematic Transponder Intercept Scoring:</strong> Evaluates candidate vessel tracks across 7 spatio-temporal kinematic criteria.</li>
                  <li><strong>Explicit Non-AIS Dark Vessel Hypothesis:</strong> Quantifies probability for transponder-disabled targets under IMO Resolution A.1106(29).</li>
                  <li><strong>Cryptographic Digital Chain of Custody:</strong> Embeds immutable SHA-256 digests on all satellite radar inputs and meteorological grids.</li>
                </ul>
              </div>
            </div>

            <div className="ld-cta-bar">
              <div className="ld-cert-badge">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mr-2" />
                <span>NTRO PS-26143 Statutory Compliance Verified</span>
              </div>
              <button onClick={onLaunchConsole} className="btn-ld-open glow-effect">
                <span>Access Live Forensic Map</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="sea-footer">
        <div className="narrative-container footer-flex-row">
          <div>
            <NautraceLogo size="sm" variant="light" />
            <p className="footer-credit">
              National Technical Research Organisation (NTRO PS-26143) • Smart India Hackathon 2026
            </p>
          </div>

          <div className="footer-links-clean">
            <button onClick={onBackToHome} className="fl-item">Overview</button>
            <button onClick={onLaunchConsole} className="fl-item">Operational Console</button>
            <a href="/guide.html" target="_blank" rel="noopener noreferrer" className="fl-item">Technical Dossier</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
