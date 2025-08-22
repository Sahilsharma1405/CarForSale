import React, { useState } from 'react';
import './Form.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password
      });
      props.onLoginSuccess(response.data);
      navigate('/');
    } catch (error) {
      alert('Login failed! Please check your username and password.');
      console.error('Login error', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Login</h2>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username"  value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"} 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="form-button">Login</button>

        <div className="form-switch-link">
          Don't have an account? <Link to="/register">Sign up now</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;