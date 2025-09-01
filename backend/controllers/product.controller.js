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
  try {
    // Δούλεψε είτε έχεις validation middleware είτε όχι
    const payload = req.validated ?? req.body;

    if (!payload) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { name, description, price, image, category } = payload;

    // Basic required checks (σύμφωνα με το schema)
    if (!name || !description || price == null || !category || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const created = await svc.createProduct({
      name,
      description,
      price: Number(price),
      image,
      category,
    });

    return res.status(201).json({ success: true, product: created });
  } catch (error) {
    return res
        .status(error.status || 500)
        .json({ message: error.message || "Server error" });
  }
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
