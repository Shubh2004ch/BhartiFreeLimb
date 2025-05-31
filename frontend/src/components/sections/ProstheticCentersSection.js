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
  EmojiFoodBeverage
} from '@mui/icons-material';
import { ENDPOINTS, getImageUrl } from '../../constants';
import { foodStallService } from '../../services/api';

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
          width: '320px',
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
            height="180"
            image={getImageUrl(item.imagePath)}
            alt={item.name}
            sx={{
              objectFit: 'cover',
              position: 'relative',
            }}
          />
          <Box 
            sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)',
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
              fontSize: '0.875rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              boxShadow: 2
            }}
          >
            <EmojiFoodBeverage sx={{ fontSize: '1rem' }} />
            Free Food
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h6" component="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Restaurant sx={{ color: 'primary.main' }} />
            {item.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <LocationOn sx={{ color: 'primary.main', fontSize: '1.2rem', mr: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {item.address}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Schedule sx={{ color: 'primary.main', fontSize: '1.2rem', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {item.timings || 'Open 24/7'}
            </Typography>
          </Box>

          {item.specialties && item.specialties.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {item.specialties.map((specialty, idx) => (
              <Chip 
                key={idx}
                  icon={<Fastfood />}
                  label={specialty} 
                size="small"
                sx={{ 
                    bgcolor: 'primary.soft',
                    color: 'primary.dark',
                    '& .MuiChip-icon': {
                      color: 'primary.main'
                    }
                }}
              />
            ))}
          </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<Phone />}
              size="large"
              fullWidth
              href={`tel:${item.contact}`}
              disabled={!item.contact}
              sx={{ 
                py: 1,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              Call Now
            </Button>
            <Button
              variant="outlined"
              startIcon={<Directions />}
              size="large"
              fullWidth
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`}
              target="_blank"
              disabled={!item.address}
              sx={{ 
                py: 1,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'primary.soft'
                }
              }}
            >
              Directions
            </Button>
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
            <LocalDining sx={{ fontSize: '2.5rem' }} />
            Free Food Stalls
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto', fontSize: '1.1rem' }}
          >
            Find free food stalls near prosthetic centers providing nutritious meals to those in need
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
              <FoodStallCard 
                item={item}
                index={index}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};