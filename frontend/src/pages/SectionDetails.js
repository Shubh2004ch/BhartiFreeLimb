import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS } from '../constants';

const SectionDetails = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let endpoint = '';
        
        // Map section parameter to appropriate endpoint
        switch (section) {
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
            navigate('/');
            return;
        }

        const response = await axios.get(endpoint);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [section, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-b-4 border-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl font-bold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">
          {section.replace(/-/g, ' ')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name || item.title} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.name || item.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {item.description}
                </p>
                {item.address && (
                  <p className="text-gray-500 text-sm">
                    📍 {item.address}
                  </p>
                )}
                {item.phone && (
                  <p className="text-gray-500 text-sm mt-2">
                    📞 {item.phone}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionDetails; 