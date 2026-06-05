import { Offers, Products } from "../models/index.js";
import ProductOffers from '../models/productOffers.model.js';

export const getAllOffersService = async () => {
    const offers = await Offers.findAll({
        include: [
            {
                model: Products,
                as: 'Products',
                attributes: ['id', 'name', 'price'],
                through: { attributes: [] } // Limpia las columnas crudas de la tabla puente
            }
        ]
    });
    return offers;
}

export const getOfferByIdService = async (id) => {
    // Usar include para traer los productos asociados a esta oferta
    const offer = await Offers.findByPk(id, {
        include: [
            {
                model: Products,
                attributes: ['id', 'name', 'price'],
                through: {
                    attributes: [] // Esto oculta los datos de la tabla intermedia en el JSON final
                }
            }
        ]
    });

    if (!offer) {
        throw new Error("Oferta no encontrada");
    }
    return offer;
}

export const createOfferService = async (data) => {
    const { title, type, value, productIds } = data;

    // 1. Validar campos obligatorios de forma segura
    if (!title || !type || value === undefined || value === null) {
        throw new Error("Todos los campos son obligatorios");
    }

    // 2. Crear la oferta principal en la base de datos
    const newOffer = await Offers.create({
        title,
        type,
        value,
        active: data.active !== undefined ? data.active : true
    });

    // 3. Guardado relacional aislado en bloque try/catch propio
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
        try {
            const relations = productIds.map(id => ({
                offerId: newOffer.id,
                productId: id.toString().trim() // 🔥 ELIMINADO EL Number() ACÁ. Enviamos el UUID limpio como string.
            }));

            // Inserción masiva en la tabla intermedia de Supabase
            await ProductOffers.bulkCreate(relations);
            console.log(`✅ Productos asociados con éxito a la oferta ID: ${newOffer.id}`);
        } catch (relationError) {
            console.error("⚠️ Alerta: La oferta se creó pero falló la asociación de productos en la tabla intermedia:");
            console.error(relationError.message);
        }
    }
    return newOffer;
}


export const updateOfferService = async (id, data) => {
    const offer = await Offers.findByPk(id);
    if (!offer) {
        throw new Error("Oferta no encontrada");
    }
    return await offer.update(data);
}

export const deleteOfferService = async (id) => {
    const offer = await Offers.findByPk(id);
    if (!offer) {
        throw new Error("Oferta no encontrada");
    }
    await offer.destroy();
    return { message: "Oferta eliminada correctamente" };
}