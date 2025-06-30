const Clinic = require('../models/Clinic');
const { deleteFileFromS3 } = require('../config/s3');

// Get all clinics
exports.getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find().sort({ createdAt: -1 });
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single clinic by ID
exports.getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json(clinic);
  } catch (error) {
    console.error('Error fetching clinic:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new clinic
exports.createClinic = async (req, res) => {
  try {
    const { name, location, description, contactNumber, operatingHours, services } = req.body;
    const clinic = new Clinic({
      name,
      location,
      description,
      contactNumber,
      operatingHours,
      services: services ? services.split(',').map(service => service.trim()) : [],
      imagePath: req.file ? req.file.location : undefined,
    });
    const savedClinic = await clinic.save();
    res.status(201).json(savedClinic);
  } catch (error) {
    console.error('Error creating clinic:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update clinic
exports.updateClinic = async (req, res) => {
  try {
    const { name, location, description, contactNumber, operatingHours, services, images } = req.body;
    const updateData = {
      name,
      location,
      description,
      contactNumber,
      operatingHours,
      services: services ? services.split(',').map(service => service.trim()) : []
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

    const clinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json(clinic);
  } catch (error) {
    console.error('Error updating clinic:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete clinic
exports.deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) return res.status(404).json({ message: 'Clinic not found' });

    // Delete hero image from S3
    if (clinic.imagePath) {
      await deleteFileFromS3(clinic.imagePath);
    }

    // Delete additional images from S3
    if (clinic.images && clinic.images.length > 0) {
      await Promise.all(clinic.images.map(image => deleteFileFromS3(image)));
    }

    // Delete the clinic from database
    await Clinic.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Clinic and associated images deleted successfully' });
  } catch (error) {
    console.error('Clinic deletion failed:', error);
    res.status(500).json({ 
      message: 'Failed to delete clinic',
      error: error.message 
    });
  }
};

// Upload multiple images to clinic
exports.uploadImages = async (req, res) => {
  try {
    console.log('Uploading images to clinic:', req.params.id);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    console.log('Found clinic:', clinic);
    console.log('Current images:', clinic.images);

    // Get image URLs from uploaded files
    const newImages = req.files.map(file => file.location);
    console.log('New image URLs:', newImages);

    // Initialize images array if it doesn't exist
    if (!clinic.images) {
      clinic.images = [];
    }

    // Add new images to the clinic's images array
    clinic.images = [...clinic.images, ...newImages];
    console.log('Updated images array:', clinic.images);

    const savedClinic = await clinic.save();
    console.log('Saved clinic:', savedClinic);

    res.json(savedClinic);
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: error.message });
  }
}; 