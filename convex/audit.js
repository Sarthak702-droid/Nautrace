"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAuditEvents = exports.createAuditEvents = exports.listAuditEvents = exports.getAuditEvents = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getAuditEvents = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("auditEvents") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listAuditEvents = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("auditEvents").collect();
    },
});
exports.createAuditEvents = (0, server_1.mutationGeneric)({
    args: {
        incidentId: values_1.v.optional(values_1.v.id("incidents")),
        jobId: values_1.v.optional(values_1.v.id("analysisJobs")),
        action: values_1.v.string(),
        details: values_1.v.optional(values_1.v.any()),
        createdAt: values_1.v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("auditEvents", args);
    },
});
exports.updateAuditEvents = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("auditEvents"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
