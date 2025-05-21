// server/routes/pollRoutes.js
const express = require('express');
const router = express.Router();
const {
  createPoll,
  getPolls,
  getPollById,
  voteOnPoll,
  deletePoll,
  addOptionToPoll, // Make sure this is imported
  getMyPolls // Make sure this is imported
} = require('../controllers/pollController');
const { protect } = require('../middleware/authMiddleware');

// Public routes (no auth needed for viewing/voting)
router.get('/', getPolls); // Get all polls
router.post('/:id/vote', voteOnPoll); // Vote on a specific poll
router.post('/:id/options', protect, addOptionToPoll); // Add option to poll (creator only)

// Authenticated user specific routes
// !! IMPORTANT: Define /my-polls BEFORE /:id !!
router.get('/my-polls', protect, getMyPolls); // Get polls created by the authenticated user

// Dynamic poll ID routes (must come AFTER fixed paths)
router.get('/:id', getPollById); // Get a single poll by ID
router.delete('/:id', protect, deletePoll); // Delete a poll

module.exports = router;