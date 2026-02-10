import { Router } from "express";
import * as productsController from "../controllers/products.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", productsController.getProducts);
router.get("/type/:type", productsController.getProductsByType);
router.get("/:id", productsController.getProductById); 
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              price:
 *                type: number
 *              stock:
 *                type: integer
 *              type:
 *                type: string
 *                description: Categoría del producto
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       403:
 *         description: No autorizado
 */
router.post("/", authenticateToken, isAdmin, productsController.createProduct);
router.put("/:id", authenticateToken, isAdmin, productsController.updateProduct);
router.delete("/:id", authenticateToken, isAdmin, productsController.deleteProduct);

export default router;