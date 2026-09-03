import { queryGeneric as query, mutationGeneric as mutation } from "convex/server";
import { v } from "convex/values";

export const getIncidents = query({
  args: { id: v.id("incidents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listIncidents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("incidents").collect();
  },
});

export const createIncidents = mutation({
  args: {
    incidentCode: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    aoiGeoJSON: v.any(),
    bbox: v.object({
      west: v.number(),
      south: v.number(),
      east: v.number(),
      north: v.number(),
    }),
    detectionTime: v.string(),
    hindcastHours: v.number(),
    forecastHours: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("incidents", args);
  },
});

export const updateIncidents = mutation({
  args: {
    id: v.id("incidents"),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.updates);
  },
});

