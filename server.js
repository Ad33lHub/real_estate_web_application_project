require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/users');
const propertyRoutes = require('./routes/properties');
const agentRoutes = require('./routes/agents');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// View engine setup - EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/agents', agentRoutes);

// Keep old API routes working for backward compatibility
app.use('/api/Registeration', userRoutes);
app.use('/api/PropertyRegisteration', propertyRoutes);

// View Routes (EJS pages)
app.use('/', viewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('home', { properties: [] });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
