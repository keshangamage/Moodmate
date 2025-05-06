import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CheckIn from './pages/CheckIn'
import Results from './pages/Results'
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/results" element={<Results />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
