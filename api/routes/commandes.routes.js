const express = require('express');
const router = express.Router();
const commandesController = require('../controllers/commandes.controller');

router.post('/', commandesController.create);
router.get('/me', commandesController.getByUser);

module.exports = router;
