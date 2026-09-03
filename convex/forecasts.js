"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateForecastRuns = exports.createForecastRuns = exports.listForecastRuns = exports.getForecastRuns = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getForecastRuns = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("forecastRuns") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listForecastRuns = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("forecastRuns").collect();
    },
});
exports.createForecastRuns = (0, server_1.mutationGeneric)({
    args: {
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
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("forecastRuns", args);
    },
});
exports.updateForecastRuns = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("forecastRuns"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
