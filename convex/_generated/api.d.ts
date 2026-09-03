/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as ais from "../ais.js";
import type * as assets from "../assets.js";
import type * as attribution from "../attribution.js";
import type * as audit from "../audit.js";
import type * as datasets from "../datasets.js";
import type * as detections from "../detections.js";
import type * as forecasts from "../forecasts.js";
import type * as hindcasts from "../hindcasts.js";
import type * as incidents from "../incidents.js";
import type * as jobs from "../jobs.js";
import type * as models from "../models.js";
import type * as reports from "../reports.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  ais: typeof ais;
  assets: typeof assets;
  attribution: typeof attribution;
  audit: typeof audit;
  datasets: typeof datasets;
  detections: typeof detections;
  forecasts: typeof forecasts;
  hindcasts: typeof hindcasts;
  incidents: typeof incidents;
  jobs: typeof jobs;
  models: typeof models;
  reports: typeof reports;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
