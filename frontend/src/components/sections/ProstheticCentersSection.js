import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Skeleton, Fade, useTheme, useMediaQuery, Alert, Button } from '@mui/material';
import { LocalDining, ArrowForward } from '@mui/icons-material';
import { ENDPOINTS, getImageUrl } from '../../config/constants';
import { centerService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import MainCard from '../MainCard';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Free Food Stalls
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
export const ProstheticCentersSection = () => {
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
      console.log('Fetching prosthetic centers...');
      const response = await centerService.getCenters();
      console.log('Prosthetic centers response:', response);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format received from server');
      }
      setItems(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching prosthetic centers:', error);
      setError('Failed to load prosthetic centers. Please try again later.');
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

  if (items.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          No prosthetic centers available at the moment. Please check back later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        py: 6,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center', 
          mb: 4
        }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Free Limb Centers
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', mb: 3 }}
          >
            Find prosthetic centers and support services. 
            Our network ensures everyone has access to quality prosthetic care.
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
          {items.map((item, index) => (
            <Box key={item._id} sx={{ minWidth: '320px', flexShrink: 0 }}>
              <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                <div>
                  <MainCard
                    image={getImageUrl(item.imagePath)}
                    name={item.name}
                    address={item.address}
                    phone={item.contact}
                    description={item.description}
                    features={item.specialties}
                    onClick={() => navigate(`/prosthetic-centers/${item._id}`)}
                    className="h-full"
                  />
                </div>
              </Fade>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/prosthetic-centers')}
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
            View All Prosthetic Centers
          </Button>
        </Box>
      </Container>
    </Box>
  );
};