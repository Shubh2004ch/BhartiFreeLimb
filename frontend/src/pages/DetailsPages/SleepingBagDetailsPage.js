import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardMedia,
  IconButton,
  useTheme,
  useMediaQuery,
  CardContent
} from '@mui/material';
import {
  Hotel,
  Phone,
  LocationOn,
  ArrowBack,
  CheckCircle,
  AccessTime,
  Email
} from '@mui/icons-material';
import { sleepingBagService } from '../../services/api';
import { getImageUrl } from '../../constants';
import { Fade } from '@mui/material';

const SleepingBagDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sleepingBag, setSleepingBag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchSleepingBagDetails();
  }, [id]);

  const fetchSleepingBagDetails = async () => {
    try {
      const response = await sleepingBagService.getSleepingBag(id);
      setSleepingBag(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sleeping bag details:', err);
      setError('Failed to load sleeping bag details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!sleepingBag) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Sleeping bag not found
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Go Back
        </Button>

        {/* Hero Section */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            mb: 4,
            position: 'relative',
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ position: 'relative', height: { xs: '300px', md: '400px' } }}>
            <CardMedia
              component="img"
              image={sleepingBag.imagePath ? getImageUrl(sleepingBag.imagePath) : ''}
              alt={sleepingBag.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
        </Paper>

        {/* Content Section */}
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                borderRadius: 4,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {sleepingBag.name}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Chip
                  icon={<CheckCircle />}
                  label={`Availability: ${sleepingBag.availability ? 'Available' : 'Not Available'}`}
                  color={sleepingBag.availability ? 'success' : 'error'}
                  variant="outlined"
                />
                <Chip
                  icon={<Hotel />}
                  label={`Quantity: ${sleepingBag.quantity}`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
                About this Sleeping Bag
              </Typography>
              <Typography variant="body1" paragraph>
                {sleepingBag.description}
              </Typography>

              {sleepingBag.features && sleepingBag.features.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
                    Features
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {sleepingBag.features.map((feature, index) => (
                      <Chip
                        key={index}
                        icon={<CheckCircle />}
                        label={feature}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </>
              )}
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                borderRadius: 4,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LocationOn color="primary" sx={{ mt: 0.5 }} />
                  <Typography variant="body1" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                    {sleepingBag.location || 'Location not specified'}
                  </Typography>
                </Box>

                {sleepingBag.contactNumber && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Phone color="primary" sx={{ mt: 0.5 }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                      {sleepingBag.contactNumber}
                    </Typography>
                  </Box>
                )}

                {sleepingBag.email && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Email color="primary" sx={{ mt: 0.5 }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                      {sleepingBag.email}
                    </Typography>
                  </Box>
                )}

                {sleepingBag.workingHours && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <AccessTime color="primary" sx={{ mt: 0.5 }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
                      {sleepingBag.workingHours}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Gallery Section */}
        {sleepingBag.images && sleepingBag.images.length > 0 && (
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              mt: 4,
              bgcolor: 'background.paper',
              p: 3
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Gallery
            </Typography>
            <Grid container spacing={2}>
              {sleepingBag.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getImageUrl(image)}
                      alt={`${sleepingBag.name} - Image ${index + 1}`}
                      sx={{
                        height: 200,
                        objectFit: 'cover'
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default SleepingBagDetailsPage; 