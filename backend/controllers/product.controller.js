import * as svc from "../services/product.service.js";

export const getAllProducts = async (req, res) => {
  try { res.json({ products: await svc.listAll() }); }
  catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

export const getFeaturedProducts = async (req, res) => {
  try { res.json(await svc.listFeatured()); }
  catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

export const getProductsByCategory = async (req, res) => {
  try { res.json({ products: await svc.listByCategory(req.params.category) }); }
  catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

export const createProduct = async (req, res) => {
  try { res.status(201).json(await svc.createProduct(req.validated)); }
  catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const { isFeatured } = req.validated ?? {};
    const id = req.validatedParams?.id || req.params.id;
    const updated = typeof isFeatured === "boolean"
        ? await svc.setFeatured(id, isFeatured)
        : await svc.toggleFeatured(id);
    res.json({ isFeatured: updated.isFeatured });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try { await svc.remove(req.validatedParams?.id || req.params.id); res.json({ message: "Product deleted" }); }
  catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};
