import { Router } from "express";
import { GenerateStandupBody } from "@workspace/api-zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    maxOutputTokens: 1024,
  },
  systemInstruction: `You are a helpful assistant that converts messy work notes into a structured standup update.
Extract information from the notes and organize them into exactly three sections:
1. Yesterday - what was accomplished
2. Today - what is planned
3. Blockers - any impediments or blockers (if none, say "No blockers")

Respond ONLY with a JSON object with keys "yesterday", "today", and "blockers".
Each value should be a clear, concise bullet-point list using "- " prefix for each item.
Keep the tone professional and concise. Do not include any other text outside the JSON.`,
});

router.post("/standup/generate", async (req, res) => {
  const parsed = GenerateStandupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request: notes field is required" });
    return;
  }

  const { notes } = parsed.data;

  try {
    const result = await model.generateContent(`Here are my work notes:\n\n${notes}`);
    const content = result.response.text();

    if (!content) {
      res.status(500).json({ error: "No response from AI" });
      return;
    }

    const parsed_response = JSON.parse(content);
    const yesterday = parsed_response.yesterday || "No information provided";
    const today = parsed_response.today || "No information provided";
    const blockers = parsed_response.blockers || "No blockers";

    res.json({ yesterday, today, blockers });
  } catch (err: unknown) {
    req.log.error({ err }, "Failed to generate standup");
    const message = err instanceof Error ? err.message : "Failed to generate standup";
    res.status(500).json({ error: message });
  }
});

export default router;
