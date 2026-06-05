import { Offers } from "../models/index.js";

export const getAllOffersService = async () => {
    return await Offers.findAll();
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
    export const createOfferService = async (data) => {
        const { title, type, value, productIds } = data;

        if (!title || !type || !value) {
            throw new Error("Todos los campos son obligatorios");
        }

        // 1. Oferta principal
        const newOffer = await Offers.create({ title, type, value });

        // 2. Si el usuario seleccionó productos, crear los vínculos en la tabla intermedia
        if (productIds && Array.isArray(productIds) && productIds.length > 0) {
            const relations = productIds.map(productId => ({
                productId: productId,
                offerId: newOffer.id
            }));

            // Inserción masiva en la tabla intermedia
            await ProductOffers.bulkCreate(relations);
        }

        return newOffer;
    }
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