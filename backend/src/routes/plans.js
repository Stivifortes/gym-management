const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const verifyToken = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

router.get('/', planController.getPlans);
router.use(verifyToken);

// Rotas que todos os usuários autenticados podem acessar
router.get('/:id', planController.getPlanById);

// Rotas restritas apenas para admin
router.post('/', checkRole(['admin']), planController.createPlan);
router.put('/:id', checkRole(['admin']), planController.updatePlan);
router.delete('/:id', checkRole(['admin']), planController.deletePlan);

module.exports = router;
