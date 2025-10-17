import { Router } from 'express';
import { getTeasProducts, getTeaProductById, createTeaProduct } from '../controllers/teasProducts.controller.js';


const router = Router();

router.get('/productos/tes', getTeasProducts);
router.get('/productos/tes/:id', getTeaProductById);
router.post('/productos/tes', createTeaProduct);


export default router;