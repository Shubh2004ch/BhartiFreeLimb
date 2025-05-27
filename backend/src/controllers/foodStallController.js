const FoodStall = require('../models/FoodStall');

// Get all food stalls
exports.getAllFoodStalls = async (req, res) => {
  try {
    const foodStalls = await FoodStall.find().sort({ createdAt: -1 });
    res.json(foodStalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new food stall
exports.createFoodStall = async (req, res) => {
  try {
    const { name, location, description, contactNumber, operatingHours } = req.body;
    const foodStall = new FoodStall({
      name,
      location,
      description,
      contactNumber,
      operatingHours,
      imagePath: req.file ? req.file.path.replace(/\\/g, '/') : undefined
    });
    const savedFoodStall = await foodStall.save();
    res.status(201).json(savedFoodStall);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update food stall
exports.updateFoodStall = async (req, res) => {
  try {
    const { name, location, description, contactNumber, operatingHours } = req.body;
    const updateData = {
      name,
      location,
      description,
      contactNumber,
      operatingHours
    };
    if (req.file) {
      updateData.imagePath = req.file.path.replace(/\\/g, '/');
    }
    const foodStall = await FoodStall.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!foodStall) {
      return res.status(404).json({ message: 'Food stall not found' });
    }
    res.json(foodStall);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete food stall
exports.deleteFoodStall = async (req, res) => {
  try {
    const foodStall = await FoodStall.findByIdAndDelete(req.params.id);
    if (!foodStall) {
      return res.status(404).json({ message: 'Food stall not found' });
    }
    res.json({ message: 'Food stall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 