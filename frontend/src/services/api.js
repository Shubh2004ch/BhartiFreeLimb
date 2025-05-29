import axios from 'axios';
import API_ENDPOINTS from '../utils/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_ENDPOINTS.AUTH.LOGIN.split('/api')[0] + '/api',
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
  login: (credentials) => api.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (userData) => api.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
};

export const centerService = {
  getCenters: () => api.get(API_ENDPOINTS.CENTERS.LIST),
  getCenter: (id) => api.get(API_ENDPOINTS.CENTERS.DETAILS(id)),
  createCenter: (data) => api.post(API_ENDPOINTS.CENTERS.CREATE, data),
  updateCenter: (id, data) => api.put(API_ENDPOINTS.CENTERS.UPDATE(id), data),
  deleteCenter: (id) => api.delete(API_ENDPOINTS.CENTERS.DELETE(id)),
};

export const mediaService = {
  getMedia: () => api.get(API_ENDPOINTS.MEDIA.LIST),
  uploadMedia: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post(API_ENDPOINTS.MEDIA.UPLOAD, formData, config);
  },
  deleteMedia: (id) => api.delete(API_ENDPOINTS.MEDIA.DELETE(id)),
};

export const reviewService = {
  getReviews: () => api.get(API_ENDPOINTS.REVIEWS.LIST),
  createReview: (data) => api.post(API_ENDPOINTS.REVIEWS.CREATE, data),
  updateReview: (id, data) => api.put(API_ENDPOINTS.REVIEWS.UPDATE(id), data),
  deleteReview: (id) => api.delete(API_ENDPOINTS.REVIEWS.DELETE(id)),
};

export const userService = {
  getProfile: () => api.get(API_ENDPOINTS.USERS.PROFILE),
  updateProfile: (data) => api.put(API_ENDPOINTS.USERS.UPDATE, data),
};

export default api; 