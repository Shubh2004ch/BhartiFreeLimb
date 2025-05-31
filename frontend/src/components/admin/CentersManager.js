import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
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
  IconButton,
  Box,
  Tooltip,
  Fade,
  Skeleton,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  AddCircleOutline,
  LocationOn,
  LocalPhone,
  Email as EmailIcon,
  AccessTime,
  Info,
  Business,
  Phone,
  Star,
  Close as CloseIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';

// Skeleton loader for loading state
const CentersSkeleton = () => (
  <Grid container spacing={4}>
    {[1, 2, 3].map((i) => (
      <Grid item key={i} xs={12} sm={6} md={4}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 4,
            p: 2,
            minHeight: 340,
            bgcolor: 'background.paper',
          }}
        >
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="text" width="70%" height={36} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="50%" />
          <Skeleton
            variant="rectangular"
            width="80%"
            height={30}
            sx={{ borderRadius: 2, mt: 2 }}
          />
        </Card>
      </Grid>
    ))}
  </Grid>
);

const CentersManager = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    imagePath: null,
    beneficiaryImages: []
  });
  const [previewUrls, setPreviewUrls] = useState({
    heroImage: null,
    beneficiaryImages: []
  });
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.CENTERS);
      setCenters(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch centers');
      console.error('Error fetching centers:', error);
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

  const handleBeneficiaryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      beneficiaryImages: [...prev.beneficiaryImages, ...files]
    }));
    setPreviewUrls(prev => ({
      ...prev,
      beneficiaryImages: [
        ...prev.beneficiaryImages,
        ...files.map(file => URL.createObjectURL(file))
      ]
    }));
  };

  const removeBeneficiaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      beneficiaryImages: prev.beneficiaryImages.filter((_, i) => i !== index)
    }));
    setPreviewUrls(prev => ({
      ...prev,
      beneficiaryImages: prev.beneficiaryImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      // Append basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('description', formData.description || '');

      // Handle hero image
      if (formData.imagePath instanceof File) {
        formDataToSend.append('heroImage', formData.imagePath);
      }

      // Handle beneficiary images
      if (formData.beneficiaryImages && formData.beneficiaryImages.length > 0) {
        formData.beneficiaryImages.forEach(file => {
          if (file instanceof File) {
            formDataToSend.append('beneficiaryImages', file);
          }
          });
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (selectedCenter) {
        await api.put(`${ENDPOINTS.CENTERS}/${selectedCenter._id}`, formDataToSend, config);
        setSuccess('Center updated successfully');
      } else {
        await api.post(ENDPOINTS.CENTERS, formDataToSend, config);
        setSuccess('Center added successfully');
      }

      fetchCenters();
      handleCloseModal();
    } catch (error) {
      setError('Failed to save center');
      console.error('Error saving center:', error);
    }
  };

  const handleEdit = (center) => {
    setSelectedCenter(center);
    setFormData({
      name: center.name || '',
      address: center.address || '',
      phone: center.phone || '',
      email: center.email || '',
      description: center.description || '',
      imagePath: null,
      beneficiaryImages: []
    });
    setPreviewUrls({
      heroImage: center.imagePath ? getImageUrl(center.imagePath) : null,
      beneficiaryImages: center.beneficiaryImages ? 
                        center.beneficiaryImages.map(img => getImageUrl(img)) : []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      try {
        await api.delete(`${ENDPOINTS.CENTERS}/${id}`);
        fetchCenters();
      } catch (error) {
        setError('Failed to delete center');
        console.error('Error deleting center:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCenter(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      description: '',
      imagePath: null,
      beneficiaryImages: []
    });
    setPreviewUrls({
      heroImage: null,
      beneficiaryImages: []
    });
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
          <Business sx={{ fontSize: 44, color: 'primary.main', mr: 1 }} />
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
            Centers Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutline />}
          onClick={() => setIsModalOpen(true)}
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
          Add New Center
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

        {loading ? (
          <CentersSkeleton />
        ) : (
          <Grid container spacing={4}>
            {centers.map((center) => (
              <Grid item key={center._id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 4,
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  {center.imagePath && (
                  <CardMedia
                    component="img"
                    height="200"
                      image={getImageUrl(center.imagePath)}
                    alt={center.name}
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                      sx={{
                        objectFit: 'cover',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                  />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight={700}>
                      {center.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {center.address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {center.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                      <Typography variant="body2" color="text.secondary">
                        {center.email}
                      </Typography>
                    </Box>
                    {center.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {center.description}
                      </Typography>
                    )}
                    {center.beneficiaryImages && center.beneficiaryImages.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {center.beneficiaryImages.map((img, index) => (
                          <Box
                            key={index}
                            component="img"
                            src={getImageUrl(img)}
                            alt={`Beneficiary ${index + 1}`}
                            onError={(e) => {
                              console.error('Image failed to load:', e.target.src);
                              e.target.style.display = 'none';
                            }}
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 2,
                              objectFit: 'cover',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton
                        onClick={() => handleEdit(center)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'primary.light' },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(center._id)}
                        sx={{
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.light' },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
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
              {selectedCenter ? 'Edit Center' : 'Add New Center'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Center Name"
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Hero Image
                </Typography>
                <input
                  accept="image/*"
                  type="file"
                  id="hero-image"
                  onChange={handleHeroImageChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="hero-image">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{ mb: 2 }}
                  >
                    Upload Hero Image
                  </Button>
                </label>
                {previewUrls.heroImage && (
                  <Box
                    sx={{
                      mt: 2,
                      position: 'relative',
                      width: '100%',
                      height: 200,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={previewUrls.heroImage}
                      alt="Hero preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Beneficiary Images
                </Typography>
                <input
                  accept="image/*"
                  type="file"
                  id="beneficiary-images"
                  multiple
                  onChange={handleBeneficiaryImagesChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="beneficiary-images">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{ mb: 2 }}
                  >
                    Upload Beneficiary Images
                  </Button>
                </label>
                <Grid container spacing={2}>
                  {previewUrls.beneficiaryImages.map((url, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: 200,
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={url}
                          alt={`Beneficiary ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          onClick={() => removeBeneficiaryImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.7)',
                            },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleCloseModal}
              sx={{
                color: 'text.secondary',
                '&:hover': { bgcolor: 'grey.100' },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              {selectedCenter ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CentersManager;