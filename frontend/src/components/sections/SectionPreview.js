import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { getImageUrl } from '../../constants';
import { LocationOn } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const SectionPreview = ({ 
  title, 
  description, 
  items, 
  route, 
  imageField = 'imagePath',
  nameField = 'name',
  locationField = 'location'
}) => {
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-800 mb-4">{title}</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.slice(0, 3).map((item) => (
          <Card 
            key={item._id} 
            className="h-full transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
          >
            {item[imageField] && (
              <CardMedia
                component="img"
                height="240"
                image={getImageUrl(item[imageField])}
                alt={item[nameField]}
                className="h-60 object-cover"
              />
            )}
            <CardContent className="p-6">
              <Typography variant="h5" component="div" className="font-bold text-gray-800 mb-2">
                {item[nameField]}
              </Typography>
              {item[locationField] && (
                <Typography variant="body1" color="text.secondary" className="flex items-center">
                  <LocationOn className="text-blue-600 mr-1" />
                  {item[locationField]}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to={route}
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default SectionPreview; 