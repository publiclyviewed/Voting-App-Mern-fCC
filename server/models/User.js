// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true, // Remove whitespace from both ends of a string
    minlength: [3, 'Username must be at least 3 characters long']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// --- Password Hashing Middleware ---
// This pre-save hook will run before a user document is saved to the database.
// It hashes the password if it's new or has been modified.
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10); // 10 is a good default for salt rounds
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

// --- Password Comparison Method ---
// This method will be available on user documents to compare a plain text password
// with the hashed password stored in the database.
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);