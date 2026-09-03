"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDataAssets = exports.createDataAssets = exports.listDataAssets = exports.getDataAssets = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getDataAssets = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("dataAssets") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listDataAssets = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("dataAssets").collect();
    },
});
exports.createDataAssets = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("dataAssets", args);
    },
});
exports.updateDataAssets = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("dataAssets"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
