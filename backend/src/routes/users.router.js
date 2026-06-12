import { Router } from "express";
import * as usersController from "../controllers/users.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Solo el admin puede ver la lista completa de usuarios
router.get("/", authenticateToken, isAdmin, usersController.getUsers);

router.post("/", authenticateToken, isAdmin, usersController.createUser);

// El resto requiere estar logueado (authenticateToken)
router.get("/:id", authenticateToken, usersController.getUserById);
router.put("/:id", authenticateToken, usersController.updateUser);
router.delete("/:id", authenticateToken, usersController.deleteUser);

export default router;