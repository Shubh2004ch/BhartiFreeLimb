import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Phone,
  Star,
  ArrowBack,
} from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../constants';

// Custom Glassmorphism Card
const GlassCard = ({ children }) => (
  <Card
    className="h-full rounded-xl shadow-2xl border border-blue-100 bg-white/70 backdrop-blur-[2px] hover:scale-[1.03] hover:shadow-blue-100/70 transition-all duration-300"
    sx={{
      overflow: 'hidden',
      position: 'relative',
    }}
    elevation={0}
  >
    {children}
  </Card>
);

const DetailedSectionPage = ({
  title,
  description,
  endpoint,
  imageField = 'imagePath',
  nameField = 'name',
  locationField = 'location',
  contactField = 'contactNumber',
  ratingField = 'rating',
  featuresField = 'features',
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(endpoint);
      setItems(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to load data. Please try again later.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item[nameField]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item[locationField] &&
        item[locationField].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-pink-50">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-red-500 font-bold text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50 pb-8">
      <Container maxWidth="lg" className="pt-10">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          className="mb-8"
          sx={{
            bgcolor: 'white',
            color: '#2563eb',
            border: '1px solid #dbeafe',
            borderRadius: 999,
            fontWeight: 600,
            px: 3,
            py: 1,
            boxShadow: '0 2px 10px rgba(59,130,246,0.06)',
            mb: 4,
            '&:hover': {
              bgcolor: '#2563eb',
              color: '#fff',
            },
          }}
        >
          Back
        </Button>

        <div className="mb-10 text-center">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            className="font-black tracking-tight"
            sx={{
              background:
                'linear-gradient(90deg, #2563eb 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              fontWeight: 900,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            className="max-w-2xl mx-auto"
          >
            {description}
          </Typography>
        </div>

        <Box className="mb-10 flex justify-center">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              maxWidth: 480,
              bgcolor: 'white',
              borderRadius: 6,
              '.MuiOutlinedInput-root': {
                borderRadius: 6,
              },
              boxShadow: '0 2px 12px rgba(59,130,246,0.07)',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#2563eb' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filteredItems.length === 0 && (
          <Box className="text-center py-24">
            <Typography variant="h6" color="text.secondary">
              No results found for your search.
            </Typography>
          </Box>
        )}

        <Grid container spacing={5}>
          {filteredItems.map((item) => (
            <Grid item key={item._id} xs={12} sm={6} md={4}>
              <GlassCard>
                {item[imageField] && (
                  <CardMedia
                    component="img"
                    height="220"
                    image={getImageUrl(item[imageField])}
                    alt={item[nameField]}
                    className="h-56 w-full object-cover"
                    sx={{
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                      boxShadow: '0 2px 12px rgba(59,130,246,0.07)',
                      filter: 'brightness(0.96)',
                    }}
                  />
                )}
                <CardContent>
                  <Typography
                    variant="h6"
                    component="div"
                    gutterBottom
                    className="font-bold tracking-tight"
                    sx={{
                      color: '#2563eb',
                      fontWeight: 700,
                    }}
                  >
                    {item[nameField]}
                  </Typography>

                  {item[locationField] && (
                    <Box className="flex items-center mb-2">
                      <LocationOn className="text-blue-600 mr-1" />
                      <Typography variant="body2" color="text.secondary">
                        {item[locationField]}
                      </Typography>
                    </Box>
                  )}

                  {item[contactField] && (
                    <Box className="flex items-center mb-2">
                      <Phone className="text-pink-500 mr-1" />
                      <Typography variant="body2" color="text.secondary">
                        {item[contactField]}
                      </Typography>
                    </Box>
                  )}

                  {item[ratingField] && (
                    <Box className="flex items-center mb-2">
                      <Star className="text-yellow-400 mr-1" />
                      <Typography variant="body2" color="text.secondary">
                        {item[ratingField]}
                      </Typography>
                    </Box>
                  )}

                  {item[featuresField] && Array.isArray(item[featuresField]) && (
                    <Box className="mt-4">
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Features
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {item[featuresField].map((feature, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium shadow-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </Box>
                  )}
                </CardContent>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default DetailedSectionPage;