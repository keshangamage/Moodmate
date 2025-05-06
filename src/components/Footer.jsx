import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-4">
              <span className="text-xl sm:text-2xl mr-2">🌟</span>
              <h2 className="text-lg sm:text-xl font-bold">MoodMate</h2>
            </div>
            <p className="text-sm opacity-80 px-4 sm:px-0">
              Your daily companion for emotional well-being and mental health tracking.
            </p>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block hover:text-indigo-200 transition-colors">Home</Link>
              <Link to="/checkin" className="block hover:text-indigo-200 transition-colors">Daily Check-In</Link>
              <Link to="/results" className="block hover:text-indigo-200 transition-colors">Your Progress</Link>
            </div>
          </div>
          
          <div className="text-center sm:text-left col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <a href="https://www.who.int/mental_health" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="block hover:text-indigo-200 transition-colors">
                Mental Health Resources
              </a>
              <a href="https://www.mind.org.uk" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="block hover:text-indigo-200 transition-colors">
                Support Services
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white border-opacity-20 text-center">
          <p className="text-xs sm:text-sm opacity-80">
            © {new Date().getFullYear()} MoodMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;