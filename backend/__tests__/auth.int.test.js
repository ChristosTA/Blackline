import request from "supertest";
import app from "../server.js";
import User from "../models/user.model.js";

describe("AUTH integration", () => {
    test("signup -> login -> profile", async () => {
        const agent = request.agent(app);

        // signup
        const s = await agent.post("/api/auth/signup").send({
            name: "Chris",
            email: "chris@example.com",
            password: "secret123",
        }).expect(201);

        expect(s.body.email).toBe("chris@example.com");

        // login
        const l = await agent.post("/api/auth/login").send({
            email: "chris@example.com",
            password: "secret123",
        }).expect(200);

        expect(l.headers["set-cookie"]).toBeDefined();

        // profile (χρειάζεται accessToken cookie)
        const p = await agent.get("/api/auth/profile").expect(200);
        expect(p.body.email).toBe("chris@example.com");
    });
});
