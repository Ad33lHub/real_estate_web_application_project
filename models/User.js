const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    maxlength: 20
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  cnic: {
    type: String,
    trim: true,
    maxlength: 15
  },
  country: {
    type: String,
    trim: true,
    maxlength: 50
  },
  city: {
    type: String,
    trim: true,
    maxlength: 50
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
