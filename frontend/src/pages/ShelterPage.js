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
} from '@mui/material';
import { Search, ArrowBack, Phone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../constants';
import ShelterCard from '../components/sections/ShelterSection';
import api from '../services/api';

const PhoneIcon = () => {
  return <Phone sx={{ color: 'success.main', fontSize: 18, mr: 1 }} />;
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
      shelter.name.toLowerCase().includes(searchLower) ||
      shelter.address.toLowerCase().includes(searchLower) ||
      shelter.city.toLowerCase().includes(searchLower) ||
      shelter.state.toLowerCase().includes(searchLower)
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
            All Shelters
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
              <ShelterCard item={shelter} index={index}>
                {shelter.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon />
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      {shelter.phone}
                    </Typography>
                  </Box>
                )}
                {shelter.contactNumber && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon />
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      {shelter.contactNumber}
                    </Typography>
                  </Box>
                )}
                {shelter.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon />
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      {shelter.email}
                    </Typography>
                  </Box>
                )}
              </ShelterCard>
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