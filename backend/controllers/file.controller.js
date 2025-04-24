import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";
import TRANSCRIPTION from "../models/transcriptionSchema.js";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const transcribeAudio = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const uploadsDir = path.join(__dirname, "..", "uploads");
    const filePath = path.join(uploadsDir, file.filename);

    exec(
      `whisper "${filePath}" --model base --output_format txt --output_dir "${uploadsDir}"`,
      async (error) => {
        if (error) {
          console.error("Whisper error:", error);
          return res.status(500).json({
            message: "Transcription failed",
            error: error.message,
          });
        }

        const transcriptPath = path.join(
          uploadsDir,
          file.filename.replace(path.extname(file.filename), ".txt")
        );

        try {
          const transcription = await fs.readFile(transcriptPath, "utf-8");

          // Grammar check using LanguageTool API
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

          // Basic Suggestion Engine (rule-based fallback)
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
            suggestions
          })

          await fs.unlink(filePath)
          await fs.unlink(transcriptPath)

          return res.status(200).json({
            message:
              "Transcription, grammar check, and suggestions generated successfully!",
            transcription,
            grammar: grammarResults.matches,
            score: score.toFixed(2),
            suggestions,
          });
        } catch (err) {
          console.error("Error reading transcript or checking grammar:", err);
          return res.status(500).json({
            message: "Error processing transcription or grammar check",
          });
        }
      }
    );
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
