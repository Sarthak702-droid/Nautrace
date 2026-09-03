import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  incidents: defineTable({
    incidentId: v.string(),
    aoi: v.string(),
    detectionTime: v.string(),
    slickAreaKm2: v.number(),
    oilProbability: v.number(),
    boundaryUncertaintyM: v.number(),
    status: v.string(),
    topCandidate: v.optional(v.string()),
    topScore: v.optional(v.number()),
    unknownSourceScore: v.optional(v.number()),
    provenanceHash: v.string(),
    createdAt: v.number(),
  }).index("by_incident_id", ["incidentId"]),

  forensicReports: defineTable({
    incidentId: v.string(),
    candidateVessel: v.string(),
    investigativeScore: v.number(),
    confidenceInterval: v.string(),
    summaryNarrative: v.string(),
    evidentiaryCaveats: v.string(),
    chainOfCustody: v.object({
      rawProductId: v.string(),
      requestSha256: v.string(),
      configSha256: v.string(),
      algorithmVersion: v.string(),
    }),
    generatedAt: v.number(),
  }).index("by_incident", ["incidentId"]),
});
