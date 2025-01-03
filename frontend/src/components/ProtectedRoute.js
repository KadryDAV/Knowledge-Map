import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If the user is not authenticated, take user to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, show the protected content
  return children;
};

export default ProtectedRoute;
