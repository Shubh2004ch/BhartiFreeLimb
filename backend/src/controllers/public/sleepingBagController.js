const SleepingBag = require('../models/SleepingBag');

// Get all sleeping bags
exports.getAllSleepingBags = async (req, res) => {
  try {
    const sleepingBags = await SleepingBag.find().sort({ createdAt: -1 });
    res.json(sleepingBags);
  } catch (error) {
    console.error('Error fetching sleeping bags:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single sleeping bag by ID
exports.getSleepingBagById = async (req, res) => {
  try {
    const sleepingBag = await SleepingBag.findById(req.params.id);
    if (!sleepingBag) {
      return res.status(404).json({ message: 'Sleeping bag not found' });
    }
    res.json(sleepingBag);
  } catch (error) {
    console.error('Error fetching sleeping bag:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new sleeping bag
exports.createSleepingBag = async (req, res) => {
  try {
    console.log('Creating sleeping bag with data:', {
      body: req.body,
      file: req.file
    });

    const { name, location, description, contactNumber, availability, quantity } = req.body;
    
    // Convert string 'true'/'false' to boolean
    const isAvailable = availability === 'true' || availability === true;
    
    const sleepingBag = new SleepingBag({
      name,
      location,
      description,
      contactNumber,
      availability: isAvailable,
      quantity: parseInt(quantity),
      imagePath: req.file ? req.file.location : undefined,
    });

    console.log('Saving sleeping bag:', sleepingBag);
    const savedSleepingBag = await sleepingBag.save();
    console.log('Saved sleeping bag:', savedSleepingBag);
    
    res.status(201).json(savedSleepingBag);
  } catch (error) {
    console.error('Error creating sleeping bag:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update sleeping bag
exports.updateSleepingBag = async (req, res) => {
  try {
    console.log('Updating sleeping bag with data:', {
      id: req.params.id,
      body: req.body,
      file: req.file
    });

    const { name, location, description, contactNumber, availability, quantity, images } = req.body;
    
    // Convert string 'true'/'false' to boolean
    const isAvailable = availability === 'true' || availability === true;
    
    const updateData = {
      name,
      location,
      description,
      contactNumber,
      availability: isAvailable
    };

    // Handle quantity parsing
    if (quantity !== undefined && quantity !== null) {
      const parsedQuantity = parseInt(quantity);
      if (!isNaN(parsedQuantity)) {
        updateData.quantity = parsedQuantity;
      } else {
        console.warn('Invalid quantity value:', quantity);
        updateData.quantity = 0; // Default to 0 if parsing fails
      }
    }

    // Handle images array if provided
    if (images) {
      try {
        // If images is a string (JSON), parse it
        const parsedImages = typeof images === 'string' ? JSON.parse(images) : images;
        updateData.images = Array.isArray(parsedImages) ? parsedImages : [];
      } catch (error) {
        console.error('Error parsing images:', error);
        updateData.images = [];
      }
    }

    if (req.file) {
      console.log('New file uploaded:', req.file);
      updateData.imagePath = req.file.location;
    }

    console.log('Update data:', updateData);

    const sleepingBag = await SleepingBag.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!sleepingBag) {
      console.log('Sleeping bag not found:', req.params.id);
      return res.status(404).json({ message: 'Sleeping bag not found' });
    }

    console.log('Updated sleeping bag:', sleepingBag);
    res.json(sleepingBag);
  } catch (error) {
    console.error('Error updating sleeping bag:', error);
    res.status(400).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete sleeping bag
exports.deleteSleepingBag = async (req, res) => {
  try {
    const sleepingBag = await SleepingBag.findByIdAndDelete(req.params.id);
    if (!sleepingBag) {
      return res.status(404).json({ message: 'Sleeping bag not found' });
    }
    res.json({ message: 'Sleeping bag deleted successfully' });
  } catch (error) {
    console.error('Error deleting sleeping bag:', error);
    res.status(500).json({ message: error.message });
  }
};

// Upload multiple images to sleeping bag
exports.uploadImages = async (req, res) => {
  try {
    console.log('Uploading images to sleeping bag:', req.params.id);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const sleepingBag = await SleepingBag.findById(req.params.id);
    if (!sleepingBag) {
      return res.status(404).json({ message: 'Sleeping bag not found' });
    }

    // Get image URLs from uploaded files
    const newImages = req.files.map(file => file.location);

    // Add new images to the sleeping bag's images array
    sleepingBag.images = [...(sleepingBag.images || []), ...newImages];
    
    // Save the updated sleeping bag
    const updatedSleepingBag = await sleepingBag.save();
    
    console.log('Images uploaded successfully:', newImages);
    res.json({
      message: 'Images uploaded successfully',
      images: newImages,
      sleepingBag: updatedSleepingBag
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ 
      message: 'Failed to upload images',
      error: error.message
    });
  }
}; 