import axios from 'axios';
import { API_BASE_URL, ENDPOINTS } from '../config/constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minute timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
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
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle server errors
    if (error.response.status >= 500) {
      console.error('Server Error:', error.response.data);
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (credentials) => api.post(ENDPOINTS.AUTH + '/login', credentials),
  register: (userData) => api.post(ENDPOINTS.AUTH + '/register', userData),
  logout: () => api.post(ENDPOINTS.AUTH + '/logout'),
};

// Center Service
export const centerService = {
  getCenters: async () => {
    console.log('Calling getCenters API...');
    try {
      const response = await api.get(ENDPOINTS.CENTERS);
      console.log('getCenters response:', response);
      return response;
    } catch (error) {
      console.error('getCenters error:', error);
      throw error;
    }
  },
  getCenter: (id) => api.get(`${ENDPOINTS.CENTERS}/${id}`),
  createCenter: (data) => api.post(ENDPOINTS.CENTERS, data),
  updateCenter: (id, data) => api.put(`${ENDPOINTS.CENTERS}/${id}`, data),
  deleteCenter: (id) => api.delete(`${ENDPOINTS.CENTERS}/${id}`),
};

// Media Service
export const mediaService = {
  getMedia: () => api.get(ENDPOINTS.MEDIA),
  uploadMedia: (formData) => {
    console.log('Uploading media with formData:', formData);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post(ENDPOINTS.MEDIA, formData, config);
  },
  deleteMedia: (id) => api.delete(`${ENDPOINTS.MEDIA}/${id}`),
};

// Review Service
export const reviewService = {
  getReviews: () => api.get(ENDPOINTS.REVIEWS),
  createReview: (data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post(ENDPOINTS.REVIEWS, data, config);
  },
  updateReview: (id, data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.put(`${ENDPOINTS.REVIEWS}/${id}`, data, config);
  },
  deleteReview: (id) => api.delete(`${ENDPOINTS.REVIEWS}/${id}`),
};

// Food Stall Service
export const foodStallService = {
  getFoodStalls: () => api.get(ENDPOINTS.FOOD_STALLS),
  getFoodStall: (id) => api.get(`${ENDPOINTS.FOOD_STALLS}/${id}`),
  createFoodStall: (data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post(ENDPOINTS.FOOD_STALLS, data, config);
  },
  updateFoodStall: (id, data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.put(`${ENDPOINTS.FOOD_STALLS}/${id}`, data, config);
  },
  deleteFoodStall: (id) => api.delete(`${ENDPOINTS.FOOD_STALLS}/${id}`),
};

// Clinic Service
export const clinicService = {
  getClinics: () => api.get(ENDPOINTS.CLINICS),
  getClinic: (id) => api.get(`${ENDPOINTS.CLINICS}/${id}`),
  createClinic: (data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post(ENDPOINTS.CLINICS, data, config);
  },
  updateClinic: (id, data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.put(`${ENDPOINTS.CLINICS}/${id}`, data, config);
  },
  deleteClinic: (id) => api.delete(`${ENDPOINTS.CLINICS}/${id}`),
};

// Sleeping Bag Service
export const sleepingBagService = {
  getSleepingBags: () => api.get(ENDPOINTS.SLEEPING_BAGS),
  getSleepingBag: (id) => api.get(`${ENDPOINTS.SLEEPING_BAGS}/${id}`),
  createSleepingBag: (data) => api.post(ENDPOINTS.SLEEPING_BAGS, data),
  updateSleepingBag: (id, data) => api.put(`${ENDPOINTS.SLEEPING_BAGS}/${id}`, data),
  deleteSleepingBag: (id) => api.delete(`${ENDPOINTS.SLEEPING_BAGS}/${id}`),
};

// Water Pond Service
export const waterPondService = {
  getWaterPonds: () => api.get(ENDPOINTS.WATER_PONDS),
  getWaterPond: (id) => api.get(`${ENDPOINTS.WATER_PONDS}/${id}`),
  createWaterPond: (data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post(ENDPOINTS.WATER_PONDS, data, config);
  },
  updateWaterPond: (id, data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.put(`${ENDPOINTS.WATER_PONDS}/${id}`, data, config);
  },
  deleteWaterPond: (id) => api.delete(`${ENDPOINTS.WATER_PONDS}/${id}`),
};

// Shelter Service
export const shelterService = {
  getShelters: () => api.get(ENDPOINTS.SHELTERS),
  getShelter: (id) => api.get(`${ENDPOINTS.SHELTERS}/${id}`),
  createShelter: (data) => api.post(ENDPOINTS.SHELTERS, data),
  updateShelter: (id, data) => api.put(`${ENDPOINTS.SHELTERS}/${id}`, data),
  deleteShelter: (id) => api.delete(`${ENDPOINTS.SHELTERS}/${id}`),
};

// User Service
export const userService = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
};

export default api; 