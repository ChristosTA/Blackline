import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { CreateCheckoutSessionDto } from "../dto/payment.dto.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, validate(CreateCheckoutSessionDto), createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;
