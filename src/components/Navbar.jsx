import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const menuRef = useRef(null);

  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
  
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleMobileAction = (action) => {
    setIsMenuOpen(false);
    if (typeof action === 'function') {
      action();
    }
  };

  const navLinkClass = (path) => `
    relative px-4 py-2 rounded-full transition-all duration-300
    ${isActiveRoute(path) 
      ? darkMode ? 'text-white bg-white bg-opacity-20' : 'text-indigo-700 bg-indigo-100' 
      : darkMode ? 'text-white hover:bg-white hover:bg-opacity-10' : 'text-indigo-700 hover:bg-indigo-50'}
  `;

  return (
    <>
      <nav className="navbar backdrop-blur-sm relative" ref={menuRef}>
        <Link to="/" className={`flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-indigo-700'}`}>
          <span className="text-2xl">🌟</span>
          <h1 className="text-2xl font-bold">MoodMate</h1>
        </Link>
        
        {/* Hamburger Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 ${darkMode ? 'text-white' : 'text-indigo-700'}`}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <Link to="/" className={navLinkClass('/')}>Home</Link>
          {user && (
            <>
              <Link to="/checkin" className={navLinkClass('/checkin')}>Check-In</Link>
              <Link to="/results" className={navLinkClass('/results')}>Results</Link>
            </>
          )}
          
          <button 
            onClick={user ? logout : login}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-white bg-opacity-10 text-white hover:bg-opacity-20' 
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            }`}
          >
            {user ? 'Sign Out' : 'Sign In'}
          </button>
          
          <button 
            onClick={toggleDarkMode}
            className={`ml-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 ${darkMode ? 'text-white' : 'text-indigo-700'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <span className="text-xl" role="img" aria-label="Light mode">🌞</span>
            ) : (
              <span className="text-xl" role="img" aria-label="Dark mode">🌙</span>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`mobile-menu fixed sm:absolute top-[var(--navbar-height)] inset-x-0 max-h-[calc(100vh-var(--navbar-height))] overflow-y-auto shadow-lg rounded-b-lg p-4 md:hidden space-y-2 z-50 transform transition-all duration-300 backdrop-blur-md ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
          style={{ '--navbar-height': '64px' }}
        >
          <Link 
            to="/" 
            onClick={() => handleMobileAction()}
            className={`block px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 ${
              darkMode ? 'text-white' : 'text-indigo-700'
            } ${isActiveRoute('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          {user && (
            <>
              <Link 
                to="/checkin" 
                onClick={() => handleMobileAction()}
                className={`block px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 ${
                  darkMode ? 'text-white' : 'text-indigo-700'
                } ${isActiveRoute('/checkin') ? 'active' : ''}`}
              >
                Check-In
              </Link>
              <Link 
                to="/results" 
                onClick={() => handleMobileAction()}
                className={`block px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 ${
                  darkMode ? 'text-white' : 'text-indigo-700'
                } ${isActiveRoute('/results') ? 'active' : ''}`}
              >
                Results
              </Link>
            </>
          )}
          <button 
            onClick={() => handleMobileAction(user ? logout : login)}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 ${darkMode ? 'text-white' : 'text-indigo-700'}`}
          >
            {user ? 'Sign Out' : 'Sign In'}
          </button>
          <button 
            onClick={() => handleMobileAction(toggleDarkMode)}
            className={`w-full text-left px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 ${darkMode ? 'text-white' : 'text-indigo-700'}`}
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </nav>
      
      
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-30 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
};

export default Navbar;