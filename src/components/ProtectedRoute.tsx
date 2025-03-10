import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { LoadingAnimation } from './PrePortfolio';

export function ProtectedRoute() {
  const { currentUser, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}