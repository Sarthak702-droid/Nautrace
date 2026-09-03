import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getDataAssets = query({
  args: { id: v.id("dataAssets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listDataAssets = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("dataAssets").collect();
  },
});

export const createDataAssets = mutation({
  args: {
    incidentId: v.id("incidents"),
    assetType: v.string(),
    provider: v.string(),
    datasetId: v.optional(v.string()),
    sourceReference: v.optional(v.string()),
    storageProvider: v.string(),
    storageKey: v.optional(v.string()),
    sha256: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    originalName: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    bbox: v.optional(v.object({
      west: v.number(),
      south: v.number(),
      east: v.number(),
      north: v.number(),
    })),
    variables: v.optional(v.array(v.string())),
    ingestionStatus: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.string(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("dataAssets", args);
  },
});

export const updateDataAssets = mutation({
  args: {
    id: v.id("dataAssets"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

