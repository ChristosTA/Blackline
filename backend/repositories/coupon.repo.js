import Coupon from "../models/coupon.model.js";
export function findActiveByUser(userId) { return Coupon.findOne({ userId, isActive: true }); }
export function findByCodeForUser(code, userId) { return Coupon.findOne({ code, userId, isActive: true }); }
export function create(doc) { return Coupon.create(doc); }
export function deleteByUser(userId) { return Coupon.findOneAndDelete({ userId }); }
