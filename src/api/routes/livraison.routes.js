const express = require('express');
const router = express.Router();
const livraisonController = require('../controllers/livraison.controller');

router.get('/', livraisonController.getAll);

module.exports = router;
