import * as payments from "../services/payment.service.js";

const mockFindByCodeForUser = jest.fn();
const mockDeleteByUser = jest.fn();
const mockCreateCouponDoc = jest.fn();

jest.mock("../repositories/coupon.repo.js", () => ({
    findByCodeForUser: (...a) => mockFindByCodeForUser(...a),
    deleteByUser: (...a) => mockDeleteByUser(...a),
    create: (...a) => mockCreateCouponDoc(...a),
}));

const mockCreateSession = jest.fn(async () => ({ id: "cs_123" }));
const mockCreateStripeCoupon = jest.fn(async () => ({ id: "cp_123" }));

jest.mock("../lib/stripe.js", () => ({
    stripe: {
        checkout: { sessions: { create: (...a) => mockCreateSession(...a) } },
        coupons: { create: (...a) => mockCreateStripeCoupon(...a) },
    },
}));

beforeAll(() => {
    process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
});

beforeEach(() => {
    mockFindByCodeForUser.mockReset();
    mockDeleteByUser.mockReset();
    mockCreateCouponDoc.mockReset();
    mockCreateSession.mockClear();
    mockCreateStripeCoupon.mockClear();
});

describe("payment.service", () => {
    test("createCheckoutSession without coupon", async () => {
        const user = { _id: "u1" };
        const body = {
            products: [{ id: "p1", name: "P1", price: 50, quantity: 1, image: "http://img" }]
        };
        const res = await payments.createCheckoutSession(user, body, process.env.CLIENT_URL);
        expect(res).toEqual({ id: "cs_123", totalAmount: 50 });
        expect(mockCreateSession).toHaveBeenCalled();
    });

    test("createCheckoutSession with coupon", async () => {
        const user = { _id: "u1" };
        const body = {
            products: [{ id: "p1", name: "P1", price: 50, quantity: 1, image: "http://img" }],
            couponCode: "WELCOME10",
        };
        mockFindByCodeForUser.mockResolvedValue({
            discountPercentage: 10,
            expirationDate: new Date(Date.now() + 100000),
            isActive: true,
            save: async () => {},
        });

        const res = await payments.createCheckoutSession(user, body, process.env.CLIENT_URL);
        expect(res.id).toBe("cs_123");
        expect(mockCreateStripeCoupon).toHaveBeenCalled();
    });
});
