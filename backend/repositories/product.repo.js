import Product from "../models/product.model.js";

export function findAll() { return Product.find({}).lean(); }
export function findMany(query) { return Product.find(query).lean(); }
export function findById(id) { return Product.findById(id).lean(); }
export function create(doc) { return Product.create(doc); }
export function updateById(id, patch) { return Product.findByIdAndUpdate(id, patch, { new: true }); }
export function deleteById(id) { return Product.findByIdAndDelete(id); }
