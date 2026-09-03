"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnalysisJobs = exports.createAnalysisJobs = exports.listAnalysisJobs = exports.getAnalysisJobs = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getAnalysisJobs = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("analysisJobs") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listAnalysisJobs = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("analysisJobs").collect();
    },
});
exports.createAnalysisJobs = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("analysisJobs", args);
    },
});
exports.updateAnalysisJobs = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("analysisJobs"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
