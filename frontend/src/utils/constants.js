const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://bhartifreelimb-production.up.railway.app/api'
  : 'http://localhost:5000/api';

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