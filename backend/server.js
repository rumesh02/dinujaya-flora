const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/flowers', require('./routes/flowers'));
app.use('/api/admin/flowers', require('./routes/adminFlowers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/orders', require('./routes/customBoxOrders'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Dinujaya Flora API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      suppliers: '/api/suppliers',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      dashboard: '/api/dashboard'
    }
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
