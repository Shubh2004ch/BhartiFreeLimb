import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { Search, ArrowBack, Star } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../constants';
import api from '../services/api';

const SuccessStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If we have state from navigation, use it
    if (location.state?.stories) {
      setStories(location.state.stories);
      setLoading(false);
    } else {
      // Otherwise fetch the data
      fetchStories();
    }
  }, [location.state]);

  const fetchStories = async () => {
    try {
      const response = await api.get(ENDPOINTS.REVIEWS);
      setStories(response.data);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStories = stories.filter(story => {
    const searchLower = searchQuery.toLowerCase();
    return (
      story.name.toLowerCase().includes(searchLower) ||
      story.text.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        pt: { xs: 2, sm: 4 },
        pb: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mb: 2,
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.light',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 900,
              color: 'primary.main',
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              background: 'linear-gradient(90deg, #2563eb 30%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Success Stories
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search stories by name or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'background.paper',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'primary.main' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={4}>
          {filteredStories.map((story) => (
            <Grid item xs={12} sm={6} md={4} key={story._id}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: 400,
                  boxShadow: 3,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                {story.imagePath && (
                  <Box
                    component="img"
                    src={getImageUrl(story.imagePath)}
                    alt={story.name}
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                    zIndex: 1,
                  }}
                />
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 1,
                      fontSize: '1.25rem',
                    }}
                  >
                    {story.name}
                  </Typography>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        sx={{
                          color: i < story.rating ? 'warning.main' : 'grey.400',
                          fontSize: '1.25rem',
                        }}
                      />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 5,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {story.text}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {!loading && filteredStories.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              No stories found matching your search.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SuccessStoriesPage; 