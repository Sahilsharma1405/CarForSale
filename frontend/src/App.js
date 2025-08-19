import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BuyCars from './pages/BuyCars';
import SellCar from './pages/SellCar';
import MyCar from './pages/MyCar';
import About from './pages/About';
import Contact from './pages/Contact';
import CarDetail from './pages/CarDetail';
import './index.css';
import Footer from './components/Footer';
import EditCar from './pages/EditCar';
import PredictPrice from './pages/PredictPrice';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // This runs once when the app loads to check if the user is already logged in.
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // This function is passed to the Login page.
  const handleLoginSuccess = (tokens) => {
    // 1. Save tokens to localStorage to "remember" the user.
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    // 2. Update the state to change the UI.
    setIsLoggedIn(true);
  };

  // This function is passed to the Navbar.
  const handleLogout = () => {
    // 1. Remove tokens from localStorage.
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // 2. Update the state to change the UI.
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main style={{ flex: 1, padding: '1rem 2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buy" element={<BuyCars />} />
            <Route path="/sell" element={<SellCar />} />
            <Route path="/my-cars" element={<MyCar />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/car/:carId/edit" element={<EditCar/>} />
            {/* Add the new route for the car detail page */}
            <Route path="/car/:carId" element={<CarDetail />} />
            <Route path="/predict-price" element={<PredictPrice/>} />
          </Routes>
        </main>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;