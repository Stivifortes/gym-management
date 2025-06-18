const nodemailer = require('nodemailer');

const createProductionTransporter = () => {
    return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: process.env.SENDGRID_API_KEY,
            pass: process.env.SENDGRID_API_KEY
        }
    });
};

const createTestAccount = async () => {
    const testAccount = await nodemailer.createTestAccount();
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

const sendPaymentConfirmation = async (userEmail, userName, planName, amount) => {
    try {
        const transporter = process.env.NODE_ENV === 'production'
            ? createProductionTransporter()
            : await createTestAccount();

        const mailOptions = {
            from: process.env.SENDGRID_FROM_EMAIL || 'Gym IEFP <no-reply@gymiefp.com>',
            to: userEmail,
            subject: 'Pagamento Confirmado - Gym',
            html: `
                <h1>Olá ${userName}!</h1>
                <p>Seu pagamento foi confirmado com sucesso.</p>
                <p>Detalhes do pagamento:</p>
                <ul>
                    <li>Plano: ${planName}</li>
                    <li>Valor: €${amount}</li>
                    <li>Data: ${new Date().toLocaleDateString('pt-PT')}</li>
                </ul>
                <p>Sua subscrição está agora ativa. Obrigado por escolher o Gym!</p>
                <p>Atenciosamente,<br>Equipa Gym</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        console.log(`Email de confirmação enviado para ${userEmail}`);
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
};

const sendSubscriptionPending = async (userEmail, userName, planName) => {
    try {
        const transporter = process.env.NODE_ENV === 'production'
            ? createProductionTransporter()
            : await createTestAccount();

        const mailOptions = {
            from: process.env.FROM_EMAIL || 'Gym <no-reply@gymiefp.com>',
            to: userEmail,
            subject: 'Subscrição Pendente - Gym',
            html: `
                <h1>Olá ${userName}!</h1>
                <p>Sua subscrição ao plano ${planName} foi registrada com sucesso.</p>
                <p>Status atual: Pendente</p>
                <p>Por favor, dirija-se à recepção do ginásio para efetuar o pagamento.</p>
                <p>Atenciosamente,<br>Equipa Gym</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        console.log(`Email de subscrição pendente enviado para ${userEmail}`);
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
};

const sendSubscriptionReminder = async (userEmail, userName, planName, endDate) => {
    try {
        const transporter = process.env.NODE_ENV === 'production'
            ? createProductionTransporter()
            : await createTestAccount();

        const mailOptions = {
            from: process.env.SENDGRID_FROM_EMAIL || 'Gym <no-reply@gymiefp.com>',
            to: userEmail,
            subject: 'Sua subscrição está para terminar',
            html: `
                <h1>Olá ${userName}!</h1>
                <p>Sua subscrição ao plano <b>${planName}</b> termina em <b>${endDate}</b>.</p>
                <p>Renove para não perder o acesso!</p>
                <p>Atenciosamente,<br>Equipa Gym</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        console.log(`Email de lembrete enviado para ${userEmail}`);
    } catch (error) {
        console.error('Erro ao enviar email de lembrete:', error);
        throw error;
    }
};

module.exports = {
    sendPaymentConfirmation,
    sendSubscriptionPending,
    sendSubscriptionReminder
}; 