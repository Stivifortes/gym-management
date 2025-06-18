const { Op } = require('sequelize');
const { sendSubscriptionReminder } = require('./emailService');
const { User, Subscription, Plan } = require('../models');
const sequelize = require('../database');

(async () => {
    try {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        const startOfDay = new Date(targetDate.setHours(0,0,0,0));
        const endOfDay = new Date(targetDate.setHours(23,59,59,999));

        const subscriptions = await Subscription.findAll({
            where: {
                endDate: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                status: 'active'
            },
            include: [
                { model: User },
                { model: Plan }
            ]
        });

        for (const sub of subscriptions) {
            if (sub.User && sub.Plan) {
                await sendSubscriptionReminder(
                    sub.User.email,
                    sub.User.username,
                    sub.Plan.name,
                    sub.endDate.toLocaleDateString('pt-PT')
                );
                console.log(`Lembrete enviado para ${sub.User.email}`);
            }
        }
        console.log('Processo concluído.');
        process.exit(0);
    } catch (err) {
        console.error('Erro ao enviar lembretes:', err);
        process.exit(1);
    }
})(); 