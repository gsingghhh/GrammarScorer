import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import { authUser } from '../middlewares/authUser.js';
import { transcribeAudio } from '../controllers/file.controller.js';

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if the directory exists and create it if not
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const router = Router();

// Define the route for audio upload and transcription
router.post('/audio', authUser, upload.single('file'), transcribeAudio);

export default router;
