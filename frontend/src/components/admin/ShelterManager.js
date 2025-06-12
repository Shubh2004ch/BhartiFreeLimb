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
  ImageList,
  ImageListItem,
  Checkbox,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Home, LocationOn, Phone, People, Info, CloudUpload, AddCircleOutline } from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';
import ImageUploadButton from '../common/ImageUploadButton';

const ShelterManager = () => {
  const navigate = useNavigate();
  const [shelters, setShelters] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingShelter, setEditingShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImages, setSelectedImages] = useState({});
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
    imagePath: null,
    images: []
  });
  const [previewUrls, setPreviewUrls] = useState({
    heroImage: null
  });

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
      setLoading(true);
      const response = await api.get(ENDPOINTS.SHELTERS);
      setShelters(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch shelters');
      console.error('Error fetching shelters:', error);
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

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagePath: file
      }));
      setPreviewUrls(prev => ({
        ...prev,
        heroImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.contactNumber) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('pincode', formData.pincode);
      formDataToSend.append('contactNumber', formData.contactNumber);
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('currentOccupancy', formData.currentOccupancy);
      formDataToSend.append('description', formData.description || '');

      // Handle facilities array
      if (formData.facilities && formData.facilities.length > 0) {
        formDataToSend.append('facilities', JSON.stringify(formData.facilities));
      }

      // Handle hero image
      if (formData.imagePath instanceof File) {
        formDataToSend.append('imagePath', formData.imagePath);
      } else if (editingShelter && editingShelter.imagePath) {
        // If editing and there's an existing image, keep it
        formDataToSend.append('imagePath', editingShelter.imagePath);
      }

      // Handle gallery images
      if (formData.images && formData.images.length > 0) {
        formDataToSend.append('images', JSON.stringify(formData.images));
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingShelter) {
        await api.put(`${ENDPOINTS.SHELTERS}/${editingShelter._id}`, formDataToSend, config);
        setSuccess('Shelter updated successfully');
      } else {
        await api.post(ENDPOINTS.SHELTERS, formDataToSend, config);
        setSuccess('Shelter added successfully');
      }

      fetchShelters();
      handleClose();
    } catch (error) {
      setError('Failed to save shelter');
      console.error('Error saving shelter:', error);
    }
  };

  const handleOpen = (shelter = null) => {
    if (shelter) {
      setEditingShelter(shelter);
      setFormData({
        name: shelter.name || '',
        address: shelter.address || '',
        city: shelter.city || '',
        state: shelter.state || '',
        pincode: shelter.pincode || '',
        contactNumber: shelter.contactNumber || '',
        capacity: shelter.capacity || '',
        currentOccupancy: shelter.currentOccupancy || '',
        facilities: shelter.facilities || [],
        description: shelter.description || '',
        imagePath: null,
        images: shelter.images || []
      });
      setPreviewUrls({
        heroImage: shelter.imagePath ? getImageUrl(shelter.imagePath) : null
      });
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
        imagePath: null,
        images: []
      });
      setPreviewUrls({
        heroImage: null
      });
    }
    setOpen(true);
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    setOpen(false);
    setEditingShelter(null);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shelter?')) {
      try {
        await api.delete(`${ENDPOINTS.SHELTERS}/${id}`);
        fetchShelters();
      } catch (error) {
        setError('Failed to delete shelter');
        console.error('Error deleting shelter:', error);
      }
    }
  };

  const handleImageUploadSuccess = (response) => {
    setSuccess('Images uploaded successfully');
    fetchShelters();
  };

  const handleImageUploadError = (error) => {
    setError(error.response?.data?.message || 'Failed to upload images');
  };

  const handleImageSelect = (shelterId, imageUrl) => {
    setSelectedImages(prev => ({
      ...prev,
      [shelterId]: {
        ...prev[shelterId],
        [imageUrl]: !prev[shelterId]?.[imageUrl]
      }
    }));
  };

  const handleDeleteSelectedImages = async (shelterId) => {
    const selectedUrls = Object.entries(selectedImages[shelterId] || {})
      .filter(([_, selected]) => selected)
      .map(([url]) => url);

    if (selectedUrls.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedUrls.length} selected images?`)) {
      return;
    }

    try {
      const shelter = shelters.find(s => s._id === shelterId);
      const updatedImages = shelter.images.filter(img => !selectedUrls.includes(img));

      const formData = new FormData();
      formData.append('name', shelter.name);
      formData.append('address', shelter.address);
      formData.append('city', shelter.city);
      formData.append('state', shelter.state);
      formData.append('pincode', shelter.pincode);
      formData.append('contactNumber', shelter.contactNumber);
      formData.append('capacity', shelter.capacity);
      formData.append('currentOccupancy', shelter.currentOccupancy);
      formData.append('description', shelter.description || '');
      formData.append('facilities', JSON.stringify(shelter.facilities || []));
      formData.append('images', JSON.stringify(updatedImages));

      await api.put(`${ENDPOINTS.SHELTERS}/${shelterId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSelectedImages(prev => ({
        ...prev,
        [shelterId]: {}
      }));

      fetchShelters();
      setSuccess('Selected images deleted successfully');
    } catch (error) {
      setError('Failed to delete selected images');
      console.error('Error deleting selected images:', error);
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
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          gap: 2,
          justifyContent: { xs: 'center', md: 'flex-start' },
        }}>
          <Home sx={{ fontSize: 44, color: 'primary.main', mr: 1 }} />
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              background: 'linear-gradient(90deg, #2563eb 30%, #38bdf8 100%)',
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
          startIcon={<AddCircleOutline />}
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

        {error && (
          <Box
            sx={{
              background: '#ffeded',
              border: '1px solid #fca5a5',
              color: '#b91c1c',
              px: 4,
              py: 2,
              borderRadius: 2,
              mb: 4,
              fontWeight: 600,
            }}
          >
            {error}
          </Box>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 4 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={5}>
          {shelters.map((shelter, idx) => (
            <Grid item xs={12} sm={6} md={4} key={shelter._id}>
              <Fade in timeout={500} style={{ transitionDelay: `${idx * 80}ms` }}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 6px 22px 0 rgba(59,130,246,0.09), 0 2px 8px 0 rgba(236,72,153,0.09)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s cubic-bezier(.4,0,.2,1)',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: '0 12px 36px 0 rgba(59,130,246,0.18), 0 3px 12px 0 rgba(236,72,153,0.16)',
                    },
                    bgcolor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(3px)',
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    {shelter.imagePath ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(shelter.imagePath)}
                        alt={shelter.name}
                        sx={{
                          objectFit: 'cover',
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: 200,
                          bgcolor: 'grey.100',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                        }}
                      >
                        <Home sx={{ fontSize: 48, color: 'grey.400' }} />
                      </Box>
                    )}
                  </Box>

                  <CardContent>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        {shelter.name}
                      </Typography>
                      <Box>
                        <ImageUploadButton
                          itemId={shelter._id}
                          itemType="shelters"
                          multiple={true}
                          maxFiles={Infinity}
                          onUploadSuccess={handleImageUploadSuccess}
                          onUploadError={handleImageUploadError}
                        />
                        <IconButton
                          onClick={() => handleOpen(shelter)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(shelter._id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    {shelter.contactNumber && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          {shelter.contactNumber}
                        </Typography>
                      </Box>
                    )}

                    {shelter.address && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          {shelter.address}
                        </Typography>
                      </Box>
                    )}

                    {shelter.capacity && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <People sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                        <Typography variant="body2" color="text.secondary">
                          Capacity: {shelter.capacity} | Current: {shelter.currentOccupancy}
                        </Typography>
                      </Box>
                    )}

                    {shelter.description && (
                      <Box sx={{ mt: 2, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {shelter.description}
                        </Typography>
                      </Box>
                    )}

                    {/* Images Section */}
                    {shelter.images && shelter.images.length > 0 && (
                      <Box sx={{ mt: 3, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Gallery Images
                          </Typography>
                          {Object.values(selectedImages[shelter._id] || {}).some(selected => selected) && (
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteSelectedImages(shelter._id)}
                              startIcon={<DeleteIcon />}
                            >
                              Delete Selected
                            </Button>
                          )}
                        </Box>
                        <Grid container spacing={1}>
                          {shelter.images.map((image, index) => (
                            <Grid item xs={4} key={index}>
                              <Box sx={{ position: 'relative' }}>
                                <img
                                  src={getImageUrl(image)}
                                  alt={`Gallery ${index + 1}`}
                                  style={{
                                    width: '100%',
                                    height: 80,
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                  }}
                                />
                                <Checkbox
                                  checked={!!selectedImages[shelter._id]?.[image]}
                                  onChange={() => handleImageSelect(shelter._id, image)}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    color: 'white',
                                    '&.Mui-checked': {
                                      color: 'white',
                                    },
                                  }}
                                />
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 2,
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight={700}>
              {editingShelter ? 'Edit Shelter' : 'Add New Shelter'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Hero Image
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <label htmlFor="hero-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        px: 3,
                      }}
                    >
                      Upload Hero Image
                    </Button>
                    <input
                      accept="image/*"
                      type="file"
                      onChange={handleHeroImageChange}
                      style={{ display: 'none' }}
                      id="hero-image-upload"
                    />
                  </label>
                  {previewUrls.heroImage && (
                    <Box sx={{ mt: 2, maxWidth: 300 }}>
                      <img
                        src={previewUrls.heroImage}
                        alt="Preview"
                        style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingShelter ? 'Update' : 'Add'} Shelter
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ShelterManager; 