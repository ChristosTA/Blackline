# Blackline – DESIGN.En.md (Architecture & Decisions)

## 1) Goals & Scope
- Deliver a clean, gradable **MERN** e‑shop with clear layering and a real deployment.
- Demonstrate understanding of domain modeling, REST API design, **auth/RBAC**, testing, and documentation.
- Keep it simple: production‑like structure without unnecessary complexity.

**Out of scope:** microservices, perfect UX, or fully featured coupon/analytics beyond MVP.

---

## 2) Compliance with the Assignment
- **Domain Model + Database** → MongoDB/Mongoose with explicit schemas. ✅
- **DAO/Repository / DTO / Service / Controllers** → clearly separated layers. ✅
- **REST API with CSR or SSR** → chose **CSR (React SPA)**. ✅
- **Extras**: Swagger UI and Jest tests. ✅
- **Deploy**: Render live deployment with documented build/start. ✅

---

## 3) High‑Level Architecture

```
React (Vite, CSR)  →  Axios  →  Express Controllers (REST API)
                                   ↓
                            Services (business rules)
                                   ↓
                    Repositories / DAO (Mongoose ODM)
                                   ↓
                              MongoDB
         (Optional: Redis/Upstash cache for hot reads)
```

- **Rendering strategy:** **CSR**. The brief allows CSR **or** SSR; CSR was chosen for faster iteration and a clean split between UI and API.
- **SPA fallback:** Express serves `frontend/dist` and uses **regex catch‑all** `app.get(/.*/, ...)` to return `index.html` for non‑API routes (avoid `'*'` which breaks with modern `path-to-regexp`).

---

## 4) Domain Model (summary)
Entities:
- **User**: `{ id, name, email(unique), passwordHash, role }`
- **Category**: `{ id, name }`
- **Product**: `{ id, name, description, price, stock, categoryId }`
- **Order**: `{ id, userId, total, status, createdAt, couponId? }`
- **CartItem** (aka OrderItem): `{ id, orderId, productId, quantity }`
- **Coupon**: `{ id, code(unique), discount, expiresAt }`

Relationships (as in the ERD):
- `Category 1–N Product`
- `User 1–N Order`
- `Order 1–N CartItem`
- `Product 1–N CartItem`
- `Coupon 0..1 – N Order` (each order has at most one coupon)

Indexes/Constraints:
- `User.email` **unique**
- `Coupon.code` **unique**
- Indexes on `Product.categoryId` and `Order.userId` for frequent queries

---

## 5) Backend Layers & Boundaries
- **Controllers (Express):** translate HTTP to use‑cases; no business logic here.
- **DTO/Validation (Zod):** validate/sanitize `body/query/params`; return **422** on validation errors with field details.
- **Services:** hold the business rules (stock checks, pricing, coupon apply/validate).
- **Repositories/DAO (Mongoose):** database access, isolated and mockable in tests.
- **Middleware:** auth (JWT cookies), **RBAC** (USER/ADMIN), error handler, CORS.

---

## 6) Authentication & Authorization
- **Tokens:** Access + Refresh **JWT stored in HttpOnly cookies** (XSS‑resistant).
    - Short‑lived access token; refresh token enables silent re‑auth.
- **RBAC:** roles `USER` / `ADMIN`.
    - Backend: per‑route role guard middleware.
    - Frontend: React Router guards and conditional rendering for admin UI.
- **Why cookies (not localStorage):** HttpOnly cookies aren’t accessible from JS → smaller XSS attack surface.

---

## 7) API Conventions & Error Handling
- Standard JSON error shape: `{ message, code?, details? }` with appropriate statuses `400/401/403/404/422/500`.
- Validation errors return **422** with a field‑level `details` array.

---

## 8) Build, Run & Deploy
- **Single service:** Node/Express serves both the API and the static React build (`frontend/dist`).
- **Local (prod‑like):**
    1. `cd frontend && npm run build`
    2. `cd .. && npm run build`
    3. `npm start`  *(Express runs in production mode and serves `frontend/dist`)*
- **Render (LIVE, root project):**
    - **Build:** `npm run build`
    - **Start:** `npm start`
    - **Environment:** `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `COOKIE_SECRET`, `MONGO_URI`, *(optional)* `STRIPE_SECRET_KEY`, `CLOUDINARY_URL`
- **Node version:** 18/20/22 LTS (recommend `engines.node >= 18`).

---

## 9) Testing Strategy
- **Unit tests:** service layer (pricing, coupon rules, helpers).
- **Integration tests:** `supertest` + `mongodb-memory-server` for end‑to‑end API:
    - RBAC: USER → admin endpoint → **403**, ADMIN → **200**
    - Coupon flow: invalid/expired → **422**, valid → **200** and correct `total`
    - Auth: login and refresh happy path + expired access token

---

## 10) Security & Performance
- **Current:** HttpOnly cookies, basic CORS restricted to `CLIENT_URL`, centralized error handler.
- **Next steps:** `helmet`, rate limiting, stricter input sanitization, audit trails, refresh‑token rotation.
- **Performance:** paginate list endpoints; rely on indexes above; consider Redis caching for read‑heavy endpoints.

---

## 11) Known Limitations (mirrors README)
- **Coupons:** application/validation has edge cases (expiry/rounding) — WIP.
- **Cart refresh:** after logout/login the cart isn’t always restored.
- **Mobile UI:** on very small screens (<400px) a few buttons overflow.

---

## 12) Roadmap (short)
- Fix coupon pipeline + **integration tests** (apply/invalid/rounding).
- Add a small **SSR sample** (EJS/Handlebars) for 1–2 public pages without breaking the SPA.
- Add **CI/CD** (GitHub Actions) and **Docker Compose** (Mongo + app).

