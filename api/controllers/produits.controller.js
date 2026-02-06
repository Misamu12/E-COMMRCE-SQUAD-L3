const { Produit, Category, ProduitImage } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
    try {
        const { type, region, minPrice, maxPrice, category, sort } = req.query;

        const where = {};

        if (type) {
            where.type = Array.isArray(type) ? { [Op.in]: type } : type;
        }
        if (region) {
            where.region = Array.isArray(region) ? { [Op.in]: region } : region;
        }
        if (category) {
            where.category_id = category;
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
        }

        let order = [['created_at', 'DESC']];
        if (sort === 'price-asc') order = [['price', 'ASC']];
        else if (sort === 'price-desc') order = [['price', 'DESC']];
        else if (sort === 'name') order = [['name', 'ASC']];
        else if (sort === 'rating') order = [['rating', 'DESC']];

        const produits = await Produit.findAll({
            where,
            order,
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: ProduitImage, attributes: ['id', 'url', 'alt_text', 'is_main', 'position'] }
            ]
        });

        const formatted = produits.map(p => {
            const data = p.toJSON();
            const mainImage = data.ProduitImages?.find(img => img.is_main) || data.ProduitImages?.[0];
            return {
                id: data.id,
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                alcohol_percent: data.alcohol_percent ? parseFloat(data.alcohol_percent) : null,
                type: data.type,
                region: data.region,
                rating: data.rating ? parseFloat(data.rating) : 4.5,
                category: data.Category?.name || 'Non spécifié',
                image: mainImage?.url || data.image || 'public/placeholder.jpg',
                images: data.ProduitImages?.map(i => i.url) || []
            };
        });

        res.json(formatted);
    } catch (error) {
        console.error('Get produits error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
};

exports.getById = async (req, res) => {
    try {
        const produit = await Produit.findByPk(req.params.id, {
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: ProduitImage, attributes: ['id', 'url', 'alt_text', 'is_main', 'position'] }
            ]
        });

        if (!produit) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        const data = produit.toJSON();
        const mainImage = data.ProduitImages?.find(img => img.is_main) || data.ProduitImages?.[0];

        res.json({
            id: data.id,
            name: data.name,
            description: data.description,
            price: parseFloat(data.price),
            alcohol_percent: data.alcohol_percent ? parseFloat(data.alcohol_percent) : null,
            type: data.type,
            region: data.region,
            rating: data.rating ? parseFloat(data.rating) : 4.5,
            category: data.Category?.name || 'Non spécifié',
            image: mainImage?.url || data.image || 'public/placeholder.jpg',
            images: (data.ProduitImages || []).map(i => i.url)
        });
    } catch (error) {
        console.error('Get produit error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
    }
};
