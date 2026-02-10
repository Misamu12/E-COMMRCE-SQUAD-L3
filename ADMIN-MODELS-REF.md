# Référence Admin ↔ Modèles

Correspondance entre les modèles Sequelize et les routes API / page admin.

---

## Modèles (api/models/)

| Modèle | Table | Champs principaux |
|--------|-------|-------------------|
| **Role** | roles | id, name |
| **User** | users | id, role_id, fullname, email, password, created_at |
| **Category** | categories | id, name, created_at |
| **Produit** | produits | id, category_id, name, description, price, alcohol_percent, type, region, rating, image, created_at |
| **ProduitImage** | produit_images | id, produit_id, url, alt_text, is_main, position, created_at |
| **TypeLivraison** | types_livraison | id, name, price, created_at |
| **Commande** | commandes | id, user_id, livraison_id, total, status, created_at |
| **CommandeItem** | commande_items | id, commande_id, produit_id, quantity, price |
| **Paiement** | paiements | id, commande_id, montant, mode, statut, date_paiement |

---

## Routes Admin (api/routes/admin.routes.js)

| Route | Controller | Modèles utilisés |
|-------|------------|------------------|
| GET /api/admin/stats | getStats | User, Produit, Commande, TypeLivraison |
| GET /api/admin/users | getUsers | User, Role |
| GET /api/admin/orders | getOrders | Commande, User, TypeLivraison, CommandeItem, Produit |
| PATCH /api/admin/orders/:id/status | updateOrderStatus | Commande |
| POST /api/admin/produits | createProduit | Produit |
| PUT /api/admin/produits/:id | updateProduit | Produit |
| DELETE /api/admin/produits/:id | deleteProduit | Produit |
| POST /api/admin/categories | createCategory | Category |
| PUT /api/admin/categories/:id | updateCategory | Category |
| DELETE /api/admin/categories/:id | deleteCategory | Category |

---

## Mapping champs Modèle ↔ Admin

### User (table users)
| Champ | API getUsers | Page admin (users) |
|-------|--------------|---------------------|
| id | ✓ | Colonne ID |
| fullname | ✓ | Colonne Nom |
| email | ✓ | Colonne Email |
| role_id → Role.name | ✓ (role) | Colonne Rôle |
| created_at | ✓ | Colonne Inscrit |

### Category (table categories)
| Champ | API | Page admin (categories) |
|-------|-----|-------------------------|
| id | ✓ | Colonne ID |
| name | ✓ | Colonne Nom |

### Produit (table produits)
| Champ | API create/update | Page admin (produits) |
|-------|-------------------|------------------------|
| id | ✓ | Colonne ID |
| category_id | ✓ | Via catégorie (relation Category) |
| name | ✓ | Colonne Nom |
| description | ✓ | Formulaire ajout/édition |
| price | ✓ | Colonne Prix |
| alcohol_percent | ✓ | Formulaire ajout/édition |
| type | ✓ (vin, champagne, whisky…) | Colonne Type |
| region | ✓ (france, ecosse…) | Formulaire ajout/édition |
| rating | ✓ | Formulaire ajout/édition |
| image | ✓ | Formulaire ajout/édition |

### Commande (table commandes)
| Champ | API getOrders | Page admin (orders) |
|-------|---------------|----------------------|
| id | ✓ | Colonne ID |
| user_id → User | ✓ (user.fullname, user.email) | Colonne Client |
| livraison_id → TypeLivraison | ✓ (livraison) | - |
| total | ✓ | Colonne Total |
| status | ✓ (pending, processing, delivered, cancelled) | Select statut |
| created_at | ✓ | Colonne Date |

### CommandeItem (via getOrders)
| Champ | Affiché |
|-------|---------|
| produit_id → Produit.name | items[].produit |
| quantity | items[].quantity |
| price | items[].price |

---

## Associations utilisées (api/models/index.js)

- User → Role (belongsTo)
- Produit → Category (belongsTo)
- ProduitImage → Produit (belongsTo)
- Commande → User, TypeLivraison (belongsTo)
- CommandeItem → Commande, Produit (belongsTo)
- Paiement → Commande (belongsTo)
