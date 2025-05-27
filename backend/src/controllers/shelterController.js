const Shelter = require('../models/Shelter');
const path = require('path');
const fs = require('fs');

// Get all shelters
exports.getAllShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find().sort({ createdAt: -1 });
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single shelter
exports.getShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    res.json(shelter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new shelter
exports.createShelter = async (req, res) => {
  try {
    const shelterData = { ...req.body };
    
    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      shelterData.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const shelter = new Shelter(shelterData);
    const newShelter = await shelter.save();
    res.status(201).json(newShelter);
  } catch (error) {
    // If there's an error, delete any uploaded files
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '..', 'uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Update shelter
exports.updateShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const updateData = { ...req.body };
    
    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      // Keep existing images if not being replaced
      const existingImages = updateData.keepImages ? updateData.keepImages.split(',') : [];
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = [...existingImages, ...newImages];

      // Delete old images that are being replaced
      if (shelter.images) {
        shelter.images.forEach(imagePath => {
          if (!existingImages.includes(imagePath)) {
            const fullPath = path.join(__dirname, '..', imagePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          }
        });
      }
    }

    Object.assign(shelter, updateData);
    shelter.updatedAt = Date.now();
    
    const updatedShelter = await shelter.save();
    res.json(updatedShelter);
  } catch (error) {
    // If there's an error, delete any uploaded files
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '..', 'uploads', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Delete shelter
exports.deleteShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    // Delete associated images
    if (shelter.images && shelter.images.length > 0) {
      shelter.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await shelter.deleteOne();
    res.json({ message: 'Shelter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 