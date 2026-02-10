const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { adminMiddleware } = require('../middlewares/auth');

router.use(adminMiddleware);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.get('/orders', adminController.getOrders);
router.patch('/orders/:id/status', adminController.updateOrderStatus);

router.post('/produits', adminController.createProduit);
router.put('/produits/:id', adminController.updateProduit);
router.delete('/produits/:id', adminController.deleteProduit);

router.post('/categories', adminController.createCategory);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

module.exports = router;
