// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// Base URLs
const PROD__BACKEND_URL = "https://bhartifreelimb-production.up.railway.app";
const S3_BASE_URL = 'https://s3.ap-south-1.amazonaws.com/bhartiallmedia/bhartifreelimb';

// Base URLs with proper configuration
export const API_BASE_URL = isDevelopment ? 'http://localhost:5000' : PROD__BACKEND_URL;
export const STATIC_FILES_URL = S3_BASE_URL;

// API Endpoints
export const ENDPOINTS = {
  FOOD_STALLS: `${API_BASE_URL}/api/foodstalls`,
  CLINICS: `${API_BASE_URL}/api/clinics`,
  SLEEPING_BAGS: `${API_BASE_URL}/api/sleepingbags`,
  WATER_PONDS: `${API_BASE_URL}/api/waterponds`,
  CENTERS: `${API_BASE_URL}/api/centers`,
  PROSTHETIC_CENTERS: `${API_BASE_URL}/api/centers`, // Alias for CENTERS
  AUTH: `${API_BASE_URL}/api/auth`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
  MEDIA: `${API_BASE_URL}/api/media`,
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  SHELTERS: `${API_BASE_URL}/api/shelters`,
};

// Helper function to get image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // If the path is already a full URL, return it as is
  if (imagePath.startsWith('http')) return imagePath;
  // If the path is a local upload, prepend the S3 base URL
  return `${STATIC_FILES_URL}/${imagePath}`;
};

// Contact Information
export const CONTACT_PHONE = '+1 (800) 555-1234';
export const CONTACT_ADDRESS = '123 Freedom Avenue, Mobility City'; 