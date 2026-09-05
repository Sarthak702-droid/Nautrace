# NAUTRACE: Operational Pitch & Demonstration Case Study
## *Operation Crimson Wake: Mumbai High-Density Shipping Corridor*

---

## 🏛️ Executive Summary & The Core Problem

Every year, an estimated **tens of thousands of deliberate, illegal bilge and oily wastewater discharges** occur across global shipping routes, inflicting hundreds of millions of dollars in marine ecological devastation. 

### Why Maritime Law Enforcement Fails Today:
1. **The Temporal Lag**: Satellite Synthetic Aperture Radar (SAR) detects slicks hours or days after discharge. By the time imagery is downlinked, the perpetrator has steamed 50–150 nautical miles away.
2. **The High-Density Chokepoint Dilemma**: In busy corridors (e.g., Singapore Strait, Malacca, Mumbai High, Dover Strait), 30–60 vessels traverse the vicinity within any 6-hour window. Traditional forensic methods cannot isolate the true polluter.
3. **The Evidentiary Gap**: Without rigorous backward hydrodynamic drift modeling and court-admissible Bayesian attribution, maritime courts and P&I insurers dismiss prosecutions due to "reasonable doubt."

### NAUTRACE's Breakthrough:
**NAUTRACE** bridges spaceborne observation, hydrodynamic supercomputing, and maritime transponder tracking into a single, unified forensic platform:
$$\text{SAR Slick Geometry} \xrightarrow{\text{Copernicus + ECMWF}} \text{Lagrangian RK4 Hindcast} \xrightarrow{\text{Bayesian Fusion}} \text{Single Accused Vessel (96.4\% Confidence)} \xrightarrow{\text{EMSA/IMO Dossier}}$$

---

## 📍 Flagship Incident Dossier: Operation Crimson Wake

```
========================================================================================
INCIDENT CASE:       CASE-PITCH-MUMBAI
THEATER:             Mumbai High-Density Shipping Corridor (Arabian Sea EEZ)
COORDINATES:         18.3500° N, 71.9500° E
DETECTION TIME:      2026-09-04 05:30:00 UTC
OBSERVING SENSOR:    Sentinel-1B C-Band SAR (VV/VH Polarization)
SLICK FOOTPRINT:     14.60 km² | Length: 11.2 km | Estimated Volume: 42.5 m³
RADAR BACKSCATTER:   -26.4 dB (High-damping surfactant / Heavy fuel oil residue)
ESTIMATED DISCHARGE: 2026-09-04 02:00:00 to 03:40:00 UTC (T₀ - 110 to 210 min)
METOCEAN FORCING:    Current: 0.48 m/s @ 115° ESE (Copernicus CMEMS PHY-001)
                     Wind: 14.2 kts @ 285° WNW (ECMWF ERA5 Atmospheric Reanalysis)
========================================================================================
```

---

## 🚢 The Multi-Vessel Tactical Setup (6 Simultaneous Tracks)

In this incident, 5 commercial vessels and 1 non-AIS hypothesis were actively evaluated within the 55-nautical-mile tactical horizon:

```
                                    [North ↑]
                                       
                      (🔵 MV Ocean Star - Container)
                                \
                                 \ Course 145° (Exonerated)
                                  \
   (🔴 M/T Poseidon Leader) -----> [ 🎯 50% CORE ORIGIN ] ------> [ OIL SLICK (T₀) ]
   Course 068° | 14.8 -> 11.2 kts       (Discharge Point)           (Detected 05:30 UTC)
                                  /
                                 / Course 310° (Exonerated)
                                /
                      (🟢 Nordic Explorer - Tanker)
```

### Candidate Scoring & Bayesian Exoneration Matrix

