"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDatasetRegistry = exports.createDatasetRegistry = exports.listDatasetRegistry = exports.getDatasetRegistry = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getDatasetRegistry = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("datasetRegistry") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listDatasetRegistry = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("datasetRegistry").collect();
    },
});
exports.createDatasetRegistry = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("datasetRegistry", args);
    },
});
exports.updateDatasetRegistry = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("datasetRegistry"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
