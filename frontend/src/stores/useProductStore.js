// frontend/src/stores/useProductStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const asArray = (data) => {
	if (Array.isArray(data)) return data;
	if (Array.isArray(data?.products)) return data.products;
	if (Array.isArray(data?.data)) return data.data;
	return [];
};

export const useProductStore = create((set, get) => ({
	products: [],
	loading: false,

	setProducts: (list) => set({ products: asArray(list) }),

	createProduct: async (payload) => {
		set({ loading: true });
		try {
			// POST /api/products
			const { data } = await axios.post("/products", payload, { withCredentials: true });

			// Δέχεται και τα δύο σχήματα: {success, product} ή σκέτο product
			const created = data?.product ?? data;

			set((state) => ({
				products: [created, ...state.products],
				loading: false,
			}));

			toast.success("Product created");
			return created;
		} catch (error) {
			set({ loading: false });
			const msg = error?.response?.data?.message || "Error creating product";
			toast.error(msg);
			throw error;
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const { data } = await axios.get("/products");
			set({ products: asArray(data), loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},

	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const { data } = await axios.get(`/products/category/${category}`);
			set({ products: asArray(data), loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to fetch products");
		}
	},

	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const { data } = await axios.get("/products/featured"); // array ή {products:[...]}
			set({ products: asArray(data), loading: false });
		} catch (error) {
			set({ loading: false });
			console.log("Error fetching featured products:", error);
		}
	},

	// Αν έχεις ξεχωριστό endpoint:
	fetchRecommendations: async () => {
		set({ loading: true });
		try {
			const { data } = await axios.get("/products/recommendations"); // προσαρμοσμένο στο backend σου
			set({ products: asArray(data), loading: false });
		} catch {
			set({ loading: false });
		}
	},

	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((state) => ({
				products: state.products.filter((p) => p._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to delete product");
		}
	},

	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const current = get().products.find((p) => p._id === productId);
			const next = !(current?.isFeatured);
			const { data } = await axios.patch(`/products/${productId}`, { isFeatured: next });
			set((state) => ({
				products: state.products.map((p) =>
					p._id === productId ? { ...p, isFeatured: data.isFeatured ?? next } : p
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Failed to update product");
		}
	},
}));
