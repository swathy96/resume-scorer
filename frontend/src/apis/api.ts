import type { ScoreResponse } from "../model/types";

export type ScoreInput =
  | { jobDescription: string; resumeText: string }
  | { jobDescription: string; resumePdf: File };

export async function scoreResume(input: ScoreInput): Promise<ScoreResponse> {
  let response: Response;

  if ("resumePdf" in input) {
    const formData = new FormData();
    formData.append("jobDescription", input.jobDescription);
    formData.append("resume", input.resumePdf);
    response = await fetch("/api/score", {
      method: "POST",
      body: formData,
    });
  } else {
    response = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(errorBody.error || `HTTP ${response.status}`);
  }

  return response.json();
}