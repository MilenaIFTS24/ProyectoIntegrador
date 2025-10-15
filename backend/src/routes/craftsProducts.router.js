import { Router } from 'express';
import { getCraftsProducts } from '../controllers/craftsProducts.controller.js';

const router = Router();

router.get('/productos/artesanias', getCraftsProducts);


export default router;