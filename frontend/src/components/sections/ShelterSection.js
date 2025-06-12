import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Skeleton, Fade, useTheme, useMediaQuery, Alert, Button } from '@mui/material';
import { Home, ArrowForward } from '@mui/icons-material';
import { ENDPOINTS, getImageUrl } from '../../constants';
import { shelterService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import MainCard from '../MainCard';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Free Homeless Shelters
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
export const ShelterSection = () => {
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
      console.log('Fetching shelters...');
      const response = await shelterService.getShelters();
      console.log('Shelters response:', response);
      
      if (!response || !response.data) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from server');
      }

      if (!Array.isArray(response.data)) {
        console.error('Response data is not an array:', response.data);
        throw new Error('Invalid data format received from server');
      }

      console.log('Setting shelters data:', response.data);
      setItems(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching shelters:', error);
      setError('Failed to load shelters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          No shelters available at the moment. Please check back later.
        </Alert>
      </Box>
    );
  }

  console.log('Rendering shelters:', items);

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
            <Home sx={{ fontSize: '2.5rem' }} />
            Free Homeless Shelters
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}
          >
            Find safe and comfortable shelters providing temporary accommodation
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: 3, 
          pb: 2,
          px: 1,
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.primary.main,
            borderRadius: '4px',
            '&:hover': {
              background: theme.palette.primary.dark,
            },
          },
        }}>
          {items.map((item, index) => {
            console.log('Rendering shelter item:', item);
            return (
              <Box 
                key={item._id} 
                sx={{ 
                  minWidth: '320px', 
                  flexShrink: 0,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div>
                    <MainCard
                      image={item.images && item.images.length > 0 ? item.images[0] : ''}
                      name={item.name}
                      address={`${item.address}, ${item.city}, ${item.state} - ${item.pincode}`}
                      phone={item.contactNumber}
                      onClick={() => navigate(`/shelters/${item._id}`)}
                      className="h-full cursor-pointer"
                      imageClassName="hover:scale-105 transition-transform duration-300"
                      nameClassName="text-xl font-bold text-gray-900"
                      addressClassName="text-gray-700"
                      phoneClassName="text-blue-600 hover:text-blue-800 font-medium"
                    />
                  </div>
                </Fade>
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/shelters')}
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
            View All Shelters
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ShelterSection;