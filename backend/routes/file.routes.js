import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import { fileURLToPath } from 'url'; // For handling ES Module path
import { authUser } from '../middlewares/authUser.js';
import { transcribeAudio } from '../controllers/file.controller.js';

// Get the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads');

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
