// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// Base URLs
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://www.bharti-freelimbs.com';
  }
  // Check if we're using ngrok
  if (window.location.hostname.includes('ngrok')) {
    return window.location.origin;
  }
  return 'http://localhost:5000';
};

// S3 Configuration
const S3_BASE_URL = 'https://bhartiallmedia.s3.ap-south-1.amazonaws.com';
const S3_UPLOAD = "s3://bhartiallmedia";

// Base URL configuration
export const API_BASE_URL = getBaseUrl();

// Static files URL
export const STATIC_FILES_URL = isDevelopment 
  ? `${API_BASE_URL}`
  : `${S3_BASE_URL}`;

// API Endpoints
export const ENDPOINTS = {
  FOOD_STALLS: '/api/foodstalls',
  CLINICS: '/api/clinics',
  SLEEPING_BAGS: '/api/sleepingbags',
  WATER_PONDS: '/api/waterponds',
  CENTERS: '/api/centers',
  PROSTHETIC_CENTERS: '/api/centers', // Alias for CENTERS
  AUTH: '/api/auth',
  UPLOAD: '/api/upload',
  MEDIA: '/api/media',
  REVIEWS: '/api/reviews',
  SHELTERS: '/api/shelters',
  LOGIN: '/api/auth/login'
};

// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // If the path is already a full URL, return it
  if (imagePath.startsWith('http')) return imagePath;

  // Clean the path by removing any system-specific paths
  const cleanPath = imagePath
    .replace(/^.*[\\\/]uploads[\\\/]/, '') // Remove everything before and including 'uploads/'
    .replace(/^\/?(uploads\/)?/, ''); // Remove any remaining 'uploads/' prefix

  // Return the full S3 URL
  return `${S3_BASE_URL}/uploads/${cleanPath}`;
};

// Contact Information
export const CONTACT_PHONE = '+1 (800) 555-1234';
export const CONTACT_ADDRESS = '123 Freedom Avenue, Mobility City'; 