import type { ScoreResponse } from "../model/types";

interface ResultsPanelProps {
  result: ScoreResponse;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <div className="results-panel">
      <HeroSection result={result} />
      <AtsCard ats={result.categories.ats_fit} />
      <RecruiterCard recruiter={result.categories.recruiter_fit} />
    </div>
  );
}

function HeroSection({ result }: { result: ScoreResponse }) {
  return (
    <section className="hero">
      <div className="hero-score">
        <div className="score-number">{result.overall_score}</div>
        <div className="score-label">/ 100</div>
      </div>
      <div className="hero-meta">
        <div className="verdict-row">
          <VerdictPill verdict={result.verdict} />
          <ApplyBadge shouldApply={result.should_apply} />
        </div>
        <p className="hero-summary">{result.summary}</p>
        <p className="apply-reason">{result.should_apply_reason}</p>
      </div>
    </section>
  );
}

function VerdictPill({ verdict }: { verdict: ScoreResponse["verdict"] }) {
  const labels: Record<ScoreResponse["verdict"], string> = {
    strong_fit: "Strong fit",
    moderate_fit: "Moderate fit",
    weak_fit: "Weak fit",
    not_a_fit: "Not a fit",
  };
  return <span className={`pill pill-${verdict}`}>{labels[verdict]}</span>;
}

function ApplyBadge({ shouldApply }: { shouldApply: boolean }) {
  return (
    <span className={`apply-badge ${shouldApply ? "apply-yes" : "apply-no"}`}>
      {shouldApply ? "Worth applying" : "Skip this one"}
    </span>
  );
}

function AtsCard({ ats }: { ats: ScoreResponse["categories"]["ats_fit"] }) {
  return (
    <section className="category-card">
      <header className="category-header">
        <h2>ATS fit</h2>
        <ScoreBadge score={ats.score} />
      </header>
      <p className="category-summary">{ats.summary}</p>

      <KeywordSection
        title="Matched keywords"
        keywords={ats.matched_keywords}
        variant="positive"
        emptyMessage="No keywords matched."
      />

      <KeywordSection
        title="Missing keywords"
        keywords={ats.missing_keywords}
        variant="negative"
        emptyMessage="No missing keywords — strong coverage."
      />

      {ats.format_issues.length > 0 && (
        <div className="subsection">
          <h3>Format issues</h3>
          <ul className="issue-list">
            {ats.format_issues.map((issue, i) => (
              <li key={i} className="issue-item">
                <div className="issue-header">
                  <SeverityDot severity={issue.severity} />
                  <strong>{issue.issue}</strong>
                  <span className="issue-section">{issue.section}</span>
                </div>
                <p className="issue-recommendation">{issue.recommendation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function RecruiterCard({ recruiter }: { recruiter: ScoreResponse["categories"]["recruiter_fit"] }) {
  return (
    <section className="category-card">
      <header className="category-header">
        <h2>Recruiter fit</h2>
        <ScoreBadge score={recruiter.score} />
      </header>
      <p className="category-summary">{recruiter.summary}</p>

      {recruiter.filler_words_detected.length > 0 && (
        <KeywordSection
          title="Filler words detected"
          keywords={recruiter.filler_words_detected}
          variant="warning"
          emptyMessage=""
        />
      )}

      {/* Bullet rewrites coming in step 4c */}
    </section>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const tier = score >= 85 ? "high" : score >= 70 ? "mid" : score >= 50 ? "low" : "weak";
  return <span className={`score-badge score-${tier}`}>{score}</span>;
}

function KeywordSection({
  title,
  keywords,
  variant,
  emptyMessage,
}: {
  title: string;
  keywords: string[];
  variant: "positive" | "negative" | "warning";
  emptyMessage: string;
}) {
  return (
    <div className="subsection">
      <h3>{title}</h3>
      {keywords.length > 0 ? (
        <div className="tag-cloud">
          {keywords.map((kw) => (
            <span key={kw} className={`tag tag-${variant}`}>{kw}</span>
          ))}
        </div>
      ) : (
        <p className="empty-state">{emptyMessage}</p>
      )}
    </div>
  );
}

function SeverityDot({ severity }: { severity: "high" | "medium" | "low" }) {
  return <span className={`severity-dot severity-${severity}`} aria-label={`${severity} severity`} />;
}