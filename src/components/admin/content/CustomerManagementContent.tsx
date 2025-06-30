
import React from 'react';
import { CustomerManagementRouter } from './forms/customerManagement/CustomerManagementRouter';

interface CustomerManagementContentProps {
  selectedSubmenu: string;
}

export const CustomerManagementContent: React.FC<CustomerManagementContentProps> = ({ selectedSubmenu }) => {
  console.log('🔍 CustomerManagementContent - selectedSubmenu:', selectedSubmenu);
  
  return (
    <div className="p-6">
      <CustomerManagementRouter selectedSubmenu={selectedSubmenu} />
    </div>
  );
};
