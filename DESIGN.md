# Blackline – DESIGN.md (Αρχιτεκτονική & Αποφάσεις)

## 1) Στόχοι & Έκταση
- Παράδοση καθαρού **MERN** e‑shop με σαφή στρωμάτωση (layers) και πραγματικό deploy.
- Να αναδειχθεί κατανόηση: domain model, REST API design, **auth/RBAC**, testing & documentation.
- Απλότητα > περιττή πολυπλοκότητα (MVP, όχι όλα τα «καμπανάκια»).

**Εκτός εύρους:** μικρο‑υπηρεσίες, τέλειο UX, πλήρες coupon/analytics πέρα από MVP.

---

## 2) Συμμόρφωση με την Εκφώνηση
- **Domain Model + ΒΔ** → MongoDB/Mongoose με ρητά schemas. ✅
- **DAO/Repository / DTO / Service / Controllers** → καθαρά layers. ✅
- **REST API με CSR ή SSR** → επιλέχθηκε **CSR (React SPA)**. ✅
- **Extras**: Swagger UI και Jest tests. ✅
- **Deploy**: Render με τεκμηριωμένο build/start. ✅

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
         (Optional: Redis/Upstash cache για «ζεστά» reads)
```

- **Rendering strategy:** **CSR**. Η εκφώνηση επιτρέπει CSR **ή** SSR· επιλέχθηκε CSR για γρήγορο iteration και καθαρό διαχωρισμό UI/API.
- **SPA fallback:** ο Express σερβίρει `frontend/dist` και χρησιμοποιεί **regex catch‑all** `app.get(/.*/, ...)` για μη‑API routes (το σκέτο `'*'` σπάει με τα νέα `path‑to‑regexp`).

---

## 4) Domain Model (σύνοψη)
Οντότητες:
- **User**: `{ id, name, email(unique), passwordHash, role }`
- **Category**: `{ id, name }`
- **Product**: `{ id, name, description, price, stock, categoryId }`
- **Order**: `{ id, userId, total, status, createdAt, couponId? }`
- **CartItem** (a.k.a. OrderItem): `{ id, orderId, productId, quantity }`
- **Coupon**: `{ id, code(unique), discount, expiresAt }`

Σχέσεις (όπως στο ERD):
- `Category 1–N Product`
- `User 1–N Order`
- `Order 1–N CartItem`
- `Product 1–N CartItem`
- `Coupon 0..1 – N Order` (κάθε Order έχει το πολύ ένα coupon)

Indexes/Constraints:
- `User.email` **unique**
- `Coupon.code` **unique**
- Indexes σε `Product.categoryId` και `Order.userId` για συχνά queries

---

## 5) Backend Layers & Boundaries
- **Controllers (Express):** μεταφράζουν HTTP → use‑cases. *Όχι* business logic.
- **DTO/Validation (Zod):** validate/sanitize `body/query/params`· στα validation errors επιστρέφεται **422** με λεπτομέρειες πεδίων.
- **Services:** επιχειρησιακοί κανόνες (stock checks, pricing, apply/validate coupon).
- **Repositories/DAO (Mongoose):** πρόσβαση στη ΒΔ, απομονωμένη και εύκολα mockable στα tests.
- **Middleware:** auth (JWT cookies), **RBAC** (USER/ADMIN), error handler, CORS.

---

## 6) Authentication & Authorization
- **Tokens:** Access + Refresh **JWT σε HttpOnly cookies** (ανθεκτικό σε XSS).
  - Access μικρής διάρκειας· Refresh για silent re‑auth.
- **RBAC:** ρόλοι `USER` / `ADMIN`.
  - Backend: role‑guard ανά route.
  - Frontend: React Router guards + conditional rendering στο admin UI.
- **Γιατί cookies (όχι localStorage):** τα HttpOnly cookies δεν είναι ορατά από JS → μικρότερη επιφάνεια XSS.

---

## 7) API Conventions & Error Handling
- Ενιαίο JSON error shape: `{ message, code?, details? }` με σωστά status `400/401/403/404/422/500`.
- Validation errors επιστρέφουν **422** με λίστα από σφάλματα πεδίων.

---

## 8) Build, Run & Deploy
- **Single service:** Node/Express σερβίρει API + static React build (`frontend/dist`).
- **Τοπικά (prod‑like):**
  1. `cd frontend && npm run build`
  2. `cd .. && npm run build`
  3. `npm start`  *(Express σε production mode σερβίρει το `frontend/dist`)*
- **Render (LIVE, root project):**
  - **Build:** `npm run build`
  - **Start:** `npm start`
  - **Env:** `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `COOKIE_SECRET`, `MONGO_URI`, *(optional)* `STRIPE_SECRET_KEY`, `CLOUDINARY_URL`
- **Node version:** 18/20/22 LTS (πρόταση `engines.node >= 18`).

---

## 9) Testing Strategy
- **Unit:** service layer (pricing, κανόνες coupon, helpers).
- **Integration:** `supertest` + `mongodb-memory-server` για end‑to‑end API:
  - RBAC: USER → admin endpoint → **403**, ADMIN → **200**
  - Coupon: invalid/expired → **422**, valid → **200** με σωστό `total`
  - Auth: login και refresh (happy path) + expired access token

---

## 10) Security & Performance
- **Τώρα:** HttpOnly cookies, βασικό CORS προς `CLIENT_URL`, κεντρικός error handler.
- **Επόμενα:** `helmet`, rate limiting, αυστηρότερο sanitization, audit trails, rotation refresh tokens.
- **Επιδόσεις:** pagination σε λίστες, αξιοποίηση indexes (βλ. §4), πιθανό Redis caching για read‑heavy endpoints.

---
