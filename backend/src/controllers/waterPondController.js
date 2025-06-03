const WaterPond = require('../models/WaterPond');

// Get all active water ponds
exports.getAllWaterPonds = async (req, res) => {
  try {
    const waterPonds = await WaterPond.find({ isActive: true });
    res.json(waterPonds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific water pond
exports.getWaterPondById = async (req, res) => {
  try {
    const waterPond = await WaterPond.findById(req.params.id);
    if (!waterPond) {
      return res.status(404).json({ message: 'Water pond not found' });
    }
    res.json(waterPond);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new water pond
exports.createWaterPond = async (req, res) => {
  try {
    const waterPond = new WaterPond({
      name: req.body.name,
      location: req.body.location,
      contactNumber: req.body.contactNumber,
      imagePath: req.file ? req.file.location : undefined, // Using location instead of path for S3
    });

    const newWaterPond = await waterPond.save();
    res.status(201).json(newWaterPond);
  } catch (error) {
    console.error('Error creating water pond:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update a water pond
exports.updateWaterPond = async (req, res) => {
  try {
    const waterPond = await WaterPond.findById(req.params.id);
    if (!waterPond) {
      return res.status(404).json({ message: 'Water pond not found' });
    }

    waterPond.name = req.body.name || waterPond.name;
    waterPond.location = req.body.location || waterPond.location;
    waterPond.contactNumber = req.body.contactNumber || waterPond.contactNumber;
    
    if (req.file) {
      waterPond.imagePath = req.file.location; // Using location instead of path for S3
    }

    const updatedWaterPond = await waterPond.save();
    res.json(updatedWaterPond);
  } catch (error) {
    console.error('Error updating water pond:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a water pond (soft delete)
exports.deleteWaterPond = async (req, res) => {
  try {
    const waterPond = await WaterPond.findById(req.params.id);
    if (!waterPond) {
      return res.status(404).json({ message: 'Water pond not found' });
    }

    waterPond.isActive = false;
    await waterPond.save();
    
    res.json({ message: 'Water pond deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 