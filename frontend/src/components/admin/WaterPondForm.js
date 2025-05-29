import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material';
import { Delete, Edit, Add, LocationOn, LocalPhone, Image as ImageIcon } from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';

const WaterPondForm = () => {
  const [waterPonds, setWaterPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPond, setSelectedPond] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    currentLevel: '',
    status: 'active',
    image: null
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchWaterPonds();
  }, []);

  const fetchWaterPonds = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.WATER_PONDS);
      setWaterPonds(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch water ponds');
      console.error('Error fetching water ponds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedPond) {
        await axios.put(`${ENDPOINTS.WATER_PONDS}/${selectedPond._id}`, formDataToSend);
      } else {
        await axios.post(ENDPOINTS.WATER_PONDS, formDataToSend);
      }

      fetchWaterPonds();
      handleCloseModal();
    } catch (error) {
      setError('Failed to save water pond');
      console.error('Error saving water pond:', error);
    }
  };

  const handleEdit = (pond) => {
    setSelectedPond(pond);
    setFormData({
      name: pond.name || '',
      location: pond.location || '',
      capacity: pond.capacity || '',
      currentLevel: pond.currentLevel || '',
      status: pond.status || 'active',
      image: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this water pond?')) {
      try {
        await axios.delete(`${ENDPOINTS.WATER_PONDS}/${id}`);
        fetchWaterPonds();
      } catch (error) {
        setError('Failed to delete water pond');
        console.error('Error deleting water pond:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPond(null);
    setFormData({
      name: '',
      location: '',
      capacity: '',
      currentLevel: '',
      status: 'active',
      image: null
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Water Ponds Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Add /> Add New Water Pond
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {waterPonds.map((pond) => (
          <div
            key={pond._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            {pond.imagePath && (
              <img
                src={getImageUrl(pond.imagePath)}
                alt={pond.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{pond.name}</h3>
            <p className="text-gray-600 mb-2">Location: {pond.location}</p>
            <p className="text-gray-600 mb-2">Capacity: {pond.capacity} liters</p>
            <p className="text-gray-600 mb-2">Current Level: {pond.currentLevel}%</p>
            <p className="text-gray-600 mb-4">Status: {pond.status}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEdit(pond)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit />
              </button>
              <button
                onClick={() => handleDelete(pond._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Delete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {selectedPond ? 'Edit Water Pond' : 'Add New Water Pond'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity (liters)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Level (%)</label>
                <input
                  type="number"
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {selectedPond ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterPondForm;