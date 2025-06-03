const Clinic = require('../models/Clinic');

// Get all clinics
exports.getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find().sort({ createdAt: -1 });
    res.json(clinics);
  } catch (error) {
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
    const { name, location, description, contactNumber, operatingHours, services } = req.body;
    const updateData = {
      name,
      location,
      description,
      contactNumber,
      operatingHours,
      services: services ? services.split(',').map(service => service.trim()) : []
    };
    if (req.file) {
      updateData.imagePath = req.file.location;
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
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    res.json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 