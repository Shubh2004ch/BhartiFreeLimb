const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const { upload, handleMulterError } = require('../config/s3');

// Debug middleware for file uploads
const debugUpload = (req, res, next) => {
  console.log('File upload request received');
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  next();
};

// Configure multer for multiple images upload
const uploadImages = upload.array('images', 10);

router.get('/', clinicController.getAllClinics);
router.get('/:id', clinicController.getClinicById);
router.post('/', upload.single('image'), clinicController.createClinic);
router.put('/:id', upload.single('image'), clinicController.updateClinic);
router.delete('/:id', clinicController.deleteClinic);

// Upload multiple images to clinic
router.post('/:id/images', 
  debugUpload,
  (req, res, next) => {
    uploadImages(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  clinicController.uploadImages
);

module.exports = router; 