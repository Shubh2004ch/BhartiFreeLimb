import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ArrowBack, LocationOn, Phone, Email, Image as ImageIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';

const WaterPondsDetailsPage = () => {
  const [pond, setPond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPondDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching water pond details for ID:', id);
        const response = await api.get(`${ENDPOINTS.WATER_PONDS}/${id}`);
        console.log('Water pond API response:', response);
        if (response.data) {
          console.log('Water pond data:', response.data);
          setPond(response.data);
        } else {
          console.error('Invalid data format received from server');
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Failed to fetch water pond details:', error);
        setError(error.response?.data?.message || 'Failed to fetch water pond details');
      } finally {
        setLoading(false);
      }
    };

    fetchPondDetails();
  }, [id]);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    setImageError(true);
    e.target.style.display = 'none';
  };

  if (loading) {
    console.log('Loading state:', loading);
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.log('Error state:', error);
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 2,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600, width: '100%' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!pond) {
    console.log('No pond data available');
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h5" color="error">
          Pond not found
        </Typography>
      </Box>
    );
  }

  console.log('Rendering pond details:', pond);
  const heroImageUrl = getImageUrl(pond.imagePath);
  console.log('Hero image URL:', heroImageUrl);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '50vh', md: '60vh' },
          width: '100%',
          overflow: 'hidden',
          bgcolor: 'grey.200',
        }}
      >
        {heroImageUrl ? (
          <Box
            component="img"
            src={heroImageUrl}
            alt={pond.name}
            onError={handleImageError}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.200',
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.5)',
            },
          }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h3"
          sx={{
            position: 'absolute',
            bottom: 32,
            left: 32,
            color: 'white',
            fontWeight: 900,
            fontSize: { xs: '2rem', md: '3rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {pond.name}
        </Typography>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Contact Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    {pond.location}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    {pond.contactNumber}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* About Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                About this Water Pond
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                This water pond provides essential water resources for the local community. 
                It serves as a vital source of water for various purposes including drinking, 
                irrigation, and other daily needs.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Image Gallery */}
        {pond.images && pond.images.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Photo Gallery
            </Typography>
            <Grid container spacing={2}>
              {pond.images.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      },
                      overflow: 'hidden',
                      borderRadius: 2
                    }}
                  >
                    <Box
                      component="img"
                      src={getImageUrl(image)}
                      alt={`${pond.name} - Image ${index + 1}`}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', e);
                        e.target.style.display = 'none';
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default WaterPondsDetailsPage; 