import { Offers, Products } from "../models/index.js";
import ProductOffers from '../models/productOffers.model.js';

// Obtener todas las ofertas
export const getAllOffersService = async () => {
    const offers = await Offers.findAll({
        include: [
            {
                model: Products,
                as: 'Products',
                attributes: ['id', 'name', 'price'],
                through: { attributes: [] }
            }
        ]
    });
    return offers;
}

// Obtener una oferta por ID
export const getOfferByIdService = async (id) => {
    const offer = await Offers.findByPk(id, {
        include: [
            {
                model: Products,
                attributes: ['id', 'name', 'price'],
                through: {
                    attributes: []
                }
            }
        ]
    });

    if (!offer) {
        throw new Error("Oferta no encontrada");
    }
    return offer;
}

// Crear una nueva oferta
export const createOfferService = async (data) => {
    const { title, type, value, productIds } = data;

    if (!title || !type || value === undefined || value === null) {
        throw new Error("Todos los campos son obligatorios");
    }

    const newOffer = await Offers.create({
        title,
        type,
        value,
        active: data.active !== undefined ? data.active : true
    });

    if (productIds && Array.isArray(productIds) && productIds.length > 0) {

        const relations = productIds.map(id => ({
            offerId: newOffer.id,
            productId: id.toString().trim()
        }));

        await ProductOffers.bulkCreate(relations);

    }
    return newOffer;
}

// Actualizar una oferta
export const updateOfferService = async (id, data) => {
    const { title, type, value, active, productIds } = data;

    const offer = await Offers.findByPk(id);
    if (!offer) {
        throw new Error("Oferta no encontrada");
    }

    await offer.update({ title, type, value, active });

    if (productIds && Array.isArray(productIds)) {
        await ProductOffers.destroy({
            where: { offerId: id }
        });

        if (productIds.length > 0) {
            const relations = productIds.map(productId => ({
                offerId: id,
                productId: productId.toString().trim()
            }));
            await ProductOffers.bulkCreate(relations);
        }
    }

    const updatedOffer = await Offers.findByPk(id, {
        include: [
            {
                model: Products,
                as: 'Products',
                attributes: ['id', 'name', 'price'],
                through: { attributes: [] }
            }
        ]
    });

    return updatedOffer;
}

// Eliminar una oferta
export const deleteOfferService = async (id) => {
    const offer = await Offers.findByPk(id);
    if (!offer) {
        throw new Error("Oferta no encontrada");
    }

    await ProductOffers.destroy({
        where: { offerId: id }
    });

    await offer.destroy();
    return { message: "Oferta eliminada correctamente" };
}