const Center = require('../models/Center');

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
    res.status(500).json({ message: error.message });
  }
};

// Create new center
exports.createCenter = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILES:', req.files);

    const { name, address, contact, features, rating } = req.body;

    const center = new Center({
      name,
      address,
      contact,
      features: req.body.features ? JSON.parse(req.body.features) : [],
      rating: isNaN(Number(rating)) ? 0 : Number(rating),
      imagePath: req.files?.heroImage ? req.files.heroImage[0].location : undefined,
      beneficiaryImages: req.files?.beneficiaryImages ? 
        req.files.beneficiaryImages.map(file => file.location) : []
    });

    await center.save();
    res.status(201).json(center);
  } catch (error) {
    console.error('Center creation failed:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update center
exports.updateCenter = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.files?.heroImage) {
      updateData.imagePath = req.files.heroImage[0].location;
    }
    
    if (req.files?.beneficiaryImages) {
      updateData.beneficiaryImages = req.files.beneficiaryImages.map(file => file.location);
    }

    const center = await Center.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json(center);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete center
exports.deleteCenter = async (req, res) => {
  try {
    const center = await Center.findByIdAndDelete(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json({ message: 'Center deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add media to center
exports.addMedia = async (req, res) => {
  try {
    const { type, url, title } = req.body;
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    center.media.push({ type, url, title });
    await center.save();
    res.status(201).json(center);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete media from center
exports.deleteMedia = async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) return res.status(404).json({ message: 'Center not found' });
    center.media = center.media.filter(m => m._id.toString() !== req.params.mediaId);
    await center.save();
    res.json(center);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 