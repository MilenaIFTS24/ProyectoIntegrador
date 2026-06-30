import { Reservations, ReservationItems, Products } from '../models/index.js';
import sequelize from '../data/database.js';

console.log('🛠️ Servicio de reservas cargado');

export const createReservationService = async (reservationData, items) => {
    console.log('📝 Creando nueva reserva con items:', items);
    const t = await sequelize.transaction();
    try {
        const reservation = await Reservations.create(reservationData, { transaction: t });
        const itemsData = items.map(item => ({
            ...item,
            reservationId: reservation.id
        }));
        await ReservationItems.bulkCreate(itemsData, { transaction: t });

        // Descontar stock
        for (const item of items) {
            console.log(`📉 Decrementando stock del producto ${item.productId} en ${item.quantity}`);
            const [updatedCount] = await Products.decrement('stock', {
                by: item.quantity,
                where: { id: item.productId },
                transaction: t
            });
            console.log(`   ✅ Filas afectadas: ${updatedCount}`);
            const productAfter = await Products.findByPk(item.productId, { transaction: t });
            console.log(`   📊 Nuevo stock del producto: ${productAfter.stock}`);
        }

        await t.commit();
        console.log(`✅ Reserva ${reservation.id} creada exitosamente. Stock actualizado.`);
        return reservation;
    } catch (error) {
        await t.rollback();
        console.error('❌ Error al crear reserva:', error);
        throw error;
    }
};

export const findAllReservationsService = async (status) => {
    console.log('🔍 findAllReservationsService llamado con status:', status);
    const where = status ? { status } : {};

    // 1. Obtener reservas con sus items (sin productos aún)
    const reservations = await Reservations.findAll({
        where,
        include: [{ model: ReservationItems, as: 'items' }],
        order: [['createdAt', 'DESC']]
    });

    console.log('📦 Reservas encontradas:', reservations.length);

    // 2. Extraer todos los productIds
    let allProductIds = [];
    for (const r of reservations) {
        for (const item of r.items) {
            allProductIds.push(item.productId);
        }
    }
    const uniqueProductIds = [...new Set(allProductIds)];
    console.log('🆔 Product IDs únicos:', uniqueProductIds);

    // 3. Obtener productos en una sola consulta
    const products = await Products.findAll({
        where: { id: uniqueProductIds },
        attributes: ['id', 'name', 'productType', 'price']
    });
    console.log('📦 Productos encontrados:', products.length);

    // 4. Crear un mapa id -> producto
    const productMap = {};
    for (const p of products) {
        productMap[p.id] = p.toJSON();
    }

    // 5. Convertir reservas a JSON plano y agregar 'product' a cada item
    const result = reservations.map(r => {
        const rJson = r.toJSON();
        rJson.items = rJson.items.map(item => {
            item.product = productMap[item.productId] || null;
            return item;
        });
        return rJson;
    });

    console.log('✅ Resultado final (primer item):', JSON.stringify(result[0]?.items?.[0] || 'sin items'));
    return result;
};

export const getReservationByIdService = async (id) => {
    console.log('🔍 getReservationByIdService llamado con id:', id);
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

export const updateStatusService = async (id, data) => {
    const reservation = await Reservations.findByPk(id);
    if (!reservation) throw new Error('Reserva no encontrada');
    return await reservation.update(data);
};

export const cancelReservationService = async (id) => {
    console.log(`🔍 Iniciando cancelación de reserva: ${id}`);
    const t = await sequelize.transaction();
    try {
        const reservation = await Reservations.findByPk(id, {
            include: [{ model: ReservationItems, as: 'items' }]
        });
        if (!reservation) {
            console.error(`❌ Reserva ${id} no encontrada`);
            throw new Error('Reserva no encontrada');
        }
        if (reservation.status !== 'pendiente') {
            console.error(`❌ La reserva ${id} no está pendiente (estado actual: ${reservation.status})`);
            throw new Error('Solo se cancelan pendientes');
        }

        console.log(`📦 Reserva encontrada. Items: ${reservation.items.length}`);
        for (const item of reservation.items) {
            console.log(`   - Producto ID: ${item.productId}, Cantidad: ${item.quantity}`);
        }

        // Reintegro de stock
        for (const item of reservation.items) {
            console.log(`🔄 Incrementando stock del producto ${item.productId} en ${item.quantity}`);
            const [updatedCount] = await Products.increment('stock', {
                by: item.quantity,
                where: { id: item.productId },
                transaction: t
            });
            console.log(`   ✅ Filas afectadas: ${updatedCount}`);

            // Verificar el nuevo stock después del incremento
            const productAfter = await Products.findByPk(item.productId, { transaction: t });
            console.log(`   📊 Nuevo stock del producto: ${productAfter.stock}`);
        }

        // Actualizar estado de la reserva
        console.log(`🔄 Actualizando estado de reserva a 'cancelada'`);
        await reservation.update({ status: 'cancelada', cancelledAt: new Date() }, { transaction: t });

        console.log(`✅ Confirmando transacción`);
        await t.commit();
        console.log(`✅ Reserva ${id} cancelada exitosamente. Stock reintegrado.`);
        return true;
    } catch (error) {
        console.error(`❌ Error al cancelar la reserva ${id}:`, error);
        await t.rollback();
        throw error;
    }
};