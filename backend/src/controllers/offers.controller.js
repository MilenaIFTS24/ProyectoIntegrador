import { 
    getAllOffersService, 
    getOfferByIdService, 
    createOfferService, 
    updateOfferService, 
    deleteOfferService 
} from "../services/offers.service.js";

export const getAllOffers = async (req, res) => {
    try {
        const offers = await getAllOffersService();
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOfferById = async (req, res) => {
    try {
        const { id } = req.params;
        const offer = await getOfferByIdService(id);
        res.status(200).json(offer);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createOffer = async (req, res) => {
    try {
        const newOffer = await createOfferService(req.body);
        res.status(201).json(newOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedOffer = await updateOfferService(id, req.body);
        res.status(200).json(updatedOffer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteOfferService(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};