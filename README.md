# ThreadCart – MERN E-commerce για ρούχα

Full-stack e-shop για ένδυση με authentication σε HttpOnly cookies, καλάθι, κουπόνια, Stripe Checkout, Cloudinary εικόνες, Swagger docs και Jest tests.

## 🚀 Χαρακτηριστικά
- **Auth**: JWT (access/refresh) σε **HttpOnly cookies** + silent refresh
- **Προϊόντα**: CRUD, featured flag, κατηγορίες (jeans, t-shirts, shoes, glasses, jackets, suits, bags)
- **Καλάθι**: προσθήκη, ενημέρωση ποσότητας, αφαίρεση, εκκαθάριση
- **Κουπόνια**: επικύρωση κωδικού, ποσοστιαία έκπτωση
- **Πληρωμές**: Stripe Checkout (test mode)
- **Εικόνες**: Cloudinary upload/URLs
- **Docs**: Swagger UI για όλα τα endpoints
- **Tests**: Jest (unit + integration με in-memory Mongo)

## 🧱 Stack
**Backend**: Node 22, Express, Mongoose, ioredis (Upstash), Stripe, Cloudinary  
**Frontend**: Vite + React, Zustand, Axios, React Router, Tailwind  
**Dev/QA**: Swagger, Jest, MongoMemoryServer

---

## 🗂️ Δομή έργου (συντομευμένη)
ThreadCart/
├─ backend/
│  ├─ app.js                # Express app (χωρίς .listen)
│  ├─ server.js             # Εκκίνηση server + connectDB (dev/prod)
│  ├─ lib/                  # helpers (π.χ. db.js)
│  ├─ dto/                  # validation schemas (zod κ.λπ.)
│  ├─ models/               # Mongoose models
│  ├─ repositories/         # data access layer
│  ├─ services/             # business logic (auth/cart/product/…)
│  ├─ controllers/          # HTTP handlers (thin)
│  ├─ routes/               # δρομολόγηση API
│  ├─ middleware/           # auth, errors, validators
│  ├─ swagger.js            # OpenAPI/Swagger ορισμοί
│  └─ __tests__/            # Jest
│     ├─ unit/              # service/repo unit tests
│     └─ integration/       # supertest + MongoMemoryServer
├─ frontend/
│  ├─ vite.config.js        # proxy /api -> http://127.0.0.1:5000
│  ├─ .env.example          # VITE_STRIPE_PUBLISHABLE_KEY=…
│  └─ src/
│     ├─ lib/axios.js       # axios instance (baseURL:'/api', withCredentials)
│     ├─ stores/            # Zustand stores (useUser/useCart/useProduct)
│     ├─ components/        # UI κομμάτια
│     └─ pages/             # σελίδες/ροές
├─ scripts/seed.js          # αρχικοί users/products/coupons (προαιρετικό)
├─ .env.example             # backend envs (MONGO_URI, JWT, Redis, Stripe, Cloudinary)
├─ package.json
└─ README.md

---

## ⚙️ Περιβάλλον

### Backend `.env`
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=<Atlas connection string>
ACCESS_TOKEN_SECRET=<long-random>
REFRESH_TOKEN_SECRET=<long-random>

Redis (Upstash REST)
UPSTASH_REDIS_REST_URL=<...>
UPSTASH_REDIS_REST_TOKEN=<...>

Stripe
STRIPE_SECRET_KEY=sk_test_...

Cloudinary
CLOUDINARY_CLOUD_NAME=<...>
CLOUDINARY_API_KEY=<...>
CLOUDINARY_API_SECRET=<...>

shell
Αντιγραφή κώδικα

### Frontend `.env`
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

yaml
Αντιγραφή κώδικα

> Αλλάξεις `.env` στο front; κάνε **restart** τον Vite dev server.

---

## ▶️ Εκκίνηση (Dev)

**Terminal A (backend)**
```bash
npm i
npm run dev
# http://localhost:5000
# Swagger: http://localhost:5000/api/docs
Terminal B (frontend)

bash
Αντιγραφή κώδικα
cd frontend
npm i
npm run dev
# http://localhost:5173