import React, { useState } from "react";
import "./Form.css"; // Reuse form styles
import { axiosInstance } from "../api/axios";
import { useNavigate } from "react-router-dom";

const StaffRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send the request to the new, secure endpoint
      await axiosInstance.post("/admin/register-staff/", {
        username,
        email,
        password,
      });
      alert("New staff member registered successfully!");
      navigate("/"); // Redirect to homepage or an admin dashboard
    } catch (error) {
      alert("Staff registration failed. You may not have admin permissions.");
      console.error("Staff registration failed:", error.response?.data);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Register New Staff Member</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="form-button">Register Staff</button>
      </form>
    </div>
  );
};

export default StaffRegister;