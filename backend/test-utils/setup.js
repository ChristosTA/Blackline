// backend/test-utils/setup.js
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Mocks για redis/stripe/cloudinary (ώστε να μην κάνουν external calls)
jest.mock("../lib/redis.js", () => {
    const mem = new Map();
    return {
        redis: {
            set: jest.fn(async (k, v) => { mem.set(k, v); }),
            get: jest.fn(async (k) => mem.get(k)),
            del: jest.fn(async (k) => { mem.delete(k); }),
        },
    };
});
jest.mock("../lib/stripe.js", () => ({
    stripe: {
        checkout: { sessions: { create: jest.fn(async () => ({ id: "cs_test_ok" })) } },
        coupons: { create: jest.fn(async () => ({ id: "cp_test_ok" })) },
    },
}));
jest.mock("../lib/cloudinary.js", () => ({
    uploader: { upload: jest.fn(async () => ({ secure_url: "http://mock.img/url" })) },
}));

let mongo;

beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "test_access_secret";
    process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "test_refresh_secret";
    process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    // αν τυχόν υπάρχει ανοιχτή σύνδεση (από λάθος import), κλείστην
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(uri, { dbName: "jest" });
    process.env.MONGO_URI = uri;
});

afterEach(async () => {
    // καθάρισε τη DB μεταξύ tests
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.dropDatabase();
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close(true);
    }
    if (mongo) await mongo.stop();
});
