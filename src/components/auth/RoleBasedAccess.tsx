import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

interface RoleBasedAccessProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({
  allowedRoles,
  children,
  fallback,
  showError = true
}) => {
  const { user, userProfile, hasRole } = useAuth();

  // Not authenticated
  if (!user) {
    if (fallback) return <>{fallback}</>;
    
    if (showError) {
      return (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            You must be logged in to access this content.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  // Check role access
  if (!hasRole(allowedRoles)) {
    if (fallback) return <>{fallback}</>;
    
    if (showError) {
      return (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this content. Required roles: {allowedRoles.join(', ')}
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  return <>{children}</>;
};

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AdminOnly: React.FC<AdminOnlyProps> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={['admin', 'super_admin']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

interface VendorOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const VendorOnly: React.FC<VendorOnlyProps> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={['vendor']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

interface ModeratorOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ModeratorOnly: React.FC<ModeratorOnlyProps> = ({ children, fallback }) => (
  <RoleBasedAccess allowedRoles={['moderator', 'admin', 'super_admin']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

interface RoleIndicatorProps {
  className?: string;
}

export const RoleIndicator: React.FC<RoleIndicatorProps> = ({ className = '' }) => {
  const { userProfile } = useAuth();

  if (!userProfile?.role) return null;

  const roleColors = {
    super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-red-100 text-red-800 border-red-200',
    moderator: 'bg-blue-100 text-blue-800 border-blue-200',
    vendor: 'bg-green-100 text-green-800 border-green-200',
    customer: 'bg-gray-100 text-gray-800 border-gray-200',
    user: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const roleNames = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    moderator: 'Moderator',
    vendor: 'Vendor',
    customer: 'Customer',
    user: 'User',
  };

  const colorClass = roleColors[userProfile.role as keyof typeof roleColors] || roleColors.user;
  const roleName = roleNames[userProfile.role as keyof typeof roleNames] || userProfile.role;

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${colorClass} ${className}`}>
      <Shield className="h-3 w-3 mr-1" />
      {roleName}
    </span>
  );
};

interface UnauthorizedAccessProps {
  requiredRole?: string[];
  message?: string;
}

export const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  requiredRole = [],
  message
}) => {
  const defaultMessage = requiredRole.length > 0
    ? `Access denied. Required roles: ${requiredRole.join(', ')}`
    : 'You are not authorized to access this page.';

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <CardTitle className="text-red-600">Access Denied</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            {message || defaultMessage}
          </p>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact your administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};