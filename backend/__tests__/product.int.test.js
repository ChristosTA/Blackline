import request from "supertest";
import app from "../server.js";
import User from "../models/user.model.js";

async function makeAdmin(email) {
    await User.updateOne({ email }, { $set: { role: "admin" } });
}

describe("PRODUCTS integration (admin)", () => {
    test("create product -> list -> featured toggle", async () => {
        const agent = request.agent(app);

        // create admin user & login
        await agent.post("/api/auth/signup").send({
            name: "Admin",
            email: "admin@example.com",
            password: "secret123",
        }).expect(201);

        await makeAdmin("admin@example.com");

        await agent.post("/api/auth/login").send({
            email: "admin@example.com",
            password: "secret123",
        }).expect(200);

        // create product
        const c = await agent.post("/api/products")
            .send({
                name: "Slim Jeans",
                description: "Organic denim",
                price: 49.99,
                category: "jeans",
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA", // mock cloudinary επιστρέφει url
            })
            .expect(201);

        const productId = c.body._id || c.body.id;

        // list all (admin)
        const list = await agent.get("/api/products").expect(200);
        expect(list.body.products.length).toBe(1);

        // toggle featured
        await agent.patch(`/api/products/${productId}`).send({ isFeatured: true }).expect(200);

        // featured list
        const feat = await agent.get("/api/products/featured").expect(200);
        expect(Array.isArray(feat.body)).toBe(true);
        expect(feat.body.length).toBe(1);
        expect(feat.body[0].isFeatured).toBe(true);
    });
});
