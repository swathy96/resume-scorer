import { useState } from "react";
import { InputPanel } from "./components/InputPanel";
import { scoreResume, type ScoreInput } from "./apis/api";
import type { ScoreResponse } from "./model/types";

function App() {
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        {loading && (
          <div className="loading">
            <p>Scoring your resume...</p>
            <p className="subtext">This takes 30-90 seconds. Claude is analyzing the full document.</p>
          </div>
        )}

        {result && (
          <div>
            <button onClick={handleReset} className="reset-btn">← Score another</button>
            <pre style={{ background: "#f0f0f0", padding: "1rem", overflow: "auto" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {error && !loading && (
          <div className="error-panel">
            <p>Error: {error}</p>
            <button onClick={handleReset}>Try again</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;