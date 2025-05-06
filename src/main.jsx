import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MoodProvider } from './context/MoodContext'
import { BrowserRouter } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';


const initializeApp = () => {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <MoodProvider>
          <App />
        </MoodProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};


const unsubscribe = onAuthStateChanged(auth, () => {
  unsubscribe();
  initializeApp();
});