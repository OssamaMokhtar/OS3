import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getMarketInsights } from "./_lib/gemini";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { role } = req.body ?? {};
    if (typeof role !== "string" || !role.trim()) {
      return res.status(400).json({ error: "role must be a non-empty string" });
    }

    return res.status(200).json(await getMarketInsights(role));
  } catch (err) {
    console.error("market-insights failed:", err);
    return res.status(500).json({ error: "Market insights failed. Please try again." });
  }
}
