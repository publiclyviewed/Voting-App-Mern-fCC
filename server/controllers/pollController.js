// server/controllers/pollController.js
const Poll = require('../models/Poll'); // Import the Poll model
const User = require('../models/User'); // Import the User model (needed for ownership checks)

// @desc    Create a new poll
// @route   POST /api/polls
// @access  Private (Authenticated Users)
const createPoll = async (req, res) => {
  const { question, options } = req.body; // Extract question and options from request body

  // Basic validation
  if (!question || !options || options.length < 2) {
    return res.status(400).json({ message: 'Please provide a question and at least two options.' });
  }

  // Ensure options are in the correct format (text property)
  const formattedOptions = options.map(option => ({ text: option.text || option }));

  try {
    const poll = new Poll({
      question,
      options: formattedOptions,
      createdBy: req.user._id, // Set the creator from the authenticated user (from authMiddleware)
    });

    const createdPoll = await poll.save();
    res.status(201).json(createdPoll); // Send back the created poll
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during poll creation.' });
  }
};

// @desc    Get all polls (publicly accessible)
// @route   GET /api/polls
// @access  Public
const getPolls = async (req, res) => {
  try {
    // Populate createdBy to get username along with polls
    const polls = await Poll.find({}).populate('createdBy', 'username');
    res.status(200).json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching polls.' });
  }
};

// @desc    Get a single poll by ID
// @route   GET /api/polls/:id
// @access  Public
const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate('createdBy', 'username');

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    res.status(200).json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching poll.' });
  }
};

// @desc    Get polls created by the authenticated user
// @route   GET /api/polls/my-polls
// @access  Private (Authenticated Users)
const getMyPolls = async (req, res) => {
  try {
    // Find polls where createdBy matches the authenticated user's ID
    const myPolls = await Poll.find({ createdBy: req.user._id }).populate('createdBy', 'username');
    res.status(200).json(myPolls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching your polls.' });
  }
};

// @desc    Vote on a poll
// @route   POST /api/polls/:id/vote
// @access  Public (Authenticated or Unauthenticated Users)
const voteOnPoll = async (req, res) => {
  const { optionIndex } = req.body; // Expects the index of the option to vote for

  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    // Basic validation for optionIndex
    if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid option selected.' });
    }

    // Increment the vote count for the selected option
    poll.options[optionIndex].votes += 1;

    // Save the updated poll
    await poll.save();

    res.status(200).json({ message: 'Vote recorded successfully.', poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error recording vote.' });
  }
};

// @desc    Add a new option to an existing poll
// @route   PUT /api/polls/:id/add-option
// @access  Private (Only the creator of the poll)
const addOptionToPoll = async (req, res) => {
  const { newOptionText } = req.body;

  if (!newOptionText || newOptionText.trim() === '') {
    return res.status(400).json({ message: 'New option text cannot be empty.' });
  }

  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    // Check if the authenticated user is the creator of the poll
    if (poll.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add options to this poll.' });
    }

    // Add the new option with 0 votes
    poll.options.push({ text: newOptionText.trim(), votes: 0 });

    const updatedPoll = await poll.save();
    res.status(200).json(updatedPoll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding new option.' });
  }
};

// @desc    Delete a poll
// @route   DELETE /api/polls/:id
// @access  Private (Only the creator of the poll)
const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    // Check if the authenticated user is the creator of the poll
    if (poll.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this poll.' });
    }

    await poll.deleteOne(); // Mongoose 6+ uses deleteOne() or deleteMany()

    res.status(200).json({ message: 'Poll removed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting poll.' });
  }
};

module.exports = {
  createPoll,
  getPolls,
  getPollById,
  getMyPolls,
  voteOnPoll,
  addOptionToPoll,
  deletePoll,
};