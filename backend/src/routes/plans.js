const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

/**
 * @swagger
 * components:
 *   schemas:
 *     Plan:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated plan ID
 *         name:
 *           type: string
 *           description: Plan name
 *         description:
 *           type: string
 *           description: Plan description
 *         price:
 *           type: number
 *           format: float
 *           description: Plan price
 *         duration:
 *           type: integer
 *           description: Duration in days
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Whether the plan is active
 *     CreatePlanRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         duration:
 *           type: integer
 *         isActive:
 *           type: boolean
 *     UpdatePlanRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         duration:
 *           type: integer
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /plans:
 *   get:
 *     summary: Get all plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: List of all plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 */
router.get('/', planController.getPlans);

// Rotas que requerem autenticação
router.use(verifyToken);

/**
 * @swagger
 * /plans/{id}:
 *   get:
 *     summary: Get plan by ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 */
router.get('/:id', planController.getPlanById);

/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Create new plan (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlanRequest'
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       403:
 *         description: Admin access required
 *       400:
 *         description: Invalid input data
 */
router.post('/', checkRole(['admin']), planController.createPlan);

/**
 * @swagger
 * /plans/{id}:
 *   put:
 *     summary: Update plan (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlanRequest'
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Plan not found
 */
router.put('/:id', checkRole(['admin']), planController.updatePlan);

/**
 * @swagger
 * /plans/{id}:
 *   delete:
 *     summary: Delete plan (Admin only)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Plan ID
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Plan not found
 */
router.delete('/:id', checkRole(['admin']), planController.deletePlan);

module.exports = router;
