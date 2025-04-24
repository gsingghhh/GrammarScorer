import { Router } from "express";
import multer from "multer";
import { authUser } from "../middlewares/authUser.js";
import { transcribeAudio } from "../controllers/file.controller.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        return cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({storage})

router.post('/audio', authUser, upload.single('file'), transcribeAudio) ;

export default router