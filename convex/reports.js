"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReports = exports.createReports = exports.listReports = exports.getReports = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getReports = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("reports") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listReports = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("reports").collect();
    },
});
exports.createReports = (0, server_1.mutationGeneric)({
    args: {
        incidentId: values_1.v.id("incidents"),
        jobId: values_1.v.id("analysisJobs"),
        reportType: values_1.v.string(),
        status: values_1.v.string(),
        artifactReference: values_1.v.optional(values_1.v.string()),
        sha256: values_1.v.optional(values_1.v.string()),
        generatedAt: values_1.v.optional(values_1.v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("reports", args);
    },
});
exports.updateReports = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("reports"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
