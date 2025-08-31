import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

// δέχεται id ή product object και επιστρέφει string id
const resolveId = (x) =>
	typeof x === "string" ? x : x?._id ?? x?.id ?? x?.productId ?? x?.product?._id;

export const useCartStore = create((set, get) => ({
	cart: [],           // <- το μοναδικό source of truth για items στο UI
	subtotal: 0,
	total: 0,
	coupon: null,
	isCouponApplied: false,

	// ----------------- helpers -----------------
	_setCart: (items) => {
		const cart = Array.isArray(items) ? items : [];
		const subtotal = cart.reduce(
			(sum, it) => sum + (it.price ?? it.product?.price ?? 0) * (it.quantity || 0),
			0
		);
		const { coupon, isCouponApplied } = get();
		const total =
			isCouponApplied && coupon
				? subtotal - subtotal * (coupon.discountPercentage / 100)
				: subtotal;

		set({ cart, subtotal, total });
	},

	// ----------------- READ -----------------
	getCartItems: async () => {
		try {
			const { data } = await axios.get("/cart");
			get()._setCart(data);
			return data;
		} catch (err) {
			if (err?.response?.status !== 401) {
				toast.error(err?.response?.data?.message || "Failed to load cart");
			}
			set({ cart: [], subtotal: 0, total: 0 });
			return [];
		}
	},
	// συμβατότητα με παλιές κλήσεις
	getCartProducts: async () => get().getCartItems(),

	// ----------------- CREATE / UPDATE -----------------
	addToCart: async (productOrId, quantity = 1) => {
		try {
			const id =
				typeof productOrId === "string"
					? productOrId
					: productOrId?._id || productOrId?.id;

			if (!id) throw new Error("No product id");

			const { data } = await axios.post(
				"/cart",
				{ productId: id, quantity },
				{ withCredentials: true }
			);

			set({ items: Array.isArray(data?.items) ? data.items : [] });
			get().calculateTotals();
			toast.success("Added to cart");
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to add to cart");
		}
	},

	updateQuantity: async (productOrId, quantity) => {
		try {
			const productId = resolveId(productOrId);
			await axios.put(`/cart/${productId}`, { quantity });
			await get().getCartItems();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to update quantity");
			throw err;
		}
	},

	// ----------------- DELETE -----------------
	removeFromCart: async (productOrId) => {
		try {
			const productId = resolveId(productOrId);
			await axios.delete("/cart", { data: { productId } });
			await get().getCartItems();
			toast.success("Removed from cart");
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to remove");
			throw err;
		}
	},

	removeAllFromCart: async () => {
		try {
			await axios.delete("/cart");
			set({ cart: [], subtotal: 0, total: 0 });
			toast.success("Cart cleared");
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to clear cart");
			throw err;
		}
	},

	// ----------------- COUPON (αν τα χρησιμοποιείς) -----------------
	applyCoupon: async (code) => {
		try {
			const { data } = await axios.post("/coupons/validate", { code });
			set({ coupon: data, isCouponApplied: true });
			get()._setCart(get().cart); // επαναυπολογισμός totals
			toast.success("Coupon applied");
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get()._setCart(get().cart);
		toast.success("Coupon removed");
	},
}));
