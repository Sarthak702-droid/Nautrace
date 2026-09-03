"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const server_1 = require("convex/server");
const values_1 = require("convex/values");
const genai_1 = require("@google/genai");
exports.generate = (0, server_1.actionGeneric)({
    args: {
        prompt: values_1.v.string(),
    },
    handler: async (ctx, args) => {
        // Requires GEMINI_API_KEY environment variable in your Convex deployment
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set in environment variables");
        }
        const ai = new genai_1.GoogleGenAI({ apiKey });
        // Using Gemini 3.1 Pro (High) as requested
        const response = await ai.models.generateContent({
            model: "gemini-3.1-pro",
            contents: args.prompt,
        });
        return response.text;
    },
});
