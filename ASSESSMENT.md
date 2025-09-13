# Αξιολόγηση βάσει προδιαγραφών

## Πολυεπίπεδη αρχιτεκτονική & React front‑end
✅ Υπάρχει διαχωρισμός σε models, repositories, services, controllers και DTOs.  
✅ React SPA με JWT‑based authentication/authorization.

## Node.js + MongoDB (REST API)
✅ Η εφαρμογή βασίζεται σε Node.js/Express με MongoDB και προσφέρει REST API.  
⚠️ Επιλέχθηκε **CSR (Client-Side Rendering)** με React SPA, όπως επιτρέπει η εκφώνηση (CSR **ή** SSR).

## Δοκιμές & Swagger
✅ Περιλαμβάνονται Jest unit/integration tests και Swagger τεκμηρίωση.

## Προτεινόμενες βελτιώσεις (nice‑to‑have)
- Προσθήκη **SSR** views (EJS/Handlebars) παράλληλα με το SPA.
- Δημιουργία **`.env.example`** για backend & frontend (περιλαμβάνονται στην παρούσα παράδοση).


## Future Plans

- Update σε τρέχουσες εκδόσεις: React 19, Node.js LTS, MongoDB driver v6, Vite v6.

- SSR (Server-Side Rendering) με EJS/Handlebars παράλληλα με SPA για SEO + ταχύτερη πρώτη απόκριση.

- CI/CD Pipeline με GitHub Actions (lint/test/build/deploy).

- Dockerization πλήρες (backend + frontend + MongoDB σε docker-compose).


🐛 Known Issues

Coupons: δεν εφαρμόζονται σωστά στην παραγγελία.

Cart refresh: μετά από logout/login, το καλάθι δεν επαναφέρεται πάντα.

Mobile UI: σε οθόνες < 400px, κάποια κουμπιά ξεφεύγουν από το layout.
