import { GoogleGenAI, Type } from "@google/genai";
import { MarketTrend, Recommendation, Skill } from "../types";

// In a real production app, never expose keys on client.
// This is a demo artifact where we simulate backend AI services on the frontend.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const analyzeResumeImage = async (base64Image: string): Promise<{
  skills: Skill[];
  summary: string;
  yearsExperience: number;
  detectedRole: string;
}> => {
  const ai = getAIClient();
  
  const prompt = `
    Analyze this resume image. 
    Extract the following strictly:
    1. A professional summary (max 30 words).
    2. Years of experience (number).
    3. The primary job role detected.
    4. A list of top 10 skills with estimated proficiency (0-100) based on context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            yearsExperience: { type: Type.NUMBER },
            detectedRole: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.NUMBER },
                  type: { type: Type.STRING, enum: ['hard', 'soft'] }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Resume analysis failed", e);
    throw e;
  }
};

export const getMarketInsights = async (role: string): Promise<{ trends: MarketTrend[]; recommendations: Recommendation[] }> => {
  const ai = getAIClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide real-time market insights for the role: ${role}. 
      List top 5 trending skills with demand levels.
      Suggest 3 specific learning recommendations (courses/projects) to stay competitive.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  demand: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                  growth: { type: Type.NUMBER },
                  relevanceScore: { type: Type.NUMBER }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['Course', 'Project', 'Article'] },
                  provider: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Market insights failed", e);
    return { trends: [], recommendations: [] };
  }
};