const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.use(verifyToken);
router.use(checkRole('admin'));

router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPaymentById);
router.get('/', paymentController.getPayments);

module.exports = router; 