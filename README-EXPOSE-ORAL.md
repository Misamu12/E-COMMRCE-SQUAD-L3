# Guide d'exposé oral — Élégance Spiritueux
## Présentation détaillée : Backend, Frontend et interaction

Ce document sert de **support de préparation** pour votre exposé. Il structure le déroulé et les points à développer à l'oral.

---

## 1. Introduction (1–2 min)

**À dire :**
- Présentation du projet : site e-commerce de vins et spiritueux premium
- Stack technique : **Frontend** (HTML/CSS/JS vanilla) + **Backend** (Node.js / Express / MySQL)
- Objectif de l'exposé : expliquer le **fonctionnement du backend** et **comment il communique avec le frontend**

---

## 2. Architecture globale (2–3 min)

**Schéma mental à expliquer :**

```
┌─────────────────┐         HTTP (fetch)           ┌─────────────────┐
│    FRONTEND     │  ─────────────────────────►    │    BACKEND      │
│   (navigateur)  │   Requêtes : GET, POST, etc.   │  (serveur API)  │
│                 │  ◄─────────────────────────    │                 │
│  HTML, CSS, JS  │         Réponses JSON          │  Express, API   │
└─────────────────┘                                └────────┬────────┘
                                                            │
                                                            ▼
                                                   ┌─────────────────┐
                                                   │   Base MySQL    │
                                                   │  (Sequelize)    │
                                                   └─────────────────┘
```

**Points à développer :**
- Le frontend tourne dans le **navigateur** ; le backend tourne sur un **serveur** (ex. localhost:3000)
- Communication par **requêtes HTTP** et **réponses JSON**
- Le backend sert de **pont** entre le navigateur et la base de données
- Pas de framework frontend (React, Vue…) : JavaScript vanilla + `fetch` pour communiquer avec l’API

---

## 3. Le Backend — Rôle et structure (3–4 min)

### 3.1 Rôle du backend

**À dire :**
- **Sécuriser** : la logique métier et la base de données ne sont pas exposées au navigateur
- **Centraliser** : une seule source de données pour tous les clients
- **Authentifier** : gestion des utilisateurs et des sessions (JWT)
- **Persister** : sauvegarde des produits, commandes, utilisateurs en base MySQL

### 3.2 Structure des dossiers (montrer l’arborescence)

```
api/
├── server.js           ← Point d'entrée : Express, CORS, routes
├── config/database.js  ← Connexion MySQL (Sequelize)
├── models/             ← Définition des tables (User, Produit, Commande...)
├── controllers/        ← Logique métier (quoi faire)
├── routes/             ← Endpoints (quelles URLs)
├── middlewares/        ← Vérifications (auth JWT)
└── seed.js             ← Données initiales
```

**À expliquer brièvement :**
- **server.js** : crée l’app Express, monte les routes, démarre le serveur
- **models** : définition des tables (champs, types) via Sequelize
- **controllers** : traitement des requêtes (ex. récupérer les produits)
- **routes** : mapping URL → controller (ex. `GET /api/produits` → liste des produits)
- **middlewares** : code exécuté avant la logique métier (ex. vérifier le token JWT)

### 3.3 Exemple concret : récupérer les produits

**Chemin de la requête :**

1. Le frontend envoie : `GET http://localhost:3000/api/produits`
2. **Express** reçoit la requête
3. La **route** `/api/produits` est matchée
4. Le **controller** appelle le modèle `Produit.findAll()`
5. **Sequelize** exécute `SELECT * FROM produits` sur MySQL
6. Le résultat est renvoyé en **JSON** au frontend

**À montrer dans le code :**
- `server.js` : `app.use('/api/produits', produitsRoutes)`
- `routes/produits.routes.js` : `router.get('/', controller.getProduits)`
- `controllers/produits.controller.js` : `Produit.findAll()` puis `res.json(produits)`

---

## 4. Le Frontend — Point d’accès à l’API (2–3 min)

### 4.1 Le fichier api.js — Client API central

**À dire :**
- Un seul fichier, `api.js`, centralise toutes les requêtes vers le backend
- Il expose un objet `api` avec des méthodes comme `getProduits()`, `getProduit(id)`, `login(email, password)`
- Chaque méthode appelle `fetch()` avec la bonne URL et les bons paramètres
- Le token JWT (si connecté) est ajouté automatiquement dans l’en-tête `Authorization`

**Exemple à montrer :**

```javascript
// Dans api.js
getProduits: () => apiFetch('/produits'),
getProduit: (id) => apiFetch(`/produits/${id}`),
createCommande: (items, livraison_id) =>
    apiFetch('/commandes', { method: 'POST', body: JSON.stringify({ items, livraison_id }) })
```

