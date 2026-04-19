import Anthropic from "@anthropic-ai/sdk";
import { ScoreResponseSchema, type ScoreResponse } from "../schemas/score.js";
import { SCORING_SYSTEM_PROMPT, buildUserMessage } from "../prompts/scoring.js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 4096;

export type ScoreInput =
  | { jobDescription: string; resumeText: string }
  | { jobDescription: string; resumePdf: Buffer };

function cleanJsonResponse(raw: string): string {
  const firstBrace = raw.indexOf("{");
  const lastBrace = raw.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("No JSON object found in Claude response");
  }
  return raw.slice(firstBrace, lastBrace + 1);
}

export async function scoreResume(input: ScoreInput): Promise<ScoreResponse> {
  let messageContent: Anthropic.Messages.MessageParam["content"];

  if ("resumePdf" in input) {
    messageContent = [
      {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: input.resumePdf.toString("base64"),
        },
      },
      {
        type: "text",
        text: `<job_description>\n${input.jobDescription}\n</job_description>\n\nScore this resume against the job description. Return only valid JSON.`,
      },
    ];
  } else {
    messageContent = buildUserMessage(input.jobDescription, input.resumeText);
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature: 0.2,
    system: SCORING_SYSTEM_PROMPT,
    messages: [{ role: "user", content: messageContent }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content");
  }

  const cleaned = cleanJsonResponse(textBlock.text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("JSON parse failed on:", cleaned.slice(0, 500));
    throw new Error("Claude returned invalid JSON");
  }

  const validation = ScoreResponseSchema.safeParse(parsed);
  if (!validation.success) {
    console.error("Zod validation failed:", validation.error.format());
    throw new Error("Claude response did not match schema");
  }

  return validation.data;
}