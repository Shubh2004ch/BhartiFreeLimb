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
  Button,
  Skeleton,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Phone,
  Directions,
  Star,
  Pets,
  LocalHospital,
} from '@mui/icons-material';
import { getImageUrl } from '../../constants';
import { clinicService } from '../../services/api';

// Loading Skeleton
const LoadingSkeleton = () => (
  <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
    <Container maxWidth="lg">
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        align="center"
        sx={{
          mb: 6,
          fontWeight: 'bold',
          color: 'primary.main',
          letterSpacing: 2,
        }}
      >
        Free Clinics & Wildlife Shelters
      </Typography>
      <Grid container spacing={4}>
        {[1, 2, 3].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Skeleton
              variant="rounded"
              height={210}
              sx={{ borderRadius: 4, mb: 1 }}
            />
            <Skeleton variant="text" height={40} width="80%" />
            <Skeleton variant="text" height={20} width="60%" />
            <Skeleton variant="text" height={20} width="50%" />
            <Skeleton variant="rectangular" height={32} width="60%" sx={{ borderRadius: 2, mt: 2 }} />
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

// Clinic Card (with Glassmorphism and animated hover)
const ClinicCard = ({ item, index }) => {
  const theme = useTheme();
  return (
    <Fade in timeout={600} style={{ transitionDelay: `${index * 120}ms` }}>
      <Card
        sx={{
          height: '100%',
          width: 320,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          boxShadow: '0 6px 32px 0 rgba(56, 189, 248, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.06)',
          backdropFilter: 'blur(3.5px)',
          background: 'linear-gradient(120deg,rgba(236, 254, 255, 0.75) 80%,rgba(236, 254, 255, 0.93) 100%)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s cubic-bezier(.4,0,.2,1)',
          '&:hover': {
            transform: 'translateY(-10px) scale(1.03)',
            boxShadow: '0 10px 32px 0 rgba(59,130,246,0.18), 0 2px 8px 0 rgba(0,0,0,0.10)',
          },
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="160"
            image={getImageUrl(item.imagePath)}
            alt={item.name}
            sx={{
              objectFit: 'cover',
              filter: 'brightness(0.97)',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              transition: 'filter 0.3s',
              '&:hover': { filter: 'brightness(0.92)' },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'rgba(255,255,255,0.94)',
              px: 1.5,
              py: 0.5,
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 8px 0 rgba(59,130,246,0.07)',
            }}
          >
            <Star sx={{ color: 'warning.main', fontSize: '1.1rem', mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.rating}
            </Typography>
          </Box>
          {item.type?.toLowerCase().includes('wildlife') && (
            <Pets
              sx={{
                position: 'absolute',
                left: 10,
                top: 10,
                color: '#10b981',
                fontSize: 30,
                opacity: 0.85,
              }}
            />
          )}
          {item.type?.toLowerCase().includes('clinic') && (
            <LocalHospital
              sx={{
                position: 'absolute',
                left: 10,
                top: 10,
                color: '#3b82f6',
                fontSize: 28,
                opacity: 0.85,
              }}
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: 'primary.main',
              fontSize: '1.17rem',
              letterSpacing: 0.1,
            }}
          >
            {item.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn sx={{ color: 'info.main', fontSize: '1.15rem', mr: 0.7 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.97rem' }}>
              {item.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Phone sx={{ color: 'success.main', fontSize: '1.1rem', mr: 0.7 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.97rem' }}>
              {item.contactNumber}
            </Typography>
          </Box>
          {item.operatingHours && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTime sx={{ color: 'warning.main', fontSize: '1.1rem', mr: 0.7 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.96rem' }}>
                {item.operatingHours}
              </Typography>
            </Box>
          )}
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {item.reviews} reviews
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
                  height: '22px',
                  fontWeight: 500,
                  letterSpacing: 0.2,
                }}
              />
            )}
            {item.specialties?.map((specialty, idx) => (
              <Chip
                key={idx}
                label={specialty}
                size="small"
                sx={{
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                  fontSize: '0.75rem',
                  height: '22px',
                  fontWeight: 500,
                  letterSpacing: 0.2,
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 1 }}>
            <Button
              variant="contained"
              startIcon={<Phone />}
              size="small"
              fullWidth
              href={`tel:${item.contactNumber}`}
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                fontWeight: 600,
                letterSpacing: 0.5,
                py: 0.5,
                boxShadow: '0 2px 8px 0 rgba(16,185,129,0.10)',
                '&:hover': { bgcolor: 'success.dark' },
              }}
            >
              Call
            </Button>
            <Button
              variant="outlined"
              startIcon={<Directions />}
              size="small"
              fullWidth
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                item.location
              )}`}
              target="_blank"
              sx={{
                borderColor: 'info.light',
                color: 'info.main',
                fontWeight: 600,
                letterSpacing: 0.5,
                py: 0.5,
                '&:hover': {
                  bgcolor: 'info.light',
                  borderColor: 'info.main',
                  color: 'white',
                },
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

// Main Section
const ClinicSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await clinicService.getClinics();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 6 },
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
        minHeight: '60vh',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: 'primary.main',
              letterSpacing: 1.5,
              textShadow: '1.5px 2px 7px rgba(16,165,202,0.08)'
            }}
          >
            Free Clinics & Wildlife Shelters
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: 'auto',
              mb: 1.5,
              fontWeight: 500,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            Access free medical care and wildlife rescue shelters across the region.<br/>
            Compassion and care for all—people and animals.
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
              <ClinicCard item={item} index={index} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ClinicSection;