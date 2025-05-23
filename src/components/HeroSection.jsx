import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const buttonStyles = "w-full sm:w-auto px-6 sm:px-8 py-3 rounded-full font-semibold transform transition";
  const iconStyles = "text-3xl sm:text-4xl mb-2 animated-emoji";

  return (
    <div className="hero relative px-4 sm:px-6">
      <div className="space-y-4 sm:space-y-6 relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Track Your Mood Journey with MoodMate
        </h1>
        <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
          Your personal companion for emotional well-being. Start your journey to better mental health today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
          <Link to="/checkin">
            <button className={`${buttonStyles} bg-bluegray text-white hover:bg-opacity-90`}>
              Start Check-In
            </button>
          </Link>
          <Link to="/results">
            <button className={`${buttonStyles} bg-indigo-700 text-white hover:bg-indigo-800`}>
              View Progress
            </button>
          </Link>
        </div>
        <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:space-x-8">
          {["🎯", "📈", "💡"].map((emoji, index) => (
            <div key={index} className="text-center">
              <div className={iconStyles}>{emoji}</div>
              <p className="opacity-90 text-sm sm:text-base">
                {index === 0 ? "Track Daily" : index === 1 ? "See Progress" : "Get Insights"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
