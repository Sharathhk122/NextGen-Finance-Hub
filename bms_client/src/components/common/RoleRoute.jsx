// src/components/common/RoleRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from './Loading';

const RoleRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.roles.includes('ROLE_CUSTOMER')) {
    return <Navigate to="/dashboard" replace />;
  }

  // Default fallback
  return <Navigate to="/home" replace />;
};

export default RoleRoute;