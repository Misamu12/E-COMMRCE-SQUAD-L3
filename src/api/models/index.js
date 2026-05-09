const { sequelize } = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Category = require('./Category');
const Produit = require('./Produit');
const ProduitImage = require('./ProduitImage');
const TypeLivraison = require('./TypeLivraison');
const Commande = require('./Commande');
const CommandeItem = require('./CommandeItem');
const Paiement = require('./Paiement');

// Associations
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

Produit.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Produit, { foreignKey: 'category_id' });

ProduitImage.belongsTo(Produit, { foreignKey: 'produit_id' });
Produit.hasMany(ProduitImage, { foreignKey: 'produit_id' });

Commande.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Commande, { foreignKey: 'user_id' });

Commande.belongsTo(TypeLivraison, { foreignKey: 'livraison_id' });
TypeLivraison.hasMany(Commande, { foreignKey: 'livraison_id' });

CommandeItem.belongsTo(Commande, { foreignKey: 'commande_id' });
Commande.hasMany(CommandeItem, { foreignKey: 'commande_id' });

CommandeItem.belongsTo(Produit, { foreignKey: 'produit_id' });
Produit.hasMany(CommandeItem, { foreignKey: 'produit_id' });

Paiement.belongsTo(Commande, { foreignKey: 'commande_id' });
Commande.hasOne(Paiement, { foreignKey: 'commande_id' });

module.exports = {
    sequelize,
    Role,
    User,
    Category,
    Produit,
    ProduitImage,
    TypeLivraison,
    Commande,
    CommandeItem,
    Paiement
};
