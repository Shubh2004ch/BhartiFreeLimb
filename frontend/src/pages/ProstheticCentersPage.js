import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Button,
  Fade,
} from '@mui/material';
import { Search, ArrowBack, LocationOn, Phone, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../constants';
import api from '../services/api';

const ProstheticCentersPage = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(ENDPOINTS.CENTERS);
        if (response.data && Array.isArray(response.data)) {
          setCenters(response.data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Failed to fetch centers:', error);
        setError(error.response?.data?.message || 'Failed to fetch prosthetic centers');
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  const filteredCenters = centers.filter(center => {
    const searchLower = searchQuery.toLowerCase();
    return (
      center.name.toLowerCase().includes(searchLower) ||
      center.address.toLowerCase().includes(searchLower) ||
      center.description.toLowerCase().includes(searchLower)
    );
  });

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        pt: { xs: 2, sm: 4 },
        pb: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mb: 2,
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.light',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 900,
              color: 'primary.main',
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              background: 'linear-gradient(90deg, #2563eb 30%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Prosthetic Centers are here to help you
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search centers by name, address, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'background.paper',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {centers.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              No prosthetic centers available at the moment.
            </Typography>
          </Box>
        ) : filteredCenters.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              No centers found matching your search.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredCenters.map((center) => (
              <Grid item xs={12} sm={6} md={4} key={center._id}>
                <Fade in={true} timeout={1000}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={getImageUrl(center.imagePath)}
                      alt={center.name}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          fontSize: '1.25rem',
                        }}
                      >
                        {center.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationOn sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {center.address}
                        </Typography>
                      </Box>

                      {center.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Phone sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body2" color="text.secondary">
                            {center.phone}
                          </Typography>
                        </Box>
                      )}

                      {center.contact && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Phone sx={{ color: 'success.main', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body2" color="text.secondary">
                            {center.contact}
                          </Typography>
                        </Box>
                      )}

                      {center.contactNumber && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Phone sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {center.contactNumber || 'Contact not available'}
                          </Typography>
                        </Box>
                      )}

                      {center.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Email sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                          <Typography variant="body2" color="text.secondary">
                            {center.email}
                          </Typography>
                        </Box>
                      )}

                      {center.features && center.features.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                            Features:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {center.features.map((feature, index) => (
                              <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                  bgcolor: 'primary.light',
                                  color: 'primary.main',
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontSize: '0.75rem',
                                }}
                              >
                                {feature}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          mb: 2,
                        }}
                      >
                        {center.description}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                        {center.phone && (
                          <Button
                            variant="contained"
                            startIcon={<Phone />}
                            size="small"
                            fullWidth
                            href={`tel:${center.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              bgcolor: 'success.main',
                              '&:hover': { bgcolor: 'success.dark' },
                            }}
                          >
                            Call Now
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          onClick={() => navigate(`/prosthetic-centers/${center._id}`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ProstheticCentersPage;