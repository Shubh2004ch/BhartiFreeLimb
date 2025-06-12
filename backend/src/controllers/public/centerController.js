const Center = require('../../models/Center');

// Get all centers
exports.getAllCenters = async (req, res) => {
  try {
    console.log('Fetching all centers...');
    const centers = await Center.find().sort({ createdAt: -1 });
    console.log(`Found ${centers.length} centers`);
    res.json(centers);
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ 
      message: 'Failed to fetch centers',
      error: error.message 
    });
  }
};

// Get single center
exports.getCenter = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json(center);
  } catch (error) {
    console.error('Error fetching center:', error);
    res.status(500).json({ 
      message: 'Failed to fetch center',
      error: error.message 
    });
  }
};

// Create new center
exports.createCenter = async (req, res) => {
  try {
    console.log('Creating new center...');
    console.log('Request body:', req.body);
    
    // Validate file uploads
    if (!req.files) {
      console.log('No files uploaded');
    } else {
      console.log('Uploaded files:', Object.keys(req.files).map(key => ({
        fieldname: key,
        count: req.files[key].length
      })));
    }

    // Parse features safely
    let features = [];
    try {
      features = req.body.features ? JSON.parse(req.body.features) : [];
    } catch (error) {
      console.error('Error parsing features:', error);
      return res.status(400).json({
        message: 'Invalid features format',
        error: error.message
      });
    }

    // Create center object
    const center = new Center({
      name: req.body.name,
      address: req.body.address,
      contact: req.body.contact,
      features: features,
      rating: isNaN(Number(req.body.rating)) ? 0 : Number(req.body.rating),
      imagePath: req.files?.heroImage?.[0]?.location,
      beneficiaryImages: req.files?.beneficiaryImages?.map(file => file.location) || []
    });

    // Validate required fields
    if (!center.name || !center.address) {
      return res.status(400).json({
        message: 'Name and address are required fields'
      });
    }

    // Save to database
    await center.save();
    console.log('Center created successfully:', center._id);
    res.status(201).json(center);
  } catch (error) {
    console.error('Center creation failed:', error);
    res.status(500).json({ 
      message: 'Failed to create center',
      error: error.message,
      details: error.stack
    });
  }
};

// Update center
exports.updateCenter = async (req, res) => {
  try {
    console.log('Updating center:', req.params.id);
    console.log('Update data:', req.body);
    console.log('Files:', req.files ? Object.keys(req.files) : 'No files');

    const updateData = { ...req.body };
    
    // Handle file uploads
    if (req.files?.heroImage?.[0]?.location) {
      console.log('Updating hero image:', req.files.heroImage[0].location);
      updateData.imagePath = req.files.heroImage[0].location;
    }
    
    if (req.files?.beneficiaryImages) {
      console.log('Updating beneficiary images:', req.files.beneficiaryImages.map(f => f.location));
      updateData.beneficiaryImages = req.files.beneficiaryImages.map(file => file.location);
    }

    // Parse features if present
    if (updateData.features) {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch (error) {
        console.error('Error parsing features:', error);
        return res.status(400).json({
          message: 'Invalid features format',
          error: error.message
        });
      }
    }

    const center = await Center.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!center) {
      console.log('Center not found:', req.params.id);
      return res.status(404).json({ message: 'Center not found' });
    }

    console.log('Center updated successfully:', center._id);
    res.json(center);
  } catch (error) {
    console.error('Center update failed:', error);
    res.status(500).json({ 
      message: 'Failed to update center',
      error: error.message,
      details: error.stack
    });
  }
};

// Delete center
exports.deleteCenter = async (req, res) => {
  try {
    const center = await Center.findByIdAndDelete(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    console.error('Center deletion failed:', error);
    res.status(500).json({ 
      message: 'Failed to delete center',
      error: error.message 
    });
  }
};

// Upload multiple images to center
exports.uploadImages = async (req, res) => {
  try {
    console.log('Uploading images to center:', req.params.id);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    // Get image URLs from uploaded files
    const newImages = req.files.map(file => file.location);

    // Add new images to the center's images array
    center.images = [...(center.images || []), ...newImages];
    await center.save();

    console.log('Images uploaded successfully:', newImages);
    res.json(center);
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ 
      message: 'Failed to upload images',
      error: error.message 
    });
  }
};

// Add media to center
exports.addMedia = async (req, res) => {
  try {
    const { type, url, title } = req.body;
    
    if (!type || !url) {
      return res.status(400).json({
        message: 'Media type and URL are required'
      });
    }

    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    
    center.media.push({ type, url, title });
    await center.save();
    res.status(201).json(center);
  } catch (error) {
    console.error('Failed to add media:', error);
    res.status(500).json({ 
      message: 'Failed to add media',
      error: error.message 
    });
  }
};

// Delete media from center
exports.deleteMedia = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    
    const mediaExists = center.media.some(m => m._id.toString() === req.params.mediaId);
    if (!mediaExists) {
      return res.status(404).json({ message: 'Media not found' });
    }

    center.media = center.media.filter(m => m._id.toString() !== req.params.mediaId);
    await center.save();
    res.json({ message: 'Media deleted successfully', center });
  } catch (error) {
    console.error('Failed to delete media:', error);
    res.status(500).json({ 
      message: 'Failed to delete media',
      error: error.message 
    });
  }
}; 