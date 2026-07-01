import { Router } from 'express';
import { 
    registerToEvent, 
    getUserRegistrations, 
    cancelRegistration, 
    getEventAttendees 
} from '../controllers/eventRegistrations.controlles.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// --- Rutas solo usuarios logueados ---

// URL: POST /api/event-registrations
router.post('/', authenticateToken, registerToEvent); 
// URL: GET /api/my-registrations/:userId
router.get('/my-registrations/:userId', authenticateToken, getUserRegistrations);
// URL: DELETE /api/event-registrations/:id 
router.delete('/:id', authenticateToken, cancelRegistration); 

// --- Rutas solo Administradores ---

// URL: GET /api/event-registrations/event/:eventId
router.get('/event/:eventId', authenticateToken, isAdmin, getEventAttendees); 

export default router;