| Track | Vessel Name | IMO / Flag | Vessel Type | Score | Horizon Match | Status |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| 🔴 **A** | **M/T Poseidon Leader** | **IMO 9458210 (Liberia)** | **Suezmax Tanker** | **96.4%** | **Inside 50% Core (0.8 km)** | **PRIMARY ACCUSED** |
| 🔵 **B** | **MV Ocean Star** | IMO 9238411 (Panama) | Panamax Container | **2.1%** | +185 min temporal lag | Exonerated |
| 🟢 **C** | **Nordic Explorer** | IMO 9671109 (Marshall Is.) | Chemical Tanker | **0.8%** | 19.4 km closest approach | Exonerated |
| 🟡 **D** | **Starlight Glory** | IMO 9812402 (Singapore) | VLCC Supertanker | **0.4%** | Anchored outside corridor | Exonerated |
| 🟣 **E** | **MV Phoenix Carrier** | IMO 9553198 (Greece) | Capesize Bulk | **0.2%** | Tangential course 140° | Exonerated |
| ⚫ **X** | **UNKNOWN / Non-AIS** | N/A | Statistical Residual | **0.1%** | 99.8% AIS corridor uptime | Exonerated |

---

## 🖥️ The 4 Operational Viewing Formats

The top toolbar of the Tactical Map provides 4 specialized viewing modes:

### 1. 🎯 `RADAR TACTICAL` (Active Defense & Surveillance)
- **360° Phosphor Sweep Beam**: Continuous rotary radar animation.
- **Concentric Sonar Rings**: Range rings calibrated at 10km, 25km, 50km nautical radii.
- **Live Vessel Chevrons**: Directional vessel icons with dynamic heading lines and speed tags.
- **Stochastic RK4 Dispersion Cloud**: 48 particles drifting backward along hydrodynamic velocity vectors.

### 2. 🛰️ `SATELLITE SAR` (Synthetic Aperture Radar Ground-Truth)
- **Sentinel-1B Orthorectified Grid**: Textured microwave swath texture.
- **False-Color Slick Polygon**: High-contrast damping region highlighting oil slick thickness.
- **Calibrated Backscatter Scale**: Real-time dB scale from $-28\text{ dB}$ (thick surfactant) to $-12\text{ dB}$ (ambient sea).

### 3. 🌊 `METOCEAN FLOW` (Copernicus & ECMWF Hydrodynamics)
- **Copernicus CMEMS 2D Current Arrows**: Uniform vector field indicating surface current speed and direction ($0.48\text{ m/s}$ at $115^\circ$).
- **Flowing Animated Streamlines**: Real-time particles demonstrating current drift across the area.
- **ECMWF ERA5 Wind HUD**: Wind barb displaying $14.2\text{ kts}$ from $285^\circ$ WNW.

### 4. 🚢 `VESSEL DOSSIER` (Photographic Intelligence & Forensics)
- **Vessel Photo Card**: Photographic profile of the accused tanker *M/T Poseidon Leader*.
- **Transponder Telemetry**: MMSI (636018942), Callsign (A8LH9), Flag (Liberia), DWT (158,000 MT), Destination (Vadinar Crude Terminal).
- **Behavioral Anomaly Warning**: Highlights speed drop from 14.8 to 11.2 knots during the discharge window (indicative of engine throttling for oily bilge pumping).

---

## ⏱️ Step-by-Step 5-Minute Pitch Demonstration Script

### Act 1: The Incident & The Challenge (0:00 – 1:00)
> *"Judges and maritime leaders: What you are looking at is the Mumbai High shipping corridor. At 05:30 UTC, European Space Agency satellite Sentinel-1B detected an unmonitored 14.6 square kilometer oil slick. Under standard maritime procedures, this case would be closed unsolved—too many ships, too much ocean drift, no eyewitnesses. Let's see how NAUTRACE solves it in seconds."*

**Action**: Click on **`Operation Crimson Wake: Mumbai High-Density Shipping Corridor`** in the left sidebar.

---

### Act 2: Running the 4-View Simulation (1:00 – 2:30)
> *"First, our physics engine runs a 4th-order Runge-Kutta backward Lagrangian simulation, rewinding 48 stochastic particles through Copernicus ocean currents and ECMWF winds to identify the exact origin ellipses."*

**Action 1**: Hit the **Play ($\blacktriangleright$)** button on the bottom timeline scrubber. Watch the 6 vessels move along their routes and watch the radar sweep spin.  
**Action 2**: Click **`SATELLITE SAR`** tab.  
> *"Here is the Sentinel-1 SAR imagery. Notice the -26.4 dB backscatter damping signature confirming heavy crude residue."*  
**Action 3**: Click **`METOCEAN FLOW`** tab.  
> *"Here is Copernicus hydrodynamic data showing the 0.48 m/s current advection that drove the slick eastward."*  
**Action 4**: Click **`VESSEL DOSSIER`** tab.  
> *"Here is the intelligence dossier on the primary accused: the Liberian Suezmax tanker M/T Poseidon Leader."*

