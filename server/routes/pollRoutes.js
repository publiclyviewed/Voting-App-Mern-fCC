// server/routes/pollRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPoll,
  getPolls,
  getPollById,
  getMyPolls,
  voteOnPoll,
  addOptionToPoll,
  deletePoll,
} = require('../controllers/pollController'); // Import poll controller functions
const { protect } = require('../middleware/authMiddleware'); // Import our authentication middleware

// Public routes for polls
router.get('/', getPolls);            // Get all polls
router.get('/:id', getPollById);      // Get a single poll by ID
router.post('/:id/vote', voteOnPoll); // Vote on a poll

// Private routes (require authentication)
router.post('/', protect, createPoll);            // Create a new poll
router.get('/my-polls', protect, getMyPolls);     // Get polls created by the user
router.put('/:id/add-option', protect, addOptionToPoll); // Add option to a poll
router.delete('/:id', protect, deletePoll);       // Delete a poll

module.exports = router;