import User from "../models/user.model.js";
export function findByEmail(email) { return User.findOne({ email }); }
export function findById(id) { return User.findById(id); }
export function create(doc) { return User.create(doc); }
export function updateById(id, patch) { return User.findByIdAndUpdate(id, patch, { new: true }); }
