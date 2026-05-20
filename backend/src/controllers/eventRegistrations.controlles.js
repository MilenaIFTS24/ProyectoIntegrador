import * as RegistrationService from '../services/eventRegistrations.service.js';

export const registerToEvent = async (req, res) => {
    try {
        // La lógica de validación de cupo ya está en el Service
        const result = await RegistrationService.registerToEventService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getUserRegistrations = async (req, res) => {
    try {
        const data = await RegistrationService.getRegistrationsByUserService(req.params.userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelRegistration = async (req, res) => {
    try {
        await RegistrationService.deleteRegistrationService(req.params.id);
        res.json({ message: "Inscripción cancelada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEventAttendees = async (req, res) => {
    try {
        const data = await RegistrationService.getAttendeesByEventService(req.params.eventId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};