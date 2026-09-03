import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getDetections = query({
  args: { id: v.id("detections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listDetections = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("detections").collect();
  },
});

export const createDetections = mutation({
  args: {
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    sarAssetId: v.optional(v.id("dataAssets")),
    modelId: v.optional(v.string()),
    modelVersion: v.optional(v.string()),
    oilProbability: v.number(),
    classification: v.string(),
    lookAlikeRisk: v.optional(v.number()),
    spillPolygon: v.any(),
    centroid: v.any(),
    areaKm2: v.optional(v.number()),
    perimeterKm: v.optional(v.number()),
    probabilityRasterRef: v.optional(v.string()),
    maskRef: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("detections", args);
  },
});

export const updateDetections = mutation({
  args: {
    id: v.id("detections"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

