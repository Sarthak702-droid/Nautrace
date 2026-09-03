import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getAttributionRuns = query({
  args: { id: v.id("attributionRuns") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listAttributionRuns = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("attributionRuns").collect();
  },
});

export const createAttributionRuns = mutation({
  args: {
    incidentId: v.id("incidents"),
    jobId: v.id("analysisJobs"),
    hindcastRunId: v.id("hindcastRuns"),
    aisReconstructionId: v.id("aisReconstructions"),
    algorithmVersion: v.string(),
    configHash: v.string(),
    resultType: v.string(),
    unknownP05: v.optional(v.number()),
    unknownMedian: v.optional(v.number()),
    unknownP95: v.optional(v.number()),
    validEnsembleFraction: v.number(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("attributionRuns", args);
  },
});

export const updateAttributionRuns = mutation({
  args: {
    id: v.id("attributionRuns"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

export const getVesselCandidates = query({
  args: { id: v.id("vesselCandidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listVesselCandidates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("vesselCandidates").collect();
  },
});

export const createVesselCandidates = mutation({
  args: {
    attributionRunId: v.id("attributionRuns"),
    MMSI: v.string(),
    vesselName: v.optional(v.string()),
    vesselType: v.optional(v.string()),
    rank: v.number(),
    compatibilityP05: v.number(),
    compatibilityMedian: v.number(),
    compatibilityP95: v.number(),
    rankStability: v.optional(v.number()),
    minimumOriginDistanceKm: v.optional(v.number()),
    scoreBreakdown: v.any(),
    explanations: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vesselCandidates", args);
  },
});

export const updateVesselCandidates = mutation({
  args: {
    id: v.id("vesselCandidates"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

