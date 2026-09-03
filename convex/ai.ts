import { actionGeneric as action } from "convex/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

export const generate = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    // Requires GEMINI_API_KEY environment variable in your Convex deployment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Using Gemini 3.1 Pro (High) as requested
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro",
      contents: args.prompt,
    });

    return response.text;
  },
});
