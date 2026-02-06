const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProduitImage = sequelize.define('ProduitImage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    produit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'produits', key: 'id' },
        onDelete: 'CASCADE'
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    alt_text: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    is_main: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
        allowNull: true
    },
    position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
    }
}, {
    tableName: 'produit_images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = ProduitImage;
