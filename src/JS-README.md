# JavaScript - Structure, utilité et fonctionnement

## Vue d'ensemble

Le frontend utilise du **JavaScript vanilla** (sans framework) pour gérer l'interactivité, les données (localStorage, API) et le rendu dynamique des pages.

---

## Structure des fichiers JS

```
js/
├── api.js          # Client API - requêtes HTTP vers le backend
├── auth.js         # Authentification - login, register, redirection
├── main.js         # Page d'accueil - panier, wishlist, Best-Sellers
├── produit.js      # Page produit - détails, favoris, produits similaires
├── catalogue.js    # Catalogue - filtres, tri, liste produits
├── panier.js       # Panier - chargement, +/- quantité, retirer
├── checkout.js     # Checkout - récap, création commande
├── dashboard.js    # Espace client - commandes, favoris, profil
├── admin.js        # Administration - produits, commandes, stats
├── animations.js   # Animations Intersection Observer
└── controllers.js  # Contrôleurs partagés (si utilisé)
```

---

## Rôle et utilité par fichier

| Fichier | Rôle principal |
|---------|----------------|
| **api.js** | Point d'accès unique à l'API. Objet `api` avec méthodes : `login`, `getProduits`, `getProduit`, `getLivraisons`, `createCommande`, `admin.*`, etc. |
| **auth.js** | Vérification de la session, redirection login si non connecté, gestion du token JWT |
| **main.js** | Données Best-Sellers, panier (`cart`), wishlist (`getWishlist`, `saveWishlist`, `toggleWishlist`), rendu des produits, header scroll, menu mobile, newsletter |
| **produit.js** | Chargement produit (API ou fallback statique), wishlist, quantité, ajout panier, produits similaires |
| **catalogue.js** | Liste produits API, filtres (type, prix, région), tri, wishlist catalogue |
| **panier.js** | Chargement panier avec détails produits, +/- quantité, retirer, suggestions, promo |
| **checkout.js** | Récap panier, choix livraison, création commande via API |
| **dashboard.js** | Onglets (commandes, favoris, adresses, fidélité, profil), rendu wishlist, commandes, stats |
| **admin.js** | CRUD produits/catégories, liste commandes, mise à jour statut |
| **animations.js** | Intersection Observer pour animations `data-aos` (fade-up, fade-left, etc.) |

---

## Données partagées (globales)

| Variable | Défini dans | Utilisation |
|----------|-------------|-------------|
| `cart` | main.js | Panier (localStorage) : `[{ id, quantity }, ...]` |
| `bestSellersData` | main.js | Produits Best-Sellers (statiques ou API) |
| `api` | api.js | Client API |
| `productData` | produit.js | Produit actuel (page produit) |
| `relatedProducts` | produit.js | Produits similaires |
| `allProducts` | catalogue.js | Tous les produits (API) |

---

## Fonctions exposées sur window

Pour les `onclick` dans le HTML dynamique, certaines fonctions sont exposées sur `window` :

| Fonction | Fichier | Usage |
|----------|---------|-------|
| `toggleWishlist(id)` | main.js | Bouton cœur sur Best-Sellers |
| `addToCart(id)` | main.js | Bouton panier sur Best-Sellers |
| `quickView(id)` | main.js | Lien vers page produit |
| `updateQuantity(id, delta)` | panier.js | Boutons +/- panier |
| `removeFromCart(id)` | panier.js | Bouton Retirer |
| `addToCartPanier(id)` | panier.js | Ajouter au panier depuis suggestions |
| `removeFromWishlist(id)` | dashboard.js | Retirer des favoris |
| `addToCartFromWishlist(id)` | dashboard.js | Ajouter au panier depuis favoris |
| `toggleWishlistCatalogue(id)` | catalogue.js | Bouton cœur catalogue |

---

## Stockage localStorage

| Clé | Format | Usage |
|-----|--------|-------|
| `cart` | `[{ id, quantity }]` | Panier |
| `wishlist` | `[{ id, name, price, image, category, rating }]` | Favoris |
| `token` | JWT string | Session utilisateur |

---

## Fonctions utilitaires principales

### main.js
- `saveCart()` : Sauvegarde le panier en localStorage
- `updateCartCount()` : Met à jour le badge du panier
- `getWishlist()` / `saveWishlist()` : Lecture/écriture wishlist
- `isInWishlist(productId)` : Vérifie si produit en favoris
- `toggleWishlist(productId)` : Ajoute/retire des favoris
- `renderBestSellers()` : Affiche les 4 Best-Sellers
- `generateStars(rating)` : Génère les étoiles HTML
- `showNotification(message)` : Toast notification

### produit.js
- `getStaticProduct(id)` : Produit statique (fallback API)
- `getStaticRelatedProducts(excludeId)` : Produits similaires statiques
- `loadProductData()` : Remplit la page avec les données produit
- `toggleWishlistQuick(id)` : Toggle favoris (produits similaires)
- `showToast(message)` : Toast sur page produit

### panier.js
- `loadCartWithProducts()` : Charge le panier avec détails API
- `updateQuantity(id, delta)` : Modifie la quantité
- `removeFromCart(id)` : Retire du panier
- `updateCartSummary()` : Met à jour sous-total, livraison, total

### catalogue.js
- `isInWishlistCatalogue(id)` : Vérifie favori
- `toggleWishlistCatalogue(id)` : Toggle favoris
- `renderProducts(products)` : Affiche la grille
- `applyFilters()` / `sortProducts()` : Filtres et tri

---

## Ordre de chargement des scripts

Typique dans les pages HTML :
```html
<script src="js/api.js"></script>
<script src="js/main.js"></script>
<script src="js/auth.js"></script>
<script src="js/animations.js"></script>
<script src="js/panier.js"></script>   <!-- ou produit.js, catalogue.js, etc. -->
```

- **api.js** en premier (objet `api` utilisé partout)
- **main.js** ensuite (`cart`, `bestSellersData`, `saveCart`, wishlist)
- **auth.js** pour vérification session
- Fichier spécifique à la page en dernier

---

## Fallback sans API

Quand l'API est indisponible :
- **index.html** : `bestSellersData` (4 produits statiques)
- **produit.html** : `getStaticProduct()` et `getStaticRelatedProducts()` depuis `bestSellersData`
- **catalogue.html** : Message d'erreur si API échoue
- **panier.html** : Produits depuis cache ou fallback produit "inconnu"
- **checkout.html** : Redirection si non connecté ; commande nécessite l'API
