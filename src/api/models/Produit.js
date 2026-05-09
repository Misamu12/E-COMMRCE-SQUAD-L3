const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Produit = sequelize.define('Produit', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'categories', key: 'id' }
    },
    name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    alcohol_percent: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'vin, champagne, whisky, cognac, rhum, vodka, gin'
    },
    region: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'france, ecosse, italie, japon, usa'
    },
    rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true,
        defaultValue: 4.5
    },
    image: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'produits',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Produit;
