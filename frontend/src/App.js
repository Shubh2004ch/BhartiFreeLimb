import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProstheticCentersPage from './pages/ProstheticCentersPage';
import CenterDetailsPage from './pages/CenterDetailsPage';
import FoodStallsPage from './pages/FoodStallsPage';
import FoodStallsDetailsPage from './pages/DetailsPages/FoodStallsDetailsPage';
import MedicalClinicsPage from './pages/MedicalClinicsPage';
import MedicalClinicsDetailsPage from './pages/DetailsPages/MedicalClinicsDetailsPage';
import SleepingBagsPage from './pages/SleepingBagsPage';
import SleepingBagDetailsPage from './pages/DetailsPages/SleepingBagDetailsPage';
import WaterPondsPage from './pages/WaterPondsPage';
import WaterPondsDetailsPage from './pages/DetailsPages/WaterPondsDetailsPage';
import ShelterPage from './pages/ShelterPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import ShelterDetailsPage from './pages/DetailsPages/ShelterDetailsPage';

function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/prosthetic-centers" element={<ProstheticCentersPage />} />
        <Route path="/prosthetic-centers/:id" element={<CenterDetailsPage />} />
        <Route path="/food-stalls" element={<FoodStallsPage />} />
        <Route path="/food-stalls/:id" element={<FoodStallsDetailsPage />} />
        <Route path="/medical-clinics" element={<MedicalClinicsPage />} />
        <Route path="/medical-clinics/:id" element={<MedicalClinicsDetailsPage />} />
        <Route path="/sleeping-bags" element={<SleepingBagsPage />} />
        <Route path="/sleeping-bags/:id" element={<SleepingBagDetailsPage />} />
        <Route path="/water-ponds" element={<WaterPondsPage />} />
        <Route path="/water-ponds/:id" element={<WaterPondsDetailsPage />} />
        <Route path="/shelters" element={<ShelterPage />} />
        <Route path="/shelters/:id" element={<ShelterDetailsPage />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;