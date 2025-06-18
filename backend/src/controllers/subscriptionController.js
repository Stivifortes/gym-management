const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.findAll();
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
};

const getSubscriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findByPk(id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscription', error: error.message });
    }
};

const createSubscription = async (req, res) => {
    try {
        const { userId, planId, startDate, endDate, status } = req.body;
        const subscription = await Subscription.create({
            userId,
            planId,
            startDate,
            endDate,
            status
        });
        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({ message: 'Error creating subscription', error: error.message });
    }
};

const updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, planId, startDate, endDate, status } = req.body;
        const [updated] = await Subscription.update(
            { userId, planId, startDate, endDate, status },
            { where: { id } }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        const updatedSubscription = await Subscription.findByPk(id);
        res.status(200).json(updatedSubscription);
    } catch (error) {
        res.status(500).json({ message: 'Error updating subscription', error: error.message });
    }
};

const deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Subscription.destroy({ where: { id } });
        if (!deleted) {
            return res.status(404).json({ message: 'Subscription not found' });
        }
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription', error: error.message });
    }
};

const getUserSubscriptions = async (req, res) => {
    try {
        const userId = req.user.id; // Obtém o ID do usuário do token
        const subscriptions = await Subscription.findAll({
            where: { userId },
            include: [
                { model: require('../models/Plan') }
            ]
        });
        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user subscriptions', error: error.message });
    }
};

const renewSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const subscription = await Subscription.findByPk(id);

        if (!subscription) {
            return res.status(404).json({ message: 'Inscrição não encontrada' });
        }

        // Verifica se o usuário tem permissão para renovar esta inscrição
        if (req.user.role !== 'admin' && subscription.userId !== req.user.id) {
            return res.status(403).json({ message: 'Não autorizado a renovar esta inscrição' });
        }

        // Calcula a nova data de término
        const endDate = new Date(subscription.endDate);
        const plan = await Plan.findByPk(subscription.planId);
        
        if (!plan) {
            return res.status(404).json({ message: 'Plano não encontrado' });
        }

        // Adiciona a duração do plano à data atual
        endDate.setDate(endDate.getDate() + plan.duration);

        // Atualiza a inscrição
        await subscription.update({
            endDate,
            status: 'active'
        });

        res.json(subscription);
    } catch (error) {
        console.error('Erro ao renovar inscrição:', error);
        res.status(500).json({ message: 'Erro ao renovar inscrição', error: error.message });
    }
};

module.exports = {
    getSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getUserSubscriptions,
    renewSubscription
};