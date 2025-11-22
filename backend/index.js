//const express = require('express');
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import multer from "multer";
import { spawn } from "child_process";
import fs from "fs";
import paymentRoutes from "./routes/payment.route.js";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import * as pdfParse from "pdf-parse";
import { stripeWebhook } from "./controllers/payment.controller.js";
import { checkUsage } from "./middleware/checkUsage.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { User } from "./models/user.model.js";
const router = express.Router();
const openai = new OpenAI();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
const storage = multer.memoryStorage();
const upload = multer({ storage });
let chatSessions = {}; // In-memory store for chat sessions
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.post(
  "/api/payment/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
// index.js

// ... (before app.post("/summarize", ...))

const MAX_FREE_USAGE = 3;

// 🔥 Middleware to check and increment usage
const checkAndIncrementUsage = async (req, res, next) => {
  // We assume req.userId is set by verifyToken middleware
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user token" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 1. Check if the user is a non-paying user AND has hit the limit
    if (
      !user.hasPaid &&
      user.serviceUsageCount >= MAX_FREE_USAGE
    ) {
      // Limit Reached! Send specific HTTP status for the frontend to handle the popup
      return res.status(403).json({
        error: "Usage limit reached.",
        limitReached: true,
        maxUsage: MAX_FREE_USAGE,
      });
    }

    // 2. If user is a non-paying user, increment the usage counter
    if (!user.hasPaid) {
      user.serviceUsageCount += 1;
      await user.save();
      console.log(`User ${user._id} usage count incremented to ${user.serviceUsageCount}`);
    }

    // 3. Proceed to the main handler (summarize or improve-cv)
    next();
  } catch (error) {
    console.error("Error in usage middleware:", error);
    res.status(500).json({ error: "Internal server error during usage check." });
  }
};
// ... (rest of the file)
const cleanup = (tempPath, py) => {
  // If a Python process is running, terminate it
  if (py && !py.killed) {
    try {
      py.kill();
    } catch (e) {
      console.warn("Could not kill Python process:", e);
    }
  }
  // If a temporary file was created, delete it
  if (tempPath) {
    fs.unlink(tempPath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });
  }
};

