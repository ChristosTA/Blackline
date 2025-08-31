import Coupon from "../models/coupon.model.js";

export async function getCoupon(userId) {
    return Coupon.findOne({ userId, isActive: true });
}

export async function validateCoupon(userId, code) {
    const coupon = await Coupon.findOne({ code, userId, isActive: true });
    if (!coupon) { const e = new Error("Invalid coupon"); e.status = 404; throw e; }
    const now = new Date();
    if (coupon.expirationDate <= now) {
        coupon.isActive = false;
        await coupon.save();
        const e = new Error("Coupon expired"); e.status = 404; throw e;
    }
    return { code: coupon.code, discountPercentage: coupon.discountPercentage };
}
