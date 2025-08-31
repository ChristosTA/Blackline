import request from "supertest";
import app from "../server.js";

describe("CART integration", () => {
    test("add -> get -> update qty -> clear", async () => {
        const agent = request.agent(app);

        // user
        await agent.post("/api/auth/signup").send({
            name: "U1", email: "u1@example.com", password: "secret123"
        }).expect(201);
        await agent.post("/api/auth/login").send({
            email: "u1@example.com", password: "secret123"
        }).expect(200);

        // create one product via admin user (γρήγορο hack)
        const admin = request.agent(app);
        await admin.post("/api/auth/signup").send({
            name: "Admin", email: "admin2@example.com", password: "secret123"
        }).expect(201);
        // κάνε τον admin
        const { default: User } = await import("../models/user.model.js");
        await User.updateOne({ email: "admin2@example.com" }, { $set: { role: "admin" }});
        await admin.post("/api/auth/login").send({ email: "admin2@example.com", password: "secret123" }).expect(200);

        const prodRes = await admin.post("/api/products").send({
            name: "Tee", description: "Cotton", price: 19.9, category: "t-shirts",
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA"
        }).expect(201);
        const pid = prodRes.body._id;

        // add to cart
        await agent.post("/api/cart").send({ productId: pid, quantity: 2 }).expect(200);

        // get cart
        const g = await agent.get("/api/cart").expect(200);
        expect(g.body.length).toBe(1);
        expect(g.body[0].quantity).toBe(2);

        // update qty -> 3
        await agent.put(`/api/cart/${pid}`).send({ quantity: 3 }).expect(200);

        // remove that item (quantity: 0)
        await agent.put(`/api/cart/${pid}`).send({ quantity: 0 }).expect(200);

        // clear all
        await agent.delete("/api/cart").expect(200);
    });
});
