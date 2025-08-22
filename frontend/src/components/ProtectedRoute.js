import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  // Check for login token and staff status
  const token = localStorage.getItem('accessToken');
  const isStaff = localStorage.getItem('isStaff') === 'true';

  // Case 1: The user is not logged in at all
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Case 2: The route is for admins only, but the user is not staff
  if (adminOnly && !isStaff) {
    // Redirect them to the homepage because they aren't authorized
    return <Navigate to="/" />;
  }

  // If all checks pass, show the requested page
  return <Outlet />;
};

export default ProtectedRoute;