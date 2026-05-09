SET NAMES utf8mb4;

-------------------------------------------
-- TABLE ROLES
-------------------------------------------
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-------------------------------------------
-- TABLE USERS
-------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    fullname VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles (id)
);

-------------------------------------------
-- TABLE CATEGORIES
-------------------------------------------
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------
-- TABLE PRODUITS
-------------------------------------------
CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    alcohol_percent DECIMAL(4, 2),
    type VARCHAR(50),
    region VARCHAR(50),
    rating DECIMAL(2, 1) DEFAULT 4.5,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);

-------------------------------------------
-- TABLE IMAGES PRODUITS
-------------------------------------------
CREATE TABLE produit_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produit_id INT NOT NULL,
    url VARCHAR(255) NOT NULL, -- chemin ou URL de l'image
    alt_text VARCHAR(255), -- texte alternatif
    is_main TINYINT(1) DEFAULT 0, -- 1 = image principale
    position INT DEFAULT 0, -- ordre d’affichage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits (id) ON DELETE CASCADE
);

-------------------------------------------
-- TYPES DE LIVRAISON
-------------------------------------------
CREATE TABLE types_livraison (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-------------------------------------------
-- TABLE COMMANDES
-------------------------------------------
CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    livraison_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (livraison_id) REFERENCES types_livraison (id)
);

-------------------------------------------
-- ITEMS DANS UNE COMMANDE
-------------------------------------------
CREATE TABLE commande_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    produit_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes (id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits (id)
);

-------------------------------------------
-- TABLE PAIEMENTS
-------------------------------------------
CREATE TABLE paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    mode VARCHAR(50) NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente',
    date_paiement TIMESTAMP NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes (id)
);