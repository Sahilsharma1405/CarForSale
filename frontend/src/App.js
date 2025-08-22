import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { axiosInstance } from "./api/axios";
import "./index.css";

// Import all your page components
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyCars from "./pages/BuyCars";
import SellCar from "./pages/SellCar";
import MyCar from "./pages/MyCar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CarDetail from "./pages/CarDetail";
import EditCar from "./pages/EditCar";
import PredictPrice from "./pages/PredictPrice";
import StaffRegister from "./pages/StaffRegister";
import AdminDashboard from "./pages/AdminDashboard";
// import AdminCarReview from './pages/AdminCarReview';

// This new component contains all your main logic
const AppLayout = () => {
  // const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const staffStatus = localStorage.getItem("isStaff") === "true";
    if (token) {
      setIsLoggedIn(true);
      setIsStaff(staffStatus);
    }
  }, []);

  const handleLoginSuccess = async (tokens) => {
    localStorage.setItem("accessToken", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    setIsLoggedIn(true);
    try {
      const response = await axiosInstance.get("/current-user/");
      localStorage.setItem("isStaff", response.data.is_staff);
      setIsStaff(response.data.is_staff);
    } catch (error) {
      console.error("Could not fetch user role", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsStaff(false);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {isLoggedIn && isStaff ? (
        <AdminNavbar onLogout={handleLogout} />
      ) : (
        <Navbar
          isLoggedIn={isLoggedIn}
          isStaff={isStaff}
          onLogout={handleLogout}
        />
      )}

      <main style={{ flex: 1, padding: "1rem 2rem" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<BuyCars />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/car/:carId" element={<CarDetail />} />
          <Route path="/predict-price" element={<PredictPrice />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />


          <Route element={<ProtectedRoute />}>
            <Route path="/sell" element={<SellCar />} />
            <Route path="/my-cars" element={<MyCar />} />
            <Route path="/car/:carId/edit" element={<EditCar />} />
          </Route>


          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/register-staff" element={<StaffRegister />} />
          </Route>
        </Routes>
      </main>
      {!isStaff && <Footer />}
    </div>
  );
};

// The main App component just sets up the Router
function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;