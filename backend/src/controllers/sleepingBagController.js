const SleepingBag = require('../models/SleepingBag');

// Get all sleeping bags
exports.getAllSleepingBags = async (req, res) => {
  try {
    const sleepingBags = await SleepingBag.find().sort({ createdAt: -1 });
    res.json(sleepingBags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new sleeping bag
exports.createSleepingBag = async (req, res) => {
  try {
    const { name, location, description, contactNumber, availability, quantity } = req.body;
    const sleepingBag = new SleepingBag({
      name,
      location,
      description,
      contactNumber,
      availability,
      quantity,
      imagePath: req.file ? req.file.path.replace(/\\/g, '/') : undefined
    });
    const savedSleepingBag = await sleepingBag.save();
    res.status(201).json(savedSleepingBag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update sleeping bag
exports.updateSleepingBag = async (req, res) => {
  try {
    const { name, location, description, contactNumber, availability, quantity } = req.body;
    const updateData = {
      name,
      location,
      description,
      contactNumber,
      availability,
      quantity
    };
    if (req.file) {
      updateData.imagePath = req.file.path.replace(/\\/g, '/');
    }
    const sleepingBag = await SleepingBag.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!sleepingBag) {
      return res.status(404).json({ message: 'Sleeping bag not found' });
    }
    res.json(sleepingBag);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
}; 