const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Create S3 client
const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer with S3
const upload = multer({
  storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME || 'bhartiallmedia',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
      // Clean the original filename to remove any path information
      const originalname = path.basename(file.originalname);
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const safeFileName = originalname.replace(/\s+/g, '_');
      const fullPath = `uploads/${uniqueSuffix}-${safeFileName}`;
          cb(null, fullPath);
        },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = {
  upload,
  s3Client
};
