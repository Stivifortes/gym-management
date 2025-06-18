const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const planRoutes = require('./src/routes/plans');
const subscriptionRoutes = require('./src/routes/subscriptions');
const paymentRoutes = require('./src/routes/payments');
const reportRoutes = require('./src/routes/report');
require('./src/models');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/plans', planRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/payments', paymentRoutes);
app.use('/reports', reportRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});