const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['house', 'apartment', 'plot', 'commercial', 'farmhouse'],
    trim: true
  },
  propertyLocation: {
    type: String,
    required: [true, 'Property location is required'],
    trim: true,
    maxlength: 255
  },
  propertySize: {
    type: String,
    required: [true, 'Property size is required'],
    trim: true,
    maxlength: 50
  },
  askingPrice: {
    type: Number,
    required: [true, 'Asking price is required'],
    min: 0
  },
  contactName: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true,
    maxlength: 100
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true,
    maxlength: 20
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  propertyDescription: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true
  },
  propertyImages: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented'],
    default: 'available'
  }
}, {
  timestamps: true
});

// Text index for search functionality
propertySchema.index({ propertyLocation: 'text', propertyDescription: 'text', propertyType: 'text' });

module.exports = mongoose.model('Property', propertySchema);
