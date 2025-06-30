import React, { useState, useEffect } from 'react';
import { Home, Users, ShoppingBag, Package, MessageSquare, BarChart, Settings, Shield, Activity, UserPlus, Store, Truck, TrendingUp, Lock, HelpCircle, AlertCircle, FileText, LayoutDashboard, CircleUserRound, ShoppingCart, Percent, Gift, BadgeCheck, ListChecks, ClipboardList, Coins, PiggyBank, Contact2, Mailbox, GanttChart, CalendarClock, Scale, Factory, Gem, HeartHandshake, LucideIcon } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavItem {
  title: string;
  icon: LucideIcon;
  submenu?: SubNavItem[];
}

interface SubNavItem {
  title: string;
  href: string;
}

interface ComprehensiveAdminSidebarProps {
  selectedSubmenu: string;
  onMenuItemClick: (menuTitle: string) => void;
  onSubmenuClick: (submenuHref: string) => void;
}

export const ComprehensiveAdminSidebar: React.FC<ComprehensiveAdminSidebarProps> = ({
  selectedSubmenu,
  onMenuItemClick,
  onSubmenuClick
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // On mount, check localStorage for theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Whenever isDarkMode changes, update localStorage and the document class
    if (isDarkMode) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navItems: NavItem[] = [
    { title: 'Dashboard', icon: LayoutDashboard, submenu: [{ title: 'Analytics Dashboard', href: '/admin/dashboard/analytics' }, { title: 'Sales Overview', href: '/admin/dashboard/sales' }] },
    { title: 'User Management', icon: CircleUserRound, submenu: [{ title: 'All Users', href: '/admin/user-management/all-users' }, { title: 'Add New User', href: '/admin/user-management/add-user' }, { title: 'User Groups', href: '/admin/user-management/user-groups' }] },
    { title: 'Customer Management', icon: Users, submenu: [
      { title: 'Customer Overview', href: '/admin/customer-management/customer-overview' },
      { title: 'All Customers', href: '/admin/customer-management/all-customers' },
      { title: 'Customer Segments', href: '/admin/customer-management/customer-segments' },
      { title: 'Customer Analytics', href: '/admin/customer-management/customer-analytics' },
      { title: 'Live Chat', href: '/admin/customer-management/live-chat' },
      { title: 'Customer Support', href: '/admin/customer-management/customer-support' },
      { title: 'Loyalty Analysis', href: '/admin/customer-management/loyalty-analysis' },
      { title: 'CLV Prediction', href: '/admin/customer-management/clv-prediction' }
    ]},
    { title: 'Product Management', icon: ShoppingCart, submenu: [{ title: 'All Products', href: '/admin/product-management/all-products' }, { title: 'Add New Product', href: '/admin/product-management/add-product' }, { title: 'Categories', href: '/admin/product-management/categories' }, { title: 'Inventory', href: '/admin/product-management/inventory' }] },
    { title: 'Order Management', icon: ShoppingBag, submenu: [{ title: 'All Orders', href: '/admin/order-management/all-orders' }, { title: 'Pending Orders', href: '/admin/order-management/pending-orders' }, { title: 'Completed Orders', href: '/admin/order-management/completed-orders' }, { title: 'Order Tracking', href: '/admin/order-management/order-tracking' }] },
    { title: 'Vendor Management', icon: Store, submenu: [{ title: 'All Vendors', href: '/admin/vendor-management/all-vendors' }, { title: 'Add New Vendor', href: '/admin/vendor-management/add-vendor' }, { title: 'Vendor Performance', href: '/admin/vendor-management/vendor-performance' }, { title: 'Vendor Contracts', href: '/admin/vendor-management/vendor-contracts' }] },
    { title: 'Sales Management', icon: TrendingUp, submenu: [
      { title: 'Sales Overview', href: '/admin/sales-management/sales-overview' },
      { title: 'Daily Sales', href: '/admin/sales-management/daily-sales' },
      { title: 'Monthly Trends', href: '/admin/sales-management/monthly-trends' },
      { title: 'Yearly Reports', href: '/admin/sales-management/yearly-reports' },
      { title: 'Sales Forecast', href: '/admin/sales-management/sales-forecast' },
      { title: 'Revenue Analytics', href: '/admin/sales-management/revenue-analytics' },
      { title: 'Revenue Dashboard', href: '/admin/sales-management/revenue-dashboard' },
      { title: 'Profit Margins', href: '/admin/sales-management/profit-margins' },
      { title: 'Cost Analysis', href: '/admin/sales-management/cost-analysis' },
      { title: 'ROI Tracking', href: '/admin/sales-management/roi-tracking' },
      { title: 'Sales Reports', href: '/admin/sales-management/sales-reports' },
      { title: 'Detailed Reports', href: '/admin/sales-management/detailed-reports' },
      { title: 'Comparative Analysis', href: '/admin/sales-management/comparative-analysis' },
      { title: 'Export Data', href: '/admin/sales-management/export-data' }
    ]},
    { title: 'Marketing Campaigns', icon: Gift, submenu: [{ title: 'All Campaigns', href: '/admin/marketing-campaigns/all-campaigns' }, { title: 'Create New Campaign', href: '/admin/marketing-campaigns/create-campaign' }, { title: 'Email Marketing', href: '/admin/marketing-campaigns/email-marketing' }, { title: 'SMS Marketing', href: '/admin/marketing-campaigns/sms-marketing' }] },
    { title: 'Inventory Management', icon: Package, submenu: [{ title: 'Stock Levels', href: '/admin/inventory-management/stock-levels' }, { title: 'Stock Adjustments', href: '/admin/inventory-management/stock-adjustments' }, { title: 'Warehouse Management', href: '/admin/inventory-management/warehouse-management' }, { title: 'Supplier Management', href: '/admin/inventory-management/supplier-management' }] },
    { title: 'Shipping & Logistics', icon: Truck, submenu: [{ title: 'Shipping Providers', href: '/admin/shipping-logistics/shipping-providers' }, { title: 'Delivery Tracking', href: '/admin/shipping-logistics/delivery-tracking' }, { title: 'Shipping Rates', href: '/admin/shipping-logistics/shipping-rates' }, { title: 'Returns Management', href: '/admin/shipping-logistics/returns-management' }] },
    { title: 'Financial Management', icon: Coins, submenu: [
      { title: 'Transactions', href: '/admin/financial-management/transactions' },
      { title: 'Invoicing', href: '/admin/financial-management/invoicing' },
      { title: 'Budgeting', href: '/admin/financial-management/budgeting' },
      { title: 'Reporting', href: '/admin/financial-management/reporting' },
      { title: 'Tax Management', href: '/admin/financial-management/tax-management' }
    ]},
    { title: 'Analytics & Reporting', icon: BarChart, submenu: [
      { title: 'Sales Analytics', href: '/admin/analytics-reporting/sales-analytics' },
      { title: 'Customer Analytics', href: '/admin/analytics-reporting/customer-analytics' },
      { title: 'Product Analytics', href: '/admin/analytics-reporting/product-analytics' },
      { title: 'Marketing Analytics', href: '/admin/analytics-reporting/marketing-analytics' },
      { title: 'Financial Reports', href: '/admin/analytics-reporting/financial-reports' },
      { title: 'Custom Reports', href: '/admin/analytics-reporting/custom-reports' },
      { title: 'Activity Reports', href: '/admin/analytics-reporting/activity-reports' }
    ]},
    { title: 'Content Management', icon: FileText, submenu: [{ title: 'Blog Posts', href: '/admin/content-management/blog-posts' }, { title: 'Pages', href: '/admin/content-management/pages' }, { title: 'Media Library', href: '/admin/content-management/media-library' }] },
    { title: 'Communications', icon: MessageSquare, submenu: [{ title: 'Email Campaigns', href: '/admin/communications/email-campaigns' }, { title: 'Live Chat', href: '/admin/communications/live-chat' }, { title: 'Notifications', href: '/admin/communications/notifications' }] },
    { title: 'Discounts & Promotions', icon: Percent, submenu: [{ title: 'Discount Codes', href: '/admin/discounts-promotions/discount-codes' }, { title: 'Promotions', href: '/admin/discounts-promotions/promotions' }, { title: 'Loyalty Programs', href: '/admin/discounts-promotions/loyalty-programs' }] },
    { title: 'Security', icon: Shield, submenu: [
      { title: 'Security Monitoring', href: '/admin/security/security-monitoring' },
      { title: 'Threat Detection', href: '/admin/security/threat-detection' },
      { title: 'Fraud Prevention', href: '/admin/security/fraud-prevention' },
      { title: 'Access Logs', href: '/admin/security/access-logs' },
      { title: 'Security Alerts', href: '/admin/security/security-alerts' },
      { title: 'Compliance', href: '/admin/security/compliance' },
      { title: 'Data Protection', href: '/admin/security/data-protection' },
      { title: 'Privacy Settings', href: '/admin/security/privacy-settings' },
      { title: 'Audit Trails', href: '/admin/security/audit-trails' },
      { title: 'Compliance Reports', href: '/admin/security/compliance-reports' }
    ]},
    { title: 'Activity Logs', icon: Activity, submenu: [
      { title: 'Recent Activities', href: '/admin/activity-logs/recent-activities' },
      { title: 'User Activities', href: '/admin/activity-logs/user-activities' },
      { title: 'System Logs', href: '/admin/activity-logs/system-logs' },
      { title: 'Log Analysis', href: '/admin/activity-logs/log-analysis' },
      { title: 'Activity Log Settings', href: '/admin/activity-logs/activity-log-settings' }
    ]},
    { title: 'Settings', icon: Settings, submenu: [{ title: 'General Settings', href: '/admin/settings/general' }, { title: 'User Roles', href: '/admin/settings/user-roles' }, { title: 'System Configuration', href: '/admin/settings/system' }] },
    { title: 'Help & Support', icon: HelpCircle, submenu: [{ title: 'Knowledge Base', href: '/admin/help-support/knowledge-base' }, { title: 'Contact Support', href: '/admin/help-support/contact-support' }, { title: 'FAQ', href: '/admin/help-support/faq' }] },
    { title: 'Error Reporting', icon: AlertCircle, submenu: [{ title: 'Error Logs', href: '/admin/error-reporting/error-logs' }, { title: 'Performance Monitoring', href: '/admin/error-reporting/performance-monitoring' }] },
  ];

  return (
    <>
      <style>
        {`
          .sidebar-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .sidebar-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .sidebar-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
        <div className="p-4 flex items-center justify-between">
          <span className="font-bold text-lg">Admin Panel</span>
          <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        </div>
        
        <div className="flex-1 overflow-y-auto sidebar-scrollbar">
          <nav className="mt-8">
            {navItems.map((item) => (
              <div key={item.title} className="mb-2">
                <button
                  onClick={() => onMenuItemClick(item.title)}
                  className="flex items-center justify-between w-full py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </div>
                  {item.submenu && <span>{'>'}</span>}
                </button>
                {item.submenu && (
                  <div className={`ml-4 mt-1 ${selectedSubmenu?.startsWith(item.title) ? 'block' : 'hidden'}`}>
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.title}
                        href={subItem.href}
                        onClick={(e) => {
                          e.preventDefault();
                          onSubmenuClick(subItem.href);
                        }}
                        className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm ${selectedSubmenu === subItem.href ? 'font-semibold' : ''}`}
                      >
                        {subItem.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
