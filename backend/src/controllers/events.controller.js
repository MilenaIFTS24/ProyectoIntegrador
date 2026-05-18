import * as EventService from '../services/events.service.js';

export const getAllEvents = async (req, res) => {
    try {
        const data = await EventService.getAllEventsService();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const data = await EventService.getEventByIdService(req.params.id);
        if (!data) return res.status(404).json({ error: "Evento no encontrado" });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const result = await EventService.createEventService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const result = await EventService.updateEventService(req.params.id, req.body);
        res.json({ message: "Evento actualizado", result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        await EventService.deleteEventService(req.params.id);
        res.json({ message: "Evento eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};