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
  Switch,
  FormControlLabel,
  Checkbox,
  ImageList,
  ImageListItem,
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
  CheckCircle,
} from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';
import { imageService } from '../../services/imageService';
import ImageUploadButton from '../common/ImageUploadButton';
import { centerService } from '../../services/api';

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
    contact: '',
    email: '',
    description: '',
    imagePath: null,
    operatingHours: '',
    services: '',
  });
  const [previewUrls, setPreviewUrls] = useState({
    heroImage: null
  });
  const [success, setSuccess] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.contact || !formData.email) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('contact', formData.contact);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('operatingHours', formData.operatingHours || '');
      formDataToSend.append('services', formData.services || '');

      // Handle hero image
      if (formData.imagePath instanceof File) {
        formDataToSend.append('heroImage', formData.imagePath);
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
      contact: center.contact || '',
      email: center.email || '',
      description: center.description || '',
      imagePath: null,
      operatingHours: center.operatingHours || '',
      services: center.services || '',
    });
    setPreviewUrls({
      heroImage: center.imagePath ? getImageUrl(center.imagePath) : null
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
      contact: '',
      email: '',
      description: '',
      imagePath: null,
      operatingHours: '',
      services: '',
    });
    setPreviewUrls({
      heroImage: null
    });
  };

  const handleImageUploadSuccess = (response) => {
    setSuccess('Images uploaded successfully');
    fetchCenters();
  };

  const handleImageUploadError = (error) => {
    setError(error.response?.data?.message || 'Failed to upload images');
  };

  const handleImageSelect = (centerId, imageUrl) => {
    setSelectedImages(prev => ({
      ...prev,
      [centerId]: {
        ...prev[centerId],
        [imageUrl]: !prev[centerId]?.[imageUrl]
      }
    }));
  };

  const handleDeleteSelectedImages = async (centerId) => {
    const selectedUrls = Object.entries(selectedImages[centerId] || {})
      .filter(([_, selected]) => selected)
      .map(([url]) => url);

    if (selectedUrls.length === 0) {
      setError('Please select images to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedUrls.length} selected images?`)) {
      try {
        // Get the current center
        const center = centers.find(c => c._id === centerId);
        if (!center) {
          throw new Error('Center not found');
        }

        // Filter out the selected images from the images array
        const updatedImages = center.images.filter(img => !selectedUrls.includes(img));
        
        // Update the center with the filtered images
        await api.put(`${ENDPOINTS.CENTERS}/${centerId}`, {
          images: updatedImages
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setSuccess('Selected images deleted successfully');
        setSelectedImages(prev => ({
          ...prev,
          [centerId]: {}
        }));
        fetchCenters();
      } catch (error) {
        console.error('Error deleting images:', error);
        setError(error.response?.data?.message || 'Failed to delete images');
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
                <Fade in timeout={500} style={{ transitionDelay: `${center._id * 80}ms` }}>
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
                      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                          {center.name}
                        </Typography>
                        <Box>
                          <ImageUploadButton
                            itemId={center._id}
                            itemType="centers"
                            multiple={true}
                            maxFiles={Infinity}
                            onUploadSuccess={handleImageUploadSuccess}
                            onUploadError={handleImageUploadError}
                          />
                          <IconButton
                            onClick={() => handleEdit(center)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(center._id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn color="primary" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {center.address}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone color="primary" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {center.contact}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon color="primary" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {center.email}
                          </Typography>
                        </Box>
                        {center.operatingHours && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {center.operatingHours}
                            </Typography>
                          </Box>
                        )}
                      </Stack>

                      {center.description && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            {center.description}
                          </Typography>
                        </Box>
                      )}

                      {/* Images Section - Moved to bottom */}
                      {center.images && center.images.length > 0 && (
                        <Box sx={{ mt: 3, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Images
                            </Typography>
                            {Object.values(selectedImages[center._id] || {}).some(selected => selected) && (
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleDeleteSelectedImages(center._id)}
                                startIcon={<DeleteIcon />}
                              >
                                Delete Selected
                              </Button>
                            )}
                          </Box>
                          <ImageList sx={{ width: '100%', height: 200 }} cols={2} rowHeight={100}>
                            {center.images.map((imageUrl, index) => (
                              <ImageListItem key={index} sx={{ position: 'relative' }}>
                                <img
                                  src={imageUrl}
                                  alt={`${center.name} image ${index + 1}`}
                                  loading="lazy"
                                  style={{ height: '100%', objectFit: 'cover' }}
                                />
                                <Checkbox
                                  checked={!!selectedImages[center._id]?.[imageUrl]}
                                  onChange={() => handleImageSelect(center._id, imageUrl)}
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                  }}
                                />
                              </ImageListItem>
                            ))}
                          </ImageList>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
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
                  label="Contact"
                  name="contact"
                  value={formData.contact}
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
                <TextField
                  fullWidth
                  label="Operating Hours"
                  name="operatingHours"
                  value={formData.operatingHours}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Services"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Hero Image
                </Typography>
                <ImageUpload
                  value={formData.imagePath}
                  onChange={(file) => setFormData(prev => ({ ...prev, imagePath: file }))}
                  label="Upload Hero Image"
                  previewHeight={200}
                  error={error}
                  helperText="Upload a high-quality image for the center"
                />
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