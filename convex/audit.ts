import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getAuditEvents = query({
  args: { id: v.id("auditEvents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listAuditEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("auditEvents").collect();
  },
});

export const createAuditEvents = mutation({
  args: {
    incidentId: v.optional(v.id("incidents")),
    jobId: v.optional(v.id("analysisJobs")),
    action: v.string(),
    details: v.optional(v.any()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("auditEvents", args);
  },
});

export const updateAuditEvents = mutation({
  args: {
    id: v.id("auditEvents"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

