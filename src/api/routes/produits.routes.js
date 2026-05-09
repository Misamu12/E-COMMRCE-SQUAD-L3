const express = require('express');
const router = express.Router();
const produitsController = require('../controllers/produits.controller');

router.get('/', produitsController.getAll);
router.get('/:id', produitsController.getById);

module.exports = router;
