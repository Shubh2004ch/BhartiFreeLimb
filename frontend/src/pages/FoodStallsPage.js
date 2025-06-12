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
} from '@mui/material';
import { Search, ArrowBack, LocationOn, Phone, Email } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS, getImageUrl } from '../constants';
import api from '../services/api';
import SEO from '../components/SEO';

const FoodStallsPage = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStalls = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(ENDPOINTS.FOOD_STALLS);
        if (response.data && Array.isArray(response.data)) {
          setStalls(response.data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Failed to fetch food stalls:', error);
        setError(error.response?.data?.message || 'Failed to fetch food stalls');
      } finally {
        setLoading(false);
      }
    };

    fetchStalls();
  }, []);

  const filteredStalls = stalls.filter(stall => {
    const searchLower = searchQuery.toLowerCase();
    return (
      stall.name.toLowerCase().includes(searchLower) ||
      (stall.location && stall.location.toLowerCase().includes(searchLower)) ||
      (stall.description && stall.description.toLowerCase().includes(searchLower))
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
    <>
      <SEO 
        title="Free Food Stalls"
        description="Find free food stalls near prosthetic centers. Access nutritious meals and support services in your area."
        keywords={[
          'free food',
          'food stalls',
          'free meals',
          'community kitchen',
          'food support',
          'nutritious meals'
        ]}
        type="article"
      />
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
              Free Food Stalls are here to help you
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search food stalls by name, address, or description..."
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

          {stalls.length === 0 ? (
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
                No food stalls available at the moment.
              </Typography>
            </Box>
          ) : filteredStalls.length === 0 ? (
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
                No food stalls found matching your search.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredStalls.map((stall) => (
                <Grid item xs={12} sm={6} md={4} key={stall._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                      },
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/food-stalls/${stall._id}`)}
                  >
                    {stall.imagePath && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(stall.imagePath)}
                        alt={stall.name}
                        sx={{
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: 'primary.main',
                          mb: 2,
                          letterSpacing: 0.5,
                        }}
                      >
                        {stall.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                        <LocationOn sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {stall.location || 'Location not specified'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                        <Phone sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {stall.contactNumber}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};

export default FoodStallsPage;