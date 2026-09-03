import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getForecastRuns = query({
  args: { id: v.id("forecastRuns") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listForecastRuns = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("forecastRuns").collect();
  },
});

export const createForecastRuns = mutation({
  args: {
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    engine: v.string(),
    algorithmVersion: v.string(),
    configHash: v.string(),
    forecastHours: v.number(),
    status: v.string(),
    forecastSummary: v.optional(v.any()),
    artifactRef: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("forecastRuns", args);
  },
});

export const updateForecastRuns = mutation({
  args: {
    id: v.id("forecastRuns"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

