const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CommandeItem = sequelize.define('CommandeItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    commande_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'commandes', key: 'id' },
        onDelete: 'CASCADE'
    },
    produit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'produits', key: 'id' }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'commande_items',
    timestamps: false
});

module.exports = CommandeItem;
