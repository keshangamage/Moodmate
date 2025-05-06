import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
    console.log(`Dark mode is now ${!darkMode ? 'enabled' : 'disabled'}`);
  };

  return (
    <nav className="navbar">
      <h1>MoodMate</h1>
      <div>
        <Link to="/" className="text-white mx-2">Home</Link>
        <Link to="/checkin" className="text-white mx-2">Check-In</Link>
        <Link to="/results" className="text-white mx-2">Results</Link>
        <button onClick={toggleDarkMode} className="text-white mx-2">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;