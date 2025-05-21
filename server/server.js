// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Essential for parsing JSON request bodies - PLACE BEFORE CORS for consistency

// --- Specific CORS Configuration for Production ---
const allowedOrigins = [
  'http://localhost:3000', // For local development of frontend
  'https://voting-app-mern-fcc.netlify.app', // Your Netlify frontend domain
  // Add other frontend domains if you have them, e.g., for staging environments
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman/curl)
    // and requests from explicitly allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allowed headers
  credentials: true // Crucial for sending cookies and Authorization headers (JWT)
}));

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use poll routes
app.use('/api/polls', pollRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});