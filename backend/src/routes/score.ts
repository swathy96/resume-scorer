import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import { scoreResume } from "../services/claude.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

router.post("/score", upload.single("resume"), async (req: Request, res: Response) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({ error: "jobDescription is required" });
    }
    if (jobDescription.length < 100) {
      return res.status(400).json({ error: "jobDescription is too short to score meaningfully" });
    }

    if (req.file) {
      const result = await scoreResume({
        jobDescription,
        resumePdf: req.file.buffer,
      });
      return res.json(result);
    }

    const { resumeText } = req.body;
    if (!resumeText || typeof resumeText !== "string") {
      return res.status(400).json({ error: "Either a resume PDF or resumeText is required" });
    }
    if (resumeText.length < 200) {
      return res.status(400).json({ error: "Resume text is too short to score meaningfully" });
    }

    const result = await scoreResume({ jobDescription, resumeText });
    return res.json(result);
  } catch (err) {
    console.error("Scoring failed:", err);
    const message = err instanceof Error ? err.message : "Unknown scoring error";
    return res.status(500).json({ error: message });
  }
});

router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err?.message?.includes("PDF")) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: "Internal error" });
});

export default router;