import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Aqui você pode adicionar uma chamada para validar o token
            // e obter os dados do usuário
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const { token, user } = response;
            localStorage.setItem('token', token);
            setUser(user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erro ao fazer login' 
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            return { success: true, data: response };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erro ao registrar' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            logout,
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 