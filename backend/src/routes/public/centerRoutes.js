const express = require('express');
const router = express.Router();
const centerController = require('../controllers/centerController');
const { upload, handleMulterError } = require('../config/s3');

// Configure multer for multiple file uploads
const uploadFields = upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'beneficiaryImages', maxCount: 10 }
]);

// Configure multer for multiple images upload
const uploadImages = (req, res, next) => {
  try {
    console.log('=== Starting bulk image upload ===');
    
    // Use the existing upload configuration from S3 config
    const { upload } = require('../config/s3');
    
    const uploadMiddleware = upload.array('images', 10);
    
    uploadMiddleware(req, res, (err) => {
      if (err) {
        console.error('Multer upload error:', err);
        
        // Check if we have any successfully uploaded files
        if (req.files && req.files.length > 0) {
          console.log('Partial upload successful. Some files uploaded:', req.files.length);
          // Continue with the files that were uploaded successfully
          return next();
        }
        
        // Handle specific multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'File too large. Maximum size is 50MB.',
            error: err.message
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            message: 'Too many files. Maximum allowed is 10 files.',
            error: err.message
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            message: `Unexpected field name "${err.field}". Expected field name is "images".`,
            error: err.message,
            expectedField: 'images',
            receivedField: err.field
          });
        }
        
        // Handle file type validation errors
        if (err.message && err.message.includes('Invalid file type')) {
          return res.status(400).json({
            message: 'Invalid file type detected. Only JPEG, PNG, GIF, and WebP images are allowed.',
            error: err.message,
            suggestion: 'Please ensure all files are valid image formats'
          });
        }
        
        // Handle other errors
        return res.status(500).json({
          message: 'Error uploading file.',
          error: err.message
        });
      }
      console.log('=== Multer upload successful ===');
      next();
    });
  } catch (error) {
    console.error('Error in uploadImages function:', error);
    return res.status(500).json({
      message: 'Internal server error during file upload setup.',
      error: error.message
    });
  }
};

// List all centers
router.get('/', centerController.getAllCenters);

// Test AWS configuration
router.get('/test-aws-config', (req, res) => {
  try {
    console.log('=== Testing AWS Configuration ===');
    console.log('AWS_REGION:', process.env.AWS_REGION);
    console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);
    console.log('AWS_ACCESS_KEY_ID exists:', !!process.env.AWS_ACCESS_KEY_ID);
    console.log('AWS_SECRET_ACCESS_KEY exists:', !!process.env.AWS_SECRET_ACCESS_KEY);
    
    const missingVars = [];
    if (!process.env.AWS_ACCESS_KEY_ID) missingVars.push('AWS_ACCESS_KEY_ID');
    if (!process.env.AWS_SECRET_ACCESS_KEY) missingVars.push('AWS_SECRET_ACCESS_KEY');
    if (!process.env.AWS_REGION) missingVars.push('AWS_REGION');
    if (!process.env.AWS_BUCKET_NAME) missingVars.push('AWS_BUCKET_NAME');
    
    if (missingVars.length > 0) {
      return res.status(500).json({
        message: 'Missing AWS environment variables',
        missing: missingVars
      });
    }
    
    res.json({
      message: 'AWS configuration looks good',
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME,
      hasCredentials: true
    });
  } catch (error) {
    console.error('Error testing AWS config:', error);
    res.status(500).json({
      message: 'Error testing AWS configuration',
      error: error.message
    });
  }
});

// Get single center
router.get('/:id', centerController.getCenter);
// Create center with error handling
router.post('/', 
  (req, res, next) => {
    uploadFields(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  centerController.createCenter
);
// Update center with error handling
router.put('/:id',
  (req, res, next) => {
    uploadFields(req, res, (err) => {
      if (err) {
        console.error('File upload error:', err);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  centerController.updateCenter
);
// Delete center
router.delete('/:id', centerController.deleteCenter);

// Upload multiple images to center
router.post('/:id/images', 
  (req, res, next) => {
    console.log('=== Bulk Image Upload Debug ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request files before multer:', req.files);
    
    // Validate content type
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
      return res.status(400).json({
        message: 'Invalid content type. Expected multipart/form-data',
        receivedContentType: req.headers['content-type']
      });
    }
    
    uploadImages(req, res, (err) => {
      if (err) {
        console.error('=== Multer Error Details ===');
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        console.error('Error field:', err.field);
        console.error('Error stack:', err.stack);
        console.error('Request files after error:', req.files);
        console.error('Request body after error:', req.body);
        
        return handleMulterError(err, req, res, next);
      }
      console.log('=== Multer Success ===');
      console.log('Files processed successfully:', req.files ? req.files.length : 0);
      next();
    });
  },
  centerController.uploadImages
);

// Media APIs (for a center)
router.post('/:id/media', centerController.addMedia); // Add media to center
router.delete('/:id/media/:mediaId', centerController.deleteMedia); // Delete media from center

module.exports = router; 