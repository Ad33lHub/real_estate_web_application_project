const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Property = require('../models/Property');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// GET all properties (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { search, type, minPrice, maxPrice, status, location } = req.query;
    let filter = {};

    // Filter by property type
    if (type) {
      filter.propertyType = type;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by location (partial match)
    if (location) {
      filter.propertyLocation = { $regex: location, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.askingPrice = {};
      if (minPrice) filter.askingPrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.askingPrice.$lte = parseFloat(maxPrice);
    }

    // Text search
    if (search) {
      filter.$or = [
        { propertyLocation: { $regex: search, $options: 'i' } },
        { propertyDescription: { $regex: search, $options: 'i' } },
        { propertyType: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (err) {
    console.error('Get Properties Error:', err);
    res.status(500).json({ message: 'Server error while fetching properties' });
  }
});

// GET single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (err) {
    console.error('Get Property Error:', err);
    res.status(500).json({ message: 'Server error while fetching property' });
  }
});

// POST - Create new property (with image upload)
router.post('/', upload.array('propertyImages', 10), async (req, res) => {
  try {
    const {
      propertyType, propertyLocation, propertySize, askingPrice,
      contactName, contactPhone, contactEmail, propertyDescription
    } = req.body;

    // Get uploaded image filenames
    const imageNames = req.files ? req.files.map(f => f.filename) : [];

    const property = new Property({
      propertyType,
      propertyLocation,
      propertySize,
      askingPrice: parseFloat(askingPrice),
      contactName,
      contactPhone,
      contactEmail: contactEmail || '',
      propertyDescription,
      propertyImages: imageNames
    });

    await property.save();
    res.status(201).json({ message: 'Property submitted successfully!', property });
  } catch (err) {
    console.error('Create Property Error:', err);
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(f => {
        try {
          fs.unlinkSync(path.join(uploadDir, f.filename));
        } catch (e) {
          console.error('File cleanup failed:', e);
        }
      });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while creating property', error: err.message });
  }
});

// PUT - Update property by ID
router.put('/:id', upload.array('propertyImages', 10), async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.askingPrice) {
      updates.askingPrice = parseFloat(updates.askingPrice);
    }

    // If new images are uploaded, add them
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => f.filename);
      updates.propertyImages = newImages;
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Property updated successfully', property });
  } catch (err) {
    console.error('Update Property Error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while updating property' });
  }
});

// DELETE - Delete property by ID
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Clean up images
    if (property.propertyImages && property.propertyImages.length > 0) {
      property.propertyImages.forEach(img => {
        try {
          fs.unlinkSync(path.join(uploadDir, img));
        } catch (e) {
          console.error('Image cleanup failed:', e);
        }
      });
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Delete Property Error:', err);
    res.status(500).json({ message: 'Server error while deleting property' });
  }
});

module.exports = router;
