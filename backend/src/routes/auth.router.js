import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

// Rutas para login y registro

// URL: POST /api/auth/login
router.post("/login", authController.login);

// URL: POST /api/auth/register
router.post("/register", authController.register);

export default router;