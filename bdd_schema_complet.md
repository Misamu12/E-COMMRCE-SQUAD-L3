# Schéma BDD Relationnel - Élégance Spiritueux

## Analyse du projet

Le projet **Élégance Spiritueux** est une boutique e-commerce de vins et spiritueux premium. Il inclut :
- Catalogue produits (types : vin, champagne, whisky, cognac, rhum, vodka, gin)
- Filtres : type, région, prix
- Panier et wishlist (favoris)
- Authentification utilisateurs
- Dashboard client : commandes, favoris, adresses, programme fidélité
- Sélection sommelier
- Codes promo
- Newsletter
- Paiements et livraisons

---

## Schéma relationnel complet

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     ROLES       │     │     USERS       │     │   ADDRESSES     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │──┐  │ id (PK)         │──┐  │ id (PK)         │
│ name            │  └─▶│ role_id (FK)    │  └─▶│ user_id (FK)    │
└─────────────────┘     │ fullname        │     │ type            │
                        │ email           │     │ address_line1   │
                        │ password        │     │ address_line2   │
                        │ phone           │     │ city            │
                        │ birthdate       │     │ postal_code     │
                        │ loyalty_points  │     │ country         │
                        │ loyalty_tier_id │     │ is_default      │
                        │ created_at      │     │ created_at      │
                        └────────┬────────┘     └─────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  WISHLISTS    │     │   COMMANDES     │     │  NEWSLETTER     │
├───────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)       │     │ id (PK)         │     │ id (PK)         │
│ user_id (FK)  │     │ user_id (FK)    │     │ email           │
│ produit_id(FK)│     │ address_id (FK) │     │ subscribed_at   │
│ added_at      │     │ livraison_id(FK)│     └─────────────────┘
└───────────────┘     │ total           │
                      │ status          │     ┌─────────────────┐
                      │ promo_code_id   │     │  SOMMELIERS     │
                      │ created_at      │     ├─────────────────┤
                      └────────┬────────┘     │ id (PK)         │
                               │              │ user_id (FK)    │
                               │              │ name            │
                               │              │ title           │
                               │              │ bio             │
                               │              │ image_url       │
                               │              │ credentials     │
                               │              └─────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ COMMANDE_ITEMS  │  │   PAIEMENTS     │  │ PANIERS (session)│
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │  │ id (PK)         │
│ commande_id(FK) │  │ commande_id(FK) │  │ session_id      │
│ produit_id (FK) │  │ montant         │  │ user_id (FK)    │
│ quantity        │  │ mode            │  │ created_at      │
│ price           │  │ statut          │  └────────┬────────┘
└─────────────────┘  │ date_paiement   │           │
                     └─────────────────┘           │
                                                   ▼
┌─────────────────┐     ┌─────────────────┐  ┌─────────────────┐
│   CATEGORIES    │     │   PRODUITS      │  │ PANIER_ITEMS    │
├─────────────────┤     ├─────────────────┤  ├─────────────────┤
│ id (PK)         │──┐  │ id (PK)         │◀─┤ id (PK)         │
│ name            │  └─▶│ category_id(FK) │  │ panier_id (FK)  │
│ slug            │     │ type_id (FK)    │  │ produit_id (FK)  │
│ description     │     │ region_id (FK)  │  │ quantity        │
│ image_url       │     │ name            │  │ added_at        │
└─────────────────┘     │ description     │  └─────────────────┘
                        │ price           │
┌─────────────────┐     │ original_price  │  ┌─────────────────┐
│  PRODUIT_TYPES  │     │ alcohol_percent │  │  PROMO_CODES    │
├─────────────────┤     │ volume          │  ├─────────────────┤
│ id (PK)         │     │ vintage         │  │ id (PK)         │
│ name            │     │ origin          │  │ code            │
│ slug            │     │ stock           │  │ discount_type   │
└─────────────────┘     │ rating_avg      │  │ discount_value  │
                        │ review_count    │  │ valid_from      │
┌─────────────────┐     │ badge           │  │ valid_to        │
│    REGIONS      │     │ is_featured     │  │ usage_limit     │
├─────────────────┤     │ sommelier_id    │  │ used_count      │
│ id (PK)         │     │ created_at      │  └─────────────────┘
│ name            │     └────────┬────────┘
│ slug            │              │
└─────────────────┘              │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ PRODUIT_IMAGES  │  │   REVIEWS       │  │  TASTING_NOTES  │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │  │ id (PK)         │
│ produit_id (FK) │  │ produit_id (FK) │  │ produit_id (FK) │
│ url             │  │ user_id (FK)    │  │ nez             │
│ alt_text        │  │ rating          │  │ bouche          │
│ is_main         │  │ comment         │  │ finale          │
│ position        │  │ created_at      │  └─────────────────┘
└─────────────────┘  └─────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ TYPES_LIVRAISON │  │ LOYALTY_TIERS   │  │ LOYALTY_REWARDS │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │  │ id (PK)         │
│ name            │  │ name            │  │ tier_id (FK)    │
│ price           │  │ points_required │  │ name            │
│ delay_days      │  │ benefits        │  │ description     │
└─────────────────┘  └─────────────────┘  │ points_cost     │
                                          │ type            │
                                          └─────────────────┘
```

---

## Script SQL Complet

Voir le fichier `bdd_complet.sql` pour l'implémentation MySQL/MariaDB.

---

## Liste des tables et rôles

| Table | Rôle |
|-------|------|
| **roles** | Rôles utilisateurs (client, admin, sommelier) |
| **users** | Comptes utilisateurs avec points fidélité |
| **addresses** | Adresses de livraison/facturation |
| **categories** | Catégories produits (Vins, Champagnes, Whiskys...) |
| **produit_types** | Types (vin, champagne, whisky, cognac, rhum, vodka, gin) |
| **regions** | Régions d'origine (France, Écosse, Japon...) |
| **produits** | Fiche produit avec prix, stock, notes... |
| **produit_images** | Images multiples par produit |
| **reviews** | Avis clients avec notation |
| **tasting_notes** | Notes de dégustation (nez, bouche, finale) |
| **wishlists** | Liste de souhaits par utilisateur |
| **paniers** / **panier_items** | Panier session (ou user si connecté) |
| **promo_codes** | Codes promo (ELITE10, BIENVENUE15...) |
| **types_livraison** | Modes de livraison et tarifs |
| **commandes** | Commandes passées |
| **commande_items** | Lignes de commande |
| **paiements** | Enregistrement des paiements |
| **newsletter** | Abonnés newsletter |
| **sommeliers** | Profils sommeliers (sélections) |
| **loyalty_tiers** | Niveaux fidélité (Gold, Platinum) |
| **loyalty_rewards** | Récompenses échangeables contre points |
