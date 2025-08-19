import React, { useState } from 'react';
import './Form.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // 1. Import Link

const Login = (props) => {
  // ... your existing useState and handleSubmit logic remains the same ...

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        
        {/* Username and Password fields remain the same */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="form-button">Login</button>

        {/* 2. Add this new div for the signup link */}
        <div className="form-switch-link">
          Don't have an account? <Link to="/register">Sign up now</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;