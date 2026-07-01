import { Router } from "express";
import * as usersController from "../controllers/users.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Rutas solo usuarios logueados ---

// URL: GET /api/users/:id
router.get("/:id", authenticateToken, usersController.getUserById);
// URL: PUT /api/users/:id
router.put("/:id", authenticateToken, usersController.updateUser);
// URL: DELETE /api/users/:id
router.delete("/:id", authenticateToken, usersController.deleteUser);

// --- Rutas solo Administradores ---

// URL: GET /api/users
router.get("/", authenticateToken, isAdmin, usersController.getUsers);
// URL: POST /api/users
router.post("/", authenticateToken, isAdmin, usersController.createUser);



export default router;