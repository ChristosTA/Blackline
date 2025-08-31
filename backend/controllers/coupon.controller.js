import * as svc from "../services/coupon.service.js";

export const getCoupon = async (req, res) => {
	try { res.json(await svc.getCoupon(req.user._id) || null); }
	catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.validated ?? req.body;
		const result = await svc.validateCoupon(req.user._id, code);
		res.json({ message: "Coupon is valid", ...result });
	} catch (error) {
		res.status(error.status || 500).json({ message: error.status===500?'Server error':error.message, error: error.message });
	}
};
