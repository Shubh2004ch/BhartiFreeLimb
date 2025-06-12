import api from './api';
import { ENDPOINTS } from '../constants';

export const imageService = {
  uploadImage: async (file, endpoint) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await api.post(endpoint, formData, config);
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  uploadMultipleImages: async (files, endpoint) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await api.post(endpoint, formData, config);
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  deleteImage: async (imageId, endpoint) => {
    try {
      const response = await api.delete(`${endpoint}/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Specific endpoints for different types of images
  uploadProstheticCenterImage: (file) => imageService.uploadImage(file, ENDPOINTS.CENTERS),
  uploadProstheticCenterImages: (files) => imageService.uploadMultipleImages(files, ENDPOINTS.CENTERS),
  uploadFoodStallImage: (file) => imageService.uploadImage(file, ENDPOINTS.FOOD_STALLS),
  uploadClinicImage: (file) => imageService.uploadImage(file, ENDPOINTS.CLINICS),
  uploadShelterImage: (file) => imageService.uploadImage(file, ENDPOINTS.SHELTERS),
  uploadWaterPondImage: (file) => imageService.uploadImage(file, ENDPOINTS.WATER_PONDS),
  uploadSleepingBagImage: (file) => imageService.uploadImage(file, ENDPOINTS.SLEEPING_BAGS),
  uploadMediaImage: (file) => imageService.uploadImage(file, ENDPOINTS.MEDIA),
}; 