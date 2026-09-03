"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateModelRegistry = exports.createModelRegistry = exports.listModelRegistry = exports.getModelRegistry = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getModelRegistry = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("modelRegistry") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listModelRegistry = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("modelRegistry").collect();
    },
});
exports.createModelRegistry = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("modelRegistry", args);
    },
});
exports.updateModelRegistry = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("modelRegistry"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
