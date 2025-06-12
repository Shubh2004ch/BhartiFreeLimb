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

// Get single food stall by ID
exports.getFoodStallById = async (req, res) => {
  try {
    const foodStall = await FoodStall.findById(req.params.id);
    if (!foodStall) {
      return res.status(404).json({ message: 'Food stall not found' });
    }
    res.json(foodStall);
  } catch (error) {
    console.error('Error fetching food stall:', error);
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
      imagePath: req.file ? req.file.location : undefined
    });
    const savedFoodStall = await foodStall.save();
    res.status(201).json(savedFoodStall);
  } catch (error) {
    console.error('Error creating food stall:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update food stall
exports.updateFoodStall = async (req, res) => {
  try {
    const { name, location, description, contactNumber, operatingHours, cuisine, images } = req.body;
    const updateData = {
      name,
      location,
      description,
      contactNumber,
      operatingHours,
      cuisine
    };

    // Handle single image upload
    if (req.file) {
      updateData.imagePath = req.file.location;
    }

    // Handle images array if provided
    if (images) {
      try {
        updateData.images = JSON.parse(images);
      } catch (error) {
        console.error('Error parsing images array:', error);
        return res.status(400).json({ message: 'Invalid images array format' });
      }
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
    console.error('Error updating food stall:', error);
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

// Upload multiple images to food stall
exports.uploadImages = async (req, res) => {
  try {
    console.log('Uploading images to food stall:', req.params.id);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const foodStall = await FoodStall.findById(req.params.id);
    if (!foodStall) {
      return res.status(404).json({ message: 'Food stall not found' });
    }

    // Get image URLs from uploaded files
    const newImages = req.files.map(file => file.location);

    // Add new images to the food stall's images array
    foodStall.images = [...(foodStall.images || []), ...newImages];
    await foodStall.save();

    console.log('Images uploaded successfully:', newImages);
    res.json(foodStall);
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ 
      message: 'Failed to upload images',
      error: error.message 
    });
  }
}; 