// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';

// Base URLs
const NGROK_BACKEND_URL = 'https://3d3a-2405-204-320a-9c44-4a0e-effb-429c-e015.ngrok-free.app';
const NGROK_FRONTEND_URL = 'https://a347-2405-204-320a-9c44-4a0e-effb-429c-e015.ngrok-free.app';

// Base URLs with proper configuration
export const API_BASE_URL = isDevelopment ? 'http://localhost:5000' : NGROK_BACKEND_URL;
export const STATIC_FILES_URL = isDevelopment ? 'http://localhost:5000/uploads' : `${NGROK_BACKEND_URL}/uploads`;

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
  // If the path already contains the full URL, return it as is
  if (imagePath.startsWith('http')) return imagePath;
  // If the path is an S3 URL, return it as is
  if (imagePath.includes('amazonaws.com')) return imagePath;
  // If the path is just the filename, prepend the static files URL
  if (!imagePath.includes('/')) return `${STATIC_FILES_URL}/${imagePath}`;
  // If the path is a full path from the backend, extract the filename
  const filename = imagePath.split('/').pop();
  return `${STATIC_FILES_URL}/${filename}`;
};

// Contact Information
export const CONTACT_PHONE = '+1 (800) 555-1234';
export const CONTACT_ADDRESS = '123 Freedom Avenue, Mobility City'; 