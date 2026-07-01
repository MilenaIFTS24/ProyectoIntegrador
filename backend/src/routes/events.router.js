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

// --- Rutas publicas ---

// URL: /api/events
router.get('/', getAllEvents); 
// URL: /api/events/:id
router.get('/:id', getEventById); 

// --- Rutas solo Administradores ---

// URL: POST /api/events
router.post('/', authenticateToken, isAdmin, createEvent);
// URL: PUT /api/events/:id
router.put('/:id', authenticateToken, isAdmin, updateEvent);
// URL: DELETE /api/events/:id
router.delete('/:id', authenticateToken, isAdmin, deleteEvent);

export default router;