app.post("/summarize",verifyToken, // Get req.userId
  checkAndIncrementUsage, upload.single("pdf"), async (req, res) => {
  // 1. Setup SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Flushes the headers to the client immediately

  // Function to send data in SSE format
  const sendSSE = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  let tempPath;
  try {
    if (!req.file) {
      sendSSE("error", { message: "PDF required" });
      return res.end();
    }

    // Parse settings if provided
    const settings = req.body.settings
      ? JSON.parse(req.body.settings)
      : { focus: "Key Concepts & Definitions", language: "English" };

    // Save PDF temporarily
    tempPath = path.join(process.cwd(), "temp.pdf");
    await fs.promises.writeFile(tempPath, req.file.buffer);

    // Call Python with settings
    const pyScript = path.join(
      process.cwd(),
      "backend",
      "mailtrap",
      "summarize_pdf.py"
    );
    const pyArgs = [tempPath, JSON.stringify(settings)];
    const py = spawn("python", [pyScript, ...pyArgs]);

    // 2. Process Real-time Python Output
    py.stdout.on("data", (chunk) => {
      const output = chunk.toString().trim();
      const lines = output.split("\n");

      for (const line of lines) {
        try {
          const jsonObject = JSON.parse(line);

          if (jsonObject.progress !== undefined) {
            // Send progress updates immediately
            sendSSE("progress", { progress: jsonObject.progress });
          }
          if (jsonObject.summary !== undefined) {
            // Send final summary
            sendSSE("summary", { summary: jsonObject.summary });
            res.end(); // End the connection after the final result
          }
        } catch (err) {
          // Log non-JSON output (e.g., standard print statements from the script)
          console.warn("Non-JSON Python output:", line);
        }
      }
    });

    py.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data.toString()}`);
      sendSSE("error", { message: `Python script error: ${data.toString()}` });
      res.end();
    });

    py.on("close", (code) => {
      if (code !== 0 && !res.finished) {
        console.error(`Python process exited with code ${code}`);
        sendSSE("error", { message: `Processing failed (Code ${code})` });
        res.end();
      }
      // 3. Clean up the temporary file
      if (tempPath) fs.unlink(tempPath, () => {});
    });

    // Handle client disconnect (optional but recommended for robustness)
    req.on("close", () => {
      py.kill(); // Stop the Python process if the client closes the connection
      console.log("Client disconnected, Python process killed.");
      if (tempPath) fs.unlink(tempPath, () => {});
    });
  } catch (err) {
    console.error(err);
    sendSSE("error", { message: "Internal server error." });
    if (tempPath) fs.unlink(tempPath, () => {});
    if (!res.finished) res.end();
  }
});

app.post("/improve-cv",verifyToken, // Get req.userId
  checkAndIncrementUsage, upload.single("pdf"), async (req, res) => {
  let tempPath;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF required" });
    }

    // Save uploaded PDF temporarily
    tempPath = path.join(process.cwd(), "temp_cv.pdf");
    await fs.promises.writeFile(tempPath, req.file.buffer);

    // Prepare Python script
    const pyScript = path.join(
      process.cwd(),
      "backend",
      "mailtrap",
      "chat_api.py"
    );
    const py = spawn("python", [pyScript, tempPath]);

    let pythonOutput = "";

    py.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
    });

    py.on("close", async () => {
      try {
        if (tempPath) fs.unlink(tempPath, () => {});

        const result = JSON.parse(pythonOutput);

        if (result.error) {
          return res.status(500).json({ error: result.error });
        }

        // Send file back to frontend
        return res.download(result.file, "Improved-CV.pdf", () => {
          fs.unlink(result.file, () => {}); // clean after sending
        });
      } catch (err) {
        console.error("Parsing error:", err);
        return res.status(500).json({ error: "Failed to process CV" });
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    if (tempPath) fs.unlink(tempPath, () => {});
    return res.status(500).json({ error: "Internal server error" });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

}

// ----------------- Study Session: START -----------------
app.post("/study/start", upload.single("file"), async (req, res) => {
  try {
    const { sessionId, prompt } = req.body;
    const file = req.file;

    if (!sessionId)
      return res.status(400).json({ error: "Session ID required" });

    let context = "";

    if (file) {
      const tempPath = path.join(process.cwd(), "temp.pdf");
      await fs.promises.writeFile(tempPath, file.buffer);

      const pyScript = path.join(
        __dirname,
        "backend",
        "mailtrap",
        "extract_pdf.py"
      );
      const py = spawn("python", [pyScript, tempPath]);

      let pythonOutput = "";
      py.stdout.on("data", (data) => {
        pythonOutput += data.toString();
      });

      await new Promise((resolve, reject) => {
        py.on("close", (code) => {
          fs.unlink(tempPath, () => {});
          if (code !== 0) return reject(new Error("Python process failed"));
          resolve();
        });
      });

      const result = JSON.parse(pythonOutput);
      if (result.error) return res.status(500).json({ error: result.error });

      context = result.text;
    } else if (prompt) {
      context = prompt;
    } else {
      return res.status(400).json({ error: "Prompt or file required" });
    }

    // Initialize session with full chat history
    chatSessions[sessionId] = {
      context,
      history: [
        {
          role: "system",
          content: `You are a study assistant. Follow these rules strictly:
                1. Always ask only **one question at a time**.
                2. Questions must be based on the material provided.
                3. Do not ask multiple questions in a single response.
                4. Wait for the student's answer before asking the next question.
                5. Keep your responses concise and clear.
                6. If the student provides an incorrect answer, gently correct them and explain why.
                7. Use the context provided to generate relevant questions.
                8. Avoid repeating questions already asked.
                9. Ensure questions vary in difficulty to challenge the student.
                10. Maintain a supportive and encouraging tone throughout the session.`,
        },
        { role: "user", content: context },
      ],
    };

    // Generate first question
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatSessions[sessionId].history,
    });

    const initialQuestion = response.choices[0].message.content.trim();

    // Save AI response to history
    chatSessions[sessionId].history.push({
      role: "assistant",
      content: initialQuestion,
    });

    return res.json({ message: "Session started", question: initialQuestion });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------- Study Session: ANSWER -----------------
app.post("/study/answer", async (req, res) => {
  try {
    const { sessionId, answer } = req.body;
    const session = chatSessions[sessionId];

    if (!session) return res.status(400).json({ error: "Session not found" });

    // Add student's answer to session history
    session.history.push({ role: "user", content: answer });

    // Ask AI to evaluate answer and generate next question
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: session.history,
    });

    const aiContent = response.choices[0].message.content.trim();

    // Save AI reply to session history
    session.history.push({ role: "assistant", content: aiContent });

    // Optional: split into correction + next question if formatted that way
    let [correction, question] = aiContent.split("Next question:");

    return res.json({
      correction: correction.trim(),
      question: question ? question.trim() : "You're answer is ?",
    });
  } catch (error) {
    console.error("Error in /study/answer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ----------------- Payment Method -----------------
app.use("/api/payment", paymentRoutes);








// ----------------- Production Frontend -----------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
