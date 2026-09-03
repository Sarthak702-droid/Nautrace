import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getDatasetRegistry = query({
  args: { id: v.id("datasetRegistry") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listDatasetRegistry = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("datasetRegistry").collect();
  },
});

export const createDatasetRegistry = mutation({
  args: {
    datasetId: v.string(),
    name: v.string(),
    version: v.string(),
    source: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    task: v.string(),
    description: v.optional(v.string()),
    trainCount: v.optional(v.number()),
    validationCount: v.optional(v.number()),
    testCount: v.optional(v.number()),
    manifestReference: v.optional(v.string()),
    sha256: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("datasetRegistry", args);
  },
});

export const updateDatasetRegistry = mutation({
  args: {
    id: v.id("datasetRegistry"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

