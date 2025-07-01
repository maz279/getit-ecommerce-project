
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth/login',
  fallback 
}) => {
  const { user, userProfile, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Redirect based on user role
    const roleRedirects = {
      admin: '/admin/dashboard',
      super_admin: '/admin/dashboard',
      vendor: '/vendor/dashboard',
      customer: '/user/dashboard',
      user: '/user/dashboard',
      moderator: '/admin/dashboard',
    };
    
    const defaultRedirect = roleRedirects[userProfile?.role as keyof typeof roleRedirects] || '/';
    return <Navigate to={defaultRedirect} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
