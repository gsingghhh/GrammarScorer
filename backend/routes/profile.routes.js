import express from 'express';
import {authUser} from '../middlewares/authUser.js'
import { deleteTranscriptionById, getTranscriptionsByUser } from '../controllers/profile.controller.js';

const router = express.Router();

// Get all transcriptions for logged-in user
router.get('/my-transcriptions', authUser, getTranscriptionsByUser);

// Delete a transcription by ID
router.delete('/delete/:id', authUser, deleteTranscriptionById);

export default router;
