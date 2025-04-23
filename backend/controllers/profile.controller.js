import TRANSCRIPTION from "../models/transcriptionSchema.js";

export const getTranscriptionsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const transcriptions = await TRANSCRIPTION.find({ userId }).sort({ createdAt: -1 });
    res.json(transcriptions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch transcriptions', error: err.message });
  }
};

export const deleteTranscriptionById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const transcription = await TRANSCRIPTION.findOne({ _id: id, userId });

    if (!transcription) {
      return res.status(404).json({ message: 'Transcription not found or unauthorized' });
    }

    await transcription.deleteOne();
    res.json({ message: 'Transcription deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting transcription', error: err.message });
  }
};
