# NAUTRACE Backend v2 — Research-Grade Forensic Core

This repository is the backend-first implementation of the NAUTRACE maritime oil-spill investigation concept for SIH 2026 PS 26143.

It is intentionally **not** a UI mockup and it does **not** return hard-coded vessel scores. Every analysis result is computed from:

- spill geometry and detection uncertainty,
- a time-varying met-ocean velocity grid,
- an explicit release-time prior,
- historical AIS trajectories,
- an external algorithm configuration,
- a reproducible ensemble seed derived from the request unless a seed is explicitly supplied.

## 1. Architecture

```text
Client / future frontend
        |
        v
+------------------------------+
| Go Gateway                   |
| - request ID / hashing       |
| - body limits                |
| - bounded concurrency        |
| - retries / timeouts         |
| - health / readiness         |
| - structured logs            |
+------------------------------+
        |
        v
+--------------------------------------------+
| FastAPI Intelligence Service               |
|                                            |
| Spill geometry                             |
|   -> met-ocean interpolation               |
|   -> ensemble Lagrangian hindcast          |
|   -> 50% / 90% origin envelopes            |
|   -> AIS cleaning + reconstruction         |
|   -> time-bisect + KD-tree retrieval       |
|   -> explainable ensemble attribution      |
|   -> Unknown / Non-AIS hypothesis          |
|   -> provenance + input/config hashes      |
+--------------------------------------------+
```

### Responsibility split

**Go** is the system/orchestration layer. It should own public API concerns, capacity protection, service-to-service calls, timeouts, retries, authentication later, job scheduling later, and persistence integration later.

**FastAPI/Python** owns numerical science, geospatial computation, trajectory reconstruction, uncertainty propagation, and model inference.

## 2. No hard-coded analysis result

All scientific parameters are outside the source code in:

`intelligence/config/algorithm.yaml`

The code reads and hashes that configuration for every service startup. Analysis provenance returns the exact config SHA-256.

The current YAML values are **research priors**, not claimed calibrated operational truth. For a final research release, calibrate these parameters against controlled synthetic experiments and retrospective labelled cases.

## 3. Hindcast mathematics

For each ensemble member, NAUTRACE samples:

- an initial position from the observed slick polygon,
- segmentation/geolocation boundary uncertainty,
- a release age from the supplied prior,
- multiplicative current uncertainty,
- multiplicative wind uncertainty,
- windage from a bounded probability distribution.

The velocity model is

```text
v_total = current_scale * u_current
        + u_stokes
        + wind_scale * beta * u_wind
```

The particle path is integrated **backward in time** using fourth-order Runge-Kutta (RK4), not a single displacement equation.

Horizontal stochastic dispersion is added as

```text
sigma_step = sqrt(2 * K_h * |dt|)
```

where `K_h` is the configured horizontal diffusivity.

The ensemble therefore propagates uncertainty in:

- release time,
- slick boundary,
- current forcing,
- wind forcing,
- windage,
- unresolved horizontal dispersion.

## 4. Probabilistic origin region

The backend does not output one fake exact origin point.

It projects ensemble origin endpoints into a local azimuthal-equidistant coordinate system, estimates the empirical covariance, and creates 50% and 90% confidence ellipses using empirical Mahalanobis-distance quantiles.

Returned outputs include:

- origin centroid,
- 50% envelope,
- 90% envelope,
- release-time p05 / median / p95,
- ensemble size,
- failed forcing members,
- spatial bandwidth used by attribution.

## 5. AIS data structures and cleaning

AIS is not treated as a perfect table.

For each vessel:

1. timestamps are sorted,
2. duplicate timestamps are merged,
3. impossible motion is rejected using implied geodesic speed,
4. track quality statistics are recorded,
5. timestamps are stored in sorted arrays for `O(log n)` binary-search interpolation,
6. positions are interpolated geodesically only when the bracketing AIS gap is below the configured maximum.

For candidate retrieval, all cleaned AIS points are:

- sorted globally by time,
- sliced using binary search,
- projected locally,
- indexed with `scipy.spatial.cKDTree`.

This gives a two-stage **temporal + spatial index** instead of scanning every AIS point for every incident.

## 6. Vessel attribution mathematics

For every vessel `v` and hindcast ensemble member `r`, the engine reconstructs vessel position at the sampled release time and computes:

### Spatial likelihood

```text
Ls(v,r) = exp( -d(v,r)^2 / (2 * sigma_x^2) )
```

where `d(v,r)` is the geodesic distance from the reconstructed vessel position to that ensemble origin.

### Temporal / interpolation reliability

AIS observations are not assumed continuous. The bracketing AIS gap is converted to a temporal reliability term and an explicit gap penalty.

### Heading agreement

```text
Lh(v,r) = (1 + cos(delta_heading)) / 2
```

The reference direction is the inferred origin-to-observed-slick bearing. Heading is deliberately a weak feature.

### Additional evidence

- 50% origin-envelope overlap,
- 90% origin-envelope overlap,
- slowdown/course-change behavioural signal,
- AIS continuity,
- cleaned-data quality,
- missing/gap penalty.

