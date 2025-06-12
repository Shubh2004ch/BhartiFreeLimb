const ProstheticCenter = require('../../models/ProstheticCenter');
const { uploadToS3, deleteFromS3 } = require('../utils/s3');

/**
 * @swagger
 * /api/prosthetic-centers:
 *   get:
 *     summary: Get all active prosthetic centers
 *     tags: [Prosthetic Centers]
 *     responses:
 *       200:
 *         description: List of active prosthetic centers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProstheticCenter'
 *       500:
 *         description: Server error
 */
exports.getAllCenters = async (req, res) => {
  try {
    const centers = await ProstheticCenter.find({ isActive: true });
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/prosthetic-centers/{id}:
 *   get:
 *     summary: Get a specific prosthetic center by ID
 *     tags: [Prosthetic Centers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prosthetic center ID
 *     responses:
 *       200:
 *         description: Prosthetic center details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProstheticCenter'
 *       404:
 *         description: Prosthetic center not found
 *       500:
 *         description: Server error
 */
exports.getCenterById = async (req, res) => {
  try {
    const center = await ProstheticCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Prosthetic center not found' });
    }
    res.json(center);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/prosthetic-centers:
 *   post:
 *     summary: Create a new prosthetic center
 *     tags: [Prosthetic Centers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               hero:
 *                 type: string
 *                 format: binary
 *               beneficiaries:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Prosthetic center created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProstheticCenter'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
exports.createCenter = async (req, res) => {
  try {
    const center = new ProstheticCenter({
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      contactNumber: req.body.contactNumber,
      services: req.body.services,
      heroImage: req.files?.hero?.[0]?.location,
      beneficiaryImages: req.files?.beneficiaries?.map(file => file.location) || [],
    });

    const newCenter = await center.save();
    res.status(201).json(newCenter);
  } catch (error) {
    console.error('Error creating prosthetic center:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/prosthetic-centers/{id}:
 *   put:
 *     summary: Update a prosthetic center
 *     tags: [Prosthetic Centers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prosthetic center ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               hero:
 *                 type: string
 *                 format: binary
 *               beneficiaries:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Prosthetic center updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProstheticCenter'
 *       404:
 *         description: Prosthetic center not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
exports.updateCenter = async (req, res) => {
  try {
    const center = await ProstheticCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Prosthetic center not found' });
    }

    center.name = req.body.name || center.name;
    center.location = req.body.location || center.location;
    center.description = req.body.description || center.description;
    center.contactNumber = req.body.contactNumber || center.contactNumber;
    center.services = req.body.services || center.services;
    
    if (req.files?.hero?.[0]) {
      center.heroImage = req.files.hero[0].location;
    }
    
    if (req.files?.beneficiaries) {
      center.beneficiaryImages = req.files.beneficiaries.map(file => file.location);
    }

    const updatedCenter = await center.save();
    res.json(updatedCenter);
  } catch (error) {
    console.error('Error updating prosthetic center:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/prosthetic-centers/{id}:
 *   delete:
 *     summary: Soft delete a prosthetic center
 *     tags: [Prosthetic Centers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prosthetic center ID
 *     responses:
 *       200:
 *         description: Prosthetic center deleted successfully
 *       404:
 *         description: Prosthetic center not found
 *       500:
 *         description: Server error
 */
exports.deleteCenter = async (req, res) => {
  try {
    const center = await ProstheticCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Prosthetic center not found' });
    }

    center.isActive = false;
    await center.save();
    
    res.json({ message: 'Prosthetic center deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @swagger
 * /api/prosthetic-centers/{id}/images:
 *   post:
 *     summary: Upload multiple images to a prosthetic center
 *     tags: [Prosthetic Centers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Prosthetic center ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProstheticCenter'
 *       400:
 *         description: No files uploaded
 *       404:
 *         description: Prosthetic center not found
 *       500:
 *         description: Server error
 */
exports.uploadImages = async (req, res) => {
  try {
    console.log('Uploading images to prosthetic center:', req.params.id);
    console.log('Files:', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const center = await ProstheticCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Prosthetic center not found' });
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