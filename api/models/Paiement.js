const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Paiement = sequelize.define('Paiement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    commande_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'commandes', key: 'id' }
    },
    montant: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    mode: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    statut: {
        type: DataTypes.STRING(50),
        defaultValue: 'en_attente',
        allowNull: true
    },
    date_paiement: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'paiements',
    timestamps: false
});

module.exports = Paiement;
