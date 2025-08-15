import express from 'express';
import { forgotPassword, login, logOut, register, resetPassword, verifyEmail } from '../controllers/auth.controlller.js';
import { verifyToken } from "../middleware/verifyTokens.js";


const router = express.Router();

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logOut)
router.post("/verify-email", verifyToken,verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;






