const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Rotas que requerem apenas autenticação
router.use(verifyToken);
router.get('/my-subscriptions', subscriptionController.getUserSubscriptions);
router.post('/:id/renew', subscriptionController.renewSubscription);

// Grupo de rotas administrativas
const adminRoutes = express.Router();
adminRoutes.use(checkRole(['admin']));
adminRoutes.get('/', subscriptionController.getSubscriptions);
adminRoutes.post('/', subscriptionController.createSubscription);
adminRoutes.put('/:id', subscriptionController.updateSubscription);
adminRoutes.delete('/:id', subscriptionController.deleteSubscription);
adminRoutes.get('/:id', subscriptionController.getSubscriptionById);

// Aplicar rotas administrativas
router.use('/', adminRoutes);

module.exports = router;

