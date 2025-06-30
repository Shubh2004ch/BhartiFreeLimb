const ProstheticCenter = require('../../models/ProstheticCenter');
const { uploadToS3, deleteFromS3, deleteFileFromS3 } = require('../utils/s3');

// Get all prosthetic centers
exports.getAllCenters = async (req, res) => {
  try {
    const centers = await ProstheticCenter.find().sort({ createdAt: -1 });
    res.json(centers);
  } catch (error) {
    console.error('Error fetching centers:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single prosthetic center by ID
exports.getCenterById = async (req, res) => {
  try {
    const center = await ProstheticCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Prosthetic center not found' });
    }
    res.json(center);
  } catch (error) {
    console.error('Error fetching center:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new prosthetic center
exports.createCenter = async (req, res) => {
  try {
    console.log('Creating new prosthetic center');
    console.log('Request body:', req.body);
    console.log('Files:', req.files);

    // Create center object
    const center = new ProstheticCenter({
      name: req.body.name,
      address: req.body.address,
      contact: req.body.contact,
      features: req.body.features ? JSON.parse(req.body.features) : [],
      rating: isNaN(Number(req.body.rating)) ? 0 : Number(req.body.rating),
      heroImage: req.files?.heroImage?.[0]?.location,
      beneficiaryImages: req.files?.beneficiaries?.map(file => file.location) || []
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

// Update prosthetic center
exports.updateCenter = async (req, res) => {
  try {
    console.log('Updating prosthetic center:', req.params.id);
    console.log('Update data:', req.body);
    console.log('Files:', req.files ? Object.keys(req.files) : 'No files');

    const updateData = { ...req.body };
    
    // Handle file uploads
    if (req.files?.heroImage?.[0]?.location) {
      console.log('Updating hero image:', req.files.heroImage[0].location);
      updateData.heroImage = req.files.heroImage[0].location;
    }
    
    if (req.files?.beneficiaries) {
      console.log('Updating beneficiary images:', req.files.beneficiaries.map(f => f.location));
      updateData.beneficiaryImages = req.files.beneficiaries.map(file => file.location);
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

    const center = await ProstheticCenter.findByIdAndUpdate(
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

// Delete prosthetic center
exports.deleteCenter = async (req, res) => {
  try {
    const center = await ProstheticCenter.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });

    // Delete hero image from S3
    if (center.heroImage) {
      await deleteFileFromS3(center.heroImage);
    }

    // Delete beneficiary images from S3
    if (center.beneficiaryImages && center.beneficiaryImages.length > 0) {
      await Promise.all(center.beneficiaryImages.map(image => deleteFileFromS3(image)));
    }

    // Delete the center from database
    await ProstheticCenter.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Center and associated images deleted successfully' });
  } catch (error) {
    console.error('Center deletion failed:', error);
    res.status(500).json({ 
      message: 'Failed to delete center',
      error: error.message 
    });
  }
};

// Upload multiple images to prosthetic center
exports.uploadImages = async (req, res) => {
  try {
    console.log('Uploading images to prosthetic center:', req.params.id);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const center = await ProstheticCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    // Get image URLs from uploaded files
    const newImages = req.files.map(file => file.location);

    // Add new images to the center's beneficiaryImages array
    center.beneficiaryImages = [...(center.beneficiaryImages || []), ...newImages];
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