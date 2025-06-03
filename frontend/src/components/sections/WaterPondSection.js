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
import { LocationOn, AccessTime, Water, Phone, Directions, Star } from '@mui/icons-material';
import { getImageUrl } from '../../constants';
import { waterPondService } from '../../services/api';

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Water Ponds for Wildlife
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

// Water Pond Card Component
const WaterPondCard = ({ item, index }) => {
  const theme = useTheme();

  return (
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
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
            {item.name}
          </Typography>
          
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
  );
};

// Main Component
const WaterPondSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await waterPondService.getWaterPonds();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching water ponds:', error);
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
            Water Ponds for Wildlife
          </Typography>
          <Typography 
            variant="subtitle2" 
            color="text.secondary"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Find water ponds and water sources for wildlife. 
            Our network ensures animals have access to clean water.
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
              <WaterPondCard item={item} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default WaterPondSection; 