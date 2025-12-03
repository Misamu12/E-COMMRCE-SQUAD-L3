# E-Commerce Alcool

Ce projet est un site web e-commerce simple pour la vente d'alcools. Il affiche une liste de produits avec des photos, des prix en gras, des champs de quantité et des boutons "Enregistrer" pour ajouter les produits au panier.

## Fonctionnement

### Structure du Site
- **Header** : Titre du site "E-Commerce Alcool".
- **Section Produits** : Grille responsive affichant les produits.
  - Chaque produit comprend :
    - Une photo (image du produit).
    - Le nom du produit.
    - Le prix en gras (en CDF).
    - Un champ de saisie pour la quantité (input number, minimum 1).
    - Un bouton "Enregistrer" pour ajouter au panier.

### Fonctionnalités
- **Affichage des Produits** : Les produits sont affichés dans une grille CSS Grid, responsive pour s'adapter aux écrans mobiles et desktop.
- **Saisie de Quantité** : Chaque produit a un input pour spécifier la quantité à commander.
- **Enregistrement** : En cliquant sur "Enregistrer", le produit et la quantité sont enregistrés (simulé) :
  - Un message est affiché dans la console du navigateur : "Produit enregistré au panier : [Nom du Produit] Quantité: [Quantité]".
  - Une alerte popup confirme l'action : "Produit '[Nom du Produit]' enregistré avec succès! Quantité: [Quantité]".
- **Technologies Utilisées** :
  - HTML5 pour la structure.
  - CSS3 pour le style (design professionnel, couleurs modernes, responsive).
  - jQuery pour la gestion des événements (clics sur les boutons).

### Comment Utiliser
1. Ouvrez le fichier `pages.html` dans un navigateur web (par exemple, Chrome, Firefox).
2. Parcourez les produits affichés.
3. Pour chaque produit souhaité :
   - Entrez la quantité dans le champ "Quantité".
   - Cliquez sur "Enregistrer" pour simuler l'ajout au panier.
4. Vérifiez la console du navigateur (F12 > Console) pour voir les logs d'enregistrement.
5. Les alertes popup confirmeront chaque action.

### Fichiers du Projet
- `pages.html` : Page principale du site.
- `TODO.md` : Liste des tâches réalisées.
- Images des produits : `black.jpg`, `bleu.jpg`, `jack.jpg`, `jb.jpg`, `red.jpg`, `grantis.jpg`, `ruinard.jpg`, `W.jpg`.
- `README.md` : Ce fichier d'explication.

### Notes
- Ce site est une démonstration statique sans backend réel. L'enregistrement est simulé via JavaScript/jQuery.
- Les prix sont en CDF (Franc Congolais) et sont des exemples.
- Le design est professionnel et responsive.

Pour toute question ou amélioration, contactez le développeur.
