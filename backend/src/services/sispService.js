const Sisp = require('@chuva.io/sisp/sisp3DS');

class SispService {
    constructor() {
        this.sisp = new Sisp({
            posID: process.env.SISP_POS_ID,
            posAutCode: process.env.SISP_POS_AUT_CODE,
            url: process.env.SISP_URL
        });
    }

    async createPayment(amount, description, webhookUrl) {
        try {
            // Gerar uma referência única para o pagamento
            const referenceId = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Gerar o formulário de pagamento com 3DSecure
            const htmlForm = this.sisp.generatePaymentRequestForm(
                referenceId,
                amount,
                webhookUrl,
                {
                    // Informações do cliente (opcional)
                    name: 'Cliente',
                    email: 'cliente@email.com',
                    phone: '000000000'
                }
            );

            return {
                success: true,
                data: {
                    referenceId,
                    amount,
                    htmlForm,
                    paymentUrl: process.env.SISP_URL
                }
            };
        } catch (error) {
            throw new Error(`Erro ao criar pagamento SISP: ${error.message}`);
        }
    }

    validatePayment(responseBody) {
        try {
            // Validar o status do pagamento usando o método da biblioteca
            const error = this.sisp.validatePayment(responseBody);
            
            if (error) {
                return {
                    success: false,
                    error: {
                        code: error.code,
                        description: error.description
                    }
                };
            }

            return {
                success: true,
                data: responseBody
            };
        } catch (error) {
            throw new Error(`Erro ao validar pagamento: ${error.message}`);
        }
    }
}

module.exports = new SispService(); 