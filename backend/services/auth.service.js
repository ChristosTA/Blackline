import jwt from "jsonwebtoken";
import * as users from "../repositories/user.repo.js";
import * as tokens from "../repositories/token.repo.js";

function generateTokens(userId) {
    const accessToken  = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET,  { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d"  });
    return { accessToken, refreshToken };
}

export async function signup({ name, email, password }) {
    const existing = await users.findByEmail(email);
    if (existing) { const err = new Error("User already exists"); err.status = 400; throw err; }
    const user = await users.create({ name, email, password });
    const tokensPair = generateTokens(user._id);
    await tokens.storeRefreshToken(user._id, tokensPair.refreshToken, 7);
    return { user, ...tokensPair };
}

export async function login({ email, password }) {
    const user = await users.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
        const err = new Error("Invalid email or password"); err.status = 401; throw err;
    }
    const tokensPair = generateTokens(user._id);
    await tokens.storeRefreshToken(user._id, tokensPair.refreshToken, 7);
    return { user, ...tokensPair };
}

export async function logout(refreshTokenCookie) {
    if (!refreshTokenCookie) return;
    try {
        const decoded = jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET);
        await tokens.deleteRefreshToken(decoded.userId);
    } catch (_) {}
}

export async function refreshAccessToken(refreshTokenCookie) {
    if (!refreshTokenCookie) { const err = new Error("No refresh token provided"); err.status = 401; throw err; }
    let decoded;
    try { decoded = jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET); }
    catch { const err = new Error("Invalid refresh token"); err.status = 401; throw err; }
    const stored = await tokens.readRefreshToken(decoded.userId);
    if (stored !== refreshTokenCookie) { const err = new Error("Invalid refresh token"); err.status = 401; throw err; }
    return jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}
