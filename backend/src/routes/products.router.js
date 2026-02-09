import { Router } from 'express';
import * as productController from '../controllers/products.controller.js';

const router = Router();

// Definimos los endpoints
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.remove);

export default router;