import axios from 'axios';
import API_ENDPOINTS from '../utils/constants';

// Get the base URL without the /api suffix
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://bhartifreelimb-production.up.railway.app';
  }
  // Check if we're using ngrok
  if (window.location.hostname.includes('ngrok')) {
    return window.location.origin;
  }
  return 'http://localhost:5000';
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
};

export const centerService = {
  getCenters: () => api.get('/api/centers'),
  getCenter: (id) => api.get(`/api/centers/${id}`),
  createCenter: (data) => api.post('/api/centers', data),
  updateCenter: (id, data) => api.put(`/api/centers/${id}`, data),
  deleteCenter: (id) => api.delete(`/api/centers/${id}`),
};

export const mediaService = {
  getMedia: () => api.get('/api/media'),
  uploadMedia: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/api/media/upload', formData, config);
  },
  deleteMedia: (id) => api.delete(`/api/media/${id}`),
};

export const reviewService = {
  getReviews: () => api.get('/api/reviews'),
  createReview: (data) => api.post('/api/reviews', data),
  updateReview: (id, data) => api.put(`/api/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/api/reviews/${id}`),
};

export const userService = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
};

export default api; 