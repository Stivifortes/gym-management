import { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Container, 
    Grid, 
    Card, 
    CardContent,
    Button,
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    FitnessCenter as FitnessCenterIcon,
    Payment as PaymentIcon,
    Menu as MenuIcon,
    ExitToApp as ExitToAppIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { planService, subscriptionService, userService, paymentService } from '../services/api';
import { Profile } from './Profile';
import { notificationService } from '../services/notificationService';

const drawerWidth = 240;

export const Dashboard = () => {
    const { user, logout } = useAuth();
    const [plans, setPlans] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        username: '',
        email: '',
        password: '',
        role: 'user',
        phone: '',
        address: '',
        paymentMethod: '',
        userId: '',
        planId: '',
        status: 'pending'
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                if (user.role === 'admin') {
                    // Admin carrega todos os dados
                    const [plansData, subscriptionsData, usersData] = await Promise.all([
                        planService.getAll(),
                        subscriptionService.getAll(),
                        userService.getAll()
                    ]);
                    setPlans(plansData);
                    setSubscriptions(subscriptionsData);
                    setUsers(usersData);

                    // Carregar estatísticas do dashboard
                    console.log('Carregando estatísticas do dashboard...');
                    const statsResponse = await fetch('http://localhost:3000/reports/dashboard-stats', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log('Resposta das estatísticas:', statsResponse.status);
                    
                    if (!statsResponse.ok) {
                        const errorText = await statsResponse.text();
                        console.error('Erro na resposta:', errorText);
                        throw new Error(`HTTP error! status: ${statsResponse.status}`);
                    }
                    
                    const statsData = await statsResponse.json();
                    console.log('Dados das estatísticas:', statsData);
                    setDashboardStats(statsData);
                } else {
                    // Usuário normal carrega apenas planos e suas próprias inscrições
                    const [plansData, subscriptionsData] = await Promise.all([
                        planService.getAll(),
                        subscriptionService.getMySubscriptions()
                    ]);
                    setPlans(plansData);
                    setSubscriptions(subscriptionsData);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                setSnackbar({
                    open: true,
                    message: `Erro ao carregar dados: ${error.response?.data?.message || error.message}`,
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    useEffect(() => {
        if (selectedItem) {
            setFormData(prev => ({
                ...prev,
                ...(dialogType === 'plan' && {
                    name: selectedItem.name || '',
                    description: selectedItem.description || '',
                    price: selectedItem.price || '',
                    duration: selectedItem.duration || ''
                }),
                ...(dialogType === 'user' && {
                    username: selectedItem.username || '',
                    email: selectedItem.email || '',
                    role: selectedItem.role || 'user',
                    phone: selectedItem.phone || '',
                    address: selectedItem.address || ''
                }),
                ...(dialogType === 'payment' && {
                    paymentMethod: '',
                    subscriptionId: selectedItem.id,
                    amount: selectedItem.Plan?.price || 0
                }),
                ...(dialogType === 'subscription' && {
                    userId: selectedItem.userId || '',
                    planId: selectedItem.planId || '',
                    status: selectedItem.status || 'pending'
                })
            }));
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                duration: '',
                username: '',
                email: '',
                password: '',
                role: 'user',
                phone: '',
                address: '',
                paymentMethod: '',
                userId: '',
                planId: '',
                status: 'pending'
            });
        }
    }, [selectedItem, dialogType]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOpenDialog = (type, item = null) => {
        setDialogType(type);
        setSelectedItem(item);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedItem(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            switch (dialogType) {
                case 'plan':
                    if (selectedItem) {
                        await planService.update(selectedItem.id, formData);
                        setSnackbar({
                            open: true,
                            message: 'Plano atualizado com sucesso',
                            severity: 'success'
                        });
                    } else {
                        await planService.create(formData);
                        setSnackbar({
                            open: true,
                            message: 'Plano criado com sucesso',
                            severity: 'success'
                        });
                    }
                    const plansData = await planService.getAll();
                    setPlans(plansData.data);
                    break;
                case 'user':
                    if (selectedItem) {
                        await userService.update(selectedItem.id, formData);
                        setSnackbar({
                            open: true,
                            message: 'Utilizador atualizado com sucesso',
                            severity: 'success'
                        });
                    } else {
                        await userService.create(formData);
                        setSnackbar({
                            open: true,
                            message: 'Utilizador criado com sucesso',
                            severity: 'success'
                        });
                    }
                    const usersData = await userService.getAll();
                    setUsers(usersData.data);
                    break;
                case 'payment':
                    if (!selectedItem) return;
                    const plan = plans.find(p => p.id === selectedItem.planId);
                    if (!plan) {
                        setSnackbar({
                            open: true,
                            message: 'Plano não encontrado',
                            severity: 'error'
                        });
                        return;
                    }
                    try {
                        await paymentService.create({
                            subscriptionId: selectedItem.id,
                            paymentMethod: formData.paymentMethod
                        });
                        setSnackbar({
                            open: true,
                            message: 'Pagamento registrado com sucesso',
                            severity: 'success'
                        });
                        const subscriptionsAfterPayment = await subscriptionService.getAll();
                        setSubscriptions(subscriptionsAfterPayment);
                        handleCloseDialog();
                    } catch (error) {
                        console.error('Erro ao registrar pagamento:', error);
                        setSnackbar({
                            open: true,
                            message: error.response?.data?.message || 'Erro ao registrar pagamento',
                            severity: 'error'
                        });
                    }
                    break;
                case 'subscription':
                    if (selectedItem) {
                        await subscriptionService.update(selectedItem.id, formData);
                        setSnackbar({
                            open: true,
                            message: 'Inscrição atualizada com sucesso',
                            severity: 'success'
                        });
                    } else {
                        await subscriptionService.create(formData);
                        setSnackbar({
                            open: true,
                            message: 'Inscrição criada com sucesso',
                            severity: 'success'
                        });
                    }
                    const subscriptionsAfterUpdate = await subscriptionService.getAll();
                    setSubscriptions(subscriptionsAfterUpdate.data);
                    break;
                case 'deletePlan':
                    await planService.delete(selectedItem.id);
                    setSnackbar({
                        open: true,
                        message: 'Plano excluído com sucesso',
                        severity: 'success'
                    });
                    const updatedPlans = await planService.getAll();
                    setPlans(updatedPlans.data);
                    break;
                case 'deleteUser':
                    await userService.delete(selectedItem.id);
                    setSnackbar({
                        open: true,
                        message: 'Utilizador excluído com sucesso',
                        severity: 'success'
                    });
                    const updatedUsers = await userService.getAll();
                    setUsers(updatedUsers.data);
                    break;
                case 'deleteSubscription':
                    await subscriptionService.delete(selectedItem.id);
                    setSnackbar({
                        open: true,
                        message: 'Inscrição excluída com sucesso',
                        severity: 'success'
                    });
                    const subscriptionsAfterDelete = await subscriptionService.getAll();
                    setSubscriptions(subscriptionsAfterDelete.data);
                    break;
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setSnackbar({
                open: true,
                message: 'Erro ao realizar operação',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const menuItems = user.role === 'admin' ? [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'users', label: 'Utilizadores', icon: <PeopleIcon /> },
        { id: 'plans', label: 'Planos', icon: <FitnessCenterIcon /> },
        { id: 'subscriptions', label: 'Inscrições', icon: <PaymentIcon /> },
        { id: 'profile', label: 'Meu Perfil', icon: <PersonIcon /> }
    ] : [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'profile', label: 'Meu Perfil', icon: <PersonIcon /> }
    ];

    const drawer = (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Gym IEFP
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        key={item.id}
                        selected={activeSection === item.id}
                        onClick={() => setActiveSection(item.id)}
                        component="div"
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem 
                    onClick={logout}
                    component="div"
                >
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sair" />
                </ListItem>
            </List>
        </Box>
    );

    const renderAdminDashboard = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Visão Geral
                        </Typography>
                        {loading ? (
                            <Typography>Carregando estatísticas...</Typography>
                        ) : dashboardStats ? (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" color="textSecondary">
                                                Total de Inscrições
                                            </Typography>
                                            <Typography variant="h4">
                                                {dashboardStats.totalSubscriptions}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" color="textSecondary">
                                                Inscrições nos Últimos 7 Dias
                                            </Typography>
                                            <Typography variant="h4">
                                                {dashboardStats.subscriptionsLast7Days}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" color="textSecondary">
                                                Inscrições Ativas
                                            </Typography>
                                            <Typography variant="h4">
                                                {dashboardStats.activeSubscriptions}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                                Top Planos
                                            </Typography>
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Plano</TableCell>
                                                            <TableCell align="right">Total de Inscrições</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {dashboardStats.topPlans.map((plan, index) => {
                                                            const planData = plans.find(p => p.id === plan.planId);
                                                            return (
                                                                <TableRow key={index}>
                                                                    <TableCell>{planData?.name || 'Plano não encontrado'}</TableCell>
                                                                    <TableCell align="right">{plan.subscriptionCount}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography color="error">
                                Não foi possível carregar as estatísticas
                            </Typography>
                        )}
                    </Box>
                );
            case 'users':
                return (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h5">
                                Gestão de Utilizadores
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('user')}
                            >
                                Novo Utilizador
                            </Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell align="right">
                                                <IconButton 
                                                    color="primary"
                                                    onClick={() => handleOpenDialog('user', user)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton 
                                                    color="error"
                                                    onClick={() => handleOpenDialog('deleteUser', user)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                );
            case 'plans':
                return (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h5">
                                Gestão de Planos
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('plan')}
                            >
                                Novo Plano
                            </Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Descrição</TableCell>
                                        <TableCell>Preço</TableCell>
                                        <TableCell>Duração</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {plans.map(plan => (
                                        <TableRow key={plan.id}>
                                            <TableCell>{plan.name}</TableCell>
                                            <TableCell>{plan.description}</TableCell>
                                            <TableCell>€{plan.price}</TableCell>
                                            <TableCell>{plan.duration} dias</TableCell>
                                            <TableCell align="right">
                                                <IconButton 
                                                    color="primary"
                                                    onClick={() => handleOpenDialog('plan', plan)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton 
                                                    color="error"
                                                    onClick={() => handleOpenDialog('deletePlan', plan)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                );
            case 'subscriptions':
                return (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h5">
                                Gestão de Inscrições
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('subscription')}
                            >
                                Nova Inscrição
                            </Button>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Utilizador</TableCell>
                                        <TableCell>Plano</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Data</TableCell>
                                        <TableCell align="right">Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {subscriptions && subscriptions.map(subscription => {
                                        const user = users.find(u => u.id === subscription.userId);
                                        const plan = plans.find(p => p.id === subscription.planId);
                                        const endDate = new Date(subscription.endDate);
                                        const now = new Date();
                                        const daysUntilEnd = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                                        const isExpired = daysUntilEnd <= 0;
                                        const isExpiringSoon = daysUntilEnd <= 7 && daysUntilEnd > 0;

                                        return (
                                            <TableRow key={subscription.id}>
                                                <TableCell>{subscription.id}</TableCell>
                                                <TableCell>{user?.username || 'N/A'}</TableCell>
                                                <TableCell>{plan?.name || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Typography
                                                        color={isExpired ? 'error' : isExpiringSoon ? 'warning.main' : 'success.main'}
                                                    >
                                                        {subscription.status}
                                                        {isExpired && ' (Expirada)'}
                                                        {isExpiringSoon && ` (Expira em ${daysUntilEnd} dias)`}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>{new Date(subscription.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton 
                                                        color="primary"
                                                        onClick={() => handleOpenDialog('subscription', subscription)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    {subscription.status === 'pending' && (
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary"
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                            onClick={() => handleOpenDialog('payment', subscription)}
                                                        >
                                                            Registrar Pagamento
                                                        </Button>
                                                    )}
                                                    {(isExpired || isExpiringSoon) && (
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary"
                                                            size="small"
                                                            sx={{ ml: 1 }}
                                                            onClick={() => handleRenewSubscription(subscription.id)}
                                                        >
                                                            Renovar
                                                        </Button>
                                                    )}
                                                    <IconButton 
                                                        color="error"
                                                        onClick={() => handleOpenDialog('deleteSubscription', subscription)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                );
            case 'profile':
                return <Profile />;
            default:
                return null;
        }
    };

    const renderUserDashboard = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            Minha Inscrição
                        </Typography>
                        {loading ? (
                            <Typography>Carregando...</Typography>
                        ) : subscriptions && subscriptions.length > 0 ? (
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card elevation={3}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Plano Atual
                                            </Typography>
                                            <Typography variant="h5" color="primary" gutterBottom>
                                                {plans.find(p => p.id === subscriptions[0].planId)?.name || 'Plano não encontrado'}
                                            </Typography>
                                            <Typography color="textSecondary" paragraph>
                                                {plans.find(p => p.id === subscriptions[0].planId)?.description || ''}
                                            </Typography>
                                            <Typography variant="h6" sx={{ mt: 2 }}>
                                                €{plans.find(p => p.id === subscriptions[0].planId)?.price || 0}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Duração: {plans.find(p => p.id === subscriptions[0].planId)?.duration || 0} dias
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card elevation={3}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Status da Inscrição
                                            </Typography>
                                            {(() => {
                                                const endDate = new Date(subscriptions[0].endDate);
                                                const now = new Date();
                                                const daysUntilEnd = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                                                const isExpired = daysUntilEnd <= 0;
                                                const isExpiringSoon = daysUntilEnd <= 7 && daysUntilEnd > 0;

                                                return (
                                                    <Box>
                                                        <Typography 
                                                            variant="h5" 
                                                            color={isExpired ? 'error' : isExpiringSoon ? 'warning.main' : 'success.main'}
                                                            gutterBottom
                                                        >
                                                            {subscriptions[0].status.toUpperCase()}
                                                        </Typography>
                                                        <Typography component="div" color="textSecondary" paragraph>
                                                            Data de início: {new Date(subscriptions[0].startDate).toLocaleDateString()}
                                                        </Typography>
                                                        <Typography component="div" color="textSecondary" paragraph>
                                                            Data de término: {endDate.toLocaleDateString()}
                                                        </Typography>
                                                        {isExpired && (
                                                            <Typography component="div" color="error" paragraph>
                                                                Sua inscrição expirou. Renove para continuar usando o ginásio.
                                                            </Typography>
                                                        )}
                                                        {isExpiringSoon && (
                                                            <Typography component="div" color="warning.main" paragraph>
                                                                Sua inscrição expira em {daysUntilEnd} dias.
                                                            </Typography>
                                                        )}
                                                        {(isExpired || isExpiringSoon) && (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                fullWidth
                                                                onClick={() => handleRenewSubscription(subscriptions[0].id)}
                                                            >
                                                                Renovar Inscrição
                                                            </Button>
                                                        )}
                                                    </Box>
                                                );
                                            })()}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        ) : (
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h6" color="textSecondary" align="center">
                                        Você não possui uma inscrição ativa no momento.
                                    </Typography>
                                    <Typography color="textSecondary" align="center" sx={{ mt: 2 }}>
                                        Entre em contato com um administrador para criar uma nova inscrição.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                );
            case 'profile':
                return <Profile />;
            default:
                return null;
        }
    };

    const renderDialogContent = () => {
        switch (dialogType) {
            case 'plan':
                return (
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nome"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Descrição"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            margin="normal"
                            multiline
                            rows={3}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Preço"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: '€'
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Duração (dias)"
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                        />
                    </Box>
                );
            case 'user':
                return (
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Nome de Utilizador"
                            name="username"
                            value={formData.username}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                        />
                        {!selectedItem && (
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleFormChange}
                                margin="normal"
                                required
                            />
                        )}
                        <TextField
                            fullWidth
                            label="Telefone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Endereço"
                            name="address"
                            value={formData.address}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                            multiline
                            rows={2}
                        />
                        <TextField
                            fullWidth
                            label="Role"
                            name="role"
                            select
                            value={formData.role}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                            SelectProps={{
                                native: true
                            }}
                        >
                            <option value="user">Utilizador</option>
                            <option value="admin">Administrador</option>
                        </TextField>
                    </Box>
                );
            case 'subscription':
                return (
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Utilizador"
                            name="userId"
                            select
                            value={formData.userId}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                            SelectProps={{
                                native: true
                            }}
                        >
                            <option value="">Selecione um utilizador...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Plano"
                            name="planId"
                            select
                            value={formData.planId}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                            SelectProps={{
                                native: true
                            }}
                        >
                            <option value="">Selecione um plano...</option>
                            {plans.map(plan => (
                                <option key={plan.id} value={plan.id}>
                                    {plan.name} - €{plan.price}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                );
            case 'payment':
                if (!selectedItem) return null;
                const selectedPlan = plans.find(p => p.id === selectedItem.planId);
                return (
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Detalhes da Inscrição
                        </Typography>
                        <Box component="div" sx={{ mb: 2 }}>
                            <Typography component="div">
                                Utilizador: {users.find(u => u.id === selectedItem.userId)?.username || 'N/A'}
                            </Typography>
                            <Typography component="div">
                                Plano: {selectedPlan?.name || 'N/A'}
                            </Typography>
                            <Typography component="div">
                                Valor: €{selectedPlan?.price || 0}
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            label="Método de Pagamento"
                            name="paymentMethod"
                            select
                            value={formData.paymentMethod}
                            onChange={handleFormChange}
                            margin="normal"
                            required
                            SelectProps={{
                                native: true
                            }}
                        >
                            <option value="">Selecione...</option>
                            <option value="cash">Dinheiro</option>
                            <option value="transfer">Transferência</option>
                            <option value="mbway">MBWay</option>
                        </TextField>
                    </Box>
                );
            case 'deletePlan':
                return (
                    <Typography>
                        Tem certeza que deseja excluir o plano "{selectedItem?.name}"?
                    </Typography>
                );
            case 'deleteUser':
                return (
                    <Typography>
                        Tem certeza que deseja excluir o utilizador "{selectedItem?.username}"?
                    </Typography>
                );
            case 'deleteSubscription':
                return (
                    <Typography>
                        Tem certeza que deseja excluir a inscrição do utilizador "{users.find(u => u.id === selectedItem?.userId)?.username}"?
                    </Typography>
                );
            default:
                return null;
        }
    };

    const loadStats = async () => {
        try {
            const response = await fetch('http://localhost:3000/report/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.warn('Erro ao carregar estatísticas:', error);
            // Não mostramos erro para o usuário, apenas logamos
        }
    };

    const handleRenewSubscription = async (subscriptionId) => {
        try {
            console.log('Renovando inscrição:', subscriptionId);
            await subscriptionService.renew(subscriptionId);
            setSnackbar({
                open: true,
                message: 'Inscrição renovada com sucesso',
                severity: 'success'
            });
            
            // Recarregar as inscrições
            if (user.role === 'user') {
                const subscriptionsData = await subscriptionService.getMySubscriptions();
                setSubscriptions(subscriptionsData);
            } else {
                const subscriptionsData = await subscriptionService.getAll();
                setSubscriptions(subscriptionsData);
            }
        } catch (error) {
            console.error('Erro ao renovar inscrição:', error);
            setSnackbar({
                open: true,
                message: 'Erro ao renovar inscrição',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        // Iniciar verificação de notificações
        notificationService.startChecking();
        
        // Adicionar listener para notificações
        const handleNotifications = (notifications) => {
            notifications.forEach(notification => {
                setSnackbar({
                    open: true,
                    message: notification.message,
                    severity: notification.type
                });
            });
        };
        
        notificationService.addListener(handleNotifications);

        // Limpar ao desmontar
        return () => {
            notificationService.stopChecking();
            notificationService.removeListener(handleNotifications);
        };
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {user.username}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: '64px'
                }}
            >
                {user.role === 'admin' ? renderAdminDashboard() : renderUserDashboard()}
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === 'plan' && (selectedItem ? 'Editar Plano' : 'Novo Plano')}
                    {dialogType === 'user' && (selectedItem ? 'Editar Utilizador' : 'Novo Utilizador')}
                    {dialogType === 'payment' && 'Registrar Pagamento'}
                    {dialogType === 'deletePlan' && 'Confirmar Exclusão'}
                    {dialogType === 'deleteUser' && 'Confirmar Exclusão'}
                    {dialogType === 'subscription' && 'Nova Inscrição'}
                    {dialogType === 'deleteSubscription' && 'Confirmar Exclusão'}
                </DialogTitle>
                <DialogContent>
                    {renderDialogContent()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleSubmit}
                    >
                        {selectedItem ? 'Salvar' : 'Criar'}
                    </Button>
                </DialogActions>
            </Dialog>

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