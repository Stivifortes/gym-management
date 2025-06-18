const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rotas que requerem autenticação
router.use(verifyToken);

// Rotas para usuários autenticados
router.get('/user/:id', async (req, res, next) => {
    // Permite que usuários acessem seu próprio perfil ou admins acessem qualquer perfil
    if (req.user.id === parseInt(req.params.id) || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Não autorizado' });
    }
}, authController.getUserById);

router.put('/user/:id', async (req, res, next) => {
    // Permite que usuários atualizem seu próprio perfil ou admins atualizem qualquer perfil
    if (req.user.id === parseInt(req.params.id) || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Não autorizado' });
    }
}, authController.updateUser);

// Rotas restritas apenas para admin
router.get('/users', checkRole(['admin']), authController.getUsers);
router.delete('/user/:id', checkRole(['admin']), authController.deleteUser);

module.exports = router; 