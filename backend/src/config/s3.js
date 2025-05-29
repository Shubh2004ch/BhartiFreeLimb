const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists (for local fallback)
const UPLOADS_FOLDER = 'uploads';
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER);
}

// Check for required AWS environment variables
const hasAwsCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

// Create S3 client only if credentials are available
const s3Client = hasAwsCredentials
  ? new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

// Local disk storage configuration (fallback)
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_FOLDER);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeFileName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${file.fieldname}-${uniqueSuffix}-${safeFileName}`);
  },
});

// S3 or local storage selection
const upload = multer({
  storage: hasAwsCredentials
    ? multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME || 'bhartiallmedia',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const safeFileName = file.originalname.replace(/\s+/g, '_');
          const fullPath = `uploads/${file.fieldname}-${uniqueSuffix}-${safeFileName}`;
          cb(null, fullPath);
        },
      })
    : localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = {
  upload,
  s3Client,
  hasAwsCredentials,
};
