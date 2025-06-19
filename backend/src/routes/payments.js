const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - subscriptionId
 *         - amount
 *         - paymentMethod
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated payment ID
 *         subscriptionId:
 *           type: integer
 *           description: Subscription ID
 *         amount:
 *           type: number
 *           format: float
 *           description: Payment amount
 *         status:
 *           type: string
 *           enum: [pending, completed, failed]
 *           default: pending
 *           description: Payment status
 *         paymentMethod:
 *           type: string
 *           enum: [cash, transfer, mbway]
 *           description: Payment method
 *         paymentDate:
 *           type: string
 *           format: date-time
 *           description: Payment date
 *         Subscription:
 *           $ref: '#/components/schemas/Subscription'
 *     CreatePaymentRequest:
 *       type: object
 *       required:
 *         - subscriptionId
 *         - paymentMethod
 *       properties:
 *         subscriptionId:
 *           type: integer
 *         paymentMethod:
 *           type: string
 *           enum: [cash, transfer, mbway]
 */

// Todas as rotas requerem autenticação e permissão de admin
router.use(verifyToken);
router.use(checkRole('admin'));

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       403:
 *         description: Admin access required
 */
router.get('/', paymentController.getPayments);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create new payment (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentRequest'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       403:
 *         description: Admin access required
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Subscription not found
 */
router.post('/', paymentController.createPayment);

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get payment by ID (Admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Payment not found
 */
router.get('/:id', paymentController.getPaymentById);

module.exports = router; 