import { Events, sequelize } from '../models/index.js';

export const getAllEventsService = async () => {
    return await Events.findAll({
        attributes: {
            include: [
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM event_registrations AS registration
                        WHERE registration.eventId = Events.id
                    )`),
                    'currentRegistrations'
                ]
            ]
        },
        order: [['date', 'ASC']]
    });
};

export const getEventByIdService = async (id) => {
    return await Events.findByPk(id, {
        attributes: {
            include: [
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM event_registrations AS registration
                        WHERE registration.eventId = Events.id
                    )`),
                    'currentRegistrations'
                ]
            ]
        }
    });
};

export const createEventService = async (eventData) => {
    return await Events.create(eventData);
};

export const updateEventService = async (id, eventData) => {
    const event = await Events.findByPk(id);
    if (!event) throw new Error('Evento no encontrado');
    return await event.update(eventData);
};

export const deleteEventService = async (id) => {
    return await Events.destroy({ where: { id } });
};