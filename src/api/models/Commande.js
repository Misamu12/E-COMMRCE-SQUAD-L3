const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Commande = sequelize.define('Commande', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    livraison_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'types_livraison', key: 'id' }
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending',
        allowNull: true
    }
}, {
    tableName: 'commandes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Commande;
