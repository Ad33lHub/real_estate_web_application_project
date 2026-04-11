const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Agent = require('../models/Agent');

// Home Page
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({ status: 'available' }).sort({ createdAt: -1 }).limit(6);
    res.render('home', { properties });
  } catch (err) {
    console.error('Home page error:', err);
    res.render('home', { properties: [] });
  }
});

// Properties Page
router.get('/properties', async (req, res) => {
  try {
    const { search, type, minPrice, maxPrice, status } = req.query;
    let filter = {};

    if (type) filter.propertyType = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { propertyLocation: { $regex: search, $options: 'i' } },
        { propertyDescription: { $regex: search, $options: 'i' } },
        { propertyType: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      filter.askingPrice = {};
      if (minPrice) filter.askingPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.askingPrice.$lte = parseFloat(maxPrice);
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.render('properties', { properties });
  } catch (err) {
    console.error('Properties page error:', err);
    res.render('properties', { properties: [] });
  }
});

// Add Property Page
router.get('/add-property', (req, res) => {
  res.render('add-property');
});

// Agents Page
router.get('/agents', async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.render('agents', { agents });
  } catch (err) {
    console.error('Agents page error:', err);
    res.render('agents', { agents: [] });
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

// About Page
router.get('/about', (req, res) => {
  res.render('about');
});

// Contact Page
router.get('/contact', (req, res) => {
  res.render('contact');
});

module.exports = router;
