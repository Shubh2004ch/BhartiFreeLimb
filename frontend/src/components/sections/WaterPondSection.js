import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Skeleton, Fade, useTheme, useMediaQuery, Alert, Button, Grid, CircularProgress } from '@mui/material';
import { WaterDrop, ArrowForward } from '@mui/icons-material';
import { ENDPOINTS, getImageUrl } from '../../constants';
import { waterPondService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import MainCard from '../MainCard';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Water Ponds for Wildlife
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ minWidth: '320px', flexShrink: 0 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} />
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

// Main Component
export const WaterPondSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      console.log('Fetching water ponds...');
      const response = await waterPondService.getWaterPonds();
      console.log('Water ponds response:', response);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format received from server');
      }
      setItems(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching water ponds:', error);
      setError('Failed to load water ponds. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (pondId) => {
    navigate(`/water-ponds/${pondId}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          py: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          No water ponds available at the moment. Please check back later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        py: 6, 
        bgcolor: 'background.default',
        borderRadius: 4,
        boxShadow: '0 0 40px rgba(0,0,0,0.03)'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 900,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <WaterDrop sx={{ fontSize: '2.5rem' }} />
            Water Ponds for Wildlife
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}
          >
            Find water ponds providing clean drinking water
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {items.slice(0, 3).map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <MainCard
                image={getImageUrl(item.imagePath)}
                name={item.name}
                address={item.location}
                phone={item.contactNumber}
                onClick={() => handleCardClick(item._id)}
                className="h-full cursor-pointer"
                imageClassName="hover:scale-105 transition-transform duration-300"
                nameClassName="text-xl font-bold text-gray-900"
                addressClassName="text-gray-700"
                phoneClassName="text-blue-600 hover:text-blue-800 font-medium"
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/water-ponds')}
            endIcon={<ArrowForward />}
            sx={{
              minWidth: 200,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              },
              transition: 'all 0.3s ease',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              py: 1.5,
              px: 4,
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            View All Water Ponds
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default WaterPondSection; 