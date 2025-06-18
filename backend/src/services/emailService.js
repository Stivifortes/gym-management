const nodemailer = require('nodemailer');

// Criar conta de teste no Ethereal
const createTestAccount = async () => {
    const testAccount = await nodemailer.createTestAccount();
    
    // Criar transporter com as credenciais de teste
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    return transporter;
};

// Função para enviar email de confirmação de pagamento
const sendPaymentConfirmation = async (userEmail, userName, planName, amount) => {
    try {
        const transporter = await createTestAccount();
        
        const mailOptions = {
            from: '"Gym IEFP" <gym.iefp@ethereal.email>',
            to: userEmail,
            subject: 'Pagamento Confirmado - Gym IEFP',
            html: `
                <h1>Olá ${userName}!</h1>
                <p>Seu pagamento foi confirmado com sucesso.</p>
                <p>Detalhes do pagamento:</p>
                <ul>
                    <li>Plano: ${planName}</li>
                    <li>Valor: €${amount}</li>
                    <li>Data: ${new Date().toLocaleDateString('pt-PT')}</li>
                </ul>
                <p>Sua subscrição está agora ativa. Obrigado por escolher o Gym IEFP!</p>
                <p>Atenciosamente,<br>Equipa Gym IEFP</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log(`Email de confirmação enviado para ${userEmail}`);
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
};

// Função para enviar email de subscrição pendente
const sendSubscriptionPending = async (userEmail, userName, planName) => {
    try {
        const transporter = await createTestAccount();
        
        const mailOptions = {
            from: '"Gym IEFP" <gym.iefp@ethereal.email>',
            to: userEmail,
            subject: 'Subscrição Pendente - Gym IEFP',
            html: `
                <h1>Olá ${userName}!</h1>
                <p>Sua subscrição ao plano ${planName} foi registrada com sucesso.</p>
                <p>Status atual: Pendente</p>
                <p>Por favor, dirija-se à recepção do ginásio para efetuar o pagamento.</p>
                <p>Atenciosamente,<br>Equipa Gym IEFP</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        console.log(`Email de subscrição pendente enviado para ${userEmail}`);
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
};

module.exports = {
    sendPaymentConfirmation,
    sendSubscriptionPending
}; 