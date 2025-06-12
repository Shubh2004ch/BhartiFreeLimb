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

const MedicalClinicsDetailsPage = () => {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchClinicDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`${ENDPOINTS.CLINICS}/${id}`);
        if (response.data) {
          console.log('Clinic data:', response.data); // Debug log
          setClinic(response.data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Failed to fetch clinic details:', error);
        setError(error.response?.data?.message || 'Failed to fetch clinic details');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicDetails();
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

  if (!clinic) {
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
          Clinic not found
        </Typography>
      </Box>
    );
  }

  const heroImageUrl = clinic.images && clinic.images.length > 0 
    ? getImageUrl(clinic.images[0])
    : getImageUrl(clinic.imagePath);
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
            alt={clinic.name}
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
          {clinic.name}
        </Typography>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Clinic Details */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOn sx={{ color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {clinic.address || 'Address not specified'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Phone sx={{ color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    wordBreak: 'break-word'
                  }}
                >
                  {clinic.contactNumber || clinic.phone || clinic.contact || 'Phone not specified'}
                </Typography>
              </Box>

              {clinic.email && (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <Email sx={{ color: 'primary.main', mt: 0.5, flexShrink: 0 }} />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      wordBreak: 'break-word'
                    }}
                  >
                    {clinic.email}
                  </Typography>
                </Box>
              )}

              {clinic.features && clinic.features.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
                    Features
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {clinic.features.map((feature, index) => (
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
          </Grid>

          {/* Description */}
          <Grid item xs={12} md={8}>
            {/* About Section */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
                About the Clinic
              </Typography>
              <Typography
                variant="body1"
                sx={{ 
                  lineHeight: 1.8, 
                  color: 'text.secondary',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {clinic.description || 'No description available.'}
              </Typography>
            </Paper>

            {/* Clinic Images Gallery */}
            {clinic.images && clinic.images.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
                  Clinic Gallery ({clinic.images.length} images)
                </Typography>
                <Grid container spacing={2}>
                  {clinic.images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={3}
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
                          src={getImageUrl(image)}
                          alt={`Clinic Image ${index + 1}`}
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
              </Box>
            )}

            {/* Beneficiary Images Gallery */}
            {clinic.beneficiaryImages && clinic.beneficiaryImages.length > 0 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
                  Our Beneficiaries ({clinic.beneficiaryImages.length} images)
                </Typography>
                <Grid container spacing={3}>
                  {clinic.beneficiaryImages.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper
                        elevation={3}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.02)',
                          },
                          height: 300,
                          bgcolor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt={`Beneficiary ${index + 1}`}
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
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MedicalClinicsDetailsPage; 