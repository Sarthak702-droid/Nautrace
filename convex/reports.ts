import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getReports = query({
  args: { id: v.id("reports") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listReports = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reports").collect();
  },
});

export const createReports = mutation({
  args: {
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    reportType: v.string(),
    status: v.string(),
    artifactReference: v.optional(v.string()),
    sha256: v.optional(v.string()),
    generatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reports", args);
  },
});

export const updateReports = mutation({
  args: {
    id: v.id("reports"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

