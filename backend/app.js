const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const planRoutes = require('./src/routes/plans');
const subscriptionRoutes = require('./src/routes/subscriptions');
const paymentRoutes = require('./src/routes/payments');
const reportRoutes = require('./src/routes/report');
require('./src/models');

const app = express();

// CORS dinâmico por ambiente
let allowedOrigins = [];
if (process.env.NODE_ENV === 'production') {
  allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');
} else {
  allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CORS_ORIGIN
  ];
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// API routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/plans', planRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/payments', paymentRoutes);
app.use('/reports', reportRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Gym Management API is running!',
    docs: '/api-docs'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`);
});