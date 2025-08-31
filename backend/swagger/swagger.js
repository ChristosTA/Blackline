import swaggerUi from "swagger-ui-express";

export function setupSwagger(app) {
  const spec = {
    openapi: "3.0.3",
    info: { title: "E-Commerce API", version: "1.0.0" },
    servers: [
      { url: "/api", description: "Same host (behind proxy)" },
      { url: "http://localhost:5000/api", description: "Backend direct" },
    ],
    tags: [
      { name: "Auth" }, { name: "Products" }, { name: "Cart" },
      { name: "Coupons" }, { name: "Payments" }, { name: "Analytics" },
    ],
    components: {
      securitySchemes: {
        cookieAuth: { type: "apiKey", in: "cookie", name: "accessToken" },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "66cf0a1b2c3d4e5f6a7b8c90" },
            name: { type: "string", example: "Chris Dev" },
            email: { type: "string", example: "chris@example.com" },
            role: { type: "string", example: "user" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "66d0faceb00c123456789012" },
            name: { type: "string", example: "Slim Jeans" },
            description: { type: "string", example: "Organic denim, tapered fit" },
            price: { type: "number", example: 49.99 },
            category: {
              type: "string",
              enum: ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"],
              example: "jeans",
            },
            image: { type: "string", example: "https://picsum.photos/seed/jeans/600/400" },
            isFeatured: { type: "boolean", example: false },
          },
        },
        ProductInput: {
          type: "object",
          required: ["name", "description", "price", "category"],
          properties: {
            name: { type: "string", example: "Slim Jeans" },
            description: { type: "string", example: "Organic denim, tapered fit" },
            price: { type: "number", example: 49.99 },
            category: {
              type: "string",
              enum: ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"],
              example: "jeans",
            },
            image: {
              type: "string",
              description: "URL ή base64 data URL",
              example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
            },
          },
        },
        PatchFeaturedInput: {
          type: "object",
          properties: { isFeatured: { type: "boolean", example: true } },
        },
        CartItem: {
          type: "object",
          properties: {
            id: { type: "string", example: "66d0faceb00c123456789012" },
            quantity: { type: "integer", example: 2 },
          },
        },
        AddToCartInput: {
          type: "object",
          required: ["productId", "quantity"],
          properties: {
            productId: { type: "string", example: "66d0faceb00c123456789012" },
            quantity: { type: "integer", example: 1 },
          },
        },
        UpdateQuantityInput: {
          type: "object",
          required: ["quantity"],
          properties: { quantity: { type: "integer", example: 3 } },
        },
        Coupon: {
          type: "object",
          properties: {
            code: { type: "string", example: "WELCOME10" },
            discountPercentage: { type: "integer", example: 10 },
            expirationDate: { type: "string", example: "2025-12-31T23:59:59.000Z" },
            isActive: { type: "boolean", example: true },
          },
        },
        ValidateCouponInput: {
          type: "object",
          required: ["code"],
          properties: { code: { type: "string", example: "WELCOME10" } },
        },
        CheckoutRequest: {
          type: "object",
          required: ["products"],
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "price", "quantity"],
                properties: {
                  id: { type: "string", example: "66d0faceb00c123456789012" },
                  name: { type: "string", example: "Slim Jeans" },
                  price: { type: "number", example: 49.99 },
                  quantity: { type: "integer", example: 1 },
                  image: { type: "string", example: "https://picsum.photos/seed/jeans/600/400" },
                },
              },
              example: [
                {
                  id: "66d0faceb00c123456789012",
                  name: "Slim Jeans",
                  price: 49.99,
                  quantity: 1,
                  image: "https://picsum.photos/seed/jeans/600/400",
                },
              ],
            },
            couponCode: { type: "string", example: "" },
          },
        },
      },
    },
    paths: {
      // ---------- Auth ----------
      "/auth/signup": {
        post: {
          tags: ["Auth"], summary: "Sign up",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string", example: "Chris Dev" },
                    email: { type: "string", example: "chris@example.com" },
                    password: { type: "string", example: "secret123" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } } },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Auth"], summary: "Login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", example: "chris@example.com" },
                    password: { type: "string", example: "secret123" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "OK (cookies set)", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } } },
        },
      },
      "/auth/logout": {
        post: { tags: ["Auth"], summary: "Logout", responses: { 200: { description: "OK" } } },
      },
      "/auth/refresh-token": {
        post: { tags: ["Auth"], summary: "Refresh access token", responses: { 200: { description: "OK" } } },
      },
      "/auth/profile": {
        get: {
          tags: ["Auth"], summary: "Get my profile", security: [{ cookieAuth: [] }],
          responses: { 200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } } },
        },
      },

      // ---------- Products ----------
      "/products": {
        get: {
          tags: ["Products"], summary: "List all products (admin)",
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: "OK", content: { "application/json": { schema: { type: "object", properties: { products: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } } } } },
        },
        post: {
          tags: ["Products"], summary: "Create product (admin)",
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } } } },
          responses: { 201: { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } } },
        },
      },
      "/products/featured": {
        get: {
          tags: ["Products"], summary: "List featured products",
          responses: { 200: { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } } },
        },
      },
      "/products/category/{category}": {
        get: {
          tags: ["Products"], summary: "List by category",
          parameters: [
            { in: "path", name: "category", required: true, schema: { type: "string", enum: ["jeans","t-shirts","shoes","glasses","jackets","suits","bags"] }, example: "jeans" },
          ],
          responses: { 200: { description: "OK", content: { "application/json": { schema: { type: "object", properties: { products: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } } } } },
        },
      },
      "/products/{id}": {
        patch: {
          tags: ["Products"], summary: "Toggle/Set featured (admin)",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" }, example: "66d0faceb00c123456789012" }],
          requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/PatchFeaturedInput" } } } },
          responses: { 200: { description: "OK", content: { "application/json": { schema: { type: "object", properties: { isFeatured: { type: "boolean", example: true } } } } } } },
        },
        delete: {
          tags: ["Products"], summary: "Delete product (admin)",
          security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" }, example: "66d0faceb00c123456789012" }],
          responses: { 200: { description: "Deleted" } },
        },
      },

      // ---------- Cart ----------
      "/cart": {
        get: {
          tags: ["Cart"], summary: "Get my cart", security: [{ cookieAuth: [] }],
          responses: { 200: { description: "OK", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } } },
        },
        post: {
          tags: ["Cart"], summary: "Add to cart", security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AddToCartInput" } } } },
          responses: { 200: { description: "OK" } },
        },
        delete: {
          tags: ["Cart"], summary: "Clear cart", security: [{ cookieAuth: [] }],
          responses: { 200: { description: "OK" } },
        },
      },
      "/cart/{id}": {
        put: {
          tags: ["Cart"], summary: "Update quantity for an item", security: [{ cookieAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" }, example: "66d0faceb00c123456789012" }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateQuantityInput" } } } },
          responses: { 200: { description: "OK" } },
        },
      },

      // ---------- Coupons ----------
      "/coupons": {
        get: {
          tags: ["Coupons"], summary: "Get my active coupon", security: [{ cookieAuth: [] }],
          responses: { 200: { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Coupon" } } } } },
        },
      },
      "/coupons/validate": {
        post: {
          tags: ["Coupons"], summary: "Validate coupon", security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ValidateCouponInput" } } } },
          responses: { 200: { description: "Valid", content: { "application/json": { schema: { $ref: "#/components/schemas/Coupon" } } } } },
        },
      },

      // ---------- Payments ----------
      "/payments/create-checkout-session": {
        post: {
          tags: ["Payments"], summary: "Create Stripe Checkout Session",
          security: [{ cookieAuth: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CheckoutRequest" } } } },
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "cs_test_a1B2C3D4..." },
                      totalAmount: { type: "number", example: 49.99 },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ---------- Analytics ----------
      "/analytics": {
        get: {
          tags: ["Analytics"], summary: "Get analytics (admin)",
          security: [{ cookieAuth: [] }],
          responses: { 200: { description: "OK" } },
        },
      },
    },
  };

  app.use(
      "/api/docs",
      swaggerUi.serve,
      swaggerUi.setup(spec, {
        explorer: true,
        swaggerOptions: { persistAuthorization: true },
      })
  );
}
