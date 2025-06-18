const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    subscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Subscriptions',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'completed', 'failed']]
        }
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['cash', 'transfer', 'mbway']]
        }
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Payment; 