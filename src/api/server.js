require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques (frontend + uploads)
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion Sequelize + models
const { sequelize } = require('./config/database');
require('./models');

// Routes API
const authRoutes = require('./routes/auth.routes');
const produitsRoutes = require('./routes/produits.routes');
const categoriesRoutes = require('./routes/categories.routes');
const commandesRoutes = require('./routes/commandes.routes');
const livraisonRoutes = require('./routes/livraison.routes');
const uploadRoutes = require('./routes/upload.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/produits', produitsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/commandes', commandesRoutes);
app.use('/api/livraison', livraisonRoutes);
app.use('/api/upload', uploadRoutes)


const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');

        app.listen(PORT, () => {
            console.log(`Serveur démarré sur http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Impossible de se connecter à la base de données :', error.message);
        process.exit(1);
    }
})();
