export type Verdict = "strong_fit" | "moderate_fit" | "weak_fit" | "not_a_fit";
export type Severity = "high" | "medium" | "low";

export interface FormatIssue {
  issue: string;
  section: string;
  severity: Severity;
  recommendation: string;
}

export interface BulletRewrite {
  original: string;
  rewrite: string;
  reason: string;
}

export interface TopGap {
  gap: string;
  severity: Severity;
  recommendation: string;
}

export interface AtsFit {
  score: number;
  summary: string;
  missing_keywords: string[];
  matched_keywords: string[];
  format_issues: FormatIssue[];
}

export interface RecruiterFit {
  score: number;
  summary: string;
  bullet_rewrites: BulletRewrite[];
  filler_words_detected: string[];
}

export interface ScoreResponse {
  overall_score: number;
  verdict: Verdict;
  should_apply: boolean;
  should_apply_reason: string;
  summary: string;
  categories: {
    ats_fit: AtsFit;
    recruiter_fit: RecruiterFit;
  };
  top_gaps: TopGap[];
  top_strengths: string[];
}