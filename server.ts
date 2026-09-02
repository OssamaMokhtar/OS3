/**
 * Local development server.
 *
 * In production these routes run as Vercel serverless functions (see api/).
 * This mounts the same shared implementation so `npm run dev` behaves the
 * same way locally without requiring the Vercel CLI.
 */
import express from "express";
import { createServer as createViteServer } from "vite";
import { analyzeResumeImage, getMarketInsights, MAX_IMAGE_BYTES } from "./api/_lib/gemini";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
app.use(express.json({ limit: "6mb" }));

app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { image } = req.body ?? {};
    if (typeof image !== "string" || !image) return res.status(400).json({ error: "image must be a base64 string" });
    if ((image.length * 3) / 4 > MAX_IMAGE_BYTES) return res.status(413).json({ error: "Image too large" });
    res.json(await analyzeResumeImage(image));
  } catch (err) {
    console.error("analyze-resume failed:", err);
    res.status(500).json({ error: "Resume analysis failed. Please try again." });
  }
});

app.post("/api/market-insights", async (req, res) => {
  try {
    const { role } = req.body ?? {};
    if (typeof role !== "string" || !role.trim()) return res.status(400).json({ error: "role must be a non-empty string" });
    res.json(await getMarketInsights(role));
  } catch (err) {
    console.error("market-insights failed:", err);
    res.status(500).json({ error: "Market insights failed. Please try again." });
  }
});

const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
app.use(vite.middlewares);
app.listen(PORT, () => console.log(`CareerOracle dev server on http://localhost:${PORT}`));
