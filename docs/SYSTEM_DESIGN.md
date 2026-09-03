# NAUTRACE Backend System Design

## Design goals

1. Scientific reproducibility: same inputs + same algorithm config + same seed => same output.
2. Provider independence: Sentinel, met-ocean and AIS providers can change without rewriting attribution logic.
3. Evidence traceability: every external input and model/config artifact is hashable.
4. Long-running analysis isolation: scientific compute is separated from the public API gateway.
5. Fail-safe attribution: Unknown/Non-AIS remains a first-class outcome.
6. Scalable data access: temporal indexes + spatial indexes avoid brute-force AIS scans.

## Logical architecture

```text
                           +-------------------+
                           |  Client / UI      |
                           +---------+---------+
                                     |
                                     v
+-------------------------------------------------------------------+
| Go Edge / Orchestration Layer                                     |
| request-id | auth later | schema guard | limits | retries | logs   |
| bounded concurrency | job API later | idempotency/request hash     |
+------------------------------+------------------------------------+
                               |
                               v
+-------------------------------------------------------------------+
| FastAPI Scientific Service                                        |
|                                                                   |
| Domain validation                                                 |
|   -> spill geometry                                               |
|   -> forcing field interpolation                                  |
|   -> ensemble Lagrangian hindcast                                 |
|   -> probabilistic origin envelope                                |
|   -> AIS normalization                                            |
|   -> trajectory interpolation                                     |
|   -> spatio-temporal candidate retrieval                          |
|   -> ensemble attribution + explicit Unknown hypothesis           |
|   -> evidence/provenance manifest                                 |
+-------------------------------------------------------------------+
```

## Production extension

The next production topology should be:

```text
                    +------------------+
                    | Go API Gateway   |
                    +--------+---------+
                             |
                     create analysis job
                             |
                             v
                    +------------------+
                    | PostgreSQL       |
                    | + PostGIS        |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    | Durable Queue    |
                    | Redis Streams /  |
                    | NATS JetStream   |
                    +--------+---------+
                             |
                   +---------+----------+
                   | Scientific Workers |
                   | FastAPI/Python     |
                   +---------+----------+
                             |
              +--------------+--------------+
              |                             |
              v                             v
        Object storage                 PostGIS results
      raster/model/evidence          polygons/tracks/cases
```

For the SIH MVP, the current repository intentionally keeps the compute request synchronous so the algorithm can be verified first. The Go gateway already contains bounded concurrency, dependency readiness, retry and timeout controls, so it can be moved behind a durable job coordinator without changing the scientific service contract.

## Domain boundaries

### 1. Detection evidence

The forensic engine consumes a spill polygon, oil probability, boundary uncertainty, acquisition time and source identity. A future Sentinel-1 model-serving service should produce that contract.

### 2. Met-ocean forcing

The numerical engine depends on a `MetoceanField` abstraction, not a specific vendor. The current implementation uses an inline regular grid. Provider adapters can later hydrate the same domain structure from Copernicus Marine, HYCOM or other data.

### 3. AIS

Raw AIS is normalized before attribution. Attribution never directly trusts raw provider messages.

### 4. Attribution

Attribution operates only on reconstructed trajectories + probabilistic origin ensemble. It is intentionally independent of how the satellite, AIS or forcing data was obtained.

## Complexity

Let:

- `N` = total AIS points in the incident dataset,
- `V` = number of vessels,
- `R` = hindcast ensemble members,
- `C` = candidate vessels after indexing.

AIS preparation:

- sort points globally: `O(N log N)`
- per-track sorting/cleaning: approximately `O(N log N)` total

Candidate retrieval:

- temporal slice via binary search: `O(log N)`
- KD-tree construction on sliced points: `O(M log M)` where `M << N`
- radius query: approximately `O(log M + k)`

Final attribution:

- trajectory interpolation uses binary search per vessel/member: `O(C * R * log n_v)`

This is materially better than comparing every raw AIS point with every hindcast particle (`O(N * R)`).

## Consistency and reproducibility

The scientific request is canonicalized and SHA-256 hashed.

If a random seed is not provided, a deterministic seed is derived from the request hash. This gives reproducibility without a global fixed seed.

Returned provenance contains:

- request hash,
- algorithm-config hash,
- config version,
- source IDs,
- supplied source hashes,
- algorithm version,
- random seed.

## Failure policy

### Forcing coverage failure

Hindcast members that leave available met-ocean coverage are counted as failed. The analysis fails if successful ensemble size or failed-member ratio violates externally configured thresholds.

### AIS corruption

Individual tracks that collapse below two valid points after cleaning are skipped and recorded as warnings instead of crashing the whole incident.

### Missing AIS evidence

Missing or weak AIS evidence strengthens the explicit Unknown/Non-AIS hypothesis. The backend does not fall back to “nearest vessel wins.”

## Security / operational notes

For production government deployment:

- authenticate clients at the Go layer,
- use mTLS between Go and Python services,
- store secrets only in a secret manager/environment, never config files,
- sign evidence manifests,
- use immutable object storage for raw source artifacts,
- enable database row-level/audit policies,
- keep analyst decisions as append-only audit events,
- do not expose raw provider credentials to scientific worker jobs.
