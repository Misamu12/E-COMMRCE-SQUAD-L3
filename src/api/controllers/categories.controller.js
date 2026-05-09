const { Category } = require('../models');

exports.getAll = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
};
