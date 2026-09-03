import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  incidents: defineTable({
    incidentCode: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    aoiGeoJSON: v.any(),
    bbox: v.object({
      west: v.number(),
      south: v.number(),
      east: v.number(),
      north: v.number(),
    }),
    detectionTime: v.string(),
    hindcastHours: v.number(),
    forecastHours: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_incidentCode", ["incidentCode"])
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  dataAssets: defineTable({
    incidentId: v.id("incidents"),
    assetType: v.string(),
    provider: v.string(),
    datasetId: v.optional(v.string()),
    sourceReference: v.optional(v.string()),
    storageProvider: v.string(),
    storageKey: v.optional(v.string()),
    sha256: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    originalName: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    bbox: v.optional(v.object({
      west: v.number(),
      south: v.number(),
      east: v.number(),
      north: v.number(),
    })),
    variables: v.optional(v.array(v.string())),
    ingestionStatus: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_incidentId", ["incidentId"])
    .index("by_incidentId_assetType", ["incidentId", "assetType"])
    .index("by_sha256", ["sha256"]),

  analysisJobs: defineTable({
    incidentId: v.id("incidents"),
    jobType: v.string(),
    requestId: v.string(),
    idempotencyKey: v.string(),
    status: v.string(),
    progress: v.optional(v.number()),
    algorithmVersion: v.optional(v.string()),
    modelVersion: v.optional(v.string()),
    inputHash: v.optional(v.string()),
    outputHash: v.optional(v.string()),
    createdAt: v.string(),
    startedAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    attemptCount: v.number(),
    errorCode: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  })
    .index("by_incidentId", ["incidentId"])
    .index("by_status", ["status"])
    .index("by_incidentId_jobType", ["incidentId", "jobType"])
    .index("by_idempotencyKey", ["idempotencyKey"]),

  detections: defineTable({
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    sarAssetId: v.optional(v.id("dataAssets")),
    modelId: v.optional(v.string()),
    modelVersion: v.optional(v.string()),
    oilProbability: v.number(),
    classification: v.string(),
    lookAlikeRisk: v.optional(v.number()),
    spillPolygon: v.any(),
    centroid: v.any(),
    areaKm2: v.optional(v.number()),
    perimeterKm: v.optional(v.number()),
    probabilityRasterRef: v.optional(v.string()),
    maskRef: v.optional(v.string()),
  })
    .index("by_incidentId", ["incidentId"])
    .index("by_jobId", ["jobId"]),

  hindcastRuns: defineTable({
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    detectionId: v.optional(v.id("detections")),
    engine: v.string(),
    engineVersion: v.string(),
    ensembleSize: v.number(),
    algorithmVersion: v.string(),
    configHash: v.string(),
    randomSeed: v.number(),
    successfulMembers: v.number(),
    failedMembers: v.number(),
    particleArtifactRef: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_incidentId", ["incidentId"])
    .index("by_jobId", ["jobId"]),

  originHypotheses: defineTable({
    hindcastRunId: v.id("hindcastRuns"),
    releaseTimeP05: v.string(),
    releaseTimeMedian: v.string(),
    releaseTimeP95: v.string(),
    origin50GeoJSON: v.any(),
    origin90GeoJSON: v.any(),
    centroid: v.any(),
    spatialBandwidthKm: v.optional(v.number()),
    createdAt: v.string(),
  })
    .index("by_hindcastRunId", ["hindcastRunId"]),

  aisReconstructions: defineTable({
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    aisAssetId: v.optional(v.id("dataAssets")),
    inputPointCount: v.number(),
    keptPointCount: v.number(),
    removedPointCount: v.number(),
    vesselCount: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    warnings: v.optional(v.array(v.string())),
    artifactRef: v.optional(v.string()),
  })
    .index("by_incidentId", ["incidentId"])
    .index("by_jobId", ["jobId"]),

  attributionRuns: defineTable({
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    hindcastRunId: v.id("hindcastRuns"),
    aisReconstructionId: v.id("aisReconstructions"),
    algorithmVersion: v.string(),
    configHash: v.string(),
    resultType: v.string(),
    unknownP05: v.optional(v.number()),
    unknownMedian: v.optional(v.number()),
    unknownP95: v.optional(v.number()),
    validEnsembleFraction: v.number(),
    createdAt: v.string(),
  })
    .index("by_incidentId", ["incidentId"])
    .index("by_jobId", ["jobId"]),

  vesselCandidates: defineTable({
    attributionRunId: v.id("attributionRuns"),
    MMSI: v.string(),
    vesselName: v.optional(v.string()),
    vesselType: v.optional(v.string()),
    rank: v.number(),
    compatibilityP05: v.number(),
    compatibilityMedian: v.number(),
    compatibilityP95: v.number(),
    rankStability: v.optional(v.number()),
    minimumOriginDistanceKm: v.optional(v.number()),
    scoreBreakdown: v.any(),
    explanations: v.optional(v.array(v.string())),
  })
    .index("by_attributionRunId", ["attributionRunId"])
    .index("by_attributionRunId_rank", ["attributionRunId", "rank"]),

  modelRegistry: defineTable({
    modelId: v.string(),
    task: v.string(),
    version: v.string(),
    architecture: v.string(),
    stage: v.string(),
    artifactProvider: v.optional(v.string()),
    artifactReference: v.optional(v.string()),
    sha256: v.optional(v.string()),
    inputChannels: v.optional(v.number()),
    inputShape: v.optional(v.array(v.number())),
    decisionThreshold: v.optional(v.number()),
    trainingDatasetIds: v.optional(v.array(v.string())),
    metrics: v.optional(v.any()),
    preprocessingConfig: v.optional(v.any()),
  })
    .index("by_task_stage", ["task", "stage"])
    .index("by_modelId_version", ["modelId", "version"]),

  datasetRegistry: defineTable({
    datasetId: v.string(),
    name: v.string(),
    version: v.string(),
    source: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    task: v.string(),
    description: v.optional(v.string()),
    trainCount: v.optional(v.number()),
    validationCount: v.optional(v.number()),
    testCount: v.optional(v.number()),
    manifestReference: v.optional(v.string()),
    sha256: v.optional(v.string()),
    status: v.string(),
  })
    .index("by_datasetId_version", ["datasetId", "version"]),

  forecastRuns: defineTable({
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    engine: v.string(),
    algorithmVersion: v.string(),
    configHash: v.string(),
    forecastHours: v.number(),
    status: v.string(),
    forecastSummary: v.optional(v.any()),
    artifactRef: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_incidentId", ["incidentId"])
    .index("by_jobId", ["jobId"]),

  reports: defineTable({
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    reportType: v.string(),
    status: v.string(),
    artifactReference: v.optional(v.string()),
    sha256: v.optional(v.string()),
    generatedAt: v.optional(v.string()),
  })
    .index("by_incidentId", ["incidentId"])
    .index("by_jobId", ["jobId"]),

  auditEvents: defineTable({
    incidentId: v.optional(v.id("incidents")),
    jobId: v.optional(v.id("analysisJobs")),
    action: v.string(),
    details: v.optional(v.any()),
    createdAt: v.string(),
  })
    .index("by_incidentId", ["incidentId"])
    .index("by_jobId", ["jobId"])
    .index("by_createdAt", ["createdAt"]),
});
