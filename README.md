# Blackline – MERN E‑shop για ρούχα

Full‑stack εφαρμογή ηλεκτρονικού εμπορίου με React front‑end και Node/Express backend.

## ✨ Λειτουργίες
- **Ασφάλεια**: JWT access/refresh tokens σε HttpOnly cookies, ανανέωση token, ρόλοι (ADMIN/USER)
- **Προϊόντα**: CRUD, κατηγορίες, επιλογή “featured”, αποθήκευση εικόνων στο Cloudinary
- **Καλάθι**: προσθήκη/ενημέρωση/αφαίρεση προϊόντων, εκκαθάριση
- **Κουπόνια**: έλεγχος εγκυρότητας & ποσοστιαία έκπτωση, αυτόματη δημιουργία κουπονιού δώρου
- **Πληρωμές**: Stripe Checkout και δημιουργία παραγγελιών
- **Analytics**: συνολικοί χρήστες/προϊόντα/πωλήσεις, ημερήσια έσοδα
- **Documentation**: Swagger UI για όλα τα API endpoints
- **Δοκιμές**: Jest unit & integration tests με MongoMemoryServer

## 🧱 Τεχνολογίες
**Backend**: Node 22, Express, Mongoose, ioredis, Stripe, Cloudinary, Zod  
**Frontend**: React 18 (Vite), Zustand, React Router, TailwindCSS, Axios  
**Dev/QA**: Jest, Supertest, Swagger


## 🗂 Domain Model
![ERD](docs/ERD.png)

## 📂 Δομή έργου
```
Blackline/
├─ backend/
│  ├─ app.js                 # Express app & routing
│  ├─ server.js              # MongoDB connection + start
│  ├─ controllers/           # HTTP controllers
│  ├─ services/              # business logic
│  ├─ repositories/          # data access (Mongo + Redis)
│  ├─ models/                # Mongoose schemas
│  ├─ dto/                   # Zod validation schemas
│  ├─ middleware/            # auth, validation, errors
│  ├─ swagger/               # OpenAPI definition
│  └─ tests/                 # Jest (unit & integration)
├─ frontend/
│  ├─ vite.config.js
│  └─ src/                   # React components/pages/stores
└─ scripts/seed.js           # seed data (optional)
```

## ⚙️ Περιβάλλον

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=...

ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
COOKIE_SECRET=...

UPSTASH_REDIS_URL=...

STRIPE_SECRET_KEY=sk_test_...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend `.env`
```env
VITE_API_BASE=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🚀 Εκτέλεση (development)

### Backend
```bash
npm install
npm run dev
# Διαθέσιμο στο http://localhost:5000
# Swagger:     http://localhost:5000/api/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Άνοιγμα στο http://localhost:5173
```

## 🧪 Δοκιμές
```bash
npm test
npm run test:cov
```

## 📖 API Documentation
Swagger UI: http://localhost:5000/api/docs

---

## 🚀 Production Build & Deploy

### Local Build & Run
```bash
# 1) Build frontend
cd frontend
npm install
npm run build

# 2) Επιστροφή στη ρίζα και build backend (ή γενικό build)
cd ..
npm install
npm run build

# 3) Start production server (serves backend + frontend build)
npm start
```
- Το `npm start` τρέχει **backend** σε production mode και σερβίρει το **frontend/dist** από τον ίδιο server.
- Δεν χρησιμοποιείται `npx serve`.

### Deployment on Render (LIVE)
👉 **Live URL**: https://eshopapp-zeay.onrender.com  <!-- βάλε το δικό σου URL -->

**Render – Root project (προτεινόμενο)**
- **Build Command**
  ```bash
  npm run build
  ```
- **Start Command**
  ```bash
  npm start
  ```
- **Environment Variables** (Render Dashboard):  
  `NODE_ENV=production`, `PORT` (ή default Render),  
  `MONGO_URI`,  
  `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `COOKIE_SECRET`,  
  *(optional)* `STRIPE_SECRET_KEY`, `CLOUDINARY_URL`.

## 📜 Άδεια
MIT License – δείτε το αρχείο `LICENSE`.
