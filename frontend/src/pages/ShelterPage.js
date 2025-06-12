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
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Fade,
} from '@mui/material';
import {
  Search,
  ArrowBack,
  Phone,
  LocationOn,
  People,
  Home,
  Email,
  Directions,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS, getImageUrl } from '../constants';
import api from '../services/api';

// Shelter Card Component
const ShelterCard = ({ shelter, index }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  return (
    <Fade in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card
        onClick={() => navigate(`/shelters/${shelter._id}`)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          boxShadow: '0 6px 32px 0 rgba(56, 189, 248, 0.10), 0 1.5px 4px 0 rgba(0,0,0,0.06)',
          backdropFilter: 'blur(3.5px)',
          background: 'linear-gradient(120deg,rgba(236, 254, 255, 0.75) 80%,rgba(236, 254, 255, 0.93) 100%)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s cubic-bezier(.4,0,.2,1)',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-10px) scale(1.03)',
            boxShadow: '0 10px 32px 0 rgba(59,130,246,0.18), 0 2px 8px 0 rgba(0,0,0,0.10)',
          },
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          {shelter.images?.[0] && (
            <CardMedia
              component="img"
              height="200"
              image={getImageUrl(shelter.images[0])}
              alt={shelter.name}
              sx={{
                objectFit: 'cover',
                filter: 'brightness(0.97)',
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                transition: 'filter 0.3s',
                '&:hover': { filter: 'brightness(0.92)' },
              }}
            />
          )}
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
            <People sx={{ color: 'primary.main', fontSize: '1.1rem', mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {shelter.currentOccupancy}/{shelter.capacity}
            </Typography>
          </Box>
          <Home
            sx={{
              position: 'absolute',
              left: 10,
              top: 10,
              color: '#2563eb',
              fontSize: 30,
              opacity: 0.85,
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              color: 'primary.main',
              fontSize: '1.17rem',
              letterSpacing: 0.1,
            }}
          >
            {shelter.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <LocationOn sx={{ color: 'info.main', fontSize: '1.15rem', mr: 0.7 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.97rem' }}>
              {shelter.address}, {shelter.city}, {shelter.state}
            </Typography>
          </Box>

          {shelter.contactNumber && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
              <Phone sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {shelter.contactNumber || 'Contact not available'}
              </Typography>
            </Box>
          )}

          {shelter.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Email sx={{ color: 'warning.main', fontSize: '1.15rem', mr: 0.7 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.97rem' }}>
                {shelter.email}
              </Typography>
            </Box>
          )}

          {shelter.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontSize: '0.97rem', fontStyle: 'italic' }}
            >
              {shelter.description}
            </Typography>
          )}

          {shelter.facilities && shelter.facilities.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2 }}>
              {shelter.facilities.map((facility, idx) => (
                <Chip
                  key={idx}
                  label={facility}
                  size="small"
                  sx={{
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    fontSize: '0.75rem',
                    height: '24px',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.2 }}>
            <People sx={{ color: 'primary.main', fontSize: '1rem', mr: 1 }} />
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Capacity: {shelter.currentOccupancy}/{shelter.capacity}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

const ShelterPage = () => {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      const response = await api.get(ENDPOINTS.SHELTERS);
      setShelters(response.data);
    } catch (error) {
      console.error('Failed to fetch shelters:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShelters = shelters.filter(shelter => {
    const searchLower = searchQuery.toLowerCase();
    return (
      shelter.name?.toLowerCase().includes(searchLower) ||
      shelter.address?.toLowerCase().includes(searchLower) ||
      shelter.city?.toLowerCase().includes(searchLower) ||
      shelter.state?.toLowerCase().includes(searchLower)
    );
  });

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
            Free Homeless Shelters
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search shelters by name, city, or state..."
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
          {filteredShelters.map((shelter, index) => (
            <Grid item xs={12} sm={6} md={4} key={shelter._id}>
              <ShelterCard shelter={shelter} index={index} />
            </Grid>
          ))}
        </Grid>

        {!loading && filteredShelters.length === 0 && (
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
              No shelters found matching your search.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ShelterPage; 