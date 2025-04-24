import { Router } from "express";
import multer from "multer";
import { authUser } from "../middlewares/authUser.js";
import { transcribeAudio } from "../controllers/file.controller.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsPath = path.join(__dirname, '..', 'uploads');
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


const upload = multer({storage})

router.post('/audio', authUser, upload.single('file'), transcribeAudio) ;

export default router