import { Router } from "express";
import { registerController, verifyEmailController, loginController,getUserProfile } from "../controllers/auth.controller.js";
import { registerValidationRules } from "../validator/userValidator.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
export const router = Router();

// Register route with validation
router.post('/register', registerValidationRules(), registerController);
// Verify email route
router.get('/verify-email/:token', verifyEmailController);
// Login route
router.post('/login', loginController);
// get user profile route
router.get('/profile',authMiddleware,getUserProfile);
 