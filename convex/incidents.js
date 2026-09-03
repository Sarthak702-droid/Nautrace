"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIncidents = exports.createIncidents = exports.listIncidents = exports.getIncidents = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
exports.getIncidents = (0, server_1.queryGeneric)({
    args: { id: values_1.v.id("incidents") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
exports.listIncidents = (0, server_1.queryGeneric)({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("incidents").collect();
    },
});
exports.createIncidents = (0, server_1.mutationGeneric)({
    args: {
        incidentCode: values_1.v.string(),
        name: values_1.v.string(),
        description: values_1.v.optional(values_1.v.string()),
        status: values_1.v.string(),
        aoiGeoJSON: values_1.v.any(),
        bbox: values_1.v.object({
            west: values_1.v.number(),
            south: values_1.v.number(),
            east: values_1.v.number(),
            north: values_1.v.number(),
        }),
        detectionTime: values_1.v.string(),
        hindcastHours: values_1.v.number(),
        forecastHours: values_1.v.number(),
        createdAt: values_1.v.string(),
        updatedAt: values_1.v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("incidents", args);
    },
});
exports.updateIncidents = (0, server_1.mutationGeneric)({
    args: {
        id: values_1.v.id("incidents"),
        updates: values_1.v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, args.updates);
    },
});
