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
    LOGIN: `/auth/login`,
    REGISTER: `/auth/register`,
    LOGOUT: `/auth/logout`,
  },
  CENTERS: {
    LIST: `/centers`,
    DETAILS: (id) => `/centers/${id}`,
    CREATE: `/centers`,
    UPDATE: (id) => `/centers/${id}`,
    DELETE: (id) => `/centers/${id}`,
  },
  MEDIA: {
    LIST: `/media`,
    UPLOAD: `/media/upload`,
    DELETE: (id) => `/media/${id}`,
  },
  REVIEWS: {
    LIST: `/reviews`,
    CREATE: `/reviews`,
    UPDATE: (id) => `/reviews/${id}`,
    DELETE: (id) => `/reviews/${id}`,
  },
  USERS: {
    PROFILE: `/users/profile`,
    UPDATE: `/users/profile`,
  }
};

export default API_ENDPOINTS; 