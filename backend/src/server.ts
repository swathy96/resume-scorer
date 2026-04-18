import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// middleware goes here
// routes go here

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
app.get('/health',(req, res) => {
  res.json({ status: "ok" });
});