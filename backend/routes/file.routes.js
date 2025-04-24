import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import { fileURLToPath } from 'url'; // For handling ES Module path
import multer from 'multer';  // Correctly import multer
import { authUser } from '../middlewares/authUser.js';
import { transcribeAudio } from '../controllers/file.controller.js';

// Get the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Get the current directory from the import.meta.url
const uploadDir = path.join(path.dirname(import.meta.url), '../uploads');


// Ensure the uploads directory exists
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
