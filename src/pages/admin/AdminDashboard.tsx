import React, { useState } from 'react';
import { AdminLayoutWrapper } from '@/components/admin/dashboard/AdminLayoutWrapper';
import { DashboardContent } from '@/components/admin/dashboard/DashboardContent';

const AdminDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <DashboardContent selectedSubmenu={selectedSubmenu} />
  );
};

export default AdminDashboard;