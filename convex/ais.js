"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAisReconstructions = exports.createAisReconstructions = exports.listAisReconstructions = exports.getAisReconstructions = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getAisReconstructions = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("aisReconstructions") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listAisReconstructions = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("aisReconstructions").collect();
    },
});
exports.createAisReconstructions = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("aisReconstructions", args);
    },
});
exports.updateAisReconstructions = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("aisReconstructions"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
