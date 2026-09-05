import React, { useState } from 'react';
import type { IncidentCase } from '../types';
import { X, ShieldAlert, Compass, Droplets, Ship, Sparkles, CheckCircle2 } from 'lucide-react';

interface NewCaseModalProps {
  onClose: () => void;
  onCreateCase: (newCase: IncidentCase) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({ onClose, onCreateCase }) => {
  const [title, setTitle] = useState('Incident 142 — Mumbai Channel High-Density Sector');
  const [region, setRegion] = useState('Arabian Sea / Mumbai Approaches (18.85°N, 72.35°E)');
  const [centerLat, setCenterLat] = useState(18.28);
  const [centerLon, setCenterLon] = useState(71.95);
  const [detectionTime, setDetectionTime] = useState('2026-09-04T05:30:00Z');
  const [slickAreaKm2, setSlickAreaKm2] = useState(12.5);
  const [oilProbability] = useState(0.95);

  const [windSpeed, setWindSpeed] = useState(8.2);
  const [windDir, setWindDir] = useState(230);
  const [currentSpeed, setCurrentSpeed] = useState(0.48);
  const [currentDir, setCurrentDir] = useState(60);

  const [vesselName, setVesselName] = useState('M/T Caspian Pride');
  const [vesselMmsi, setVesselMmsi] = useState('419008821');
  const [vesselType, setVesselType] = useState('Aframax Crude Tanker');

  // Quick preset loader
  const loadPreset = (presetName: string) => {
    if (presetName === 'mumbai') {
      setTitle('Incident 158 — Mumbai Offshore Anchorage Dump');
      setRegion('Mumbai Offshore Basin (18.90°N, 72.40°E)');
      setCenterLat(18.30);
      setCenterLon(71.92);
      setWindSpeed(9.5);
      setWindDir(245);
      setCurrentSpeed(0.55);
      setCurrentDir(70);
      setVesselName('M/T Indian Star');
      setVesselMmsi('419003312');
      setVesselType('Product Tanker');
      setSlickAreaKm2(16.4);
    } else if (presetName === 'hormuz') {
      setTitle('Incident 204 — Strait of Hormuz Transit Evasion');
      setRegion('Strait of Hormuz (26.30°N, 56.45°E)');
      setCenterLat(18.22);
      setCenterLon(71.85);
      setWindSpeed(6.0);
      setWindDir(180);
      setCurrentSpeed(0.70);
      setCurrentDir(90);
      setVesselName('M/T Gulf Titan');
      setVesselMmsi('636019922');
      setVesselType('VLCC Supertanker');
      setSlickAreaKm2(21.8);
    } else if (presetName === 'redsea') {
      setTitle('Incident 311 — Red Sea Bab-el-Mandeb Discharge');
      setRegion('Southern Red Sea (13.15°N, 43.10°E)');
      setCenterLat(18.35);
      setCenterLon(72.05);
      setWindSpeed(11.0);
      setWindDir(330);
      setCurrentSpeed(0.35);
      setCurrentDir(150);
      setVesselName('MV Phoenix Carrier');
      setVesselMmsi('538004119');
      setVesselType('Bulk Ore Carrier');
      setSlickAreaKm2(10.2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const caseId = `MANUAL-${Date.now().toString().slice(-4)}`;

    // Generate realistic slick polygon around centerLat, centerLon
    const slickPolygon = [
      { lat: centerLat + 0.03, lon: centerLon - 0.05 },
      { lat: centerLat + 0.06, lon: centerLon },
      { lat: centerLat + 0.04, lon: centerLon + 0.06 },
      { lat: centerLat - 0.02, lon: centerLon + 0.04 },
      { lat: centerLat - 0.04, lon: centerLon - 0.03 },
      { lat: centerLat + 0.03, lon: centerLon - 0.05 }
    ];

    // AIS sample tracks near the slick (inputs only — scores come from the backend).
    const radCurrent = (currentDir * Math.PI) / 180;
    const offsetScale = 0.08;
    const approachLat = centerLat - Math.cos(radCurrent) * offsetScale;
    const approachLon = centerLon - Math.sin(radCurrent) * offsetScale;
    const detectMs = new Date(detectionTime).getTime();
    const hoursBefore = (h: number) => new Date(detectMs - h * 3_600_000).toISOString();

    const targetPoints = [
      { timestamp: hoursBefore(3.5), lat: approachLat - 0.12, lon: approachLon - 0.12, sog: 13.5, cog: 45, heading: 45 },
      { timestamp: hoursBefore(2.5), lat: approachLat - 0.06, lon: approachLon - 0.06, sog: 13.2, cog: 45, heading: 45 },
      { timestamp: hoursBefore(1.5), lat: approachLat, lon: approachLon, sog: 12.0, cog: 46, heading: 46 },
      { timestamp: hoursBefore(0.5), lat: approachLat + 0.07, lon: approachLon + 0.07, sog: 13.4, cog: 45, heading: 45 },
      { timestamp: detectionTime, lat: approachLat + 0.11, lon: approachLon + 0.11, sog: 13.8, cog: 45, heading: 45 },
    ];

    const passingPoints = [
      { timestamp: hoursBefore(3.5), lat: centerLat + 0.15, lon: centerLon - 0.2, sog: 18.0, cog: 120, heading: 120 },
      { timestamp: hoursBefore(2.5), lat: centerLat + 0.1, lon: centerLon - 0.05, sog: 17.8, cog: 120, heading: 120 },
      { timestamp: hoursBefore(1.5), lat: centerLat + 0.05, lon: centerLon + 0.1, sog: 18.1, cog: 120, heading: 120 },
      { timestamp: hoursBefore(0.5), lat: centerLat, lon: centerLon + 0.25, sog: 18.2, cog: 120, heading: 120 },
      { timestamp: detectionTime, lat: centerLat - 0.03, lon: centerLon + 0.32, sog: 18.0, cog: 120, heading: 120 },
    ];

    const newCase: IncidentCase = {
      id: caseId,
      title,
      region,
      detectionTime,
      slickPolygon,
      slickAreaKm2: Number(slickAreaKm2),
      oilProbability: Number(oilProbability),
      boundaryUncertaintyM: 40.0,
      windSpeedMps: Number(windSpeed),
      windDirDeg: Number(windDir),
      currentSpeedMps: Number(currentSpeed),
      currentDirDeg: Number(currentDir),
      origin50: {
        center: { lat: centerLat, lon: centerLon },
        semiMajorKm: 0,
        semiMinorKm: 0,
        rotationDeg: 0,
      },
      origin90: {
        center: { lat: centerLat, lon: centerLon },
        semiMajorKm: 0,
        semiMinorKm: 0,
        rotationDeg: 0,
      },
      provenance: {
        rawProductId: `MANUAL_S1_${caseId}`,
        requestSha256: '',
        configSha256: '',
        algorithmVersion: 'pending-analysis',
        oceanForcing: 'pending-analysis',
        windForcing: 'pending-analysis',
      },
      tracks: [
        {
          id: `target-${caseId}`,
          name: vesselName,
          mmsi: vesselMmsi,
          type: vesselType,
          flag: 'Unknown',
          color: '#ef4444',
          points: targetPoints,
        },
        {
          id: `passing-${caseId}`,
          name: 'MV Global Transporter',
          mmsi: '538009981',
          type: 'Container Carrier',
          flag: 'Singapore',
          color: '#38bdf8',
          points: passingPoints,
        },
      ],
      candidates: [],
      particles: [],
    };

    onCreateCase(newCase);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window new-case-modal" style={{ maxWidth: '640px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="modal-title">New incident input</div>
              <div className="modal-subtitle">
                Enter slick location, metocean, and AIS tracks — attribution runs on the backend
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div style={{ padding: '12px 20px', background: 'rgba(15, 23, 42, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Quick Presets:</span>
          <button type="button" onClick={() => loadPreset('mumbai')} className="cyber-btn-secondary" style={{ padding: '4px 10px', fontSize: '10px' }}>
            Mumbai Anchorage
          </button>
          <button type="button" onClick={() => loadPreset('hormuz')} className="cyber-btn-secondary" style={{ padding: '4px 10px', fontSize: '10px' }}>
            Strait of Hormuz
          </button>
          <button type="button" onClick={() => loadPreset('redsea')} className="cyber-btn-secondary" style={{ padding: '4px 10px', fontSize: '10px' }}>
            Southern Red Sea
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
          {/* Section 1: Incident & SAR Observation */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Droplets className="w-3.5 h-3.5" />
              <span>SAR OBSERVATION & SPILL GEOMETRY</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Incident Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Region & Description</label>
                <input 
                  type="text" 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Center Latitude (°N)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={centerLat} 
                  onChange={(e) => setCenterLat(parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Center Longitude (°E)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={centerLon} 
                  onChange={(e) => setCenterLon(parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Slick Area (km²)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={slickAreaKm2} 
                  onChange={(e) => setSlickAreaKm2(parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>SAR Acquisition Time (UTC)</label>
                <input 
                  type="text" 
                  value={detectionTime} 
                  onChange={(e) => setDetectionTime(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Metocean Forcing */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass className="w-3.5 h-3.5" />
              <span>MET-OCEAN FORCING FIELDS</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Wind Speed (m/s)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={windSpeed} 
                  onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Wind Bearing (°)</label>
                <input 
                  type="number" 
                  value={windDir} 
                  onChange={(e) => setWindDir(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Current Speed (m/s)</label>
                <input 
                  type="number" 
                  step="0.05"
                  value={currentSpeed} 
                  onChange={(e) => setCurrentSpeed(parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(0, 242, 254, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Current Bearing (°)</label>
                <input 
                  type="number" 
                  value={currentDir} 
                  onChange={(e) => setCurrentDir(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(0, 242, 254, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Primary Suspect Vessel Candidate */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Ship className="w-3.5 h-3.5" />
              <span>PRIMARY SUSPECT VESSEL CANDIDATE</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Vessel Name</label>
                <input 
                  type="text" 
                  value={vesselName} 
                  onChange={(e) => setVesselName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>MMSI Transponder ID</label>
                <input 
                  type="text" 
                  value={vesselMmsi} 
                  onChange={(e) => setVesselMmsi(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Vessel Type</label>
                <input 
                  type="text" 
                  value={vesselType} 
                  onChange={(e) => setVesselType(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', color: '#fff', fontSize: '11px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="cyber-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="cyber-btn-primary" style={{ padding: '9px 18px' }}>
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-cyan-300" />
              <span>INGEST & RUN FORENSIC INVERSE ADVECTION</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
