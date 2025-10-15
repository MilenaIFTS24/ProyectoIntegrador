import { Router } from 'express';
import { getTeasProducts } from '../controllers/teasProducts.controller.js';

const router = Router();

router.get('/productos/tes', getTeasProducts);


export default router;