The configured research score follows the report-style form:

```text
z(v,r) = log(prior_v)
       + w_s * log(Ls)
       + w_t * log(Lt)
       + w_h * Lh
       + w_50 * overlap50
       + w_90 * overlap90
       + w_b * behavior
       + w_c * continuity
       + w_q * quality
       - w_g * gap_penalty
```

Weights are **not compiled into Python code**. They are loaded from `algorithm.yaml`.

## 7. Explicit Unknown / Non-AIS hypothesis

Unknown is a first-class hypothesis in the same softmax competition as observed vessels.

For every ensemble member:

```text
P(h | E,r) = exp(z_h,r) / sum_j exp(z_j,r)
```

The Unknown hypothesis gains evidence when:

- all observed vessels have weak spatial compatibility,
- AIS interpolation/coverage is missing.

The final output therefore can be:

`UNKNOWN_NON_AIS`

instead of forcing the nearest available ship to rank as a defensible source.

## 8. End-to-end uncertainty propagation

The model does not calculate one score and manufacture a confidence interval around it.

It calculates a hypothesis distribution independently for **every hindcast ensemble member**.

For each vessel it returns:

- p05 compatibility,
- median compatibility,
- p95 compatibility,
- top-rank stability across ensemble members,
- valid ensemble fraction,
- explainable feature decomposition.

Decision thresholds are also external configuration.

## 9. Evidence / provenance

Every analysis response includes:

- analysis version,
- algorithm config version,
- request SHA-256,
- algorithm config SHA-256,
- reproducible random seed,
- source product IDs,
- supplied source SHA-256 hashes,
- exact algorithm stages,
- warnings.

This is the start of the evidence chain required later for an auditable investigation bundle.

## 10. API

### Public gateway

```text
POST /api/v1/analyze
GET  /healthz
GET  /readyz
```

### Internal scientific service

```text
POST /internal/v1/analyze
GET  /healthz
GET  /readyz
```

The public gateway returns the intelligence result together with a gateway request ID and request SHA-256.

## 11. Dynamic input contract

`POST /api/v1/analyze` receives:

- spill polygon,
- detection timestamp,
- oil probability,
- boundary uncertainty,
- release-time probability prior,
- full time-varying current/wind/Stokes grid,
- historical AIS tracks,
- optional ensemble size,
- optional random seed.

No vessel, origin, wind/current vector, score, or decision is baked into application code.

See:

- `examples/known_source_case.json`
- `examples/unknown_source_case.json`

Those are test fixtures only, not runtime defaults.

## 12. Run

### Local FastAPI service

```bash
cd intelligence
python -m pip install -r requirements.txt
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Local Go gateway

```bash
cd gateway
INTELLIGENCE_URL=http://127.0.0.1:8000 go run ./cmd/server
```

### Analyze example

```bash
curl -sS -X POST http://127.0.0.1:8080/api/v1/analyze \
  -H 'Content-Type: application/json' \
  --data-binary @examples/known_source_case.json
```

### Docker

```bash
docker compose up --build
```

## 13. Tests

```bash
make test
```

Current tests cover:

- AIS duplicate removal,
- impossible-motion rejection,
- bounded geodesic interpolation,
- known-source ranking,
- Unknown/Non-AIS decision,
- Go gateway health and request validation.

## 14. What is intentionally not faked

This repository does **not** contain a pretend SAR neural network with random weights.

The forensic engine currently expects a detected spill polygon and oil probability as upstream evidence. The next ML milestone should be a separately trained, versioned Sentinel-1 segmentation artifact (U-Net baseline / SegFormer candidate) with real held-out IoU, Dice, precision, recall and look-alike false-positive evaluation.

Likewise, the internal RK4 ensemble engine is a mathematically real research implementation, but the project research recommends OpenDrift/OpenOil as the operational trajectory engine. A production milestone should add an OpenDrift adapter while preserving this interface and use GNOME as an independent validation engine.

## 15. Next backend milestones

1. Sentinel-1 preprocessing + model-serving service with versioned model artifacts.
2. Copernicus Marine/ECMWF provider adapters instead of posting grids inline.
3. OpenDrift/OpenOil engine adapter.
4. PostGIS case/evidence repository.
5. Async analysis jobs and durable queue.
6. Attribution-parameter calibration pipeline using controlled source-injection experiments.
7. PDF/GeoJSON evidence bundle and signature/hash manifest.
8. GNOME cross-validation harness.

## 16. Research validation harness

Labelled cases can be evaluated without touching the API code:

```bash
cd intelligence
PYTHONPATH=. python scripts/benchmark_cases.py \
  --cases ../examples \
  --labels ../examples/benchmark_labels.json
```

The harness reports the metrics recommended for attribution validation:

- Rank@1
- Rank@3
- Mean Reciprocal Rank (MRR)
- Unknown/Non-AIS accuracy

The included two-case fixture is only a software regression test. Do not present its 100% result as scientific accuracy; build a large controlled source-injection benchmark before making performance claims.
