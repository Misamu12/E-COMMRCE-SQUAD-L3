const { TypeLivraison } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const types = await TypeLivraison.findAll({
            order: [['price', 'ASC']]
        });
        res.json(types.map(t => ({
            id: t.id,
            name: t.name,
            price: parseFloat(t.price)
        })));
    } catch (error) {
        console.error('Get livraisons error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des modes de livraison' });
    }
};
