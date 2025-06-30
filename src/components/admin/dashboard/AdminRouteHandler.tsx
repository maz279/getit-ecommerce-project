
import { useState, useCallback } from 'react';

interface AdminRouteHandlerReturn {
  selectedMenu: string;
  selectedSubmenu: string;
  handleMenuChange: (menu: string) => void;
  handleSubmenuChange: (submenu: string) => void;
}

export const useAdminRouteHandler = (): AdminRouteHandlerReturn => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState('overview');

  const handleMenuChange = useCallback((menu: string) => {
    setSelectedMenu(menu);
    // Reset to default submenu when menu changes
    setSelectedSubmenu('overview');
  }, []);

  const handleSubmenuChange = useCallback((submenu: string) => {
    setSelectedSubmenu(submenu);
  }, []);

  return {
    selectedMenu,
    selectedSubmenu,
    handleMenuChange,
    handleSubmenuChange
  };
};
