import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getAisReconstructions = query({
  args: { id: v.id("aisReconstructions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listAisReconstructions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aisReconstructions").collect();
  },
});

export const createAisReconstructions = mutation({
  args: {
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    aisAssetId: v.optional(v.id("dataAssets")),
    inputPointCount: v.number(),
    keptPointCount: v.number(),
    removedPointCount: v.number(),
    vesselCount: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    warnings: v.optional(v.array(v.string())),
    artifactRef: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aisReconstructions", args);
  },
});

export const updateAisReconstructions = mutation({
  args: {
    id: v.id("aisReconstructions"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

