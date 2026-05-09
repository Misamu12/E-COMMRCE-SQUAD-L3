const { Commande, CommandeItem, Produit, TypeLivraison } = require('../models');

const verifyToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'elegance-spiritueux-secret-key');
        return decoded.id;
    } catch {
        return null;
    }
};

exports.create = async (req, res) => {
    try {
        const userId = verifyToken(req);
        if (!userId) {
            return res.status(401).json({ error: 'Vous devez être connecté pour passer commande' });
        }

        const { items, livraison_id } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Le panier est vide' });
        }

        const livraison = await TypeLivraison.findByPk(livraison_id || 1);
        const livraisonPrice = livraison ? parseFloat(livraison.price) : 0;

        let subtotal = 0;
        const commandeItems = [];

        for (const item of items) {
            const produit = await Produit.findByPk(item.id);
            if (!produit) {
                return res.status(404).json({ error: `Produit ${item.id} non trouvé` });
            }
            const qty = Math.max(1, parseInt(item.quantity) || 1);
            const price = parseFloat(produit.price);
            subtotal += price * qty;
            commandeItems.push({
                produit_id: produit.id,
                quantity: qty,
                price
            });
        }

        const total = subtotal + livraisonPrice;

        const commande = await Commande.create({
            user_id: userId,
            livraison_id: livraison_id || 1,
            total,
            status: 'pending'
        });

        for (const ci of commandeItems) {
            await CommandeItem.create({
                commande_id: commande.id,
                produit_id: ci.produit_id,
                quantity: ci.quantity,
                price: ci.price
            });
        }

        res.status(201).json({
            message: 'Commande créée avec succès',
            commande: {
                id: commande.id,
                total: parseFloat(commande.total),
                status: commande.status
            }
        });
    } catch (error) {
        console.error('Create commande error:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la commande' });
    }
};

exports.getByUser = async (req, res) => {
    try {
        const userId = verifyToken(req);
        if (!userId) {
            return res.status(401).json({ error: 'Non autorisé' });
        }

        const commandes = await Commande.findAll({
            where: { user_id: userId },
            include: [
                { model: TypeLivraison, attributes: ['name', 'price'] },
                {
                    model: CommandeItem,
                    include: [{ model: Produit, attributes: ['id', 'name', 'image'] }]
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(commandes);
    } catch (error) {
        console.error('Get commandes error:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
