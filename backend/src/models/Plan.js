const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Plan = sequelize.define('Plan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Plan;