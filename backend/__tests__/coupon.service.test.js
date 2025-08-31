import * as couponsvc from "../services/coupon.service.js";

const mockFindOne = jest.fn();

jest.mock("../models/coupon.model.js", () => ({
    __esModule: true,
    default: { findOne: (...a) => mockFindOne(...a) },
}));

beforeEach(() => { mockFindOne.mockReset(); });

describe("coupon.service", () => {
    test("validateCoupon returns code & percentage when active", async () => {
        mockFindOne.mockResolvedValue({
            code: "WELCOME10",
            discountPercentage: 10,
            isActive: true,
            expirationDate: new Date(Date.now() + 3600_000),
            save: async () => {},
        });

        const res = await couponsvc.validateCoupon("u1", "WELCOME10");
        expect(res).toEqual({ code: "WELCOME10", discountPercentage: 10 });
    });

    test("validateCoupon throws 404 when expired", async () => {
        const save = jest.fn();
        mockFindOne.mockResolvedValue({
            code: "WELCOME10",
            discountPercentage: 10,
            isActive: true,
            expirationDate: new Date(Date.now() - 1000),
            save,
        });

        await expect(couponsvc.validateCoupon("u1", "WELCOME10"))
            .rejects.toHaveProperty("status", 404);
        expect(save).toHaveBeenCalled();
    });
});
