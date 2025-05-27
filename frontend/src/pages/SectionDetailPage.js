import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia,
  Typography, 
  Grid, 
  Container,
  Box,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { 
  LocationOn, 
  Phone, 
  Email, 
  AccessTime,
  Search,
  ArrowBack
} from '@mui/icons-material';
import axios from 'axios';
import { ENDPOINTS, getImageUrl } from '../constants';

const SectionDetailPage = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let endpoint;
        
        // Map the section parameter to the correct endpoint
        switch(section) {
          case 'prosthetic-centers':
            endpoint = ENDPOINTS.CENTERS;
            break;
          case 'food-stalls':
            endpoint = ENDPOINTS.FOOD_STALLS;
            break;
          case 'medical-clinics':
            endpoint = ENDPOINTS.CLINICS;
            break;
          case 'sleeping-bags':
            endpoint = ENDPOINTS.SLEEPING_BAGS;
            break;
          case 'water-ponds':
            endpoint = ENDPOINTS.WATER_PONDS;
            break;
          default:
            endpoint = ENDPOINTS.CENTERS;
        }

        console.log('Fetching data from:', endpoint);
        const response = await axios.get(endpoint);
        console.log('Raw API Response:', response.data);
        
        // Process the data to ensure consistent field names
        const processedData = response.data.map(item => {
          console.log('Processing item:', item);
          return {
            ...item,
            name: item.name || item.centerName || item.title || 'Unnamed Center',
            address: item.address || item.location || item.contactAddress || item.centerAddress || '',
            phone: item.phone || item.contactPhone || item.contactNumber || item.centerPhone || '',
            email: item.email || item.contactEmail || item.centerEmail || '',
            workingHours: item.workingHours || item.timing || item.workingTime || item.centerTiming || '',
            services: item.services || item.centerServices || [],
            description: item.description || item.about || item.details || item.centerDescription || ''
          };
        });
        
        console.log('Processed Data:', processedData);
        setItems(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [section]);

  const filteredItems = items.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSectionTitle = () => {
    const titles = {
      'prosthetic-centers': 'Prosthetic Centers',
      'food-stalls': 'Food Stalls',
      'medical-clinics': 'Medical Clinics',
      'sleeping-bags': 'Sleeping Bags',
      'water-ponds': 'Water Ponds'
    };
    return titles[section] || 'Section Details';
  };

  if (loading) {
    return (
      <Container className="min-h-screen pt-24 flex items-center justify-center">
        <CircularProgress size={60} className="text-blue-800" />
      </Container>
    );
  }

  return (
    <Container className="min-h-screen pt-24 pb-12">
      <Box className="mb-8">
        <IconButton 
          onClick={() => navigate(-1)}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h3" className="text-blue-800 font-bold mb-6">
          {getSectionTitle()}
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name, address, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          className="mb-6"
        />
      </Box>

      <Grid container spacing={4}>
        {filteredItems.map((item) => {
          console.log('Rendering item:', item);
          return (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
                {item.imagePath && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(item.imagePath)}
                    alt={item.name}
                    className="h-48 object-cover"
                  />
                )}
                <CardContent className="p-6">
                  <Typography variant="h5" className="font-bold mb-4 text-blue-800">
                    {item.name}
                  </Typography>
                  
                  <Box className="space-y-3">
                    {item.address && (
                      <Box className="flex items-start">
                        <LocationOn className="text-gray-500 mr-2 mt-1" />
                        <Typography variant="body1" className="text-gray-700">
                          {item.address}
                        </Typography>
                      </Box>
                    )}

                    {item.phone && (
                      <Box className="flex items-center">
                        <Phone className="text-gray-500 mr-2" />
                        <Typography variant="body1" className="text-gray-700">
                          {item.phone}
                        </Typography>
                      </Box>
                    )}

                    {item.email && (
                      <Box className="flex items-center">
                        <Email className="text-gray-500 mr-2" />
                        <Typography variant="body1" className="text-gray-700">
                          {item.email}
                        </Typography>
                      </Box>
                    )}

                    {item.workingHours && (
                      <Box className="flex items-center">
                        <AccessTime className="text-gray-500 mr-2" />
                        <Typography variant="body1" className="text-gray-700">
                          {item.workingHours}
                        </Typography>
                      </Box>
                    )}

                    {item.services && item.services.length > 0 && (
                      <Box className="mt-4">
                        <Typography variant="subtitle2" className="text-gray-600 mb-2">
                          Services:
                        </Typography>
                        <Box className="flex flex-wrap gap-2">
                          {Array.isArray(item.services) ? (
                            item.services.map((service, index) => (
                              <Chip
                                key={index}
                                label={service}
                                size="small"
                                className="bg-blue-100 text-blue-800"
                              />
                            ))
                          ) : (
                            <Chip
                              label={item.services}
                              size="small"
                              className="bg-blue-100 text-blue-800"
                            />
                          )}
                        </Box>
                      </Box>
                    )}

                    {item.description && (
                      <Box className="mt-4">
                        <Typography variant="body2" className="text-gray-600">
                          {item.description}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default SectionDetailPage; 