**À expliquer :**
- `apiFetch` est une fonction interne qui construit l’URL, ajoute le token, gère les erreurs
- Les autres scripts (`main.js`, `produit.js`, `panier.js`) n’utilisent que `api.getProduits()`, etc., jamais `fetch` directement

### 4.2 Flux typique côté frontend

**Exemple : afficher la page produit**

1. L’utilisateur ouvre `produit.html?id=1`
2. `produit.js` lit l’ID dans l’URL
3. Appel à `api.getProduit(1)` → requête `GET /api/produits/1`
4. Le backend renvoie les données du produit
5. `produit.js` met à jour le DOM (titre, prix, image, etc.)
6. Si l’API échoue, on a un **fallback** : données statiques depuis `bestSellersData`

---

## 5. Communication Backend ↔ Frontend — Exemples (4–5 min)

### 5.1 Produits (lecture)

| Action utilisateur     | Frontend                      | Backend                     | Base de données      |
|------------------------|-------------------------------|-----------------------------|----------------------|
| Ouvre la page accueil  | `api.getProduits()`           | `GET /api/produits`         | `SELECT * FROM produits` |
| Clique sur un produit  | `api.getProduit(id)`          | `GET /api/produits/:id`     | `SELECT * FROM produits WHERE id = ?` |

**Données échangées :** JSON avec `{ id, name, price, image, category, rating, ... }`

### 5.2 Authentification

| Action             | Frontend                                | Backend                  |
|--------------------|-----------------------------------------|--------------------------|
| Connexion          | `api.login(email, password)`            | `POST /api/auth/login`   |
| Réponse            | Reçoit un **token JWT**                 | Vérifie mdp, génère token|
| Stockage           | `localStorage.setItem('token', ...)`    | —                        |
| Requêtes suivantes | En-tête `Authorization: Bearer <token>` | Middleware vérifie le token |

**À dire :**
- Le token permet de savoir qui est connecté sans renvoyer le mot de passe à chaque requête
- Le middleware `auth` lit le token, le décode, et attache l’utilisateur à la requête
- Si le token est invalide ou absent sur une route protégée → erreur 401

### 5.3 Panier et commande

**Panier :**
- Stocké **localement** (localStorage) : `[{ id, quantity }, ...]`
- Pas de requête au backend tant que l’utilisateur ne passe pas commande
- Le frontend appelle `api.getProduit(id)` pour afficher les détails de chaque article

**Commande :**
- L’utilisateur clique sur « Procéder au paiement »
- Le frontend envoie : `api.createCommande(items, livraison_id)`
- Le backend : `POST /api/commandes` avec `{ items: [{ id, quantity }], livraison_id }`
- Le controller crée les enregistrements `Commande` et `CommandeItem` en base
- Réponse : `{ commande: { id, total, ... } }`
- Le frontend vide le panier localStorage et affiche une page de confirmation

**À insister :**
- Le panier reste côté client jusqu’à la validation
- La commande est persistée uniquement par le backend

---

## 6. Gestion des erreurs et fallback (2 min)

**À dire :**
- Si l’API n’est pas disponible (serveur arrêté, erreur réseau), `fetch` échoue
- On a prévu des **fallbacks** :
  - **Page d’accueil** : utilisation de `bestSellersData` (4 produits statiques en JS)
  - **Page produit** : `getStaticProduct(id)` cherche dans `bestSellersData` si l’API échoue
- Cela permet de continuer à naviguer même sans backend
- Les commandes, la connexion et certaines données nécessitent obligatoirement l’API

---

## 7. Sécurité et bonnes pratiques (2 min)

**Points à mentionner :**
- **CORS** : le backend autorise les requêtes depuis le frontend (même origine ou configuré)
- **JWT** : tokens signés, expiration possible
- **bcrypt** : mots de passe hashés en base, jamais stockés en clair
- **Validation** : le backend vérifie les données (email, prix, etc.) avant de les enregistrer
- **Rôles** : routes admin protégées par un contrôle `role === 'admin'`

---

## 8. Conclusion (1 min)

**À dire :**
- Le backend est une **API REST** qui centralise la logique et les données
- Le frontend appelle cette API via `fetch` et affiche les résultats
- La communication se fait en **JSON** sur **HTTP**
- Séparation nette des responsabilités : backend = données + sécurité, frontend = interface + interactions
- Le projet illustre une architecture client-serveur classique, adaptable à des évolutions (PWA, mobile, etc.)

---

## Checklist avant l’exposé

- [ ] Préparer une démo : ouvrir le site, montrer une requête dans les DevTools (Network)
- [ ] Montrer `server.js`, une route, un controller
- [ ] Montrer `api.js` et un appel `api.getProduits()` depuis une page
- [ ] Expliquer le flux : clic → requête → backend → base → réponse → mise à jour DOM
- [ ] Anticiper les questions : CORS, JWT, différence panier localStorage vs commande en base
