import * as repo from "../repositories/product.repo.js";
import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";

const FEATURED_CACHE_KEY = "featured_products";

export async function listAll() { return repo.findAll(); }

export async function listFeatured() {
  try {
    const cached = await redis.get(FEATURED_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (_) {}
  const data = await repo.findMany({ isFeatured: true });
  try { await redis.set(FEATURED_CACHE_KEY, JSON.stringify(data)); } catch (_) {}
  return data;
}

export function listByCategory(category) { return repo.findMany({ category }); }

export async function createProduct({ name, description, price, image, category }) {
  let imageUrl = "";
  if (image) {
    const uploaded = await cloudinary.uploader.upload(image, { folder: "products" });
    imageUrl = uploaded?.secure_url || "";
  }
  const created = await repo.create({ name, description, price, image: imageUrl, category });
  await invalidateFeatured();
  return created;
}

export async function setFeatured(id, isFeatured) {
  const updated = await repo.updateById(id, { isFeatured });
  await invalidateFeatured();
  return updated;
}

export async function toggleFeatured(id) {
  const current = await repo.findById(id);
  if (!current) throw Object.assign(new Error("Product not found"), { status: 404 });
  const updated = await repo.updateById(id, { isFeatured: !current.isFeatured });
  await invalidateFeatured();
  return updated;
}

export async function remove(id) {
  await repo.deleteById(id);
  await invalidateFeatured();
}

async function invalidateFeatured() {
  try { await redis.del(FEATURED_CACHE_KEY); } catch (_) {}
}
