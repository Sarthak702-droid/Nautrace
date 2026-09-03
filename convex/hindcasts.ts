import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getHindcastRuns = query({
  args: { id: v.id("hindcastRuns") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listHindcastRuns = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hindcastRuns").collect();
  },
});

export const createHindcastRuns = mutation({
  args: {
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    detectionId: v.optional(v.id("detections")),
    engine: v.string(),
    engineVersion: v.string(),
    ensembleSize: v.number(),
    algorithmVersion: v.string(),
    configHash: v.string(),
    randomSeed: v.number(),
    successfulMembers: v.number(),
    failedMembers: v.number(),
    particleArtifactRef: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("hindcastRuns", args);
  },
});

export const updateHindcastRuns = mutation({
  args: {
    id: v.id("hindcastRuns"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

export const getOriginHypotheses = query({
  args: { id: v.id("originHypotheses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listOriginHypotheses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("originHypotheses").collect();
  },
});

export const createOriginHypotheses = mutation({
  args: {
    hindcastRunId: v.id("hindcastRuns"),
    releaseTimeP05: v.string(),
    releaseTimeMedian: v.string(),
    releaseTimeP95: v.string(),
    origin50GeoJSON: v.any(),
    origin90GeoJSON: v.any(),
    centroid: v.any(),
    spatialBandwidthKm: v.optional(v.number()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("originHypotheses", args);
  },
});

export const updateOriginHypotheses = mutation({
  args: {
    id: v.id("originHypotheses"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

