import { z } from "zod";

const SeveritySchema = z.enum(["high", "medium", "low"]);

const FormatIssueSchema = z.object({
  issue: z.string(),
  section: z.string(),
  severity: SeveritySchema,
  recommendation: z.string(),
});

const BulletRewriteSchema = z.object({
  original: z.string(),
  rewrite: z.string(),
  reason: z.string(),
});

const TopGapSchema = z.object({
  gap: z.string(),
  severity: SeveritySchema,
  recommendation: z.string(),
});

const AtsFitSchema = z.object({
  score: z.number().int().min(0).max(100),
  summary: z.string(),
  missing_keywords: z.array(z.string()),
  matched_keywords: z.array(z.string()),
  format_issues: z.array(FormatIssueSchema).max(5),
});

const RecruiterFitSchema = z.object({
  score: z.number().int().min(0).max(100),
  summary: z.string(),
  bullet_rewrites: z.array(BulletRewriteSchema).max(5),
  filler_words_detected: z.array(z.string()),
});

export const ScoreResponseSchema = z.object({
  overall_score: z.number().int().min(0).max(100),
  verdict: z.enum(["strong_fit", "moderate_fit", "weak_fit", "not_a_fit"]),
  should_apply: z.boolean(),
  should_apply_reason: z.string(),
  summary: z.string(),
  categories: z.object({
    ats_fit: AtsFitSchema,
    recruiter_fit: RecruiterFitSchema,
  }),
  top_gaps: z.array(TopGapSchema).max(5),
  top_strengths: z.array(z.string()).max(5),
});

export type ScoreResponse = z.infer<typeof ScoreResponseSchema>;