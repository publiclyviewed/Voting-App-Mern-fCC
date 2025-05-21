// server/models/Poll.js
const mongoose = require('mongoose');

const PollOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  votes: {
    type: Number,
    default: 0
  }
}, { _id: false }); // _id: false means Mongoose won't create an _id for each option subdocument

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Poll question is required'],
    trim: true,
    minlength: [5, 'Question must be at least 5 characters long']
  },
  options: {
    type: [PollOptionSchema], // Array of PollOptionSchema
    validate: {
      validator: function(v) {
        return v.length >= 2; // Ensure at least two options are provided
      },
      message: 'A poll must have at least two options.'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // This will store the MongoDB _id of the User who created the poll
    ref: 'User', // References the 'User' model
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Poll', PollSchema);