
import React from 'react';
import { UserManagementForm } from './forms/UserManagementForm';

interface UserManagementContentProps {
  selectedSubmenu: string;
}

export const UserManagementContent: React.FC<UserManagementContentProps> = ({ selectedSubmenu }) => {
  console.log('UserManagementContent - selectedSubmenu:', selectedSubmenu);
  
  const getContent = () => {
    switch (selectedSubmenu) {
      case 'admin-users':
      case 'admin-list':
      case 'role-management':
      case 'permissions':
      case 'activity-logs':
      case 'user-analytics':
      case 'registration-trends':
      case 'activity-reports':
      case 'demographics':
      default:
        return <UserManagementForm />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {getContent()}
    </div>
  );
};
