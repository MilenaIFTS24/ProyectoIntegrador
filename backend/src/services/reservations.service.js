import { Reservations, ReservationItems, Products } from '../models/index.js';
import sequelize from '../data/database.js';

export const createReservationService = async (reservationData, items) => {
    const t = await sequelize.transaction();
    try {
        // 1. Crear cabecera
        const reservation = await Reservations.create(reservationData, { transaction: t });

        // 2. Preparar items con el ID de la reserva creada
        const itemsData = items.map(item => ({
            ...item,
            reservationId: reservation.id
        }));

        // 3. Insertar items y actualizar stock masivamente
        await ReservationItems.bulkCreate(itemsData, { transaction: t });

        for (const item of items) {
            await Products.decrement('stock', { 
                by: item.quantity, 
                where: { id: item.productId }, 
                transaction: t 
            });
        }

        await t.commit();
        return reservation;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

export const findAllReservationsService = async (status) => {
    const where = status ? { status } : {};
    return await Reservations.findAll({
        where,
        include: [{ model: ReservationItems, as: 'items' }],
        order: [['createdAt', 'DESC']]
    });
};

export const findReservationsByUserService = async (userId) => {
    return await Reservations.findAll({
        where: { userId },
        include: [{ model: ReservationItems, as: 'items', include: ['product'] }],
        order: [['createdAt', 'DESC']]
    });
};

export const updateStatusService = async (id, data) => {
    const reservation = await Reservations.findByPk(id);
    if (!reservation) throw new Error('Reserva no encontrada');
    return await reservation.update(data);
};

export const cancelReservationService = async (id) => {
    const t = await sequelize.transaction();
    try {
        const reservation = await Reservations.findByPk(id, { 
            include: [{ model: ReservationItems, as: 'items' }] 
        });

        if (!reservation) throw new Error('Reserva no encontrada');
        if (reservation.status !== 'pendiente') throw new Error('Solo se cancelan pendientes');

        // Devolver stock
        for (const item of reservation.items) {
            await Products.increment('stock', { 
                by: item.quantity, 
                where: { id: item.productId }, 
                transaction: t 
            });
        }

        await reservation.update({ status: 'cancelada', cancelledAt: new Date() }, { transaction: t });
        await t.commit();
        return true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};