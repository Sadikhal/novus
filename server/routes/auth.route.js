import express from 'express';
import { forgotPassword, login, logOut, register, resetPassword, verifyEmail,refreshToken } from '../controllers/auth.controlller.js';
import { verifyToken } from "../middleware/verifyTokens.js";
import { authLimiter } from '../lib/rateLimiter.js';


const router = express.Router();

router.post('/register',authLimiter,register)
router.post('/login',authLimiter,login)
router.post('/logout',logOut)
router.post("/verify-email", verifyToken,verifyEmail);
router.post("/forgot-password",authLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post('/refresh', refreshToken);

export default router;






