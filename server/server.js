// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv'); // Import dotenv
const connectDB = require('./config/db'); // Import the database connection function

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// We'll add more routes here later

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});