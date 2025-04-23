import { Router } from "express";
import { getUserProfile, loginUser, registerUser } from "../controllers/user.contoller.js";
import { authUser } from "../middlewares/authUser.js";

const router = Router()

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/profile', authUser, getUserProfile)

export default router