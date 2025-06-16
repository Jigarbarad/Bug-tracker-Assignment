
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  // Redirect to login if not authenticated, otherwise to dashboard
  return <Navigate to={user ? "/" : "/login"} replace />;
};

export default Index;
