import { Router } from "express";
import {
    getAllOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer
} from "../controllers/offers.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Rutas publicas ---

// URL: GET /api/offers
router.get("/", getAllOffers);
// URL: GET /api/offers/:id
router.get("/:id", getOfferById);

// --- Rutas solo Administradores ---

// URL: POST /api/offers
router.post("/", authenticateToken, isAdmin, createOffer);
// URL: PUT /api/offers/:id
router.put("/:id", authenticateToken, isAdmin, updateOffer);
// URL: DELETE /api/offers/:id
router.delete("/:id", authenticateToken, isAdmin, deleteOffer);

export default router;