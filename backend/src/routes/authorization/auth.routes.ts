import express from 'express';
import { registerUser,loginUser,sendOtpEmail,verifyOtp, forgotPassword, resetPassword } from '../../controllers/authorization/auth.controller.ts';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send', sendOtpEmail);
router.post('/verify', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
