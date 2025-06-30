const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Debug environment variables
const debugEnvVars = () => {
  const vars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_BUCKET_NAME',
    'NODE_ENV'
  ];

  console.log('Environment Variables Check:');
  vars.forEach(varName => {
    if (process.env[varName]) {
      if (varName.includes('KEY') || varName.includes('SECRET')) {
        console.log(`${varName}: [HIDDEN]`);
      } else {
        console.log(`${varName}: ${process.env[varName]}`);
      }
    } else {
      console.log(`${varName}: NOT SET`);
    }
  });
};

// Validate AWS credentials
const validateAWSCredentials = () => {
  debugEnvVars();

  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_BUCKET_NAME'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required AWS environment variables: ${missingVars.join(', ')}`);
  }

  // Validate AWS_ACCESS_KEY_ID format (typically 20 characters)
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_ACCESS_KEY_ID.length < 16) {
    throw new Error('AWS_ACCESS_KEY_ID appears to be invalid (too short)');
  }

  // Validate AWS_SECRET_ACCESS_KEY format (typically 40 characters)
  if (process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_SECRET_ACCESS_KEY.length < 32) {
    throw new Error('AWS_SECRET_ACCESS_KEY appears to be invalid (too short)');
  }

  // Validate AWS_REGION format
  const validRegions = ['ap-south-1', 'us-east-1', 'us-west-2']; // Add more as needed
  if (!validRegions.includes(process.env.AWS_REGION)) {
    throw new Error(`Invalid AWS_REGION. Must be one of: ${validRegions.join(', ')}`);
  }
};

// Create S3 client
const createS3Client = () => {
  try {
    validateAWSCredentials();
    
    const config = {
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    };

    console.log('Creating S3 client with config:', {
      region: config.region,
      credentialsProvided: !!(config.credentials.accessKeyId && config.credentials.secretAccessKey)
    });

    return new S3Client(config);
  } catch (error) {
    console.error('Error creating S3 client:', error);
    throw error;
  }
};

// Initialize S3 client
let s3Client;
try {
  s3Client = createS3Client();
  console.log('S3 client created successfully');
} catch (error) {
  console.error('Failed to create S3 client:', error);
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    env: {
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    }
  });
  // Create a dummy client that will throw errors when used
  s3Client = {
    send: () => {
      throw new Error('S3 client not properly initialized. Check your AWS credentials and environment variables.');
    }
  };
}

// Configure multer with S3
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      try {
        console.log('Processing file:', {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          fieldname: file.fieldname
        });
        cb(null, { fieldName: file.fieldname });
      } catch (error) {
        console.error('Error processing file metadata:', error);
        cb(error);
      }
    },
    key: function (req, file, cb) {
      try {
        // Clean the original filename to remove any path information
        const originalname = path.basename(file.originalname);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const safeFileName = originalname.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
        const fullPath = `uploads/${uniqueSuffix}-${safeFileName}`;
        console.log('Generated S3 key:', fullPath);
        cb(null, fullPath);
      } catch (error) {
        console.error('Error generating S3 key:', error);
        cb(error);
      }
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Log file information
    console.log('Received file:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
  }
});

// Error handler middleware for multer
const handleMulterError = (error, req, res, next) => {
  console.error('File upload error:', error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 5MB.',
        error: error.message
      });
    }
    return res.status(400).json({
      message: 'Error uploading file.',
      error: error.message
    });
  }
  
  // Handle AWS credential errors
  if (error.message.includes('credential') || error.message.includes('AWS')) {
    console.error('AWS Credential Error:', error);
    return res.status(500).json({
      message: 'AWS configuration error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
  
  if (error) {
    return res.status(500).json({
      message: 'Error uploading file.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
  next();
};

// Function to delete a file from S3
const deleteFileFromS3 = async (fileUrl) => {
  try {
    if (!fileUrl) return;
    
    // Extract the key from the URL
    const key = fileUrl.split('/').slice(-2).join('/'); // Gets 'uploads/filename.ext'
    
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    });

    await s3Client.send(command);
    console.log('Successfully deleted file from S3:', key);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
};

module.exports = {
  upload,
  deleteFileFromS3,
  handleMulterError
};
