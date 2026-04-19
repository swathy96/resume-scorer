import type { ScoreResponse } from "../model/types";

interface ResultsPanelProps {
  result: ScoreResponse;
}

function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <div className="results-panel">
      <HeroSection result={result} />
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
export default ResultsPanel;