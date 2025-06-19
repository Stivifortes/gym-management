const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       required:
 *         - userId
 *         - planId
 *         - startDate
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated subscription ID
 *         userId:
 *           type: integer
 *           description: User ID
 *         planId:
 *           type: integer
 *           description: Plan ID
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Subscription start date
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Subscription end date
 *         status:
 *           type: string
 *           enum: [pending, active, expired, cancelled]
 *           default: pending
 *           description: Subscription status
 *         User:
 *           $ref: '#/components/schemas/User'
 *         Plan:
 *           $ref: '#/components/schemas/Plan'
 *     CreateSubscriptionRequest:
 *       type: object
 *       required:
 *         - userId
 *         - planId
 *       properties:
 *         userId:
 *           type: integer
 *         planId:
 *           type: integer
 *         startDate:
 *           type: string
 *           format: date-time
 *     UpdateSubscriptionRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *         planId:
 *           type: integer
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [pending, active, expired, cancelled]
 */

// Rotas que requerem apenas autenticação
router.use(verifyToken);

/**
 * @swagger
 * /subscriptions/my-subscriptions:
 *   get:
 *     summary: Get current user's subscriptions
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 */
router.get('/my-subscriptions', subscriptionController.getUserSubscriptions);

/**
 * @swagger
 * /subscriptions/{id}/renew:
 *   post:
 *     summary: Renew subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription renewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 */
router.post('/:id/renew', subscriptionController.renewSubscription);

// Grupo de rotas administrativas
const adminRoutes = express.Router();
adminRoutes.use(checkRole(['admin']));

/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get all subscriptions (Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 *       403:
 *         description: Admin access required
 */
adminRoutes.get('/', subscriptionController.getSubscriptions);

/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Create new subscription (Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubscriptionRequest'
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       403:
 *         description: Admin access required
 *       400:
 *         description: Invalid input data
 */
adminRoutes.post('/', subscriptionController.createSubscription);

/**
 * @swagger
 * /subscriptions/{id}:
 *   put:
 *     summary: Update subscription (Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subscription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSubscriptionRequest'
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subscription not found
 */
adminRoutes.put('/:id', subscriptionController.updateSubscription);

/**
 * @swagger
 * /subscriptions/{id}:
 *   delete:
 *     summary: Delete subscription (Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subscription not found
 */
adminRoutes.delete('/:id', subscriptionController.deleteSubscription);

/**
 * @swagger
 * /subscriptions/{id}:
 *   get:
 *     summary: Get subscription by ID (Admin only)
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subscription not found
 */
adminRoutes.get('/:id', subscriptionController.getSubscriptionById);

// Aplicar rotas administrativas
router.use('/', adminRoutes);

module.exports = router;

