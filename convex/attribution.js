"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVesselCandidates = exports.createVesselCandidates = exports.listVesselCandidates = exports.getVesselCandidates = exports.updateAttributionRuns = exports.createAttributionRuns = exports.listAttributionRuns = exports.getAttributionRuns = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getAttributionRuns = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("attributionRuns") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listAttributionRuns = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("attributionRuns").collect();
    },
});
exports.createAttributionRuns = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("attributionRuns", args);
    },
});
exports.updateAttributionRuns = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("attributionRuns"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
exports.getVesselCandidates = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("vesselCandidates") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listVesselCandidates = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("vesselCandidates").collect();
    },
});
exports.createVesselCandidates = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("vesselCandidates", args);
    },
});
exports.updateVesselCandidates = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("vesselCandidates"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
