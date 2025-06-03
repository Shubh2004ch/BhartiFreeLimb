const { upload } = require('../config/s3');

const handleUploadError = (error, req, res, next) => {
  console.error('File upload error:', error);
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
  }
  return res.status(500).json({ message: 'Error uploading file.', error: error.message });
};

const debugUpload = (req, res, next) => {
  console.log('Upload middleware called');
  console.log('Request headers:', req.headers);
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
      next();
    }
  ]
};

module.exports = uploadMiddleware;
