import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';

const RoleRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.roles.includes('ROLE_CUSTOMER')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;