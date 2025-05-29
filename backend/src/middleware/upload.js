const { upload } = require('../config/s3');

const uploadMiddleware = {
  // For single image upload (hero image)
  single: (fieldName) => upload.single(fieldName),

  // For multiple images upload (beneficiary images)
  array: (fieldName, maxCount) => upload.array(fieldName, maxCount),

  // For multiple fields with different image counts
  fields: (fields) => upload.fields(fields)
};

module.exports = uploadMiddleware;
