import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';

const ShelterManager = () => {
  const navigate = useNavigate();
  const [shelters, setShelters] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingShelter, setEditingShelter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactNumber: '',
    capacity: '',
    currentOccupancy: '',
    facilities: [],
    description: '',
    images: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin = JSON.parse(localStorage.getItem('admin'));
    
    if (!token || !admin) {
      navigate('/login');
      return;
    }
    
    fetchShelters();
  }, [navigate]);

  // Get auth token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return token;
  };

  // Configure axios with auth header
  const getAuthConfig = () => {
    const token = getAuthToken();
    if (!token) return null;
    
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchShelters = async () => {
    try {
      const authConfig = getAuthConfig();
      if (!authConfig) return;
      
      const response = await api.get(ENDPOINTS.SHELTERS, authConfig);
      setShelters(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch shelters');
      }
    }
  };

  const handleOpen = (shelter = null) => {
    if (shelter) {
      setEditingShelter(shelter);
      setFormData(shelter);
      setPreviewUrls(shelter.images.map(img => getImageUrl(img)) || []);
    } else {
      setEditingShelter(null);
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        contactNumber: '',
        capacity: '',
        currentOccupancy: '',
        facilities: [],
        description: '',
        images: [],
      });
      setPreviewUrls([]);
    }
    setSelectedFiles([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess('');
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    if (index < selectedFiles.length) {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      // If it's an existing image, add it to keepImages
      const existingImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: existingImages,
        keepImages: existingImages.join(',')
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authConfig = getAuthConfig();
    if (!authConfig) return;

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'facilities') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append files
      selectedFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      // Add Content-Type header for multipart/form-data
      const uploadConfig = {
        ...authConfig,
        headers: {
          ...authConfig.headers,
          'Content-Type': 'multipart/form-data',
        }
      };

      if (editingShelter) {
        await api.put(`${ENDPOINTS.SHELTERS}/${editingShelter._id}`, formDataToSend, uploadConfig);
        setSuccess('Shelter updated successfully');
      } else {
        await api.post(ENDPOINTS.SHELTERS, formDataToSend, uploadConfig);
        setSuccess('Shelter added successfully');
      }
      fetchShelters();
      handleClose();
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Operation failed');
      }
    }
  };

  const handleDelete = async (id) => {
    const authConfig = getAuthConfig();
    if (!authConfig) return;

    if (window.confirm('Are you sure you want to delete this shelter?')) {
      try {
        await api.delete(`${ENDPOINTS.SHELTERS}/${id}`, authConfig);
        setSuccess('Shelter deleted successfully');
        fetchShelters();
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to delete shelter');
        }
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Manage Homeless Shelters</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add New Shelter
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {shelters.map((shelter) => (
          <Grid item xs={12} sm={6} md={4} key={shelter._id}>
            <Card>
              {shelter.images[0] && (
                <CardMedia
                  component="img"
                  height="140"
                  image={getImageUrl(shelter.images[0])}
                  alt={shelter.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {shelter.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {shelter.address}, {shelter.city}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capacity: {shelter.currentOccupancy}/{shelter.capacity}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {shelter.facilities.map((facility, index) => (
                    <Chip
                      key={index}
                      label={facility}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => handleOpen(shelter)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(shelter._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingShelter ? 'Edit Shelter' : 'Add New Shelter'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Occupancy"
                  name="currentOccupancy"
                  type="number"
                  value={formData.currentOccupancy}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Facilities (comma-separated)"
                  name="facilities"
                  value={formData.facilities.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    facilities: e.target.value.split(',').map(f => f.trim())
                  }))}
                  helperText="Enter facilities separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Upload Images
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  You can upload up to 5 images. Each image should be less than 5MB.
                </Typography>
              </Grid>
              {previewUrls.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {previewUrls.map((url, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img
                          src={getImageUrl(url)}
                          alt={`Preview ${index + 1}`}
                          style={{ width: 100, height: 100, objectFit: 'cover' }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'background.paper' }
                          }}
                          onClick={() => removeImage(index)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingShelter ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShelterManager; 