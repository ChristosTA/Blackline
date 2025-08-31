import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateParams } from "../middleware/validateParams.middleware.js";
import { AddToCartDto, UpdateQuantityDto } from "../dto/cart.dto.js";
import { ObjectIdDto } from "../dto/common.dto.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, validate(AddToCartDto), addToCart);
router.delete("/", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, validateParams(ObjectIdDto), validate(UpdateQuantityDto), updateQuantity);

export default router;
