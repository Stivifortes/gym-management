const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

router.use(verifyToken);

router.get('/user/:id', async (req, res, next) => {
    if (req.user.id === parseInt(req.params.id) || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Não autorizado' });
    }
}, authController.getUserById);

router.put('/user/:id', async (req, res, next) => {
    if (req.user.id === parseInt(req.params.id) || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Não autorizado' });
    }
}, authController.updateUser);

router.get('/users', checkRole(['admin']), authController.getUsers);
router.delete('/user/:id', checkRole(['admin']), authController.deleteUser);

module.exports = router; 