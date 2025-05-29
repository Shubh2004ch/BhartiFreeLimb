const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://bhartifreelimb-production.up.railway.app/api';
  }
  // Check if we're using ngrok
  if (window.location.hostname.includes('ngrok')) {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseUrl();

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  CENTERS: {
    LIST: `${API_BASE_URL}/centers`,
    DETAILS: (id) => `${API_BASE_URL}/centers/${id}`,
    CREATE: `${API_BASE_URL}/centers`,
    UPDATE: (id) => `${API_BASE_URL}/centers/${id}`,
    DELETE: (id) => `${API_BASE_URL}/centers/${id}`,
  },
  MEDIA: {
    LIST: `${API_BASE_URL}/media`,
    UPLOAD: `${API_BASE_URL}/media/upload`,
    DELETE: (id) => `${API_BASE_URL}/media/${id}`,
  },
  REVIEWS: {
    LIST: `${API_BASE_URL}/reviews`,
    CREATE: `${API_BASE_URL}/reviews`,
    UPDATE: (id) => `${API_BASE_URL}/reviews/${id}`,
    DELETE: (id) => `${API_BASE_URL}/reviews/${id}`,
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE: `${API_BASE_URL}/users/profile`,
  }
};

export default API_ENDPOINTS; 