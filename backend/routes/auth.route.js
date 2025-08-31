import express from "express";
import { login, logout, signup, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { SignUpDto, LoginDto } from "../dto/auth.dto.js";

const router = express.Router();

router.post("/signup", validate(SignUpDto), signup);
router.post("/login", validate(LoginDto), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

export default router;
