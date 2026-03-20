import { Router } from "express";
import * as productsController from "../controllers/products.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", productsController.getProducts);
router.get("/type/:type", productsController.getProductsByType);
router.get("/:id", productsController.getProductById); 
router.post("/",  productsController.createProduct);
router.put("/:id", productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);

export default router;