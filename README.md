# ThreadCart – MERN E‑shop για ρούχα

Full‑stack εφαρμογή ηλεκτρονικού εμπορίου με React front‑end και Node/Express backend.

## ✨ Λειτουργίες
- **Ασφάλεια**: JWT access/refresh tokens σε HttpOnly cookies, ανανέωση token, ρόλοι (admin/customer)
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

## 📂 Δομή έργου
ThreadCart/
├─ backend/
│ ├─ app.js # Express app & routing
│ ├─ server.js # σύνδεση MongoDB + εκκίνηση
│ ├─ controllers/ # HTTP controllers
│ ├─ services/ # business logic
│ ├─ repositories/ # data access layer (Mongo + Redis)
│ ├─ models/ # Mongoose schemas
│ ├─ dto/ # Zod validation schemas
│ ├─ middleware/ # auth, validation, errors
│ ├─ swagger/ # OpenAPI ορισμός
│ └─ tests/ # Jest (unit & integration)
├─ frontend/
│ ├─ vite.config.js
│ └─ src/ # React components/pages/stores
└─ scripts/seed.js # αρχικά δεδομένα (προαιρετικό)



## ⚙️ Περιβάλλον

### Backend `.env`
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGO_URI=...

ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...

UPSTASH_REDIS_URL=...

STRIPE_SECRET_KEY=sk_test_...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

shell
Αντιγραφή κώδικα

### Frontend `.env`
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

markdown
Αντιγραφή κώδικα

## 🚀 Εκτέλεση (development)

1. **Backend**
   ```bash
   npm install
   npm run dev
Διαθέσιμο στο http://localhost:5000
Swagger: http://localhost:5000/api/docs

2. **Frontend**

```bash

cd frontend
npm install
npm run dev
Άνοιγμα στο http://localhost:5173
```

🧪 Δοκιμές
bash
Αντιγραφή κώδικα
npm test        # unit + integration tests
npm run test:cov
📖 API Documentation
Swagger UI στο http://localhost:5000/api/docs

📜 Άδεια
MIT License – δείτε το αρχείο LICENSE.

markdown
Αντιγραφή κώδικα

---

## 🚀 Production Build & Deploy

### Local Build & Run
```bash
# 1) Build frontend
cd frontend
npm install
npm run build

# 2) Go back to project root and build backend
cd ..
npm install
npm run build

# 3) Start production server (serves both backend + frontend build)
npm start
```

## 🚀 Deployment on Render (LIVE)

👉 Live URL: put your Render link here

Render Settings (Root project)

Build Command:
````
cd backend && npm run build
````

Start Command:
`````
npm backend && npm start
`````

## Environment Variables (configured in Render Dashboard):

- NODE_ENV=production

- PORT=10000 (or the default Render port)

- MONGO_URI

- JWT_SECRET, REFRESH_TOKEN_SECRET, COOKIE_SECRET

- (optional) STRIPE_SECRET_KEY, CLOUDINARY_URL

- Static files: The backend automatically serves the frontend/dist folder, so no separate static site is needed.