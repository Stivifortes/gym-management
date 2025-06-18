const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Plan = require('../models/Plan');
const { sendPaymentConfirmation } = require('../services/emailService');

exports.createPayment = async (req, res) => {
    try {
        const { subscriptionId, paymentMethod } = req.body;

        console.log('Dados recebidos:', req.body);

        // Buscar a subscrição, plano e usuário
        const subscription = await Subscription.findOne({
            where: { id: subscriptionId },
            include: [
                { model: Plan },
                { model: User }
            ]
        });

        if (!subscription) {
            console.error('Subscrição não encontrada:', subscriptionId);
            return res.status(404).json({ message: 'Subscrição não encontrada' });
        }

        if (!subscription.Plan) {
            console.error('Plano não encontrado para a subscrição:', subscriptionId);
            return res.status(404).json({ message: 'Plano não encontrado para esta subscrição' });
        }

        // Criar o registro de pagamento
        const payment = await Payment.create({
            subscriptionId,
            amount: subscription.Plan.price,
            status: 'completed',
            paymentMethod,
            paymentDate: new Date()
        });

        // Ativar a subscrição
        await subscription.update({ 
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + (subscription.Plan.duration * 24 * 60 * 60 * 1000))
        });

        // Enviar email de confirmação
        try {
            if (subscription.User && subscription.User.email) {
                await sendPaymentConfirmation(
                    subscription.User.email,
                    subscription.User.username,
                    subscription.Plan.name,
                    subscription.Plan.price
                );
            }
        } catch (emailError) {
            console.error('Erro ao enviar email de confirmação:', emailError);
            // Não interrompe o fluxo se o email falhar
        }

        res.status(201).json(payment);
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        res.status(500).json({ 
            message: 'Erro ao criar pagamento', 
            error: error.message
        });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [{ model: Subscription }]
        });
        res.status(200).json(payments);
    } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
        res.status(500).json({ message: 'Erro ao buscar pagamentos', error: error.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id, {
            include: [{ model: Subscription }]
        });
        
        if (!payment) {
            return res.status(404).json({ message: 'Pagamento não encontrado' });
        }
        
        res.status(200).json(payment);
    } catch (error) {
        console.error('Erro ao buscar pagamento:', error);
        res.status(500).json({ message: 'Erro ao buscar pagamento', error: error.message });
    }
}; 