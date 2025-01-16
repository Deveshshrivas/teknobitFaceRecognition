const express = require('express');
const connectDB = require('./config/db');
const signupRoutes = require('./routes/signupRoutes');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/signup', signupRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));