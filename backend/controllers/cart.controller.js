import * as cart from "../services/cart.service.js";

export const getCartProducts = async (req, res) => {
	try {
		const items = await cart.getCartProducts(req.user._id);
		res.json(items);
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message, error: err.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId, quantity = 1 } = req.body;
		const items = await cart.addToCart(req.user._id, String(productId), Number(quantity));
		res.status(200).json(items);
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message, error: err.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id } = req.params;            // product id
		const { quantity } = req.body;
		const items = await cart.updateQuantity(req.user._id, String(id), Number(quantity));
		res.json(items);
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message, error: err.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		await cart.removeAll(req.user._id);
		res.json([]);
	} catch (err) {
		res.status(err.status || 500).json({ message: err.message, error: err.message });
	}
};
