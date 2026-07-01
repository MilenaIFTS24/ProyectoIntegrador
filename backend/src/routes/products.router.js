import { Router } from "express";
import * as productsController from "../controllers/products.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Rutas publicas ---

// URL: GET /api/products
router.get("/", productsController.getProducts);
// URL: GET /api/products/type/:type
router.get("/type/:type", productsController.getProductsByType);
// URL: GET /api/products/:id
router.get("/:id", productsController.getProductById);

// --- Rutas solo Administradores ---

// URL: POST /api/products
router.post("/", authenticateToken, isAdmin, productsController.createProduct);
// URL: PUT /api/products/:id
router.put("/:id", authenticateToken, isAdmin, productsController.updateProduct);
// URL: DELETE /api/products/:id
router.delete("/:id", authenticateToken, isAdmin, productsController.deleteProduct);

export default router;