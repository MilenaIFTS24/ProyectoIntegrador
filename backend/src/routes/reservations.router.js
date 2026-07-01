import { Router } from 'express';
import { 
    createReservation, 
    getAllReservations, 
    getReservationsByUser, 
    updateReservationStatus, 
    cancelReservation,
    getReservationById 
} from '../controllers/reservations.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// --- Rutas solo usuarios logueados ---

// URL: POST /api/reservations
router.post('/', authenticateToken, createReservation); 
// URL: GET /api/reservations/user/:userId
router.get('/user/:userId', authenticateToken, getReservationsByUser);
// URL: PATCH /api/reservations/cancel/:id 
router.patch('/cancel/:id', authenticateToken, cancelReservation);

// --- Rutas solo Administradores ---

// URL: GET /api/reservations
router.get('/', authenticateToken, isAdmin, getAllReservations);
// URL: GET /api/reservations/:id
router.get('/:id', authenticateToken, isAdmin, getReservationById);
// URL: PATCH /api/reservations/:id
router.patch('/:id', authenticateToken, isAdmin, updateReservationStatus); 

export default router;