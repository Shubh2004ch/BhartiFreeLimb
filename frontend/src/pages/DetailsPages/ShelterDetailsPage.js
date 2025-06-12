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
  Chip,
} from '@mui/material';
import { ArrowBack, LocationOn, Phone, People, Home, Info } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { shelterService } from '../../services/api';
import { getImageUrl } from '../../constants';

const ShelterDetailsPage = () => {
  const [shelter, setShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchShelter = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await shelterService.getShelter(id);
        
        if (response.data) {
          // Parse facilities if they are JSON strings
          const parsedData = {
            ...response.data,
            facilities: response.data.facilities.map(facility => {
              try {
                const parsed = JSON.parse(facility);
                return Array.isArray(parsed) ? parsed[0] : parsed;
              } catch (e) {
                return facility;
              }
            })
          };
          
          setShelter(parsedData);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching shelter:', err);
        setError(err.response?.data?.message || 'Failed to load shelter details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShelter();
  }, [id]);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
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

  if (!shelter) {
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
          Shelter not found
        </Typography>
      </Box>
    );
  }

  const heroImage = shelter.images && shelter.images.length > 0 ? shelter.images[0] : null;

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
        {heroImage ? (
          <Box
            component="img"
            src={heroImage}
            alt={shelter.name}
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
            <Home sx={{ fontSize: 60, color: 'grey.400' }} />
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
          {shelter.name}
        </Typography>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Contact Information */}
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
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <LocationOn sx={{ color: 'primary.main', mr: 1, mt: 0.5 }} />
                <Typography>
                  {shelter.address}, {shelter.city}, {shelter.state} - {shelter.pincode}
                </Typography>
              </Box>
              {shelter.contactNumber && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Phone sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography>{shelter.contactNumber}</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ color: 'primary.main', mr: 1 }} />
                <Typography>
                  Capacity: {shelter.currentOccupancy || 0} / {shelter.capacity || 0} people
                </Typography>
              </Box>
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
                About this Shelter
              </Typography>
              <Typography variant="body1" paragraph>
                {shelter.description || 'No description available.'}
              </Typography>

              {shelter.facilities && shelter.facilities.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2, mt: 4, fontWeight: 700 }}>
                    Facilities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {shelter.facilities.map((facility, index) => (
                      <Chip
                        key={index}
                        label={facility}
                        sx={{
                          bgcolor: 'primary.light',
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Paper>

            {/* Image Gallery */}
            {shelter.images && shelter.images.length > 1 && (
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                  Photo Gallery
                </Typography>
                <Grid container spacing={2}>
                  {shelter.images.slice(1).map((image, index) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Box
                        component="img"
                        src={image}
                        alt={`${shelter.name} - Image ${index + 1}`}
                        onError={handleImageError}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 1,
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
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

export default ShelterDetailsPage; 