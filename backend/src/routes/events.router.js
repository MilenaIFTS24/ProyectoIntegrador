import { Router } from 'express';
import { 
    getAllEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent 
} from '../controllers/events.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// --- RUTAS PÚBLICAS (Sin token) ---
router.get('/', getAllEvents); 
router.get('/:id', getEventById); 

// --- RUTAS ADMINISTRATIVAS (Solo Admin) ---
router.post('/', authenticateToken, isAdmin, createEvent);
router.put('/:id', authenticateToken, isAdmin, updateEvent);
router.delete('/:id', authenticateToken, isAdmin, deleteEvent);

export default router;