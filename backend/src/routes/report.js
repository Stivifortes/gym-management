const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Subscription = require('../models/Subscription');

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalSubscriptions:
 *           type: integer
 *           description: Total number of subscriptions
 *         subscriptionsLast7Days:
 *           type: integer
 *           description: Number of subscriptions created in the last 7 days
 *         activeSubscriptions:
 *           type: integer
 *           description: Number of active subscriptions
 *         topPlans:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               planId:
 *                 type: integer
 *               subscriptionCount:
 *                 type: integer
 *           description: Top 5 plans by subscription count
 */

/**
 * @swagger
 * /reports/dashboard-stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *       500:
 *         description: Internal server error
 */

// Estatísticas gerais para o dashboard
router.get('/dashboard-stats', async (req, res) => {
    try {
        // Total de assinaturas
        const totalSubscriptions = await Subscription.count();

        // Assinaturas criadas nos últimos 7 dias
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        const subscriptionsLast7Days = await Subscription.count({
            where: {
                startDate: {
                    [Op.gte]: last7Days
                }
            }
        });

        // Assinaturas ativas
        const activeSubscriptions = await Subscription.count({
            where: {
                status: 'active'
            }
        });

        // Assinaturas por plano (top 5)
        const subscriptionsByPlan = await Subscription.findAll({
            attributes: [
                'planId',
                [Subscription.sequelize.fn('COUNT', Subscription.sequelize.col('id')), 'subscriptionCount']
            ],
            group: ['planId'],
            order: [[Subscription.sequelize.literal('subscriptionCount'), 'DESC']],
            limit: 5
        });

        res.json({
            totalSubscriptions,
            subscriptionsLast7Days,
            activeSubscriptions,
            topPlans: subscriptionsByPlan
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estatísticas do dashboard', error: error.message });
    }
});

module.exports = router;

