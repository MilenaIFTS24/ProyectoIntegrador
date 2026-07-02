import { Reservations, ReservationItems, Products } from '../models/index.js';
import sequelize from '../data/database.js';

// Crear una nueva reserva
export const createReservationService = async (reservationData, items) => {
    const t = await sequelize.transaction();
    try {
        const reservation = await Reservations.create(reservationData, { transaction: t });
        const itemsData = items.map(item => ({
            ...item,
            reservationId: reservation.id
        }));
        await ReservationItems.bulkCreate(itemsData, { transaction: t });

        for (const item of items) {
            console.log(`Decrementando stock del producto ${item.productId} en ${item.quantity}`);
            const [updatedCount] = await Products.decrement('stock', {
                by: item.quantity,
                where: { id: item.productId },
                transaction: t
            });
            const productAfter = await Products.findByPk(item.productId, { transaction: t });
        }

        await t.commit();
        return reservation;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// Obtener todas las reservas
export const findAllReservationsService = async (status) => {
    const where = status ? { status } : {};

    const reservations = await Reservations.findAll({
        where,
        include: [{ model: ReservationItems, as: 'items' }],
        order: [['createdAt', 'DESC']]
    });

    let allProductIds = [];
    for (const r of reservations) {
        for (const item of r.items) {
            allProductIds.push(item.productId);
        }
    }
    const uniqueProductIds = [...new Set(allProductIds)];

    const products = await Products.findAll({
        where: { id: uniqueProductIds },
        attributes: ['id', 'name', 'productType', 'price']
    });

    const productMap = {};
    for (const p of products) {
        productMap[p.id] = p.toJSON();
    }

    const result = reservations.map(r => {
        const rJson = r.toJSON();
        rJson.items = rJson.items.map(item => {
            item.product = productMap[item.productId] || null;
            return item;
        });
        return rJson;
    });

    return result;
};

// Obtener una reserva por ID
export const getReservationByIdService = async (id) => {
    const reservation = await Reservations.findByPk(id, {
        include: [{ model: ReservationItems, as: 'items' }]
    });

    if (!reservation) {
        throw new Error('Reserva no encontrada');
    }

    // Obtener productos para los items
    const productIds = reservation.items.map(item => item.productId);
    const uniqueProductIds = [...new Set(productIds)];

    const products = await Products.findAll({
        where: { id: uniqueProductIds },
        attributes: ['id', 'name', 'productType', 'price']
    });

    const productMap = {};
    for (const p of products) {
        productMap[p.id] = p.toJSON();
    }

    const result = reservation.toJSON();
    result.items = result.items.map(item => {
        item.product = productMap[item.productId] || null;
        return item;
    });

    return result;
};

// Obtener las reservas de un usuario
export const findReservationsByUserService = async (userId) => {
    const reservations = await Reservations.findAll({
        where: { userId },
        include: [{ model: ReservationItems, as: 'items' }],
        order: [['createdAt', 'DESC']]
    });

    let allProductIds = [];
    for (const r of reservations) {
        for (const item of r.items) {
            allProductIds.push(item.productId);
        }
    }
    const uniqueProductIds = [...new Set(allProductIds)];

    const products = await Products.findAll({
        where: { id: uniqueProductIds },
        attributes: ['id', 'name', 'productType', 'price']
    });

    const productMap = {};
    for (const p of products) {
        productMap[p.id] = p.toJSON();
    }

    const result = reservations.map(r => {
        const rJson = r.toJSON();
        rJson.items = rJson.items.map(item => {
            item.product = productMap[item.productId] || null;
            return item;
        });
        return rJson;
    });

    return result;
};

// Actualizar el estado de una reserva
export const updateStatusService = async (id, data) => {
    const { status, pickupDate, isEcoPackaging } = data;

    const reservation = await Reservations.findByPk(id, {
        include: [{ model: ReservationItems, as: 'items' }]
    });
    if (!reservation) throw new Error('Reserva no encontrada');
    if (reservation.status === 'cancelada' || reservation.status === 'entregada') {
        throw new Error(`No se puede modificar una reserva ${reservation.status}`);
    }


    if (status === 'cancelada' && reservation.status !== 'cancelada') {
        const t = await sequelize.transaction();
        try {
            for (const item of reservation.items) {
                await Products.increment('stock', {
                    by: item.quantity,
                    where: { id: item.productId },
                    transaction: t
                });
            }

            await reservation.update(
                { status, pickupDate, isEcoPackaging, cancelledAt: new Date() },
                { transaction: t }
            );

            await t.commit();
            return reservation;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } else {
        return await reservation.update(data);
    }
};

// Cancelar una reserva (estado)
export const cancelReservationService = async (id) => {
    const t = await sequelize.transaction();
    try {
        const reservation = await Reservations.findByPk(id, {
            include: [{ model: ReservationItems, as: 'items' }]
        });
        if (!reservation) {
            throw new Error('Reserva no encontrada');
        }
        if (reservation.status !== 'pendiente') {
            throw new Error('Solo se cancelan pendientes');
        }

        for (const item of reservation.items) {
            const [updatedCount] = await Products.increment('stock', {
                by: item.quantity,
                where: { id: item.productId },
                transaction: t
            });

            const productAfter = await Products.findByPk(item.productId, { transaction: t });
        }

        await reservation.update({ status: 'cancelada', cancelledAt: new Date() }, { transaction: t });

        await t.commit();
        return true;
    } catch (error) {
        await t.rollback();
        throw error;
    }

};

// Eliminar una reserva
export const deleteReservationService = async (id) => {
    const t = await sequelize.transaction();
    try {
        const reservation = await Reservations.findByPk(id, {
            include: [{ model: ReservationItems, as: 'items' }]
        });
        if (!reservation) throw new Error('Reserva no encontrada');

        if (reservation.status === 'pendiente') {
            for (const item of reservation.items) {
                await Products.increment('stock', {
                    by: item.quantity,
                    where: { id: item.productId },
                    transaction: t
                });
            }
        }

        await ReservationItems.destroy({
            where: { reservationId: id },
            transaction: t
        });

        await reservation.destroy({ transaction: t });

        await t.commit();
        return { message: 'Reserva eliminada correctamente' };
    } catch (error) {
        await t.rollback();
        throw error;
    }
};