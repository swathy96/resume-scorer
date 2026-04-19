import { useState } from "react";
import { scoreResume } from "./apis/api";
import type { ScoreResponse } from "./model/types";

function App() {
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setLoading(true);
    setError(null);
    try {
      const data = await scoreResume({
        jobDescription: "Senior Backend Engineer, 5+ years Java, Spring Boot, Kafka, AWS, distributed systems, PostgreSQL, Docker. Fintech a plus.",
        resumeText: "Swathy Dakshinamoorthy. Senior Software Engineer at Discover Financial Services for 5 years. Built Java Spring Boot microservices on AWS processing 10K TPS. Led security initiative remediating 150+ vulnerabilities. Stack: Java, Spring Boot, Kafka, PostgreSQL, Redis, Docker, Kubernetes, AWS. Previously at Thoughtworks. MS Computer Science USC."
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Resume Fit Scorer</h1>
      </header>
      <main>
        <button onClick={handleTest} disabled={loading}>
          {loading ? "Scoring..." : "Run test"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {result && (
          <pre style={{ background: "#f0f0f0", padding: "1rem", overflow: "auto" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </main>
    </div>
  );
}

export default App;