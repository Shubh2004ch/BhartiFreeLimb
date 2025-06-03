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
  Button
} from '@mui/material';
import { LocationOn, AccessTime, Hotel, Phone, Directions } from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../../constants';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Free Sleeping Bags
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

// Sleeping Bag Card Component
const SleepingBagCard = ({ item, index }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} sm={6} md={4} key={item._id}>
      <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
        <Card 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            width: '280px',
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
              image={getImageUrl(item.imagePath)}
              alt={item.name}
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
          </Box>
          <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Hotel sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                {item.name}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {item.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {item.contactNumber}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {item.operatingHours}
              </Typography>
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {item.rating} ({item.reviews} reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {item.type && (
                <Chip 
                  label={item.type} 
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
                href={`tel:${item.contactNumber}`}
                sx={{ py: 0.5 }}
              >
                Call Now
              </Button>
              <Button
                variant="outlined"
                startIcon={<Directions />}
                size="small"
                fullWidth
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
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
const SleepingBagSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(ENDPOINTS.SLEEPING_BAGS);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching sleeping bags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
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
            Free Sleeping Bags
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Find free sleeping bags. 
            Our network ensures everyone has a safe place to rest.
          </Typography>
        </Box>

        <Grid
          container
          spacing={5}
          justifyContent="center"
          alignItems="stretch"
          sx={{ overflowX: 'auto', flexWrap: 'nowrap', pb: 2 }}
        >
          {items.slice(0, 3).map((item, index) => (
            <Grid item key={item._id} sx={{ minWidth: 320 }}>
              <SleepingBagCard item={item} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SleepingBagSection; 