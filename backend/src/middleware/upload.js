const { upload } = require('../config/s3');

const handleUploadError = (error, req, res, next) => {
  console.error('File upload error:', error);
  console.error('Error stack:', error.stack);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
  }
  
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ message: 'Unexpected field name. Expected "file" or "media".' });
  }

  return res.status(500).json({ 
    message: 'Error uploading file.',
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

const debugUpload = (req, res, next) => {
  console.log('Upload middleware called');
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  console.log('Request file:', req.file);
  next();
};

const uploadMiddleware = {
  // For single image upload (hero image)
  single: (fieldName) => [
    debugUpload,
    upload.single(fieldName),
    (error, req, res, next) => {
      if (error) {
        return handleUploadError(error, req, res, next);
      }
      next();
    }
  ],

  // For multiple images upload (beneficiary images)
  array: (fieldName, maxCount) => [
    debugUpload,
    upload.array(fieldName, maxCount),
    (error, req, res, next) => {
      if (error) {
        return handleUploadError(error, req, res, next);
      }
      next();
    }
  ],

  // For multiple fields with different image counts
  fields: (fields) => [
    debugUpload,
    upload.fields(fields),
    (error, req, res, next) => {
      if (error) {
        return handleUploadError(error, req, res, next);
      }
      if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files detected in request');
      }
      next();
    }
  ]
};

module.exports = uploadMiddleware;
