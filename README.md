# Bharti - Community Support Services Platform

A comprehensive web application for managing and displaying various community support services including prosthetic centers, food stalls, clinics, water points, shelters, and sleeping bag distribution centers across India.

## Features

- Multiple service categories:
  - Prosthetic centers
  - Food stalls
  - Medical clinics
  - Water points
  - Homeless shelters
  - Sleeping bag distribution points
- Detailed information for each service location
- Image management with AWS S3 integration
- Rating and review system
- Location-based search
- Responsive design with Material-UI
- Admin interface for managing all services

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB
- AWS S3 for image storage
- Multer for file upload handling

## Project Structure

```
bharti/
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── constants/    # Configuration constants
│   │   └── App.js        # Main React component
│   └── package.json      # Frontend dependencies
└── backend/
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   ├── middleware/   # Custom middleware
    │   └── config/       # Configuration files
    └── package.json      # Backend dependencies
```

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd bharti
```

2. Backend Setup
```bash
cd backend
npm install
# Create .env file with required environment variables
npm run dev
```

3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
```

## API Endpoints

### Prosthetic Centers
- `GET /api/centers` - Get all prosthetic centers
- `POST /api/centers` - Create a new center
- `GET /api/centers/:id` - Get a specific center
- `PUT /api/centers/:id` - Update a center
- `DELETE /api/centers/:id` - Delete a center

### Food Stalls
- `GET /api/foodstalls` - Get all food stalls
- `POST /api/foodstalls` - Create a new food stall
- `GET /api/foodstalls/:id` - Get a specific food stall
- `PUT /api/foodstalls/:id` - Update a food stall
- `DELETE /api/foodstalls/:id` - Delete a food stall

### Clinics
- `GET /api/clinics` - Get all clinics
- `POST /api/clinics` - Create a new clinic
- `GET /api/clinics/:id` - Get a specific clinic
- `PUT /api/clinics/:id` - Update a clinic
- `DELETE /api/clinics/:id` - Delete a clinic

### Shelters
- `GET /api/shelters` - Get all shelters
- `POST /api/shelters` - Create a new shelter
- `GET /api/shelters/:id` - Get a specific shelter
- `PUT /api/shelters/:id` - Update a shelter
- `DELETE /api/shelters/:id` - Delete a shelter

### Water Points
- `GET /api/waterponds` - Get all water points
- `POST /api/waterponds` - Create a new water point
- `GET /api/waterponds/:id` - Get a specific water point
- `PUT /api/waterponds/:id` - Update a water point
- `DELETE /api/waterponds/:id` - Delete a water point

### Reviews
- `POST /api/reviews` - Create a new review
- `GET /api/reviews/:serviceId` - Get reviews for a specific service
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

## Image Upload

The application uses AWS S3 for image storage. Images are uploaded directly to S3 when creating or updating service locations. The system:
- Supports multiple image uploads
- Stores full S3 URLs in the database
- Handles image deletion when services are removed
- Provides secure, scalable image storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 