
import React from 'react';
import { UserManagementRouter } from './forms/userManagement/UserManagementRouter';

interface UserManagementContentProps {
  selectedSubmenu: string;
}

export const UserManagementContent: React.FC<UserManagementContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 UserManagementContent - selectedSubmenu:', selectedSubmenu);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <UserManagementRouter selectedSubmenu={selectedSubmenu} />
    </div>
  );
};
