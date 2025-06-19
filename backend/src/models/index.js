const User = require('./User');
const Plan = require('./Plan');
const Subscription = require('./Subscription');
const Payment = require('./Payment');
const Report = require('./Report');

// User associations
User.hasMany(Subscription);
User.hasMany(Report);

// Plan associations
Plan.hasMany(Subscription);

// Subscription associations
Subscription.belongsTo(User);
Subscription.belongsTo(Plan);
Subscription.hasMany(Payment);

// Payment associations
Payment.belongsTo(Subscription);

// Report associations
Report.belongsTo(User);

module.exports = {
    User,
    Plan,
    Subscription,
    Payment,
    Report
}; 