import React, { useState } from 'react';
import { VendorLayoutWrapper } from '@/components/vendor/dashboard/VendorLayoutWrapper';
import { VendorDashboardContent } from '@/components/vendor/dashboard/VendorDashboardContent';

const VendorDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <VendorLayoutWrapper
      selectedMenu={selectedMenu}
      selectedSubmenu={selectedSubmenu}
      sidebarCollapsed={sidebarCollapsed}
      onMenuSelect={setSelectedMenu}
      onSubmenuSelect={setSelectedSubmenu}
      onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
    >
      <VendorDashboardContent selectedSubmenu={selectedSubmenu} />
    </VendorLayoutWrapper>
  );
};

export default VendorDashboard;