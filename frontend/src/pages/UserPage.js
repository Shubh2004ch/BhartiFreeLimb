import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  LocationOn,
  Phone,
  Star,
  PlayCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS, getImageUrl, CONTACT_PHONE, CONTACT_ADDRESS } from '../constants';
import SectionPreview from '../components/sections/SectionPreview';
import SuccessStoriesSection from '../components/sections/SuccessStoriesSection';
import ShelterSection from '../components/sections/ShelterSection';

function UserPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const storiesRef = useRef(null);
  const mediaRef = useRef(null);

  const [media, setMedia] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [centers, setCenters] = useState([]);
  const [foodStalls, setFoodStalls] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [sleepingBags, setSleepingBags] = useState([]);
  const [waterPonds, setWaterPonds] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
      try {
        setLoading(true);

      const [
        mediaRes,
        reviewsRes,
        centersRes,
        foodStallsRes,
        clinicsRes,
        sleepingBagsRes,
        waterPondsRes,
        sheltersRes
      ] = await Promise.all([
        axios.get(ENDPOINTS.MEDIA).catch(() => ({ data: [] })),
        axios.get(ENDPOINTS.REVIEWS).catch(() => ({ data: [] })),
        axios.get(ENDPOINTS.CENTERS).catch(() => ({ data: [] })),
        axios.get(ENDPOINTS.FOOD_STALLS).catch(() => ({ data: [] })),
        axios.get(ENDPOINTS.CLINICS).catch(() => ({ data: [] })),
        axios.get(ENDPOINTS.SLEEPING_BAGS).catch(() => ({ data: [] })),
        axios.get(ENDPOINTS.WATER_PONDS).catch(() => ({ data: [] })),
        axios.get(ENDPOINTS.SHELTERS).catch(() => ({ data: [] }))
      ]);

      setMedia(Array.isArray(mediaRes.data) ? mediaRes.data : []);
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      setCenters(Array.isArray(centersRes.data) ? centersRes.data : []);
      setFoodStalls(Array.isArray(foodStallsRes.data) ? foodStallsRes.data : []);
      setClinics(Array.isArray(clinicsRes.data) ? clinicsRes.data : []);
      setSleepingBags(Array.isArray(sleepingBagsRes.data) ? sleepingBagsRes.data : []);
      setWaterPonds(Array.isArray(waterPondsRes.data) ? waterPondsRes.data : []);
      setShelters(Array.isArray(sheltersRes.data) ? sheltersRes.data : []);
        setError(null);
    } catch (error) {
        setError('Failed to load data. Please try again later.');
      setMedia([]); setReviews([]); setCenters([]); setFoodStalls([]);
      setClinics([]); setSleepingBags([]); setWaterPonds([]); setShelters([]);
      } finally {
        setLoading(false);
      }
    };

  // Auto-scroll media
  useEffect(() => {
    if (media.length > 0) {
      const interval = setInterval(() => {
        setCurrentMediaIndex((prevIndex) =>
          prevIndex === media.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [media]);

  // Scroll to current media
  useEffect(() => {
    if (mediaRef.current && media.length > 0) {
      mediaRef.current.scrollTo({
        left: currentMediaIndex * mediaRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [currentMediaIndex, media]);

  const scrollMedia = (direction) => {
    if (media.length === 0) return;
    if (direction === 'left') {
      setCurrentMediaIndex(prev =>
        prev === 0 ? media.length - 1 : prev - 1
      );
    } else {
      setCurrentMediaIndex(prev =>
        prev === media.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 font-sans">
      {/* GLASS NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-lg shadow-lg z-50 border-b border-blue-100">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-gradient bg-gradient-to-r from-red-700 via-pink-500 to-blue-700 bg-clip-text text-transparent">BhartiFreeLimbs</span>
            <span className="font-semibold text-blue-700">.Com</span>
          </h1>
          <div className="hidden md:flex space-x-8 ml-auto">
            <button className="relative text-blue-900 font-semibold group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button className="relative text-blue-900 font-semibold group">
              Centers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button className="relative text-blue-900 font-semibold group">
              Success Stories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button className="relative text-blue-900 font-semibold group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={handleLogin}
              className="bg-gradient-to-r from-pink-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <section className="relative pt-20 pb-8 min-h-[45vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700/60 to-pink-300/30 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.12),rgba(0,0,0,0))]" />
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-3 animate-fade-in-up">
            Empowering <span className="text-pink-300">Lives</span> with <br className="hidden md:inline" /> <span className="text-blue-200">Comprehensive Care</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 mb-4 max-w-3xl mx-auto font-medium animate-fade-in-up delay-100">
            From prosthetic limbs and medical care to food, shelter, and wildlife support - we provide holistic assistance to those in need. Join us in creating a world of hope and independence.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Media Carousel Section */}
        {media.length > 0 && (
          <div className="mb-12 relative">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-black text-blue-800 mb-2 tracking-tight">Our Work in Action</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Capturing the moments and milestones that change lives forever.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden ring-2 ring-blue-100 shadow-xl">
            <div
              ref={mediaRef}
                className="flex overflow-x-hidden snap-mandatory snap-x"
                style={{ height: '440px' }}
            >
              {media.map((item, index) => (
                <div
                  key={item._id}
                    className="w-full flex-shrink-0 snap-start relative group"
                >
                  {item.type === 'image' ? (
                    <img
                        src={getImageUrl(item.path)}
                      alt={item.title}
                        className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video
                          src={getImageUrl(item.path)}
                        className="w-full h-full object-cover"
                        controls
                        autoPlay={index === currentMediaIndex}
                        muted
                        loop
                      />
                        <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-7xl opacity-70 group-hover:opacity-100 transition-all" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-10 py-8">
                      <h3 className="text-white text-2xl font-bold mb-2 drop-shadow">{item.title}</h3>
                      <p className="text-blue-100">{item.description}</p>
                    </div>
                  </div>
                ))}
                </div>

              <button
                onClick={() => scrollMedia('left')}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-blue-100 transition-all rounded-full shadow-xl z-10"
              >
                <ArrowBackIosNew className="text-blue-600" />
              </button>
              <button
                onClick={() => scrollMedia('right')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-blue-100 transition-all rounded-full shadow-xl z-10"
              >
                <ArrowForwardIos className="text-blue-600" />
              </button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-7 space-x-3">
              {media.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`w-5 h-5 rounded-full transition-all ring-2 ring-blue-100 ${
                    index === currentMediaIndex ? 'bg-blue-600 scale-110 shadow-md' : 'bg-gray-300 hover:bg-blue-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Shelter Section */}
        <section className="mb-12">
          <ShelterSection />
        </section>

        {/* Section Previews */}
        <div className="space-y-10">
          <SectionPreview
            title="🏥 Free Limb Centers"
            description="Find the nearest prosthetic center for your needs"
            items={centers}
            route="/prosthetic-centers"
          />

          <SectionPreview
            title="🍛 Free Food Stalls"
            description="Discover food stalls near prosthetic centers"
            items={foodStalls}
            route="/food-stalls"
          />

          <SectionPreview
            title="🦜 Free Clinics & Shelters For Injured Wildlife"
            description="Access medical care and support services"
            items={clinics}
            route="/medical-clinics"
          />

          <SectionPreview
            title="🛏️ Sleeping Bags"
            description="Find comfortable accommodation options"
            items={sleepingBags}
            route="/sleeping-bags"
          />

          <SectionPreview
            title="💧 Water Ponds For Wildlife"
            description="Locate water ponds for wildlife"
            items={waterPonds}
            route="/water-ponds"
          />
        </div>

        <SuccessStoriesSection />
      </div>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-black mb-4 text-slate-100">BhartiFreeLimbs.Com</h3>
              <p className="text-slate-300">
                Empowering lives through free prosthetic limbs, medical care, food support, shelter, and wildlife assistance. We provide comprehensive care and support services to create a world of hope and independence for all.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-slate-100">Contact Us</h4>
              <div className="space-y-2">
                <p className="flex items-center text-slate-300">
                  <Phone className="mr-2" />
                  {CONTACT_PHONE}
                </p>
                <p className="flex items-center text-slate-300">
                  <LocationOn className="mr-2" />
                  {CONTACT_ADDRESS}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 text-slate-100">Quick Links</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/prosthetic-centers')}
                  className="block text-slate-300 hover:text-blue-300 transition-colors"
                >
                  Prosthetic Centers
                </button>
                <button 
                  onClick={() => navigate('/food-stalls')}
                  className="block text-slate-300 hover:text-blue-300 transition-colors"
                >
                  Food Stalls
                </button>
                <button 
                  onClick={() => navigate('/medical-clinics')}
                  className="block text-slate-300 hover:text-blue-300 transition-colors"
                >
                  Medical Clinics
                </button>
                <button 
                  onClick={() => navigate('/sleeping-bags')}
                  className="block text-slate-300 hover:text-blue-300 transition-colors"
                >
                  Sleeping Bags
                </button>
              <button
                  onClick={() => navigate('/water-ponds')}
                  className="block text-slate-300 hover:text-blue-300 transition-colors"
              >
                  Water Ponds
              </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p className="mb-3">&copy; {new Date().getFullYear()} BhartiFreeLimbs.Com. All rights reserved.</p>
            <button 
              onClick={handleLogin}
              className="text-slate-300 hover:text-blue-300 transition-colors underline"
            >
              Admin Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UserPage;