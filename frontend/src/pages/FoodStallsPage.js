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
  Skeleton,
  Fade,
  Button,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  Phone as PhoneIcon,
  AccessTime,
  Email as EmailIcon,
  Restaurant,
  Star,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../constants';

// Loading skeleton for beautiful loading state
const FoodStallSkeleton = () => (
  <Grid container spacing={4}>
    {[1, 2, 3].map((i) => (
      <Grid item xs={12} md={6} lg={4} key={i}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 5,
            p: 2,
            minHeight: 350,
            bgcolor: 'background.paper',
          }}
        >
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="text" width="70%" height={36} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="rectangular" width="80%" height={30} sx={{ borderRadius: 2, mt: 2 }} />
        </Card>
      </Grid>
    ))}
  </Grid>
);

const FoodStallsPage = () => {
  const [foodStalls, setFoodStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodStalls = async () => {
      try {
        const response = await axios.get(ENDPOINTS.FOOD_STALLS);
        setFoodStalls(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching food stalls:', error);
        setLoading(false);
      }
    };
    fetchFoodStalls();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 10,
        pb: 8,
        bgcolor: 'linear-gradient(120deg,#f0f9ff 0%,#fff7f7 100%)',
        background: 'linear-gradient(120deg,#e0ecff 0%,#fff6f6 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton
            onClick={() => navigate(-1)}
            size="large"
            sx={{
              mr: 1,
              bgcolor: 'white',
              border: '1px solid #e0e7ef',
              boxShadow: 1,
              '&:hover': { bgcolor: '#f3f4f6' },
            }}
            aria-label="Back"
          >
            <ArrowBack sx={{ color: '#2563eb' }} />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#2563eb', fontWeight: 700 }}>
            Back
          </Typography>
        </Box>
        <Box textAlign="center" mb={6}>
          <Restaurant sx={{ fontSize: 46, color: '#ec4899', mb: 1 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              letterSpacing: 1.4,
              mb: 1,
              background: 'linear-gradient(90deg, #2563eb 30%, #ec4899 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Food Stalls
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 1,
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 500,
            }}
          >
            Discover free, hygienic food stalls near you. Nourishment and kindness in every meal.
          </Typography>
        </Box>

        {loading ? (
          <FoodStallSkeleton />
        ) : (
          <Grid container spacing={5}>
            {foodStalls.map((stall, idx) => (
              <Grid item xs={12} md={6} lg={4} key={stall._id}>
                <Fade in timeout={550} style={{ transitionDelay: `${idx * 100}ms` }}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: '0 6px 22px 0 rgba(59,130,246,0.09), 0 2px 8px 0 rgba(236,72,153,0.09)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      transition: 'transform 0.22s cubic-bezier(.4,0,.2,1), box-shadow 0.22s cubic-bezier(.4,0,.2,1)',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.03)',
                        boxShadow:
                          '0 12px 36px 0 rgba(59,130,246,0.18), 0 3px 12px 0 rgba(236,72,153,0.16)',
                      },
                      bgcolor: 'rgba(255,255,255,0.88)',
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    {stall.imagePath && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(stall.imagePath)}
                        alt={stall.name}
                        sx={{
                          objectFit: 'cover',
                          filter: 'brightness(0.98)',
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                        }}
                      />
                    )}
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        p: 3,
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: '#2563eb',
                          mb: 2,
                          letterSpacing: 0.5,
                        }}
                      >
                        {stall.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
                        <LocationOn sx={{ color: '#ec4899', mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ color: '#475569', fontWeight: 500 }}>
                          {stall.location}
                        </Typography>
                      </Box>

                      {stall.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PhoneIcon sx={{ color: 'success.main', fontSize: 18, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            {stall.phone}
                          </Typography>
                        </Box>
                      )}
                      {stall.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmailIcon sx={{ color: 'info.main', fontSize: 18, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            {stall.email}
                          </Typography>
                        </Box>
                      )}
                      {stall.workingHours && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTime sx={{ color: '#fbbf24', fontSize: 19, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            {stall.workingHours}
                          </Typography>
                        </Box>
                      )}

                      {stall.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Star sx={{ color: '#fbbf24', fontSize: 19, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            {stall.rating}
                          </Typography>
                        </Box>
                      )}

                      {stall.tags && Array.isArray(stall.tags) && (
                        <Box sx={{ mt: 1.2, mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.7 }}>
                          {stall.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                fontWeight: 600,
                                fontSize: 13,
                                letterSpacing: 0.3,
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      {stall.description && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            mt: 2,
                            mb: 1,
                            fontSize: 15.5,
                            letterSpacing: 0.3,
                          }}
                        >
                          {stall.description}
                        </Typography>
                      )}

                      {stall.website && (
                        <Button
                          href={stall.website}
                          target="_blank"
                          size="small"
                          variant="outlined"
                          sx={{
                            mt: 'auto',
                            alignSelf: 'flex-start',
                            color: '#ec4899',
                            borderColor: '#ec4899',
                            textTransform: 'none',
                            fontWeight: 600,
                            letterSpacing: 0.2,
                            px: 2,
                            py: 0.5,
                            borderRadius: 99,
                            '&:hover': {
                              bgcolor: '#ec489910',
                              borderColor: '#ec4899',
                            },
                          }}
                        >
                          Visit Website
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FoodStallsPage;