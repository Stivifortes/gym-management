import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Serviços de autenticação
export const authService = {
    login: async (email, password) => {
        console.log('Enviando requisição de login...');
        const response = await api.post('/auth/login', { email, password });
        console.log('Resposta do servidor:', response);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    }
};

// Serviços de planos
export const planService = {
    getAll: async () => {
        const response = await api.get('/plans');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/plans/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/plans', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/plans/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/plans/${id}`);
        return response.data;
    }
};

// Serviços de subscrição
export const subscriptionService = {
    getAll: async () => {
        const response = await api.get('/subscriptions');
        return response.data;
    },
    getMySubscriptions: async () => {
        const response = await api.get('/subscriptions/my-subscriptions');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/subscriptions', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/subscriptions/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/subscriptions/${id}`);
        return response.data;
    },
    renew: async (id) => {
        const response = await api.post(`/subscriptions/${id}/renew`);
        return response.data;
    }
};

// Serviços de pagamento
export const paymentService = {
    create: async (paymentData) => {
        const response = await api.post('/payments', paymentData);
        return response.data;
    },
    getAll: async () => {
        const response = await api.get('/payments');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/payments/${id}`);
        return response.data;
    }
};

// Serviços de usuário
export const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default api; 