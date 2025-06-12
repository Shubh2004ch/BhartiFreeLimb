import React from 'react';
import PropTypes from 'prop-types';

const MainCard = ({ 
  image, 
  name, 
  address, 
  phone,
  email,
  description,
  features,
  className = '',
  onClick,
  imageClassName = '',
  nameClassName = '',
  addressClassName = '',
  phoneClassName = '',
  emailClassName = '',
  descriptionClassName = '',
  featuresClassName = ''
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      {/* Image Container - Only show if image exists */}
      {image && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={image}
            alt={name || 'Card image'}
            className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${imageClassName}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className="p-4">
        {/* Name - Only show if name exists */}
        {name && (
          <h3 className={`text-xl font-semibold text-gray-800 mb-2 ${nameClassName}`}>
            {name}
          </h3>
        )}

        {/* Address - Only show if address exists */}
        {address && (
          <div className="flex items-start mb-2">
            <svg 
              className="w-5 h-5 text-gray-500 mt-0.5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className={`text-gray-600 text-sm ${addressClassName}`}>
              {address}
            </p>
          </div>
        )}

        {/* Phone - Only show if phone exists */}
        {phone && (
          <div className="flex items-center mb-2">
            <svg 
              className="w-5 h-5 text-gray-500 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <a 
              href={`tel:${phone}`}
              className={`text-blue-600 hover:text-blue-800 text-sm ${phoneClassName}`}
            >
              {phone}
            </a>
          </div>
        )}

        {/* Email - Only show if email exists */}
        {email && (
          <div className="flex items-center mb-2">
            <svg 
              className="w-5 h-5 text-gray-500 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <a 
              href={`mailto:${email}`}
              className={`text-blue-600 hover:text-blue-800 text-sm ${emailClassName}`}
            >
              {email}
            </a>
          </div>
        )}

        {/* Description - Only show if description exists */}
        {description && (
          <p className={`text-gray-600 text-sm mb-2 ${descriptionClassName}`}>
            {description}
          </p>
        )}

        {/* Features - Only show if features exist */}
        {features && features.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-2 ${featuresClassName}`}>
            {features.map((feature, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

MainCard.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  address: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  description: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  onClick: PropTypes.func,
  imageClassName: PropTypes.string,
  nameClassName: PropTypes.string,
  addressClassName: PropTypes.string,
  phoneClassName: PropTypes.string,
  emailClassName: PropTypes.string,
  descriptionClassName: PropTypes.string,
  featuresClassName: PropTypes.string
};

export default MainCard; 