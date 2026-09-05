import React, { useState } from 'react';
import type { IncidentCase } from '../types';
import { X, CheckCircle2, ShieldAlert, Compass, Ship, Crosshair } from 'lucide-react';

interface NewCaseModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onCreateCase: (newCase: IncidentCase) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen = true,
  onClose,
  onCreateCase,
}) => {
  const [title, setTitle] = useState('Incident 158 — Mumbai Offshore Anchorage Dump');
  const [region, setRegion] = useState('Arabian Sea / Mumbai Approaches (18.85°N, 72.35°E)');
  const [centerLat, setCenterLat] = useState(18.30);
  const [centerLon, setCenterLon] = useState(71.92);
  const [detectionTime, setDetectionTime] = useState('2026-09-04T05:30:00Z');
  const [slickAreaKm2, setSlickAreaKm2] = useState(16.4);
  const [oilProbability] = useState(0.95);
  const [windSpeed, setWindSpeed] = useState(8.2);
  const [windDir, setWindDir] = useState(230);
  const [currentSpeed, setCurrentSpeed] = useState(0.48);
  const [currentDir, setCurrentDir] = useState(60);

  const [vesselName, setVesselName] = useState('M/T Indian Star');
  const [vesselMmsi, setVesselMmsi] = useState('419003312');
  const [vesselType, setVesselType] = useState('Product Tanker (Single Hull)');

  if (isOpen === false) return null;

  const handleApplyPreset = (presetName: 'mumbai' | 'hormuz' | 'redsea') => {
    if (presetName === 'mumbai') {
      setTitle('Incident 142 — Mumbai Channel High-Density Sector');
      setRegion('Arabian Sea / Mumbai Approaches (18.85°N, 72.35°E)');
      setCenterLat(18.30);
      setCenterLon(71.92);
      setWindSpeed(8.2);
      setWindDir(230);
      setCurrentSpeed(0.48);
      setCurrentDir(60);
      setVesselName('M/T Indian Star');
      setVesselMmsi('419003312');
      setVesselType('Product Tanker (Single Hull)');
      setSlickAreaKm2(16.4);
    } else if (presetName === 'hormuz') {
      setTitle('Incident 204 — Strait of Hormuz Transit Evasion');
      setRegion('Strait of Hormuz (26.30°N, 56.45°E)');
      setCenterLat(26.30);
      setCenterLon(56.45);
      setWindSpeed(6.0);
      setWindDir(180);
      setCurrentSpeed(0.65);
      setCurrentDir(90);
      setVesselName('M/T Gulf Titan');
      setVesselMmsi('636019922');
      setVesselType('VLCC Supertanker');
      setSlickAreaKm2(21.8);
    } else if (presetName === 'redsea') {
      setTitle('Incident 311 — Red Sea Bab-el-Mandeb Discharge');
      setRegion('Southern Red Sea (13.15°N, 43.10°E)');
      setCenterLat(13.15);
      setCenterLon(43.10);
      setWindSpeed(10.5);
      setWindDir(330);
      setCurrentSpeed(0.35);
      setCurrentDir(150);
      setVesselName('MV Phoenix Carrier');
      setVesselMmsi('538004119');
      setVesselType('Bulk Ore Carrier');
      setSlickAreaKm2(14.2);
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

    const radCurrent = (currentDir * Math.PI) / 180;
    const offsetScale = 0.07;
    const approachLat = centerLat - Math.cos(radCurrent) * offsetScale;
    const approachLon = centerLon - Math.sin(radCurrent) * offsetScale;
    const detectMs = new Date(detectionTime).getTime();

    // High cadence 15-minute sampling (14 steps = 3.5 hours) to ensure dense AIS coverage and 0 gap penalty
    const totalSteps = 14;
    const targetPoints = Array.from({ length: totalSteps + 1 }, (_, i) => {
      const frac = i / totalSteps;
      const hoursAgo = (1 - frac) * 3.5;
      const t = new Date(detectMs - hoursAgo * 3_600_000).toISOString();
      const lat = Number((approachLat - 0.15 + frac * 0.28).toFixed(4));
      const lon = Number((approachLon - 0.15 + frac * 0.28).toFixed(4));
      return {
        timestamp: t,
        lat,
        lon,
        sog: 13.0,
        cog: 45,
        heading: 45,
      };
    });

    const passingPoints = Array.from({ length: totalSteps + 1 }, (_, i) => {
      const frac = i / totalSteps;
      const hoursAgo = (1 - frac) * 3.5;
      const t = new Date(detectMs - hoursAgo * 3_600_000).toISOString();
      const lat = Number((centerLat + 0.18 - frac * 0.22).toFixed(4));
      const lon = Number((centerLon - 0.22 + frac * 0.50).toFixed(4));
      return {
        timestamp: t,
        lat,
        lon,
        sog: 18.2,
        cog: 120,
        heading: 120,
      };
    });

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
        oceanForcing: 'CMEMS SMOC Real-Time Analysis',
        windForcing: 'ECMWF IFS 10m Wind Grid',
      },
      tracks: [
        {
          id: 'vessel-primary',
          name: vesselName,
          mmsi: vesselMmsi,
          type: vesselType,
          flag: 'Target Flag State',
          color: '#ef4444',
          points: targetPoints,
        },
        {
          id: 'vessel-distractor',
          name: 'MV Global Transporter',
          mmsi: '538009844',
          type: 'Container Carrier',
          flag: 'Liberia',
          color: '#38bdf8',
          points: passingPoints,
        }
      ],
      candidates: [],
      particles: [],
    };

    onCreateCase(newCase);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(6, 13, 26, 0.96)',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '720px',
        boxShadow: '0 0 50px rgba(0, 242, 254, 0.15)',
        overflow: 'hidden',
        color: '#e2e8f0',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 20, 38, 0.8)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crosshair className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.06em', color: '#fff', display: 'block' }}>
                New incident input
              </span>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                Enter slick location, metocean, and AIS tracks — attribution runs on the backend
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X className="w-5 h-5 hover:text-white" />
          </button>
        </div>

        {/* Quick Presets */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(4, 9, 20, 0.5)' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#f59e0b', letterSpacing: '0.04em' }}>⚡ Quick Presets:</span>
          <button type="button" onClick={() => handleApplyPreset('mumbai')} className="cyber-btn-secondary" style={{ padding: '3px 10px', fontSize: '10px' }}>
            Mumbai Anchorage
          </button>
          <button type="button" onClick={() => handleApplyPreset('hormuz')} className="cyber-btn-secondary" style={{ padding: '3px 10px', fontSize: '10px' }}>
            Strait of Hormuz
          </button>
          <button type="button" onClick={() => handleApplyPreset('redsea')} className="cyber-btn-secondary" style={{ padding: '3px 10px', fontSize: '10px' }}>
            Southern Red Sea
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>
          {/* Section 1: SAR Observation */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#00f2fe', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SAR OBSERVATION & SPILL GEOMETRY</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
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
