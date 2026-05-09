const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TypeLivraison = sequelize.define('TypeLivraison', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'types_livraison',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = TypeLivraison;
