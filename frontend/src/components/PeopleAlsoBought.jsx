// frontend/src/components/PeopleAlsoBought.jsx
import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "./ProductCard";

const toArray = (v) => {
	if (Array.isArray(v)) return v;
	if (Array.isArray(v?.products)) return v.products;
	if (Array.isArray(v?.data)) return v.data;
	return [];
};

const PeopleAlsoBought = () => {
	// Αν δεν έχεις ξεχωριστό endpoint για recommendations, άσε τη μέθοδο να δείχνει στο fetchFeaturedProducts
	const fetchRecs = useProductStore((s) => s.fetchRecommendations || s.fetchFeaturedProducts);
	const productsState = useProductStore((s) => s.products);
	const loading = useProductStore((s) => s.loading);

	useEffect(() => {
		fetchRecs?.().catch(() => {});
	}, [fetchRecs]);

	const list = toArray(productsState);

	if (loading && list.length === 0) return null; // ή skeleton
	if (list.length === 0) return null;

	return (
		<section className='mt-8'>
			<h3 className='mb-4 text-xl font-semibold'>People also bought</h3>
			<div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
				{list.map((p) => (
					<ProductCard key={p._id ?? p.id} product={p} />
				))}
			</div>
		</section>
	);
};

export default PeopleAlsoBought;
