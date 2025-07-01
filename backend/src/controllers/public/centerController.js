const Center = require('../../models/Center');
const { deleteFileFromS3 } = require('../../config/s3');

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
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });

    // Delete hero image from S3
    if (center.imagePath) {
      await deleteFileFromS3(center.imagePath);
    }

    // Delete beneficiary images from S3
    if (center.beneficiaryImages && center.beneficiaryImages.length > 0) {
      await Promise.all(center.beneficiaryImages.map(image => deleteFileFromS3(image)));
    }

    // Delete the center from database
    await Center.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Center and associated images deleted successfully' });
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
    console.log('=== Controller: Upload Images ===');
    console.log('Center ID:', req.params.id);
    console.log('Files received:', req.files ? req.files.length : 0);
    console.log('Files details:', req.files);

    if (!req.files || req.files.length === 0) {
      console.log('No files uploaded');
      return res.status(400).json({ 
        message: 'No valid files uploaded. Please ensure you are uploading image files (JPEG, PNG, GIF, WebP).',
        suggestion: 'Only image files are allowed. Please check your file types and try again.'
      });
    }

    // Validate center ID
    if (!req.params.id) {
      console.error('No center ID provided');
      return res.status(400).json({ message: 'Center ID is required' });
    }

    const center = await Center.findById(req.params.id);
    if (!center) {
      console.error('Center not found:', req.params.id);
      return res.status(404).json({ message: 'Center not found' });
    }

    console.log('Center found:', center._id);

    // Validate uploaded files
    const validFiles = req.files.filter(file => file && file.location);
    if (validFiles.length === 0) {
      console.error('No valid files with location found');
      return res.status(400).json({ 
        message: 'No valid files uploaded. All files must be successfully uploaded to S3.',
        uploadedFiles: req.files.length,
        validFiles: validFiles.length,
        suggestion: 'Please ensure all files are valid image formats and try again.'
      });
    }

    // Get image URLs from uploaded files
    const newImages = validFiles.map(file => file.location);
    console.log('New image URLs:', newImages);

    // Initialize images array if it doesn't exist
    if (!center.images) {
      center.images = [];
    }

    // Add new images to the center's images array
    const previousImages = center.images.length;
    center.images = [...center.images, ...newImages];
    
    console.log(`Adding ${newImages.length} images to center. Previous: ${previousImages}, New total: ${center.images.length}`);

    const savedCenter = await center.save();
    console.log('Center saved successfully with new images');

    // Check if all files were processed
    const totalFiles = req.files.length;
    const processedFiles = validFiles.length;
    const skippedFiles = totalFiles - processedFiles;

    let responseMessage = 'Images uploaded successfully';
    if (skippedFiles > 0) {
      responseMessage = `${processedFiles} images uploaded successfully. ${skippedFiles} files were skipped (invalid format).`;
    }

    res.json({
      message: responseMessage,
      images: newImages,
      center: savedCenter,
      uploadSummary: {
        totalFiles,
        processedFiles,
        skippedFiles
      }
    });
  } catch (error) {
    console.error('=== Controller Error ===');
    console.error('Error uploading images:', error);
    console.error('Error stack:', error.stack);
    console.error('Request params:', req.params);
    console.error('Request files:', req.files);
    
    res.status(500).json({ 
      message: 'Failed to upload images',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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