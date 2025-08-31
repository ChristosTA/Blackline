import * as cart from "../services/cart.service.js";

let mockUserDoc;

jest.mock("../repositories/user.repo.js", () => ({
    findById: jest.fn(async () => mockUserDoc),
}));

jest.mock("../repositories/product.repo.js", () => ({
    findMany: jest.fn(async ({ _id: { $in } }) =>
        $in.map((id) => ({ _id: id, name: `P-${id}`, price: 10 }))
    ),
}));

beforeEach(() => {
    mockUserDoc = { _id: "u1", cartItems: [], save: async () => {} };
});

describe("cart.service", () => {
    test("addToCart adds new item and increases quantity", async () => {
        await cart.addToCart("u1", "p1", 1);
        expect(mockUserDoc.cartItems).toEqual([{ id: "p1", quantity: 1 }]);

        await cart.addToCart("u1", "p1", 1);
        expect(mockUserDoc.cartItems).toEqual([{ id: "p1", quantity: 2 }]);
    });

    test("updateQuantity sets 0 => remove item", async () => {
        mockUserDoc.cartItems = [{ id: "p1", quantity: 2 }];
        await cart.updateQuantity("u1", "p1", 0);
        expect(mockUserDoc.cartItems).toEqual([]);
    });

    test("getCartProducts merges quantities with products", async () => {
        mockUserDoc.cartItems = [{ id: "p1", quantity: 2 }, { id: "p2", quantity: 1 }];
        const list = await cart.getCartProducts(mockUserDoc);
        expect(list).toHaveLength(2);
        expect(list[0]).toMatchObject({ _id: "p1", quantity: 2 });
        expect(list[1]).toMatchObject({ _id: "p2", quantity: 1 });
    });
});
