import { subscriptionService } from './api';

class NotificationService {
    constructor() {
        this.checkInterval = null;
        this.listeners = new Set();
    }

    startChecking() {
        // Verifica a cada hora
        this.checkInterval = setInterval(this.checkSubscriptions.bind(this), 3600000);
        // Verifica imediatamente ao iniciar
        this.checkSubscriptions();
    }

    stopChecking() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    addListener(callback) {
        this.listeners.add(callback);
    }

    removeListener(callback) {
        this.listeners.delete(callback);
    }

    async checkSubscriptions() {
        try {
            const subscriptions = await subscriptionService.getMySubscriptions();
            const now = new Date();
            const notifications = [];

            subscriptions.forEach(subscription => {
                if (subscription.status === 'active') {
                    const endDate = new Date(subscription.endDate);
                    const daysUntilEnd = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

                    if (daysUntilEnd <= 7 && daysUntilEnd > 0) {
                        notifications.push({
                            type: 'warning',
                            message: `Sua inscrição expira em ${daysUntilEnd} dias. Renove agora para manter seu acesso.`,
                            subscriptionId: subscription.id
                        });
                    } else if (daysUntilEnd <= 0) {
                        notifications.push({
                            type: 'error',
                            message: 'Sua inscrição expirou. Renove agora para continuar usando o sistema.',
                            subscriptionId: subscription.id
                        });
                    }
                }
            });

            if (notifications.length > 0) {
                this.notifyListeners(notifications);
            }
        } catch (error) {
            console.error('Erro ao verificar inscrições:', error);
        }
    }

    notifyListeners(notifications) {
        this.listeners.forEach(callback => {
            callback(notifications);
        });
    }
}

export const notificationService = new NotificationService(); 