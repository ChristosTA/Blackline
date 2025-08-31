import mongoose from "mongoose";
const { Schema } = mongoose;

const couponSchema = new Schema({
	code: { type: String, required: true, trim: true, uppercase: true, unique: true },
	discountPercentage: { type: Number, required: true, min: 0, max: 100 },
	isActive: { type: Boolean, default: true },
	expirationDate: { type: Date, required: true },
	usedBy: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

couponSchema.index({ code: 1 }, { unique: true });

export default mongoose.model("Coupon", couponSchema);
