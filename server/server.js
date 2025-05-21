// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes'); // Import poll routes

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Essential for parsing JSON request bodies

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use poll routes
app.use('/api/polls', pollRoutes); // All routes in pollRoutes will be prefixed with /api/polls

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});