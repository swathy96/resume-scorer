import { useEffect, useState } from "react";
import { FileText, GitCompare, Search, Pencil, Sparkles, type LucideIcon } from "lucide-react";

interface Stage {
  icon: LucideIcon;
  message: string;
}

const STAGES: Stage[] = [
  { icon: FileText, message: "Reading your resume…" },
  { icon: GitCompare, message: "Comparing against the job description…" },
  { icon: Search, message: "Identifying gaps and matched keywords…" },
  { icon: Pencil, message: "Drafting bullet rewrites…" },
  { icon: Sparkles, message: "Almost there — finalizing scores…" },
];

export function LoadingState() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const Icon = STAGES[stageIndex].icon;

  return (
    <div className="loading">
      <div className="loading-icon-wrap">
        <Icon size={28} strokeWidth={1.75} className="loading-icon" />
      </div>
      <p className="loading-stage">{STAGES[stageIndex].message}</p>
      <p className="subtext">
        Claude is analyzing the full document. This usually takes 30–90 seconds.
      </p>
    </div>
  );
}