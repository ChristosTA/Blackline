// backend/controllers/auth.controller.js
import * as auth from "../services/auth.service.js";

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000,
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

export const signup = async (req, res) => {
	try {
		const { user, accessToken, refreshToken } = await auth.signup(req.validated ?? req.body);
		setCookies(res, accessToken, refreshToken);
		res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ message: status === 500 ? "Server error" : error.message, error: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { user, accessToken, refreshToken } = await auth.login(req.validated ?? req.body);
		setCookies(res, accessToken, refreshToken);
		res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ message: status === 500 ? "Server error" : error.message, error: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		await auth.logout(req.cookies?.refreshToken);
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const accessToken = await auth.refreshAccessToken(req.cookies?.refreshToken);
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});
		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ message: status === 500 ? "Server error" : error.message, error: error.message });
	}
};

export const getProfile = async (req, res) => {
	try { res.json(req.user); }
	catch (error) { res.status(500).json({ message: "Server error", error: error.message }); }
};
