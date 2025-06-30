
import React from 'react';
import { UserManagementRouter } from './forms/userManagement/UserManagementRouter';

interface UserManagementContentProps {
  selectedSubmenu: string;
}

export const UserManagementContent: React.FC<UserManagementContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 UserManagementContent - selectedSubmenu:', selectedSubmenu);
  
  return (
    <div className="p-6">
      <UserManagementRouter selectedSubmenu={selectedSubmenu} />
    </div>
  );
};
