"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.default = (0, server_1.defineSchema)({
    incidents: (0, server_1.defineTable)({
        incidentCode: values_1.v.string(),
        name: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        status: values_1.v.string(),
        aoiGeoJSON: values_1.v.any(),
        bbox: values_1.v.object({
            west: values_1.v.number(),
            south: values_1.v.number(),
            east: values_1.v.number(),
            north: values_1.v.number(),
        }),
        detectionTime: values_1.v.string(),
        hindcastHours: values_1.v.number(),
        forecastHours: values_1.v.number(),
        createdAt: values_1.v.string(),
        updatedAt: values_1.v.string(),
    })
        .index("by_incidentCode", ["incidentCode"])
        .index("by_status", ["status"])
        .index("by_createdAt", ["createdAt"]),
    dataAssets: (0, server_1.defineTable)({
        incidentId: values_1.v.id("incidents"),
        assetType: values_1.v.string(),
        provider: values_1.v.string(),
        datasetId: values_1.v.optional(values_1.v.string()),
        sourceReference: values_1.v.optional(values_1.v.string()),
        storageProvider: values_1.v.string(),
        storageKey: values_1.v.optional(values_1.v.string()),
        sha256: values_1.v.optional(values_1.v.string()),
        fileSize: values_1.v.optional(values_1.v.number()),
        originalName: values_1.v.optional(values_1.v.string()),
        startTime: values_1.v.optional(values_1.v.string()),
        endTime: values_1.v.optional(values_1.v.string()),
        bbox: values_1.v.optional(values_1.v.object({
            west: values_1.v.number(),
            south: values_1.v.number(),
            east: values_1.v.number(),
            north: values_1.v.number(),
        })),
        variables: values_1.v.optional(values_1.v.array(values_1.v.string())),
        ingestionStatus: values_1.v.string(),
        metadata: values_1.v.optional(values_1.v.any()),
        createdAt: values_1.v.string(),
        updatedAt: values_1.v.string(),
    })
        .index("by_incidentId", ["incidentId"])
        .index("by_incidentId_assetType", ["incidentId", "assetType"])
        .index("by_sha256", ["sha256"]),
    analysisJobs: (0, server_1.defineTable)({
        incidentId: values_1.v.id("incidents"),
        jobType: values_1.v.string(),
        requestId: values_1.v.string(),
        idempotencyKey: values_1.v.string(),
        status: values_1.v.string(),
        progress: values_1.v.optional(values_1.v.number()),
        algorithmVersion: values_1.v.optional(values_1.v.string()),
        modelVersion: values_1.v.optional(values_1.v.string()),
        inputHash: values_1.v.optional(values_1.v.string()),
        outputHash: values_1.v.optional(values_1.v.string()),
        createdAt: values_1.v.string(),
        startedAt: values_1.v.optional(values_1.v.string()),
        completedAt: values_1.v.optional(values_1.v.string()),
        attemptCount: values_1.v.number(),
        errorCode: values_1.v.optional(values_1.v.string()),
        errorMessage: values_1.v.optional(values_1.v.string()),
    })
        .index("by_incidentId", ["incidentId"])
        .index("by_status", ["status"])
        .index("by_incidentId_jobType", ["incidentId", "jobType"])
        .index("by_idempotencyKey", ["idempotencyKey"]),
    detections: (0, server_1.defineTable)({
        incidentId: values_1.v.id("incidents"),
        jobId: values_1.v.id("analysisJobs"),
        sarAssetId: values_1.v.optional(values_1.v.id("dataAssets")),
        modelId: values_1.v.optional(values_1.v.string()),
        modelVersion: values_1.v.optional(values_1.v.string()),
        oilProbability: values_1.v.number(),
        classification: values_1.v.string(),
        lookAlikeRisk: values_1.v.optional(values_1.v.number()),
        spillPolygon: values_1.v.any(),
        centroid: values_1.v.any(),
        areaKm2: values_1.v.optional(values_1.v.number()),
        perimeterKm: values_1.v.optional(values_1.v.number()),
        probabilityRasterRef: values_1.v.optional(values_1.v.string()),
        maskRef: values_1.v.optional(values_1.v.string()),
    })
        .index("by_incidentId", ["incidentId"])
        .index("by_jobId", ["jobId"]),
    hindcastRuns: (0, server_1.defineTable)({
        incidentId: values_1.v.id("incidents"),
        jobId: values_1.v.id("analysisJobs"),
        detectionId: values_1.v.optional(values_1.v.id("detections")),
        engine: values_1.v.string(),
        engineVersion: values_1.v.string(),
        ensembleSize: values_1.v.number(),
        algorithmVersion: values_1.v.string(),
        configHash: values_1.v.string(),
        randomSeed: values_1.v.number(),
        successfulMembers: values_1.v.number(),
        failedMembers: values_1.v.number(),
        particleArtifactRef: values_1.v.optional(values_1.v.string()),
        createdAt: values_1.v.string(),
    })
        .index("by_incidentId", ["incidentId"])
        .index("by_jobId", ["jobId"]),
    originHypotheses: (0, server_1.defineTable)({
        hindcastRunId: values_1.v.id("hindcastRuns"),
        releaseTimeP05: values_1.v.string(),
        releaseTimeMedian: values_1.v.string(),
        releaseTimeP95: values_1.v.string(),
        origin50GeoJSON: values_1.v.any(),
        origin90GeoJSON: values_1.v.any(),
        centroid: values_1.v.any(),
        spatialBandwidthKm: values_1.v.optional(values_1.v.number()),
        createdAt: values_1.v.string(),
    })
        .index("by_hindcastRunId", ["hindcastRunId"]),
    aisReconstructions: (0, server_1.defineTable)({
        incidentId: values_1.v.id("incidents"),
        jobId: values_1.v.id("analysisJobs"),
        aisAssetId: values_1.v.optional(values_1.v.id("dataAssets")),
        inputPointCount: values_1.v.number(),
        keptPointCount: values_1.v.number(),
        removedPointCount: values_1.v.number(),
        vesselCount: values_1.v.number(),
        startTime: values_1.v.string(),
        endTime: values_1.v.string(),
        warnings: values_1.v.optional(values_1.v.array(values_1.v.string())),
        artifactRef: values_1.v.optional(values_1.v.string()),
    })
        .index("by_incidentId", ["incidentId"])
        .index("by_jobId", ["jobId"]),
    attributionRuns: (0, server_1.defineTable)({
        incidentId: values_1.v.id("incidents"),
        jobId: values_1.v.id("analysisJobs"),
        hindcastRunId: values_1.v.id("hindcastRuns"),
        aisReconstructionId: values_1.v.id("aisReconstructions"),
        algorithmVersion: values_1.v.string(),
        configHash: values_1.v.string(),
        resultType: values_1.v.string(),
        unknownP05: values_1.v.optional(values_1.v.number()),
        unknownMedian: values_1.v.optional(values_1.v.number()),
        unknownP95: values_1.v.optional(values_1.v.number()),
        validEnsembleFraction: values_1.v.number(),
        createdAt: values_1.v.string(),
    })
        .index("by_incidentId", ["incidentId"])
        .index("by_jobId", ["jobId"]),
    vesselCandidates: (0, server_1.defineTable)({
        attributionRunId: values_1.v.id("attributionRuns"),
        MMSI: values_1.v.string(),
        vesselName: values_1.v.optional(values_1.v.string()),
        vesselType: values_1.v.optional(values_1.v.string()),
        rank: values_1.v.number(),
        compatibilityP05: values_1.v.number(),
        compatibilityMedian: values_1.v.number(),
        compatibilityP95: values_1.v.number(),
        rankStability: values_1.v.optional(values_1.v.number()),
        minimumOriginDistanceKm: values_1.v.optional(values_1.v.number()),
        scoreBreakdown: values_1.v.any(),
        explanations: values_1.v.optional(values_1.v.array(values_1.v.string())),
    })
        .index("by_attributionRunId", ["attributionRunId"])
        .index("by_attributionRunId_rank", ["attributionRunId", "rank"]),
    modelRegistry: (0, server_1.defineTable)({
        modelId: values_1.v.string(),
        task: values_1.v.string(),
        version: values_1.v.string(),
        architecture: values_1.v.string(),
        stage: values_1.v.string(),
        artifactProvider: values_1.v.optional(values_1.v.string()),
        artifactReference: values_1.v.optional(values_1.v.string()),
        sha256: values_1.v.optional(values_1.v.string()),
        inputChannels: values_1.v.optional(values_1.v.number()),
        inputShape: values_1.v.optional(values_1.v.array(values_1.v.number())),
        decisionThreshold: values_1.v.optional(values_1.v.number()),
        trainingDatasetIds: values_1.v.optional(values_1.v.array(values_1.v.string())),
        metrics: values_1.v.optional(values_1.v.any()),
        preprocessingConfig: values_1.v.optional(values_1.v.any()),
    })
        .index("by_task_stage", ["task", "stage"])
        .index("by_modelId_version", ["modelId", "version"]),
    datasetRegistry: (0, server_1.defineTable)({
        datasetId: values_1.v.string(),
        name: values_1.v.string(),
        version: values_1.v.string(),
        source: values_1.v.optional(values_1.v.string()),
        sourceUrl: values_1.v.optional(values_1.v.string()),
        task: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        trainCount: values_1.v.optional(values_1.v.number()),
        validationCount: values_1.v.optional(values_1.v.number()),
        testCount: values_1.v.optional(values_1.v.number()),
        manifestReference: values_1.v.optional(values_1.v.string()),
        sha256: values_1.v.optional(values_1.v.string()),
        status: values_1.v.string(),
    })
        .index("by_datasetId_version", ["datasetId", "version"]),
    forecastRuns: (0, server_1.defineTable)({
        incidentId: values_1.v.id("incidents"),
        jobId: values_1.v.id("analysisJobs"),
        engine: values_1.v.string(),
        algorithmVersion: values_1.v.string(),
        configHash: values_1.v.string(),
        forecastHours: values_1.v.number(),
        status: values_1.v.string(),
        forecastSummary: values_1.v.optional(values_1.v.any()),
        artifactRef: values_1.v.optional(values_1.v.string()),
        createdAt: values_1.v.string(),
    })
        .index("by_incidentId", ["incidentId"])
        .index("by_jobId", ["jobId"]),
    reports: (0, server_1.defineTable)({
        incidentId: values_1.v.id("incidents"),
        jobId: values_1.v.id("analysisJobs"),
        reportType: values_1.v.string(),
        status: values_1.v.string(),
        artifactReference: values_1.v.optional(values_1.v.string()),
        sha256: values_1.v.optional(values_1.v.string()),
        generatedAt: values_1.v.optional(values_1.v.string()),
    })
        .index("by_incidentId", ["incidentId"])
        .index("by_jobId", ["jobId"]),
    auditEvents: (0, server_1.defineTable)({
        incidentId: values_1.v.optional(values_1.v.id("incidents")),
        jobId: values_1.v.optional(values_1.v.id("analysisJobs")),
        action: values_1.v.string(),
        details: values_1.v.optional(values_1.v.any()),
        createdAt: values_1.v.string(),
    })
        .index("by_incidentId", ["incidentId"])
        .index("by_jobId", ["jobId"])
        .index("by_createdAt", ["createdAt"]),
});
