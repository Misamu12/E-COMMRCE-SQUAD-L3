-- ============================================================
-- BDD RELATIONNELLE COMPLÈTE - ÉLÉGANCE SPIRITUEUX
-- E-commerce vins & spiritueux premium
-- ============================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. LOYALTY TIERS (niveaux fidélité)
-- ============================================================
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  points_required INT DEFAULT 0,
  benefits TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL DEFAULT 1,
  loyalty_tier_id INT DEFAULT 1,
  fullname VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  birthdate DATE,
  loyalty_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (loyalty_tier_id) REFERENCES loyalty_tiers(id),
  INDEX idx_email (email)
);

-- ============================================================
-- 4. ADDRESSES (adresses utilisateur)
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('livraison', 'facturation', 'both') DEFAULT 'livraison',
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'RD Congo',
  is_default TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
);

-- ============================================================
-- 5. CATEGORIES (grandes catégories)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. PRODUIT_TYPES (vin, champagne, whisky, cognac...)
-- ============================================================
CREATE TABLE IF NOT EXISTS produit_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. REGIONS (France, Écosse, Japon...)
-- ============================================================
CREATE TABLE IF NOT EXISTS regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. SOMMELIERS
-- ============================================================
CREATE TABLE IF NOT EXISTS sommeliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(150) NOT NULL,
  title VARCHAR(150),
  bio TEXT,
  image_url VARCHAR(255),
  credentials TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================
-- 9. PRODUITS
-- ============================================================
CREATE TABLE IF NOT EXISTS produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT,
  type_id INT,
  region_id INT,
  sommelier_id INT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  alcohol_percent DECIMAL(4,2),
  volume VARCHAR(20),
  vintage VARCHAR(10),
  origin VARCHAR(150),
  stock INT DEFAULT 0,
  rating_avg DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  badge VARCHAR(50),
  is_featured TINYINT(1) DEFAULT 0,
  is_bestseller TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (type_id) REFERENCES produit_types(id),
  FOREIGN KEY (region_id) REFERENCES regions(id),
  FOREIGN KEY (sommelier_id) REFERENCES sommeliers(id),
  INDEX idx_category (category_id),
  INDEX idx_type (type_id),
  INDEX idx_region (region_id),
  INDEX idx_price (price),
  INDEX idx_featured (is_featured)
);

-- ============================================================
-- 10. PRODUIT_IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS produit_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  is_main TINYINT(1) DEFAULT 0,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
  INDEX idx_produit (produit_id)
);

-- ============================================================
-- 11. TASTING_NOTES (notes de dégustation)
-- ============================================================
CREATE TABLE IF NOT EXISTS tasting_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT NOT NULL,
  nez VARCHAR(255),
  bouche VARCHAR(255),
  finale VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

-- ============================================================
-- 12. REVIEWS (avis clients)
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produit_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, produit_id),
  INDEX idx_produit (produit_id)
);

-- ============================================================
-- 13. WISHLISTS (favoris utilisateur)
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  produit_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_wishlist (user_id, produit_id),
  INDEX idx_user (user_id)
);

-- ============================================================
-- 14. PROMO_CODES (codes promo)
-- ============================================================
CREATE TABLE IF NOT EXISTS promo_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('percent', 'fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  valid_from DATE,
  valid_to DATE,
  usage_limit INT,
  used_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_code (code)
);

-- ============================================================
-- 15. TYPES_LIVRAISON
-- ============================================================
CREATE TABLE IF NOT EXISTS types_livraison (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  delay_days INT,
  free_above DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 16. COMMANDES
-- ============================================================
CREATE TABLE IF NOT EXISTS commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_id INT,
  livraison_id INT NOT NULL,
  promo_code_id INT,
  total DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (address_id) REFERENCES addresses(id),
  FOREIGN KEY (livraison_id) REFERENCES types_livraison(id),
  FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id),
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- ============================================================
-- 17. COMMANDE_ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS commande_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  produit_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,

  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
  FOREIGN KEY (produit_id) REFERENCES produits(id),
  INDEX idx_commande (commande_id)
);

-- ============================================================
-- 18. PAIEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS paiements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  mode ENUM('card', 'mobile_money', 'bank_transfer', 'cash') NOT NULL,
  statut ENUM('en_attente', 'effectue', 'echoue', 'rembourse') DEFAULT 'en_attente',
  reference VARCHAR(100),
  date_paiement TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (commande_id) REFERENCES commandes(id),
  INDEX idx_commande (commande_id)
);

-- ============================================================
-- 19. NEWSLETTER
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL,

  INDEX idx_email (email)
);

-- ============================================================
-- 20. LOYALTY_REWARDS (récompenses fidélité)
-- ============================================================
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loyalty_tier_id INT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  points_cost INT NOT NULL,
  type ENUM('discount', 'free_shipping', 'gift', 'percentage'),
  value DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (loyalty_tier_id) REFERENCES loyalty_tiers(id)
);

-- ============================================================
-- 21. PANIERS (panier utilisateur connecté - optionnel)
-- ============================================================
CREATE TABLE IF NOT EXISTS paniers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_session (session_id)
);

CREATE TABLE IF NOT EXISTS panier_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  panier_id INT NOT NULL,
  produit_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (panier_id) REFERENCES paniers(id) ON DELETE CASCADE,
  FOREIGN KEY (produit_id) REFERENCES produits(id),
  UNIQUE KEY unique_panier_produit (panier_id, produit_id)
);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- DONNÉES INITIALES
-- ============================================================

INSERT INTO roles (name) VALUES 
  ('client'), ('admin'), ('sommelier');

INSERT INTO loyalty_tiers (name, points_required, benefits) VALUES 
  ('Bronze', 0, 'Membre standard'),
  ('Silver', 500, 'Réductions exclusives'),
  ('Gold', 1000, 'Livraison gratuite, offres prioritaires'),
  ('Platinum', 3000, 'Accès événements, bouteille offerte');

INSERT INTO produit_types (name, slug) VALUES 
  ('Vin', 'vin'),
  ('Champagne', 'champagne'),
  ('Whisky', 'whisky'),
  ('Cognac', 'cognac'),
  ('Rhum', 'rhum'),
  ('Vodka', 'vodka'),
  ('Gin', 'gin');

INSERT INTO regions (name, slug) VALUES 
  ('France', 'france'),
  ('Écosse', 'ecosse'),
  ('Italie', 'italie'),
  ('Japon', 'japon'),
  ('USA', 'usa'),
  ('Barbade', 'barbade'),
  ('Guatemala', 'guatemala'),
  ('Pologne', 'pologne'),
  ('Venezuela', 'venezuela');

INSERT INTO categories (name, slug) VALUES 
  ('Vins d''Exception', 'vins'),
  ('Champagnes Prestige', 'champagnes'),
  ('Whiskys Premium', 'whiskys'),
  ('Spiritueux Rares', 'spiritueux');

INSERT INTO promo_codes (code, discount_type, discount_value, valid_to, usage_limit) VALUES 
  ('ELITE10', 'percent', 10, '2026-12-31', 1000),
  ('BIENVENUE15', 'percent', 15, '2026-12-31', 500),
  ('VIP20', 'percent', 20, '2026-12-31', 100);

INSERT INTO types_livraison (name, price, delay_days, free_above) VALUES 
  ('Standard - Kinshasa', 15.00, 3, 200.00),
  ('Express 48h', 25.00, 2, 300.00),
  ('Livraison Gratuite', 0.00, 5, 200.00);
