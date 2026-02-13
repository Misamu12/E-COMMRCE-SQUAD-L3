# API Élégance Spiritueux - Rôle, utilité et fonctionnement

## Vue d'ensemble

L'API est un backend **Express.js** avec **Sequelize** et **MySQL** qui fournit les endpoints REST pour l'application e-commerce Élégance Spiritueux. Elle gère l'authentification, les produits, les catégories, les commandes, la livraison et l'administration.

---

## Rôle et utilité

| Rôle | Description |
|------|-------------|
| **Données centralisées** | Source unique de vérité pour produits, utilisateurs, commandes |
| **Authentification** | Inscription, connexion, gestion des sessions (JWT) |
| **Catalogue** | CRUD produits, catégories, images |
| **E-commerce** | Création de commandes, types de livraison |
| **Administration** | Stats, gestion utilisateurs, commandes, produits, catégories |

---

## Structure du projet

```
api/
├── server.js              # Point d'entrée, middlewares, routes
├── config/
│   └── database.js        # Configuration Sequelize / MySQL
├── models/                # Modèles Sequelize
│   ├── index.js           # Associations, connexion DB
│   ├── User.js, Role.js
│   ├── Category.js, Produit.js, ProduitImage.js
│   ├── TypeLivraison.js, Commande.js, CommandeItem.js
│   └── Paiement.js
├── controllers/           # Logique métier
├── routes/                # Définition des routes
├── middlewares/
│   └── auth.js            # Vérification JWT
├── seed.js                # Données initiales (produits, catégories, admin)
└── package.json
```

---

## Routes API

### Base URL : `http://localhost:3000/api`

### Auth (`/api/auth`)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/register` | Inscription (fullname, email, password) |
| POST | `/login` | Connexion (email, password) → token JWT |
| GET | `/me` | Profil utilisateur connecté (Bearer token) |

### Produits (`/api/produits`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Liste des produits |
| GET | `/:id` | Détail d'un produit |

### Catégories (`/api/categories`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Liste des catégories |

### Livraison (`/api/livraison`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Liste des types de livraison |

### Commandes (`/api/commandes`)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/` | Créer une commande (items, livraison_id) |
| GET | `/me` | Mes commandes (utilisateur connecté) |

### Admin (`/api/admin`) — Nécessite token + rôle admin

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/stats` | Statistiques globales |
| GET | `/users` | Liste des utilisateurs |
| GET | `/orders` | Liste des commandes |
| PATCH | `/orders/:id/status` | Modifier statut commande |
| POST | `/produits` | Créer un produit |
| PUT | `/produits/:id` | Modifier un produit |
| DELETE | `/produits/:id` | Supprimer un produit |
| POST | `/categories` | Créer une catégorie |
| PUT | `/categories/:id` | Modifier une catégorie |
| DELETE | `/categories/:id` | Supprimer une catégorie |

---

## Modèles (tables)

| Modèle | Table | Champs principaux |
|--------|-------|-------------------|
| Role | roles | id, name |
| User | users | id, role_id, fullname, email, password |
| Category | categories | id, name |
| Produit | produits | id, category_id, name, description, price, type, region, rating, image |
| ProduitImage | produit_images | id, produit_id, url, alt_text |
| TypeLivraison | types_livraison | id, name, price |
| Commande | commandes | id, user_id, livraison_id, total, status |
| CommandeItem | commande_items | id, commande_id, produit_id, quantity, price |
| Paiement | paiements | id, commande_id, montant, mode, statut |

---

## Démarrage

```bash
cd api
npm install
# Créer .env (copier .env.example) avec DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET
npm run seed    # Données initiales (première fois)
npm run dev     # Lancement avec nodemon
```

**Port par défaut :** 3000

**Compte admin créé par seed :**
- Email : `admin@elegance-spiritueux.fr`
- Mot de passe : `admin123`

---

## Sécurité

- **JWT** : Authentification via Bearer token
- **bcrypt** : Mots de passe hashés
- **CORS** : Autorisation des requêtes cross-origin (origin: true, credentials: true)
- **Middleware auth** : Protection des routes admin et `/commandes/me`

---

## Fallback frontend

Si l'API n'est pas disponible, le frontend utilise des **données statiques** (`bestSellersData` dans `main.js`) pour :
- La page d'accueil (Best-Sellers)
- La page produit (`produit.html?id=1` à `id=4`)
