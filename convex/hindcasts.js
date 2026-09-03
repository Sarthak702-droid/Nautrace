"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOriginHypotheses = exports.createOriginHypotheses = exports.listOriginHypotheses = exports.getOriginHypotheses = exports.updateHindcastRuns = exports.createHindcastRuns = exports.listHindcastRuns = exports.getHindcastRuns = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getHindcastRuns = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("hindcastRuns") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listHindcastRuns = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("hindcastRuns").collect();
    },
});
exports.createHindcastRuns = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("hindcastRuns", args);
    },
});
exports.updateHindcastRuns = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("hindcastRuns"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
exports.getOriginHypotheses = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("originHypotheses") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listOriginHypotheses = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("originHypotheses").collect();
    },
});
exports.createOriginHypotheses = (0, server_1.mutationGeneric)({
    args: {
        hindcastRunId: values_1.v.id("hindcastRuns"),
        releaseTimeP05: values_1.v.string(),
        releaseTimeMedian: values_1.v.string(),
        releaseTimeP95: values_1.v.string(),
        origin50GeoJSON: values_1.v.any(),
        origin90GeoJSON: values_1.v.any(),
        centroid: values_1.v.any(),
        spatialBandwidthKm: values_1.v.optional(values_1.v.number()),
        createdAt: values_1.v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("originHypotheses", args);
    },
});
exports.updateOriginHypotheses = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("originHypotheses"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
