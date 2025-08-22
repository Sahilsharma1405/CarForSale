import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
// 1. Import the main Navbar's CSS file
import './Navbar.css'; 

const AdminNavbar = (props) => {
  const navigate=useNavigate()
  
  const getNavLinkClass = ({ isActive }) => {
    return isActive ? 'nav-link active' : 'nav-link';
  };

  const handleLogout = () => {
    props.onLogout();
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">CarForSale Admin</Link>
        <div className="nav-links">
          <NavLink to="/admin/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
          <NavLink to="/my-cars" className={getNavLinkClass}>My Cars</NavLink>
          
          <div className="nav-dropdown">
            <button className="nav-link sell-car-btn">Services</button>
            <div className="dropdown-content">
              <Link to="/sell">Sell Car</Link>
              <Link to="/predict-price">Predict Price</Link>
            </div>
          </div>

          <NavLink to="/admin/register-staff" className={getNavLinkClass}>Register Staff</NavLink>
          <button onClick={handleLogout} className="nav-link">Logout</button>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;