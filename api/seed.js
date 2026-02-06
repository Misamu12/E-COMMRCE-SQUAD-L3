const { sequelize, Role, User, Category, Produit, TypeLivraison } = require('./models');

const productsData = [
    { name: "Château Margaux 2015", category_id: 1, price: 850, alcohol_percent: 13.5, description: "Grand Cru Classé", type: "vin", region: "france", rating: 4.9, image: "public/chateau-margaux-wine-bottle.png" },
    { name: "Dom Pérignon 2012", category_id: 2, price: 280, alcohol_percent: 12.5, description: "Champagne Millésimé", type: "champagne", region: "france", rating: 4.8, image: "public/dom-perignon-champagne-bottle-gold.jpg" },
    { name: "Macallan 25 ans", category_id: 3, price: 2400, alcohol_percent: 43, description: "Single Malt Exceptionnel", type: "whisky", region: "ecosse", rating: 5.0, image: "public/macallan-25-whisky-bottle.jpg" },
    { name: "Hennessy Paradis", category_id: 4, price: 1200, description: "Cognac d'Exception", type: "cognac", region: "france", rating: 4.9, image: "public/hennessy-paradis-cognac-bottle.jpg" },
    { name: "Hibiki 21 ans", category_id: 3, price: 1800, description: "Whisky Japonais Premium", type: "whisky", region: "japon", rating: 4.9, image: "public/hibiki-21-japanese-whisky.jpg" },
    { name: "Grey Goose Magnum", category_id: 5, price: 95, alcohol_percent: 40, description: "Vodka Premium", type: "vodka", region: "france", rating: 4.5, image: "public/grey-goose-vodka.png" },
    { name: "Monkey 47 Gin", category_id: 6, price: 65, alcohol_percent: 47, description: "Gin Artisanal", type: "gin", region: "france", rating: 4.7, image: "public/monkey-47-gin-bottle.jpg" },
    { name: "Diplomático Reserva", category_id: 7, price: 78, description: "Rhum Vénézuélien", type: "rhum", region: "france", rating: 4.6, image: "public/diplomatico-rum-bottle-dark.jpg" },
    { name: "Pétrus 2010", category_id: 1, price: 3200, description: "Pomerol Mythique", type: "vin", region: "france", rating: 5.0, image: "public/petrus-wine-bottle-bordeaux.jpg" },
    { name: "Krug Grande Cuvée", category_id: 2, price: 320, description: "Champagne Prestige", type: "champagne", region: "france", rating: 4.8, image: "public/krug-champagne-bottle-luxury.jpg" },
    { name: "Glenfiddich 30 ans", category_id: 3, price: 950, description: "Single Malt Rare", type: "whisky", region: "ecosse", rating: 4.8, image: "public/glenfiddich-30-whisky-bottle.jpg" },
    { name: "Louis XIII Cognac", category_id: 4, price: 3800, description: "Le Roi des Cognacs", type: "cognac", region: "france", rating: 5.0, image: "public/louis-xiii-cognac-crystal-bottle.jpg" },
    { name: "Barolo Riserva 2013", category_id: 1, price: 180, description: "Roi des Vins Italiens", type: "vin", region: "italie", rating: 4.7, image: "public/barolo-wine-bottle-italian.jpg" },
    { name: "Belvedere Intense", category_id: 5, price: 120, description: "Vodka Polonaise", type: "vodka", region: "france", rating: 4.6, image: "public/belvedere-vodka.png" },
    { name: "Hendrick's Orbium", category_id: 6, price: 55, description: "Gin Écossais", type: "gin", region: "ecosse", rating: 4.5, image: "public/hendricks-orbium-gin-bottle.jpg" },
    { name: "Zacapa XO", category_id: 7, price: 180, description: "Rhum Guatémaltèque", type: "rhum", region: "france", rating: 4.8, image: "public/zacapa-xo-rum-bottle.jpg" },
    { name: "Opus One 2016", category_id: 1, price: 420, description: "Napa Valley Prestige", type: "vin", region: "usa", rating: 4.8, image: "public/opus-one-wine-bottle-napa-valley.jpg" },
    { name: "Bollinger La Grande", category_id: 2, price: 195, description: "Champagne d'Excellence", type: "champagne", region: "france", rating: 4.7, image: "public/bollinger-champagne-bottle.jpg" },
    { name: "Lagavulin 16 ans", category_id: 3, price: 110, description: "Islay Tourbé", type: "whisky", region: "ecosse", rating: 4.7, image: "public/lugavulun6659.jpg" },
    { name: "Martell Cordon Bleu", category_id: 4, price: 240, description: "Cognac Légendaire", type: "cognac", region: "france", rating: 4.6, image: "public/martel65.jpg" },
    { name: "Yamazaki 18 ans", category_id: 3, price: 1600, description: "Single Malt Japonais", type: "whisky", region: "japon", rating: 4.9, image: "public/yamazakib479.jpg" },
    { name: "Ciroc Black Raspberry", category_id: 5, price: 75, description: "Vodka Française", type: "vodka", region: "france", rating: 4.4, image: "public/black_raberi1.jpg" },
    { name: "The Botanist Gin", category_id: 6, price: 48, description: "Gin Islay Botanique", type: "gin", region: "ecosse", rating: 4.6, image: "public/botaniste0.jpg" },
    { name: "Mount Gay XO", category_id: 7, price: 95, description: "Rhum Barbade Premium", type: "rhum", region: "france", rating: 4.5, image: "public/mount_xo.jpg" },
];

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Connexion DB OK');

        await sequelize.sync({ alter: true });

        const roleCount = await Role.count();
        if (roleCount === 0) {
            await Role.bulkCreate([
                { name: 'client' },
                { name: 'admin' }
            ]);
            console.log('Rôles créés');
        }

        const catCount = await Category.count();
        if (catCount === 0) {
            await Category.bulkCreate([
                { name: 'Vin Rouge' }, { name: 'Champagne' }, { name: 'Whisky' },
                { name: 'Cognac' }, { name: 'Vodka' }, { name: 'Gin' }, { name: 'Rhum' }
            ]);
            console.log('Catégories créées');
        }

        const prodCount = await Produit.count();
        if (prodCount === 0) {
            await Produit.bulkCreate(productsData);
            console.log('Produits créés');
        }

        const livCount = await TypeLivraison.count();
        if (livCount === 0) {
            await TypeLivraison.bulkCreate([
                { name: 'Livraison standard', price: 9.90 },
                { name: 'Livraison express', price: 19.90 },
                { name: 'Livraison gratuite (dès 200€)', price: 0 }
            ]);
            console.log('Types de livraison créés');
        }

        console.log('Seed terminé avec succès');
        process.exit(0);
    } catch (error) {
        console.error('Erreur seed:', error);
        process.exit(1);
    }
}

seed();
