import React from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <HeroSection />
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to MoodMate</h1>
        <p className="mb-4">Track your mood and mental well-being over time.</p>
        <Link to="/checkin">
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Start Mood Check-In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