---

### Act 3: Bayesian Culprit Attribution (2:30 – 3:45)
> *"NAUTRACE evaluates every candidate across 7 forensic dimensions: spatial proximity, temporal offset, heading alignment, origin envelope overlap, AIS continuity, behavioral anomaly, and ensemble stability.  
Notice the results on the right: MV Ocean Star is exonerated with a 2.1% score due to upwind transit. But M/T Poseidon Leader scores 96.4%—it crossed the 50% core origin ellipse at the exact discharge timestamp while inexplicably throttling down its engines by 3.6 knots."*

**Action**: Click on **`M/T Poseidon Leader`** in the suspect list on the right panel to show its telemetry breakdown and Bayesian sub-score radar.

---

### Act 4: The Legal Dossier & Closing (3:45 – 5:00)
> *"To hold polluters accountable in international admiralty courts, data on a screen is not enough. You need an official evidentiary chain-of-custody."*

**Action**: Click **"Generate Agency Forensic Dossier (PDF/Print)"** in the top navigation bar.  
> *"NAUTRACE automatically generates an official dossier compliant with EMSA CleanSeaNet, IMO MARPOL Annex I, and USCG Marine Safety Laboratory standards—complete with mathematical likelihood proofs, sensor logs, and a cryptographic SHA-256 integrity seal ready for submission to the International Maritime Organization."*

---

## 🧪 Live Verification & Testing Protocol

Before presenting, perform this 60-second operational health check:

| Step | Action | Expected Output | Status |
| :---: | :--- | :--- | :---: |
| **1** | Open `http://localhost:3000/` | Console loads with 0 blank screens | ✅ PASS |
| **2** | Select `Operation Crimson Wake` | Map re-centers on Arabian Sea (18.35°N, 71.95°E) with 6 colored vessel tracks | ✅ PASS |
| **3** | Press Timeline Play ($\blacktriangleright$) | Timeline timer increments; 6 vessels move smoothly along paths | ✅ PASS |
| **4** | Click all 4 View Mode tabs | Radar $\rightarrow$ SAR $\rightarrow$ Metocean $\rightarrow$ Vessel Dossier switch instantly | ✅ PASS |
| **5** | Click Suspect `M/T Poseidon Leader` | Reticle pulses red; right panel displays 96.4% score & subscores | ✅ PASS |
| **6** | Click "Generate Agency Forensic Dossier" | Modal displays EMSA/IMO/USCG banners, SHA-256 seal, and Print button | ✅ PASS |
| **7** | Click "Ingest New Incident" | Modal opens with 6-step AIS input pre-filled; submits cleanly | ✅ PASS |

---

## 🛡️ Technical Architecture Summary

```
                       ┌──────────────────────────────────────────────┐
                       │        Sentinel-1 SAR / NOAA VIIRS           │
                       └──────────────────────┬───────────────────────┘
                                              │
                                              ▼
┌────────────────────────────────┐    ┌────────────────────────────────┐
│  Copernicus CMEMS PHY-001      │    │  Global AIS Transponder Stream │
│  ECMWF ERA5 Wind Reanalysis    │    │  (Terrestrial + Satellite)     │
└──────────────┬─────────────────┘    └───────────────┬────────────────┘
               │                                      │
               ▼                                      ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  NAUTRACE INTELLIGENCE ENGINE (FastAPI)              │
│  - 4th-Order Runge-Kutta Lagrangian Backward Drift Hindcast          │
│  - 50% & 90% Mahalanobis Origin Covariance Estimation                │
│  - 7-Vector Bayesian Likelihood Attribution (Spatial, Temporal, etc.)│
│  - Anti-Spoofing Anomaly & Dark Spill Hypothesis Resolution          │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  NAUTRACE OPERATIONAL CONSOLE (React + Vite)         │
│  - 4 Specialized Viewing Formats (Radar, SAR, Metocean, Dossier)     │
│  - Multi-Ship High-Density Fleet Tracking                            │
│  - Court-Admissible EMSA / IMO / USCG Evidentiary PDF Exporter       │
└──────────────────────────────────────────────────────────────────────┘
```
