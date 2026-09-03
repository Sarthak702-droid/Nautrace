import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getAnalysisJobs = query({
  args: { id: v.id("analysisJobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listAnalysisJobs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("analysisJobs").collect();
  },
});

export const createAnalysisJobs = mutation({
  args: {
    incidentId: v.id("incidents"),
    jobType: v.string(),
    requestId: v.string(),
    idempotencyKey: v.string(),
    status: v.string(),
    progress: v.optional(v.number()),
    algorithmVersion: v.optional(v.string()),
    modelVersion: v.optional(v.string()),
    inputHash: v.optional(v.string()),
    outputHash: v.optional(v.string()),
    createdAt: v.string(),
    startedAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    attemptCount: v.number(),
    errorCode: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analysisJobs", args);
  },
});

export const updateAnalysisJobs = mutation({
  args: {
    id: v.id("analysisJobs"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

