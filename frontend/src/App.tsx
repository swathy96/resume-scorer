import { useEffect, useRef, useState } from "react";
import InputPanel from "./components/InputPanel";
import { ResultsPanel } from "./components/ResultsPanel";
import { scoreResume, type ScoreInput } from "./apis/api";
import type { ScoreResponse } from "./model/types";
import { LoadingState } from "./components/LoadingState";


function getErrorHint(error: string): string {
  if (error.includes("too short")) {
    return "Make sure both fields have enough content. Try using a longer job description and a more detailed resume.";
  }
  if (error.includes("PDF") || error.includes("file")) {
    return "Try pasting your resume as text instead, or use a different PDF.";
  }
  if (error.includes("schema") || error.includes("JSON")) {
    return "The AI returned an unexpected response. Please try again — this is usually transient.";
  }
  if (error.includes("API") || error.includes("rate") || error.includes("429")) {
    return "The Claude API is rate-limited or temporarily unavailable. Wait a minute and try again.";
  }
  return "Please try again. If the problem persists, check your inputs.";
}


function App() {
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  async function handleSubmit(input: ScoreInput) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await scoreResume(input);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
  }

  return (
    <div className="app">
      <header>
        <h1>Resume Fit Scorer</h1>
        <p className="tagline">AI-powered resume scoring against a job description</p>
      </header>

      <main>
        {!result && !loading && (
          <InputPanel onSubmit={handleSubmit} disabled={false} />
        )}

        {loading && <LoadingState />}

        {result && (
          <div ref={resultsRef}>
            <button onClick={handleReset} className="reset-btn">← Score another</button>
            <ResultsPanel result={result} />
          </div>
        )}

        {error && !loading && (
          <div className="error-panel">
            <h3>Something went wrong</h3>
            <p className="error-message">{error}</p>
            <p className="error-hint">{getErrorHint(error)}</p>
            <button onClick={handleReset} className="error-retry">Try again</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;