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

router.get("/", getAllOffers);
router.get("/:id", getOfferById);
router.post("/", authenticateToken, isAdmin, createOffer);
router.put("/:id", authenticateToken, isAdmin, updateOffer);
router.delete("/:id", authenticateToken, isAdmin, deleteOffer);

export default router;