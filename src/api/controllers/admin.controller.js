const { User, Role, Produit, Category, Commande, CommandeItem, TypeLivraison } = require('../models');
const { Op } = require('sequelize');

// Statistiques globales
exports.getStats = async (req, res) => {
    try {
        const [usersCount, produitsCount, commandesCount] = await Promise.all([
            User.count(),
            Produit.count(),
            Commande.count()
        ]);

        const recentOrders = await Commande.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, attributes: ['fullname', 'email'] },
                { model: TypeLivraison, attributes: ['name'] }
            ]
        });

        res.json({
            users: usersCount,
            produits: produitsCount,
            commandes: commandesCount,
            recentOrders: recentOrders.map(c => ({
                id: c.id,
                total: parseFloat(c.total),
                status: c.status,
                created_at: c.created_at,
                user: c.User?.fullname
            }))
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Liste des utilisateurs
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'fullname', 'email', 'created_at'],
            include: [{ model: Role, attributes: ['name'] }],
            order: [['created_at', 'DESC']]
        });
        res.json(users.map(u => ({
            id: u.id,
            fullname: u.fullname,
            email: u.email,
            role: u.Role?.name,
            created_at: u.created_at
        })));
    } catch (error) {
        console.error('Admin getUsers error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Liste de toutes les commandes
exports.getOrders = async (req, res) => {
    try {
        const commandes = await Commande.findAll({
            include: [
                { model: User, attributes: ['fullname', 'email'] },
                { model: TypeLivraison, attributes: ['name', 'price'] },
                { model: CommandeItem, include: [{ model: Produit, attributes: ['name', 'price'] }] }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(commandes.map(c => ({
            id: c.id,
            total: parseFloat(c.total),
            status: c.status,
            created_at: c.created_at,
            user: { fullname: c.User?.fullname, email: c.User?.email },
            livraison: c.TypeLivraison?.name,
            items: c.CommandeItems?.map(i => ({
                produit: i.Produit?.name,
                quantity: i.quantity,
                price: parseFloat(i.price)
            }))
        })));
    } catch (error) {
        console.error('Admin getOrders error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Mise à jour statut commande
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const commande = await Commande.findByPk(id);
        if (!commande) return res.status(404).json({ error: 'Commande non trouvée' });
        commande.status = status || commande.status;
        await commande.save();
        res.json({ message: 'Statut mis à jour', commande: { id: commande.id, status: commande.status } });
    } catch (error) {
        console.error('Admin updateOrder error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// CRUD Produits
exports.createProduit = async (req, res) => {
    try {
        const { name, description, price, category_id, alcohol_percent, type, region, rating, image } = req.body;
        if (!name || !price) return res.status(400).json({ error: 'Nom et prix requis' });
        const produit = await Produit.create({
            name, description, price: parseFloat(price), category_id: category_id || null,
            alcohol_percent: alcohol_percent ? parseFloat(alcohol_percent) : null,
            type, region, rating: rating ? parseFloat(rating) : 4.5, image
        });
        res.status(201).json(produit);
    } catch (error) {
        console.error('Admin createProduit error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateProduit = async (req, res) => {
    try {
        const produit = await Produit.findByPk(req.params.id);
        if (!produit) return res.status(404).json({ error: 'Produit non trouvé' });
        const { name, description, price, category_id, alcohol_percent, type, region, rating, image } = req.body;
        if (name) produit.name = name;
        if (description !== undefined) produit.description = description;
        if (price !== undefined) produit.price = parseFloat(price);
        if (category_id !== undefined) produit.category_id = category_id || null;
        if (alcohol_percent !== undefined) produit.alcohol_percent = alcohol_percent ? parseFloat(alcohol_percent) : null;
        if (type !== undefined) produit.type = type;
        if (region !== undefined) produit.region = region;
        if (rating !== undefined) produit.rating = parseFloat(rating);
        if (image !== undefined) produit.image = image;
        await produit.save();
        res.json(produit);
    } catch (error) {
        console.error('Admin updateProduit error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteProduit = async (req, res) => {
    try {
        const produit = await Produit.findByPk(req.params.id);
        if (!produit) return res.status(404).json({ error: 'Produit non trouvé' });
        await produit.destroy();
        res.json({ message: 'Produit supprimé' });
    } catch (error) {
        console.error('Admin deleteProduit error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// CRUD Catégories
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Nom requis' });
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        console.error('Admin createCategory error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
        if (req.body.name) category.name = req.body.name;
        await category.save();
        res.json(category);
    } catch (error) {
        console.error('Admin updateCategory error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
        await category.destroy();
        res.json({ message: 'Catégorie supprimée' });
    } catch (error) {
        console.error('Admin deleteCategory error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
