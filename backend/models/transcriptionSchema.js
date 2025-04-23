import mongoose from 'mongoose';

const transcriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  transcription: {
    type: String,
    required: true,
  },
  grammar: {
    type: Array,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  suggestions: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TRANSCRIPTION = mongoose.model('transcription', transcriptionSchema);

export default TRANSCRIPTION
