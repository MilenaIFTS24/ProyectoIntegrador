import { EventRegistrations, Events, Users } from '../models/index.js';

// Inscripcion a un evento
export const registerToEventService = async (registrationData) => {
    const event = await Events.findByPk(registrationData.eventId);
    if (!event) throw new Error('Evento inexistente');

    const count = await EventRegistrations.count({ 
        where: { eventId: event.id, status: 'confirmada' } 
    });

    if (event.maxCapacity && count >= event.maxCapacity) {
        throw new Error('Cupo máximo alcanzado');
    }

    return await EventRegistrations.create(registrationData);
};

// Obtener las inscripciones de un usuario
export const getRegistrationsByUserService = async (userId) => {
    return await EventRegistrations.findAll({
        where: { userId },
        include: [{ model: Events, as: 'event' }]
    });
};

// Obtener los asistentes de un evento
export const getAttendeesByEventService = async (eventId) => {
    return await EventRegistrations.findAll({
        where: { eventId },
        include: [{ model: Users, attributes: ['name', 'email'] }]
    });
};

// Cancelar una inscripcion
export const deleteRegistrationService = async (id) => {
    return await EventRegistrations.destroy({ where: { id } });
};