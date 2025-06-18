const Plan = require('../models/Plan');

exports.getPlans = async (req, res) => {
    const plans = await Plan.findAll();
    res.status(200).json(plans);
};

exports.getPlanById = async (req, res) => {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);
    if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
    }
    res.status(200).json(plan);
};

exports.createPlan = async (req, res) => {
    const { name, description, price, duration } = req.body;
    const plan = await Plan.create({ name, description, price, duration });
    res.status(201).json(plan);
};

exports.updatePlan = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, duration } = req.body;
    const plan = await Plan.update({ name, description, price, duration }, { where: { id } });
    res.status(200).json(plan);
};

exports.deletePlan = async (req, res) => {
    const { id } = req.params;
    const plan = await Plan.destroy({ where: { id } });
    res.status(200).json({ message: 'Plan deleted successfully' });
};

exports.getPlanByName = async (req, res) => {
    const { name } = req.params;
    const plan = await Plan.findAll({ where: { name } });
    res.status(200).json(plan);
};

