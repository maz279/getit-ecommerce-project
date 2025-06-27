
import React, { useState } from 'react';
import { useAdminRouteHandler } from '@/components/admin/dashboard/AdminRouteHandler';
import { AdminLayoutWrapper } from '@/components/admin/dashboard/AdminLayoutWrapper';

const AdminDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const {
    selectedMenu,
    selectedSubmenu,
    handleMenuChange,
    handleSubmenuChange
  } = useAdminRouteHandler();

  // Mock user profile data
  const userProfile = {
    name: 'Admin User',
    email: 'admin@getit.com',
    role: 'System Administrator',
    avatar: null
  };

  return (
    <AdminLayoutWrapper
      selectedMenu={selectedMenu}
      selectedSubmenu={selectedSubmenu}
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      onMenuChange={handleMenuChange}
      userProfile={userProfile}
    />
  );
};

export default AdminDashboard;
