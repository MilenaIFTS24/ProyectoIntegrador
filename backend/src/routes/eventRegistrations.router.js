import { Router } from 'express';
import { 
    registerToEvent, 
    getUserRegistrations, 
    cancelRegistration, 
    getEventAttendees 
} from '../controllers/eventRegistrations.controlles.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// --- RUTAS PROTEGIDAS (Usuario logueado) ---
router.post('/', authenticateToken, registerToEvent); 
router.get('/my-registrations/:userId', authenticateToken, getUserRegistrations); 
router.delete('/:id', authenticateToken, cancelRegistration); 

// --- RUTAS ADMINISTRATIVAS (Solo Admin) ---
router.get('/event/:eventId', authenticateToken, isAdmin, getEventAttendees); 

export default router;