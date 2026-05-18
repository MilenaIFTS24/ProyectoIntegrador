import { EventRegistrations, Events, Users } from '../models/index.js';

export const registerToEventService = async (registrationData) => {
    const event = await Events.findByPk(registrationData.eventId);
    if (!event) throw new Error('Evento inexistente');

    // Validación de cupo
    const count = await EventRegistrations.count({ 
        where: { eventId: event.id, status: 'confirmada' } 
    });

    if (event.maxCapacity && count >= event.maxCapacity) {
        throw new Error('Cupo máximo alcanzado');
    }

    return await EventRegistrations.create(registrationData);
};

export const getRegistrationsByUserService = async (userId) => {
    return await EventRegistrations.findAll({
        where: { userId },
        include: [{ model: Events, as: 'event' }]
    });
};

export const getAttendeesByEventService = async (eventId) => {
    return await EventRegistrations.findAll({
        where: { eventId },
        include: [{ model: Users, attributes: ['name', 'email'] }]
    });
};

export const deleteRegistrationService = async (id) => {
    return await EventRegistrations.destroy({ where: { id } });
};