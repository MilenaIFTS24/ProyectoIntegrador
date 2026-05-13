import { Router } from 'express';
import { 
    createReservation, 
    getAllReservations, 
    getReservationsByUser, 
    updateReservationStatus, 
    cancelReservation 
} from '../controllers/reservations.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// --- RUTAS PROTEGIDAS (Cualquier usuario logueado) ---
router.post('/', authenticateToken, createReservation); 
router.get('/user/:userId', authenticateToken, getReservationsByUser); 
router.patch('/cancel/:id', authenticateToken, cancelReservation); 

// --- RUTAS ADMINISTRATIVAS (Solo Admin) ---
router.get('/', authenticateToken, isAdmin, getAllReservations); 
router.patch('/:id/status', authenticateToken, isAdmin, updateReservationStatus); 

export default router;