"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDetections = exports.createDetections = exports.listDetections = exports.getDetections = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getDetections = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("detections") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listDetections = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("detections").collect();
    },
});
exports.createDetections = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("detections", args);
    },
});
exports.updateDetections = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("detections"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
