import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const API_KEY = process.env.ASSEMBLYAI_API_KEY;  // You should have this key in your .env file

export const transcribeAudio = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No audio file uploaded" });
    }

    const uploadsDir = path.join(__dirname, "..", "uploads");
    const filePath = path.join(uploadsDir, file.filename);

    // Upload the file to AssemblyAI
    const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', fs.createReadStream(filePath), {
      headers: {
        'authorization': API_KEY,
      },
    });

    const audioUrl = uploadResponse.data.upload_url;

    // Request transcription
    const transcribeResponse = await axios.post('https://api.assemblyai.com/v2/transcript', 
      { audio_url: audioUrl }, 
      { headers: { 'authorization': API_KEY } });

    const transcriptionId = transcribeResponse.data.id;

    // Poll for the transcription status
    let statusResponse;
    let transcriptionText = "";
    while (true) {
      statusResponse = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptionId}`, {
        headers: { 'authorization': API_KEY }
      });

      if (statusResponse.data.status === 'completed') {
        transcriptionText = statusResponse.data.text;
        break;
      } else if (statusResponse.data.status === 'failed') {
        return res.status(500).json({ message: 'Transcription failed' });
      }

      // Wait for a few seconds before checking the status again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Now perform the grammar check using LanguageTool API (you can keep that part the same)

    const grammarCheckResponse = await axios.post(
      "https://api.languagetoolplus.com/v2/check",
      new URLSearchParams({
        text: transcriptionText,
        language: "en-US",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const grammarResults = grammarCheckResponse.data;

    const totalIssues = grammarResults.matches.length;
    const totalWords = transcriptionText.split(/\s+/).length;
    const score = ((totalWords - totalIssues) / totalWords) * 100;

    const suggestions = grammarResults.matches
      .slice(0, 5)
      .map((match, index) => {
        return `Suggestion ${index + 1}: "${match.context.text}" → ${match.message}`;
      })
      .join("\n");

    // Store the transcription and results in the database
    await TRANSCRIPTION.create({
      userId: req.user._id,
      transcription: transcriptionText,
      grammar: grammarResults.matches,
      score: parseFloat(score.toFixed(2)),
      suggestions
    });

    await fs.unlink(filePath);  // Clean up uploaded file

    return res.status(200).json({
      message:
        "Transcription, grammar check, and suggestions generated successfully!",
      transcription: transcriptionText,
      grammar: grammarResults.matches,
      score: score.toFixed(2),
      suggestions,
    });
  } catch (error) {
    console.error("Error during transcription or grammar check:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
