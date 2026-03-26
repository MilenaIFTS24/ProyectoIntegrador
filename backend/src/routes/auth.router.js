import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

// URL: /api/auth/login
router.post("/login", authController.login);

// URL: /api/auth/register
router.post("/register", authController.register);

export default router;