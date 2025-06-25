
import React from 'react';
import { UserManagementForm } from './forms/UserManagementForm';
import { AdminListManagement } from '../dashboard/sections/AdminListManagement';

interface UserManagementContentProps {
  selectedSubmenu: string;
}

export const UserManagementContent: React.FC<UserManagementContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 UserManagementContent - selectedSubmenu:', selectedSubmenu);
  console.log('🔍 UserManagementContent - selectedSubmenu type:', typeof selectedSubmenu);
  
  const getContent = () => {
    console.log('🎯 UserManagementContent getContent switch - selectedSubmenu:', selectedSubmenu);
    
    switch (selectedSubmenu) {
      case 'admin-users':
        console.log('✅ Rendering AdminListManagement for admin-users');
        return <AdminListManagement />;
      case 'admin-list':
        console.log('✅ Rendering AdminListManagement for admin-list');
        return <AdminListManagement />;
      case 'role-management':
        console.log('✅ Rendering UserManagementForm for role-management');
        return <UserManagementForm />;
      case 'permissions':
        console.log('✅ Rendering UserManagementForm for permissions');
        return <UserManagementForm />;
      case 'activity-logs':
        console.log('✅ Rendering UserManagementForm for activity-logs');
        return <UserManagementForm />;
      case 'user-analytics':
        console.log('✅ Rendering UserManagementForm for user-analytics');
        return <UserManagementForm />;
      case 'registration-trends':
        console.log('✅ Rendering UserManagementForm for registration-trends');
        return <UserManagementForm />;
      case 'activity-reports':
        console.log('✅ Rendering UserManagementForm for activity-reports');
        return <UserManagementForm />;
      case 'demographics':
        console.log('✅ Rendering UserManagementForm for demographics');
        return <UserManagementForm />;
      default:
        console.log('⚠️ No matching submenu, defaulting to UserManagementForm');
        console.log('   selectedSubmenu was:', selectedSubmenu);
        return <UserManagementForm />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {getContent()}
    </div>
  );
};
