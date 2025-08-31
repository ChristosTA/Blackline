import * as auth from "../services/auth.service.js";

// Χρησιμοποιούμε prefix "mock" για να το επιτρέψει η Jest
const mockMem = new Map();

jest.mock("../repositories/token.repo.js", () => ({
    storeRefreshToken: jest.fn(async (uid, token) => { mockMem.set(String(uid), token); }),
    readRefreshToken: jest.fn(async (uid) => mockMem.get(String(uid))),
    deleteRefreshToken: jest.fn(async (uid) => { mockMem.delete(String(uid)); }),
}));

// Mock user.repo
const mockFindByEmail = jest.fn();
const mockCreate = jest.fn();

jest.mock("../repositories/user.repo.js", () => ({
    findByEmail: (...args) => mockFindByEmail(...args),
    create: (...args) => mockCreate(...args),
}));

beforeAll(() => {
    process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test_access_secret";
    process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "test_refresh_secret";
});

beforeEach(() => {
    mockMem.clear();
    mockFindByEmail.mockReset();
    mockCreate.mockReset();
});

describe("auth.service", () => {
    test("signup creates user and returns tokens", async () => {
        mockFindByEmail.mockResolvedValue(null);
        const fakeUser = { _id: "u1", name: "X", email: "x@example.com" };
        mockCreate.mockResolvedValue(fakeUser);

        const res = await auth.signup({ name: "X", email: "x@example.com", password: "pass" });
        expect(res.user._id).toBe("u1");
        expect(typeof res.accessToken).toBe("string");
        expect(typeof res.refreshToken).toBe("string");
    });

    test("login fails with wrong password", async () => {
        const fakeUser = { _id: "u1", email: "x@example.com", comparePassword: async () => false };
        mockFindByEmail.mockResolvedValue(fakeUser);

        await expect(auth.login({ email: "x@example.com", password: "nope" }))
            .rejects.toHaveProperty("status", 401);
    });

    test("refreshAccessToken returns new access token when refresh cookie matches store", async () => {
        const okUser = { _id: "u2", email: "ok@example.com", comparePassword: async () => true };
        mockFindByEmail.mockResolvedValue(okUser);
        const { refreshToken } = await auth.login({ email: "ok@example.com", password: "pass" });

        const newAccess = await auth.refreshAccessToken(refreshToken);
        expect(typeof newAccess).toBe("string");
        expect(newAccess.length).toBeGreaterThan(10);
    });
});
