import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Rating,
  Skeleton,
  Fade,
  useTheme,
  useMediaQuery,
  Button,
  Alert
} from '@mui/material';
import { LocationOn, AccessTime, Restaurant, Phone, Directions, Star } from '@mui/icons-material';
import { getImageUrl } from '../../constants';
import { foodStallService } from '../../services/api';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Free Food Stalls
      </Typography>
      <Grid container spacing={4}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="text" height={20} />
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

// Food Stall Card Component
const FoodStallCard = ({ item, index }) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} key={item._id}>
      <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
        <Card 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', sm: '280px' },
            mx: 'auto',
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
              height="160"
              image={imageError ? '/placeholder-food.jpg' : getImageUrl(item.imagePath)}
              alt={item.name}
              onError={() => setImageError(true)}
              sx={{
                objectFit: 'cover',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out'
                },
                '&:hover::after': {
                  opacity: 1
                }
              }}
            />
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8, 
                bgcolor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(4px)',
                px: 1.5,
                py: 0.5,
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Star sx={{ color: 'warning.main', fontSize: '1rem', mr: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {item.rating || 'N/A'}
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
              {item.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {item.location || 'Location not specified'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {item.contactNumber || 'Contact not available'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {item.operatingHours || 'Hours not specified'}
              </Typography>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {item.reviews || 0} reviews
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {item.cuisine && (
                <Chip 
                  label={item.cuisine} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    fontSize: '0.75rem',
                    height: '20px'
                  }} 
                />
              )}
              {item.features?.map((feature, idx) => (
                <Chip 
                  key={idx}
                  label={feature} 
                  size="small"
                  sx={{ 
                    bgcolor: 'success.light',
                    color: 'success.contrastText',
                    fontSize: '0.75rem',
                    height: '20px'
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
              <Button
                variant="contained"
                startIcon={<Phone />}
                size="small"
                fullWidth
                href={item.contactNumber ? `tel:${item.contactNumber}` : '#'}
                disabled={!item.contactNumber}
                sx={{ py: 0.5 }}
              >
                Call Now
              </Button>
              <Button
                variant="outlined"
                startIcon={<Directions />}
                size="small"
                fullWidth
                href={item.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}` : '#'}
                disabled={!item.location}
                target="_blank"
                sx={{ py: 0.5 }}
              >
                Directions
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Grid>
  );
};

// Main Component
const FoodStallSection = () => {
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
      const response = await foodStallService.getFoodStalls();
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
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
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
            Free Food Stalls
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Find free food stalls and community kitchens. 
            Our network ensures everyone has access to nutritious meals.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: 2, 
          pb: 2,
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#555',
            },
          },
        }}>
          {items.map((item, index) => (
            <Box key={item._id} sx={{ minWidth: { xs: '100%', sm: '280px' }, flexShrink: 0 }}>
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

export default FoodStallSection; 