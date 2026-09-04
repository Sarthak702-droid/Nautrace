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

    // Compute inferred backward origin displacement from wind and current
    const radCurrent = (currentDir * Math.PI) / 180;
    const offsetScale = 0.08;
    const originLat = centerLat - Math.cos(radCurrent) * offsetScale;
    const originLon = centerLon - Math.sin(radCurrent) * offsetScale;

    // Build culprit vessel trajectory passing through origin
    const culpritPoints = [
      { timestamp: '2026-09-04T02:00:00Z', lat: originLat - 0.12, lon: originLon - 0.12, sog: 13.5, cog: 45, heading: 45 },
      { timestamp: '2026-09-04T03:00:00Z', lat: originLat - 0.06, lon: originLon - 0.06, sog: 13.2, cog: 45, heading: 45 },
      { timestamp: '2026-09-04T04:00:00Z', lat: originLat, lon: originLon, sog: 12.0, cog: 46, heading: 46 }, // Discharge Window CPA
      { timestamp: '2026-09-04T05:00:00Z', lat: originLat + 0.07, lon: originLon + 0.07, sog: 13.4, cog: 45, heading: 45 },
      { timestamp: '2026-09-04T05:30:00Z', lat: originLat + 0.11, lon: originLon + 0.11, sog: 13.8, cog: 45, heading: 45 }
    ];

    // Build innocent passing vessel trajectory far away
    const innocentPoints = [
      { timestamp: '2026-09-04T02:00:00Z', lat: centerLat + 0.15, lon: centerLon - 0.20, sog: 18.0, cog: 120, heading: 120 },
      { timestamp: '2026-09-04T03:00:00Z', lat: centerLat + 0.10, lon: centerLon - 0.05, sog: 17.8, cog: 120, heading: 120 },
      { timestamp: '2026-09-04T04:00:00Z', lat: centerLat + 0.05, lon: centerLon + 0.10, sog: 18.1, cog: 120, heading: 120 },
      { timestamp: '2026-09-04T05:00:00Z', lat: centerLat, lon: centerLon + 0.25, sog: 18.2, cog: 120, heading: 120 },
      { timestamp: '2026-09-04T05:30:00Z', lat: centerLat - 0.03, lon: centerLon + 0.32, sog: 18.0, cog: 120, heading: 120 }
    ];

    const newCase: IncidentCase = {
      id: caseId,
      title: title,
      region: region,
      detectionTime: detectionTime,
      slickPolygon: slickPolygon,
      slickAreaKm2: Number(slickAreaKm2),
      oilProbability: Number(oilProbability),
      boundaryUncertaintyM: 40.0,
      windSpeedMps: Number(windSpeed),
      windDirDeg: Number(windDir),
      currentSpeedMps: Number(currentSpeed),
      currentDirDeg: Number(currentDir),
      origin50: {
        center: { lat: Number(originLat.toFixed(4)), lon: Number(originLon.toFixed(4)) },
        semiMajorKm: 3.2,
        semiMinorKm: 1.6,
        rotationDeg: currentDir
      },
      origin90: {
        center: { lat: Number(originLat.toFixed(4)), lon: Number(originLon.toFixed(4)) },
        semiMajorKm: 6.4,
        semiMinorKm: 3.5,
        rotationDeg: currentDir
      },
      provenance: {
        rawProductId: `MANUAL_S1_TEST_${caseId}`,
        requestSha256: `sha256_${Date.now().toString(16)}`,
        configSha256: '39ba708ee737ac01241f8dd6b895c1f89d1115e0c88fc487fee4039147c04b0c',
        algorithmVersion: 'nautrace-hindcast-v2.1-rk4',
        oceanForcing: 'Copernicus Marine SMOC Ingested',
        windForcing: 'ECMWF High-Res 10m Ingested'
      },
      tracks: [
        {
          id: `target-${caseId}`,
          name: vesselName,
          mmsi: vesselMmsi,
          type: vesselType,
          flag: 'Marshall Islands',
          color: '#ef4444',
          points: culpritPoints
        },
        {
          id: `passing-${caseId}`,
          name: 'MV Global Transporter',
          mmsi: '538009981',
          type: 'Container Carrier',
          flag: 'Singapore',
          color: '#38bdf8',
          points: innocentPoints
        }
      ],
      candidates: [
        {
          id: `target-${caseId}`,
          name: `${vesselName} (MMSI ${vesselMmsi})`,
          type: vesselType,
          score: 0.954,
          p05: 0.89,
          p95: 0.99,
          closestApproachKm: 0.35,
          temporalOffsetMin: -8.0,
          trajectoryCompatibility: 'Direct Origin Intersect (98% Correlation)',
          aisContinuity: 'Continuous AIS Stream',
          subscores: {
            spatial: 97,
            temporal: 95,
            heading: 94,
            originOverlap: 98,
            aisContinuity: 99,
            behaviourAnomaly: 88,
            ensembleStability: 96
          }
        },
        {
          id: `passing-${caseId}`,
          name: 'MV Global Transporter (MMSI 538009981)',
          type: 'Container Carrier',
          score: 0.112,
          p05: 0.03,
          p95: 0.18,
          closestApproachKm: 24.6,
          temporalOffsetMin: 110.0,
          trajectoryCompatibility: 'Exonerated (Beyond 90% Horizon)',
          aisContinuity: 'Normal Stream',
          subscores: {
            spatial: 11,
            temporal: 9,
            heading: 14,
            originOverlap: 5,
            aisContinuity: 98,
            behaviourAnomaly: 8,
            ensembleStability: 12
          }
        },
        {
          id: 'unknown-source',
          name: 'UNKNOWN / Non-AIS Alternative Source',
          type: 'Unobserved Dark Vessel',
          score: 0.046,
          p05: 0.01,
          p95: 0.09,
          closestApproachKm: 0,
          temporalOffsetMin: 0,
          trajectoryCompatibility: 'Low Prior Residual',
          aisContinuity: 'Exonerated by Confirmed Target Intersect',
          isUnknownSource: true,
          subscores: {
            spatial: 10,
            temporal: 8,
            heading: 10,
            originOverlap: 10,
            aisContinuity: 85,
            behaviourAnomaly: 5,
            ensembleStability: 8
          }
        }
      ],
      particles: [
        {
          id: 1,
          trajectory: [
            { t: '2026-09-04T05:30:00Z', lat: centerLat, lon: centerLon },
            { t: '2026-09-04T04:30:00Z', lat: centerLat - 0.02, lon: centerLon - 0.02 },
            { t: '2026-09-04T03:30:00Z', lat: centerLat - 0.05, lon: centerLon - 0.05 },
            { t: '2026-09-04T02:30:00Z', lat: Number(originLat.toFixed(4)), lon: Number(originLon.toFixed(4)) }
          ]
        }
      ]
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
              <div className="modal-title">Ingest Custom Incident Case (Manual Test)</div>
              <div className="modal-subtitle">Configure custom SAR observations, metocean forcing, and suspect vessels</div>
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
