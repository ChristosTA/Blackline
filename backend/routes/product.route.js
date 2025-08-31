import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  toggleFeaturedProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { CreateProductDto, PatchProductFeaturedDto } from "../dto/product.dto.js";
import { validateParams } from "../middleware/validateParams.middleware.js";
import { ObjectIdDto } from "../dto/common.dto.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/", protectRoute, adminRoute, validate(CreateProductDto), createProduct);
router.patch("/:id", validateParams(ObjectIdDto), protectRoute, adminRoute, validate(PatchProductFeaturedDto), toggleFeaturedProduct);
router.delete("/:id", validateParams(ObjectIdDto), protectRoute, adminRoute, deleteProduct);

export default router;
