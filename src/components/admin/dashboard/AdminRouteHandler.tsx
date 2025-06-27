
import { useState, useCallback } from 'react';
import { getDefaultSubmenu, handleSpecialCases, handleSubmenuRouting, handleCompoundMenus } from './menuHandlers';

interface UseAdminRouteHandlerReturn {
  selectedMenu: string;
  selectedSubmenu: string;
  handleMenuChange: (menu: string) => void;
  handleSubmenuChange: (submenu: string) => void;
}

export const useAdminRouteHandler = (): UseAdminRouteHandlerReturn => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubmenu, setSelectedSubmenu] = useState('overview');

  const setDefaultSubmenu = useCallback((menu: string) => {
    const defaultSubmenu = getDefaultSubmenu(menu);
    setSelectedSubmenu(defaultSubmenu);
  }, []);

  const handleMenuChange = useCallback((menu: string) => {
    console.log('🎯 AdminRouteHandler handleMenuChange called with:', menu);
    
    // Handle special cases first
    const specialCase = handleSpecialCases(menu);
    if (specialCase) {
      setSelectedMenu(specialCase.selectedMenu);
      setSelectedSubmenu(specialCase.selectedSubmenu);
      return;
    }
    
    // Check if this is a submenu from various management sections
    const submenuRouting = handleSubmenuRouting(menu);
    if (submenuRouting) {
      setSelectedMenu(submenuRouting.selectedMenu);
      setSelectedSubmenu(submenuRouting.selectedSubmenu);
      return;
    }
    
    // Handle compound menu items
    const compoundMenu = handleCompoundMenus(menu);
    if (compoundMenu) {
      setSelectedMenu(compoundMenu.selectedMenu);
      setSelectedSubmenu(compoundMenu.selectedSubmenu);
      return;
    }

    // Handle simple menu changes
    setSelectedMenu(menu);
    console.log('📝 Menu set to:', menu);
    
    // Set default submenu based on menu selection
    setDefaultSubmenu(menu);
  }, [setDefaultSubmenu]);

  const handleSubmenuChange = useCallback((submenu: string) => {
    console.log('🎯 AdminRouteHandler handleSubmenuChange called with:', submenu);
    setSelectedSubmenu(submenu);
  }, []);

  return {
    selectedMenu,
    selectedSubmenu,
    handleMenuChange,
    handleSubmenuChange
  };
};
