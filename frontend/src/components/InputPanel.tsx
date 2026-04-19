import { useState } from "react";
import type { ScoreInput } from "../apis/api";

interface InputPanelProps {
  onSubmit: (input: ScoreInput) => void;
  disabled?: boolean;
}

type ResumeMode = "pdf" | "text";

function InputPanel({ onSubmit, disabled }: InputPanelProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeMode, setResumeMode] = useState<ResumeMode>("pdf");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (jobDescription.trim().length < 100) {
      setValidationError("Job description must be at least 100 characters.");
      return;
    }

    if (resumeMode === "pdf") {
      if (!resumeFile) {
        setValidationError("Please upload a PDF resume.");
        return;
      }
      onSubmit({ jobDescription, resumePdf: resumeFile });
    } else {
      if (resumeText.trim().length < 200) {
        setValidationError("Resume text must be at least 200 characters.");
        return;
      }
      onSubmit({ jobDescription, resumeText });
    }
  }

  return (
    <form className="input-panel" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="jd">Job description</label>
        <textarea
          id="jd"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          rows={10}
          disabled={disabled}
        />
        <span className="field-hint">{jobDescription.length} chars</span>
      </div>

      <div className="field">
        <label>Resume</label>
        <div className="mode-toggle">
          <button
            type="button"
            className={resumeMode === "pdf" ? "active" : ""}
            onClick={() => setResumeMode("pdf")}
            disabled={disabled}
          >
            Upload PDF
          </button>
          <button
            type="button"
            className={resumeMode === "text" ? "active" : ""}
            onClick={() => setResumeMode("text")}
            disabled={disabled}
          >
            Paste text
          </button>
        </div>

        {resumeMode === "pdf" ? (
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
            disabled={disabled}
          />
        ) : (
          <>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              rows={10}
              disabled={disabled}
            />
            <span className="field-hint">{resumeText.length} chars</span>
          </>
        )}
      </div>

      {validationError && <p className="error">{validationError}</p>}

      <button type="submit" className="submit-btn" disabled={disabled}>
        {disabled ? "Scoring..." : "Score my resume"}
      </button>
    </form>
  );
}
export default InputPanel;