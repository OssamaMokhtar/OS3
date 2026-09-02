import { MarketTrend, Recommendation, Skill } from "../types";

/**
 * Client-side API wrappers.
 *
 * This file ships to the browser, so it contains no Gemini SDK usage and no
 * API key. All model calls go through our own /api endpoints, where the key
 * is held server-side (see api/_lib/gemini.ts).
 */

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const analyzeResumeImage = (base64Image: string): Promise<{
  skills: Skill[];
  summary: string;
  yearsExperience: number;
  detectedRole: string;
}> => post("/api/analyze-resume", { image: base64Image });

export const getMarketInsights = (
  role: string
): Promise<{ trends: MarketTrend[]; recommendations: Recommendation[] }> =>
  post("/api/market-insights", { role });
