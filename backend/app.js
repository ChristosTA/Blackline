// app.js
import express from "express";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./swagger/swagger.js";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const distPath   = path.join(__dirname, "../frontend/dist");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Swagger
setupSwagger(app);

// Serve frontend build (ίδιο origin)
app.use(express.static(distPath));
app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

export default app;
