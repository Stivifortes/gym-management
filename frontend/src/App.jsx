import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { CssBaseline } from '@mui/material';

// Componente para proteger rotas que precisam de autenticação
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route 
                path="/login" 
                element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
                path="/" 
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } 
            />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CssBaseline />
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
