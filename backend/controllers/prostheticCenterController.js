const ProstheticCenter = require('../models/ProstheticCenter');
const { uploadToS3, deleteFromS3 } = require('../utils/s3');

// Get all prosthetic centers
exports.getAllCenters = async (req, res) => {
  try {
    const centers = await ProstheticCenter.find();
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single prosthetic center
exports.getCenterById = async (req, res) => {
  try {
    const center = await ProstheticCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    res.json(center);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new prosthetic center
exports.createCenter = async (req, res) => {
  try {
    const { name, address, phone, email, description, location } = req.body;
    
    // Upload hero image
    const heroImage = await uploadToS3(req.files.heroImage[0]);
    
    // Upload beneficiary images
    const beneficiaryImages = await Promise.all(
      req.files.beneficiaryImages.map(file => uploadToS3(file))
    );

    const center = new ProstheticCenter({
      name,
      address,
      phone,
      email,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)],
      },
      heroImage,
      beneficiaryImages,
    });

    const savedCenter = await center.save();
    res.status(201).json(savedCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a prosthetic center
exports.updateCenter = async (req, res) => {
  try {
    const { name, address, phone, email, description, location } = req.body;
    const updateData = {
      name,
      address,
      phone,
      email,
      description,
      location: {
        type: 'Point',
        coordinates: [parseFloat(location.longitude), parseFloat(location.latitude)],
      },
    };

    // Handle hero image update if provided
    if (req.files?.heroImage) {
      const oldCenter = await ProstheticCenter.findById(req.params.id);
      if (oldCenter.heroImage) {
        await deleteFromS3(oldCenter.heroImage);
      }
      updateData.heroImage = await uploadToS3(req.files.heroImage[0]);
    }

    // Handle beneficiary images update if provided
    if (req.files?.beneficiaryImages) {
      const oldCenter = await ProstheticCenter.findById(req.params.id);
      // Delete old beneficiary images
      await Promise.all(
        oldCenter.beneficiaryImages.map(image => deleteFromS3(image))
      );
      // Upload new beneficiary images
      updateData.beneficiaryImages = await Promise.all(
        req.files.beneficiaryImages.map(file => uploadToS3(file))
      );
    }

    const updatedCenter = await ProstheticCenter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCenter) {
      return res.status(404).json({ message: 'Center not found' });
    }

    res.json(updatedCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a prosthetic center
exports.deleteCenter = async (req, res) => {
  try {
    const center = await ProstheticCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }

    // Delete images from S3
    await deleteFromS3(center.heroImage);
    await Promise.all(
      center.beneficiaryImages.map(image => deleteFromS3(image))
    );

    await ProstheticCenter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Center deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 