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
import { ArrowBack, LocationOn, Phone, Email, Image as ImageIcon, AccessTime } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { ENDPOINTS, getImageUrl } from '../../constants';
import api from '../../services/api';

const FoodStallsDetailsPage = () => {
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchStallDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`${ENDPOINTS.FOOD_STALLS}/${id}`);
        if (response.data) {
          console.log('Stall data:', response.data); // Debug log
          setStall(response.data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Failed to fetch stall details:', error);
        setError(error.response?.data?.message || 'Failed to fetch stall details');
      } finally {
        setLoading(false);
      }
    };

    fetchStallDetails();
  }, [id]);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src); // Debug log
    setImageError(true);
    e.target.style.display = 'none';
  };

  if (loading) {
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

  if (!stall) {
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
          Food stall not found
        </Typography>
      </Box>
    );
  }

  const heroImageUrl = getImageUrl(stall.imagePath);
  console.log('Hero image URL:', heroImageUrl); // Debug log

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
            alt={stall.name}
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
          {stall.name}
        </Typography>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Stall Details */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                height: 'fit-content',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                Contact Information
              </Typography>
              {stall.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography>{stall.location}</Typography>
                </Box>
              )}
              {stall.contactNumber && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography>{stall.contactNumber}</Typography>
                </Box>
              )}
              {stall.operatingHours && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTime sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography>{stall.operatingHours}</Typography>
                </Box>
              )}
              {stall.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Email sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography>{stall.email}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                height: 'fit-content',
                mb: 4,
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                About this Food Stall
              </Typography>
              <Typography variant="body1" paragraph>
                {stall.description}
              </Typography>

              {stall.features && stall.features.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                    Features
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {stall.features.map((feature, index) => (
                      <Paper
                        key={index}
                        elevation={1}
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {feature}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Image Gallery */}
            {stall.images && stall.images.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: 'fit-content',
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  Photo Gallery
                </Typography>
                <Grid container spacing={2}>
                  {stall.images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={1}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                          height: 200,
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt={`Food Stall Image ${index + 1}`}
                          onError={(e) => {
                            console.error('Failed to load image:', image);
                            handleImageError(e);
                          }}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FoodStallsDetailsPage; 