import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getModelRegistry = query({
  args: { id: v.id("modelRegistry") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listModelRegistry = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("modelRegistry").collect();
  },
});

export const createModelRegistry = mutation({
  args: {
    modelId: v.string(),
    task: v.string(),
    version: v.string(),
    architecture: v.string(),
    stage: v.string(),
    artifactProvider: v.optional(v.string()),
    artifactReference: v.optional(v.string()),
    sha256: v.optional(v.string()),
    inputChannels: v.optional(v.number()),
    inputShape: v.optional(v.array(v.number())),
    decisionThreshold: v.optional(v.number()),
    trainingDatasetIds: v.optional(v.array(v.string())),
    metrics: v.optional(v.any()),
    preprocessingConfig: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("modelRegistry", args);
  },
});

export const updateModelRegistry = mutation({
  args: {
    id: v.id("modelRegistry"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

