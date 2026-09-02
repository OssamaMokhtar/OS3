import type { VercelRequest, VercelResponse } from "@vercel/node";
import { analyzeResumeImage, MAX_IMAGE_BYTES } from "./_lib/gemini";

export const config = { api: { bodyParser: { sizeLimit: "6mb" } } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { image } = req.body ?? {};
    if (typeof image !== "string" || !image) {
      return res.status(400).json({ error: "image must be a base64 string" });
    }
    // base64 inflates by ~4/3; check decoded size before forwarding.
    if ((image.length * 3) / 4 > MAX_IMAGE_BYTES) {
      return res.status(413).json({ error: "Image too large" });
    }

    return res.status(200).json(await analyzeResumeImage(image));
  } catch (err) {
    console.error("analyze-resume failed:", err);
    return res.status(500).json({ error: "Resume analysis failed. Please try again." });
  }
}
