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
  Container,
  Fade,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Home, LocationOn, Phone, People, Info } from '@mui/icons-material';
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
    <Box
      sx={{
        bgcolor: 'linear-gradient(120deg,#f0f9ff 0%,#fff7f7 100%)',
        background: 'linear-gradient(120deg,#e0ecff 0%,#fff6f6 100%)',
        minHeight: '100vh',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 4,
            gap: 2,
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Home sx={{ fontSize: 44, color: 'primary.main', mr: 1 }} />
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              background: 'linear-gradient(90deg, #2563eb 30%, #f472b6 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              letterSpacing: 1.2,
            }}
          >
            Manage Homeless Shelters
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{
            mb: 5,
            borderRadius: 99,
            fontWeight: 700,
            px: 4,
            fontSize: '1rem',
            boxShadow: 3,
            textTransform: 'none',
            letterSpacing: 0.5,
          }}
        >
          Add New Shelter
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={5}>
          {shelters.map((shelter, idx) => (
            <Grid item xs={12} sm={6} md={4} key={shelter._id}>
              <Fade in timeout={500} style={{ transitionDelay: `${idx * 80}ms` }}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow:
                      '0 6px 22px 0 rgba(59,130,246,0.09), 0 2px 8px 0 rgba(236,72,153,0.09)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition:
                      'transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s cubic-bezier(.4,0,.2,1)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow:
                        '0 12px 36px 0 rgba(59,130,246,0.18), 0 3px 12px 0 rgba(236,72,153,0.16)',
                    },
                    bgcolor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(3px)',
                  }}
                >
                  {shelter.images && shelter.images[0] && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(shelter.images[0])}
                      alt={shelter.name}
                      sx={{
                        objectFit: 'cover',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    />
                  )}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      p: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color: 'primary.main',
                        fontSize: '1.16rem',
                        letterSpacing: 0.1,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Home sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                      {shelter.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <LocationOn sx={{ color: '#f472b6', fontSize: 20, mr: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {shelter.address}, {shelter.city}, {shelter.state}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Phone sx={{ color: 'success.main', fontSize: 18, mr: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {shelter.contactNumber}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <People sx={{ color: '#38bdf8', fontSize: 18, mr: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Capacity: {shelter.currentOccupancy}/{shelter.capacity}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                      <Info sx={{ color: '#2563eb', fontSize: 18, mr: 1 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontWeight: 500,
                          fontStyle: 'italic',
                        }}
                      >
                        {shelter.description}
                      </Typography>
                    </Box>
                    {shelter.facilities && shelter.facilities.length > 0 && (
                      <Box sx={{ mt: 1.2, mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
                        {shelter.facilities.map((facility, index) => (
                          <Chip
                            key={index}
                            label={facility}
                            size="small"
                            sx={{
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                              fontWeight: 600,
                              fontSize: 13,
                              letterSpacing: 0.3,
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                      }}
                    >
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          onClick={() => handleOpen(shelter)}
                          color="primary"
                          sx={{ bgcolor: '#f1f7ff', mr: 0.5 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          onClick={() => handleDelete(shelter._id)}
                          color="error"
                          sx={{ bgcolor: '#fff5f5' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 4, p: 1 },
          }}
        >
          <DialogTitle>
            <Typography variant="h5" color="primary" fontWeight={700}>
              {editingShelter ? 'Edit Shelter' : 'Add New Shelter'}
            </Typography>
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
                      facilities: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                    }))}
                    helperText="Enter facilities separated by commas"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      borderColor: 'primary.light',
                    }}
                  >
                    Upload Images
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      multiple
                      onChange={handleFileChange}
                    />
                  </Button>
                  {previewUrls.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {previewUrls.map((url, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'background.paper',
                              '&:hover': { bgcolor: 'background.paper' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 700,
                borderRadius: 8,
                textTransform: 'none',
                px: 4,
              }}
            >
              {editingShelter ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ShelterManager; 