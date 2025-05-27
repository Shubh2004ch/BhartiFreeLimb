# Bharti - Prosthetic Centers Management System

A web application for managing and displaying prosthetic centers across India, helping people find and access prosthetic limb services.

## Features

- List of prosthetic centers with detailed information
- Center features and ratings
- Image gallery for each center
- Beneficiary success stories
- Responsive design using Tailwind CSS
- Admin interface for managing centers

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB
- Multer for file uploads

## Project Structure

```
bharti/
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main React component
│   └── package.json      # Frontend dependencies
└── backend/
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   ├── middleware/   # Custom middleware
    │   └── uploads/      # Uploaded files
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
```

## API Endpoints

- `GET /api/centers` - Get all prosthetic centers
- `POST /api/centers` - Create a new center
- `GET /api/centers/:id` - Get a specific center
- `PUT /api/centers/:id` - Update a center
- `DELETE /api/centers/:id` - Delete a center

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 