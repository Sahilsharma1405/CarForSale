import React from 'react';
import { Link, useNavigate ,NavLink} from 'react-router-dom';
import './Navbar.css';

const Navbar = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    props.onLogout();
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          CarForSale
        </Link>
        <div className="nav-links">
          {props.isLoggedIn && props.isStaff && (
            <div className="nav-dropdown">
              <button className="nav-link admin-btn">Admin</button>
              <div className="dropdown-content">
                <Link to="/admin/dashboard">Pending Approvals</Link>
                <Link to="/admin/register-staff">Register Staff</Link>
              </div>
            </div>
          )}
          {props.isLoggedIn ? (
            // --- Logged-In User Links ---
            <>
              <NavLink to="/buy" className="nav-link">Buy Car</NavLink>
              <NavLink to="/my-cars" className="nav-link">My Cars</NavLink>
              <NavLink to="/about" className="nav-link">About Us</NavLink>
              <NavLink to="/contact" className="nav-link">Contact</NavLink>
              {/* <Link to="/sell" className="nav-link sell-car-btn">Sell Car</Link> */}
              <div className="nav-dropdown">
                <button className="nav-link sell-car-btn">Services</button>
                <div className="dropdown-content">
                  <NavLink to="/sell">Sell Your Car</NavLink>
                  <NavLink to="/predict-price">Predict Car Price</NavLink>
                </div>
              </div>
              <button onClick={handleLogout} className="nav-link">Logout</button>
            </>
          ) : (
            // --- Logged-Out User Links ---
            <>
              <NavLink to="/buy" className="nav-link">Buy Car</NavLink>
              <NavLink to="/about" className="nav-link">About Us</NavLink>
              <NavLink to="/contact" className="nav-link">Contact</NavLink>
              <NavLink to="/login" className="nav-link">Login</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;