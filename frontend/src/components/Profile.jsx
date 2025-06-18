import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText,
    Alert,
    Snackbar,
    Paper
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { userService, subscriptionService } from '../services/api';

export const Profile = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user && user.id) {
            loadUserData();
        }
    }, [user]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            console.log('Carregando dados do usuário:', user.id);
            const userResponse = await userService.getById(user.id);
            console.log('Dados do usuário recebidos:', userResponse);
            
            const subscriptionsResponse = await subscriptionService.getMySubscriptions();
            console.log('Inscrições recebidas:', subscriptionsResponse);
            
            setUserData(userResponse);
            setSubscriptions(subscriptionsResponse);
            setFormData({
                username: userResponse.username || '',
                email: userResponse.email || '',
                phone: userResponse.phone || '',
                address: userResponse.address || ''
            });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setSnackbar({
                open: true,
                message: 'Erro ao carregar dados do perfil',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async () => {
        try {
            await userService.update(user.id, formData);
            setSnackbar({
                open: true,
                message: 'Perfil atualizado com sucesso',
                severity: 'success'
            });
            loadUserData();
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Erro ao atualizar perfil',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Carregando...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Meu Perfil
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Informações Pessoais
                            </Typography>
                            <TextField
                                fullWidth
                                label="Nome de Utilizador"
                                name="username"
                                value={formData.username}
                                onChange={handleFormChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Telefone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleFormChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label="Endereço"
                                name="address"
                                value={formData.address}
                                onChange={handleFormChange}
                                margin="normal"
                                multiline
                                rows={2}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdateProfile}
                                sx={{ mt: 2 }}
                                fullWidth
                            >
                                Atualizar Perfil
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Minhas Inscrições
                            </Typography>
                            {subscriptions && subscriptions.length > 0 ? (
                                <List>
                                    {subscriptions.map((subscription) => (
                                        <Paper 
                                            key={subscription.id} 
                                            elevation={2} 
                                            sx={{ mb: 2, p: 2 }}
                                        >
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {subscription.Plan?.name || 'Plano não encontrado'}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ mt: 1 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Status: {subscription.status}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Data de Início: {new Date(subscription.createdAt).toLocaleDateString()}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Data de Término: {new Date(subscription.endDate).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                        </Paper>
                                    ))}
                                </List>
                            ) : (
                                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                                    Você não possui inscrições ativas no momento.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}; 