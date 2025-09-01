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

shell
Αντιγραφή κώδικα

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

Frontend

bash
Αντιγραφή κώδικα
cd frontend
npm install
npm run dev
Άνοιγμα στο http://localhost:5173

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

### Αξιολόγηση βάσει προδιαγραφών εργασίας

1. **Πολυεπίπεδη αρχιτεκτονική & React front‑end**
    - Υπάρχει διαχωρισμός σε models, repositories, services, controllers και DTOs.
    - Χρησιμοποιείται React για το front‑end και JWT‑based authentication/authorization.  
      ✅ Καλύπτει την απαίτηση.

2. **Υλοποίηση με Node.js + MongoDB και server‑side rendering (SSR)**
    - Η εφαρμογή βασίζεται σε Node.js/Express με MongoDB και προσφέρει REST API.
    - Ωστόσο η απόδοση του UI είναι μόνο client‑side (Vite/React SPA)· δεν υπάρχει SSR.  
      ⚠️ Απαίτηση για SSR δεν καλύπτεται.

3. **Δοκιμές & Swagger**
    - Περιλαμβάνει Jest unit και integration tests, καθώς και Swagger τεκμηρίωση.  
      ✅ Καλύπτει την απαίτηση.

---

### Προτεινόμενες βελτιώσεις

Η βασική έλλειψη είναι η απουσία server‑side rendering· χωρίς αυτό η εργασία 2 δεν θεωρείται πλήρης. Επιπλέον λείπουν αρχεία `.env.example` για να διευκολύνουν τη ρύθμιση περιβάλλοντος.

:::task-stub{title="Προσθήκη server-side rendering"}
1. Δημιούργησε φάκελο `backend/views/` και πρόσθεσε templates (π.χ. EJS ή Handlebars).
2. Εγκατέστησε view engine και ρύθμισέ τη στο `backend/app.js` με `app.set('view engine', 'ejs')`.
3. Πρόσθεσε νέα routes (π.χ. `backend/routes/view.route.js`) που αποδίδουν τα templates.
4. Ενημέρωσε `backend/app.js` ώστε να χρησιμοποιεί τα view routes πριν από τα `express.static` middleware.
5. Διατήρησε παράλληλα τα υπάρχοντα REST endpoints.
   :::

:::task-stub{title="Δημιουργία αρχείων .env.example"}
1. Πρόσθεσε αρχείο `.env.example` στη ρίζα με όλες τις μεταβλητές backend (`MONGO_URI`, `ACCESS_TOKEN_SECRET`, κ.λπ.).
2. Δημιούργησε `frontend/.env.example` με `VITE_STRIPE_PUBLISHABLE_KEY`.
3. Ενημέρωσε το README ώστε να αναφέρει τα νέα αρχεία.
   :::