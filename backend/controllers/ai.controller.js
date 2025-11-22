import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import multer from "multer";
import { spawn } from "child_process";
import fs from "fs";
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/summarize", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "PDF required" });

    // Save PDF temporarily
    const tempPath = path.join(process.cwd(), "temp.pdf");
    await fs.promises.writeFile(tempPath, req.file.buffer);

    // Path to Python script
    const pyScript = path.join(process.cwd(), "backend", "mailtrap", "summarize_pdf.py");

    // Spawn Python process
    const py = spawn("python", [pyScript, tempPath]);

    let finalData = "";

    py.stdout.on("data", (chunk) => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) { 
        if (!line) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.progress) {
            io.emit("pdf-progress", msg.progress); // send progress to frontend
          }
          if (msg.summary) {
            finalData = msg.summary; // capture final summary
          }
        } catch (err) {
          console.error("JSON parse error:", err);
        }
      }
    });

    py.stderr.on("data", (chunk) => console.error("Python error:", chunk.toString()));

    py.on("close", () => {
      res.json({ success: true, summary: finalData });
      // Clean up temp file
      fs.unlink(tempPath, () => {});
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to summarize PDF" });
  }
}
);