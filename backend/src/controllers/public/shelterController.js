const Shelter = require('../models/Shelter');

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
    console.log('Fetching shelter with ID:', req.params.id);
    
    if (!req.params.id) {
      console.error('No shelter ID provided');
      return res.status(400).json({ message: 'Shelter ID is required' });
    }

    const shelter = await Shelter.findById(req.params.id);
    
    if (!shelter) {
      console.log('Shelter not found with ID:', req.params.id);
      return res.status(404).json({ 
        message: 'Shelter not found',
        id: req.params.id
      });
    }

    console.log('Successfully fetched shelter:', {
      id: shelter._id,
      name: shelter.name
    });

    res.json(shelter);
  } catch (error) {
    console.error('Error fetching shelter:', {
      id: req.params.id,
      error: error.message,
      stack: error.stack
    });

    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid shelter ID format',
        id: req.params.id
      });
    }

    res.status(500).json({ 
      message: 'Failed to fetch shelter details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create new shelter
exports.createShelter = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    console.log('Request file:', req.file); // Debug log

    const shelterData = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      contactNumber: req.body.contactNumber,
      capacity: parseInt(req.body.capacity),
      currentOccupancy: parseInt(req.body.currentOccupancy),
      description: req.body.description,
      isActive: true
    };
    
    // Handle facilities array
    if (req.body.facilities) {
      shelterData.facilities = Array.isArray(req.body.facilities) 
        ? req.body.facilities 
        : [req.body.facilities];
    }
    
    // Handle uploaded hero image
    if (req.file) {
      console.log('Hero image uploaded:', req.file);
      shelterData.imagePath = req.file.location;
    }

    console.log('Creating shelter with data:', shelterData); // Debug log

    const shelter = new Shelter(shelterData);
    const newShelter = await shelter.save();
    res.status(201).json(newShelter);
  } catch (error) {
    console.error('Error creating shelter:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update shelter
exports.updateShelter = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    console.log('Request file:', req.file); // Debug log

    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    const updateData = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      contactNumber: req.body.contactNumber,
      capacity: parseInt(req.body.capacity),
      currentOccupancy: parseInt(req.body.currentOccupancy),
      description: req.body.description
    };
    
    // Handle facilities array
    if (req.body.facilities) {
      try {
        updateData.facilities = JSON.parse(req.body.facilities);
      } catch (error) {
        console.error('Error parsing facilities:', error);
        updateData.facilities = Array.isArray(req.body.facilities) 
          ? req.body.facilities 
          : [req.body.facilities];
      }
    }
    
    // Handle images array
    if (req.body.images) {
      try {
        updateData.images = JSON.parse(req.body.images);
      } catch (error) {
        console.error('Error parsing images:', error);
        updateData.images = Array.isArray(req.body.images) 
          ? req.body.images 
          : [req.body.images];
      }
    }
    
    // Handle hero image
    if (req.file) {
      console.log('New hero image uploaded:', req.file);
      updateData.imagePath = req.file.location;
    } else if (req.body.imagePath && !req.file) {
      // Keep existing image if no new file is uploaded
      console.log('Keeping existing hero image:', req.body.imagePath);
      updateData.imagePath = req.body.imagePath;
    }

    console.log('Updating shelter with data:', updateData);

    Object.assign(shelter, updateData);
    shelter.updatedAt = Date.now();
    
    const updatedShelter = await shelter.save();
    res.json(updatedShelter);
  } catch (error) {
    console.error('Error updating shelter:', error);
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

    await shelter.deleteOne();
    res.json({ message: 'Shelter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload multiple images to shelter
exports.uploadImages = async (req, res) => {
  try {
    console.log('Uploading images to shelter:', req.params.id);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    // Get image URLs from uploaded files
    const newImages = req.files.map(file => file.location);

    // Add new images to the shelter's images array
    shelter.images = [...(shelter.images || []), ...newImages];
    await shelter.save();

    console.log('Images uploaded successfully:', newImages);
    res.json(shelter);
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ 
      message: 'Failed to upload images',
      error: error.message 
    });
  }
}; 