import { redis } from "../lib/redis.js";
const key = (userId) => `refresh_token:${userId}`;
export async function storeRefreshToken(userId, token, days=7) { const ttl = days*24*60*60; await redis.set(key(userId), token, "EX", ttl); }
export async function readRefreshToken(userId) { return redis.get(key(userId)); }
export async function deleteRefreshToken(userId) { try { await redis.del(key(userId)); } catch (_) {} }
