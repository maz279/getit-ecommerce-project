import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export type UserRole = 'admin' | 'vendor' | 'customer' | 'moderator' | 'user' | 'super_admin';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackComponent?: React.ReactNode;
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackComponent,
  redirectTo = '/unauthorized'
}) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};