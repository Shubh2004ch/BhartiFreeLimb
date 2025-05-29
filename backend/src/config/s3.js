const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Check for required environment variables
const hasAwsCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
if (!hasAwsCredentials) {
  console.warn('AWS credentials not found in environment variables. S3 uploads will not work.');
}

// Only create S3 client if credentials are available
const s3Client = hasAwsCredentials ? new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  endpoint: 'https://s3.ap-south-1.amazonaws.com',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  forcePathStyle: true
}) : null;

// Create a local storage fallback when S3 is not available
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage: hasAwsCredentials ? multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME || 'bhartiallmedia',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `bhartifreelimb/${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
    }
  }) : localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = {
  s3Client,
  upload,
  hasAwsCredentials
}; 