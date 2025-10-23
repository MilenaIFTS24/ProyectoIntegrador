import { Router } from 'express';
import { getTeasProducts, getTeaProductById, createTeaProduct, updateTeaProduct, deleteTeaProduct } from '../controllers/teasProducts.controller.js';


const router = Router();

router.get('/productos/tes', getTeasProducts);
router.get('/productos/tes/:id', getTeaProductById);
router.post('/productos/tes', createTeaProduct);
router.put('/productos/tes/:id', updateTeaProduct);
router.delete('/productos/tes/:id', deleteTeaProduct);


export default router;