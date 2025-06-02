import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Fade,
  useTheme,
  useMediaQuery,
  Button,
  Alert,
  Rating
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Phone,
  Directions,
  Restaurant,
  LocalDining,
  Schedule,
  Fastfood,
  EmojiFoodBeverage,
  ArrowForward
} from '@mui/icons-material';
import { ENDPOINTS, getImageUrl } from '../../constants';
import { foodStallService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

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

// Food Stall Card Component
const FoodStallCard = ({ item, index }) => {
  const theme = useTheme();

  return (
    <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          width: '250px',
          mx: 'auto',
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[8]
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={getImageUrl(item.imagePath)}
            alt={item.name}
            sx={{
              objectFit: 'cover',
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)',
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 12, 
              right: 12,
              bgcolor: 'success.main',
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              boxShadow: 2
            }}
          >
            <EmojiFoodBeverage sx={{ fontSize: '0.875rem' }} />
            Free
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h6" component="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: '1rem',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Restaurant sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
            {item.name}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 1,
            bgcolor: 'grey.50',
            p: 1,
            borderRadius: 1
          }}>
            <LocationOn sx={{ 
              color: 'primary.main', 
              fontSize: '1.2rem',
              flexShrink: 0,
              mt: 0.2
            }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.primary',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                fontWeight: 500
              }}
            >
              {item.location}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

// Main Component
export const FoodStallsSection = () => {
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
      console.log('Fetching food stalls...');
      const response = await foodStallService.getFoodStalls();
      console.log('Food stalls response:', response);
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid data format received from server');
      }
      setItems(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching food stalls:', error);
      setError('Failed to load food stalls. Please try again later.');
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
          No food stalls available at the moment. Please check back later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        py: 4, 
        bgcolor: 'background.default',
        borderRadius: 4,
        boxShadow: '0 0 40px rgba(0,0,0,0.03)'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            <LocalDining sx={{ fontSize: '2.5rem' }} />
            Free Food Stalls
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', fontSize: '1rem' }}
          >
            Find free food stalls near prosthetic centers providing nutritious meals
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: 2, 
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
            <Box key={item._id} sx={{ minWidth: '250px', flexShrink: 0 }}>
              <FoodStallCard 
                item={item}
                index={index}
              />
            </Box>
          ))}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 4
        }}>
          <Button
            variant="contained"
            onClick={() => navigate('/food-stalls')}
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
            View All Food Stalls
          </Button>
        </Box>
      </Container>
    </Box>
  );
}; 