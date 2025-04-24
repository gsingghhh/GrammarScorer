import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import TRANSCRIPTION from "../models/transcriptionSchema.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const filePath = path.join(__dirname, "..", "uploads", file.filename);

    // 🔁 OpenAI Whisper API transcription
    const transcriptionResult = await openai.audio.transcriptions.create({
      file: fsSync.createReadStream(filePath),
      model: "whisper-1",
    });

    const transcription = transcriptionResult.text;

    // 🧠 Grammar check using LanguageTool
    const response = await axios.post(
      "https://api.languagetoolplus.com/v2/check",
      new URLSearchParams({
        text: transcription,
        language: "en-US",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const grammarResults = response.data;
    const totalIssues = grammarResults.matches.length;
    const totalWords = transcription.split(/\s+/).length;
    const score = ((totalWords - totalIssues) / totalWords) * 100;

    const suggestions = grammarResults.matches
      .slice(0, 5)
      .map((match, index) => {
        return `Suggestion ${index + 1}: "${match.context.text}" → ${match.message}`;
      })
      .join("\n");

    await TRANSCRIPTION.create({
      userId: req.user._id,
      transcription,
      grammar: grammarResults.matches,
      score: parseFloat(score.toFixed(2)),
      suggestions,
    });

    // Clean up
    await fs.unlink(filePath);

    return res.status(200).json({
      message: "Transcription, grammar check, and suggestions generated successfully!",
      transcription,
      grammar: grammarResults.matches,
      score: score.toFixed(2),
      suggestions,
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
