require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rendre les fichiers uploadés accessibles statiquement
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion Sequelize
const { sequelize } = require('./config/database');

// Import des routes
const uploadRoutes = require('./routes/upload.routes');

app.use('/api/upload', uploadRoutes);

// Test de connexion DB puis démarrage du serveur
const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');

        // Synchroniser les modèles si nécessaire
        // await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('Impossible de se connecter à la base de données :', error);
        process.exit(1);
    }
})();
