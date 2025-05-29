import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminPage from './pages/AdminPage';
import ProstheticCentersPage from './pages/ProstheticCentersPage';
import CenterDetailsPage from './pages/CenterDetailsPage';
import FoodStallsPage from './pages/FoodStallsPage';
import MedicalClinicsPage from './pages/MedicalClinicsPage';
import SleepingBagsPage from './pages/SleepingBagsPage';
import WaterPondsPage from './pages/WaterPondsPage';
import ShelterPage from './pages/ShelterPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import { ProstheticCentersSection } from './components/sections/ProstheticCentersSection';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<AdminPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/prosthetic-centers" element={<ProstheticCentersPage />} />
      <Route path="/prosthetic-centers/:id" element={<CenterDetailsPage />} />
      <Route path="/food-stalls" element={<FoodStallsPage />} />
      <Route path="/medical-clinics" element={<MedicalClinicsPage />} />
      <Route path="/sleeping-bags" element={<SleepingBagsPage />} />
      <Route path="/water-ponds" element={<WaterPondsPage />} />
      <Route path="/shelters" element={<ShelterPage />} />
      <Route path="/success-stories" element={<SuccessStoriesPage />} />
    
    </Routes>
  );
}

export default App;