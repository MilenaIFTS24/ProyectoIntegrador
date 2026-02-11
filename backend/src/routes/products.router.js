import { Router } from "express";
import * as productsController from "../controllers/products.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", productsController.getProducts);
router.get("/type/:type", productsController.getProductsByType);
router.get("/:id", productsController.getProductById); 
router.post("/", authenticateToken, isAdmin, productsController.createProduct);
router.put("/:id", authenticateToken, isAdmin, productsController.updateProduct);
router.delete("/:id", authenticateToken, isAdmin, productsController.deleteProduct);

export default router;