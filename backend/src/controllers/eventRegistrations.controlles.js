import * as RegistrationService from '../services/eventRegistrations.service.js';

// Inscribirse a un evento con cupo limitado
export const registerToEvent = async (req, res) => {
    try {
        const result = await RegistrationService.registerToEventService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener las inscripciones de un usuario
export const getUserRegistrations = async (req, res) => {
    try {
        const data = await RegistrationService.getRegistrationsByUserService(req.params.userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancelar una inscripción
export const cancelRegistration = async (req, res) => {
    try {
        await RegistrationService.deleteRegistrationService(req.params.id);
        res.json({ message: "Inscripción cancelada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener los asistentes de un evento
export const getEventAttendees = async (req, res) => {
    try {
        const data = await RegistrationService.getAttendeesByEventService(req.params.eventId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};