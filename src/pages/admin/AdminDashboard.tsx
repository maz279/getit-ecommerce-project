import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboardHeader } from '@/components/admin/AdminDashboardHeader';
import { AdminDashboardFooter } from '@/components/admin/AdminDashboardFooter';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminCharts } from '@/components/admin/AdminCharts';
import { AdminRecentActivity } from '@/components/admin/AdminRecentActivity';
import { AdminVendorManagement } from '@/components/admin/AdminVendorManagement';
import { AdminProductManagement } from '@/components/admin/AdminProductManagement';
import { AdminOrderManagement } from '@/components/admin/AdminOrderManagement';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminFinancials } from '@/components/admin/AdminFinancials';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminReports } from '@/components/admin/AdminReports';
import { AdminNotifications } from '@/components/admin/AdminNotifications';
import { seoService } from '@/services/seo/SEOService';

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // SEO optimization for admin dashboard
  useEffect(() => {
    const seoData = {
      title: 'Admin Dashboard | GetIt Bangladesh - Multi-Vendor E-commerce Platform Management',
      description: 'Comprehensive admin dashboard for GetIt Bangladesh. Manage vendors, products, orders, users, and analytics. Real-time insights, reporting, and platform administration tools.',
      keywords: 'admin dashboard, getit bangladesh, e-commerce management, vendor management, multi-vendor platform, bangladesh ecommerce, admin panel, business intelligence',
      canonical: 'https://getit-bangladesh.com/admin/dashboard',
      noindex: false,
      nofollow: false,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "GetIt Bangladesh Admin Dashboard",
        "description": "Administrative dashboard for managing GetIt Bangladesh multi-vendor e-commerce platform",
        "url": "https://getit-bangladesh.com/admin/dashboard",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "provider": {
          "@type": "Organization",
          "name": "GetIt Bangladesh",
          "url": "https://getit-bangladesh.com"
        },
        "featureList": [
          "Vendor Management",
          "Product Management", 
          "Order Management",
          "User Management",
          "Financial Reporting",
          "Analytics Dashboard",
          "System Administration"
        ]
      }
    };
    
    seoService.updateMetaTags(seoData);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Main Dashboard Content */}
            <div className="grid gap-6">
              <AdminStats />
              <AdminCharts />
              <AdminRecentActivity />
            </div>

            {/* Extended Dashboard Sections */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Real-time System Monitoring */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Real-time System Monitoring</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">99.97%</div>
                      <div className="text-sm text-green-700">System Uptime</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.3s</div>
                      <div className="text-sm text-blue-700">Avg Response Time</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">15,437</div>
                      <div className="text-sm text-purple-700">Active Users</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">87%</div>
                      <div className="text-sm text-orange-700">Server Load</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Status */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Gateway Status</h3>
                <div className="space-y-3">
                  {[
                    { name: 'bKash', status: 'Operational', transactions: '5,234' },
                    { name: 'Nagad', status: 'Operational', transactions: '3,456' },
                    { name: 'Rocket', status: 'Operational', transactions: '1,234' },
                    { name: 'SSL Commerz', status: 'Operational', transactions: '8,901' }
                  ].map((gateway, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{gateway.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{gateway.transactions} today</div>
                        <div className="text-xs text-green-600">{gateway.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Analytics */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Performance Analytics</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">৳15,67,890</div>
                  <div className="text-sm text-gray-600">Revenue Today</div>
                  <div className="text-xs text-green-600">+12.5% vs yesterday</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">8,234</div>
                  <div className="text-sm text-gray-600">Orders Today</div>
                  <div className="text-xs text-green-600">+8.3% vs yesterday</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">1,456</div>
                  <div className="text-sm text-gray-600">New Customers</div>
                  <div className="text-xs text-green-600">+15.2% vs yesterday</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">234</div>
                  <div className="text-sm text-gray-600">New Vendors</div>
                  <div className="text-xs text-green-600">+5.7% vs yesterday</div>
                </div>
              </div>
            </div>

            {/* Security & Compliance Dashboard */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Security Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>SSL Certificate</span>
                    <span className="text-green-600 font-medium">Valid (Expires: Dec 2025)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Security Scan</span>
                    <span className="text-green-600 font-medium">No Issues Found</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Failed Login Attempts</span>
                    <span className="text-yellow-600 font-medium">23 (Last 24h)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Backup</span>
                    <span className="text-green-600 font-medium">Completed (2 hours ago)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>PCI DSS Compliance</span>
                    <span className="text-green-600 font-medium">Compliant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>GDPR Compliance</span>
                    <span className="text-green-600 font-medium">Compliant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bangladesh Bank Guidelines</span>
                    <span className="text-green-600 font-medium">Compliant</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ISO 27001 Certification</span>
                    <span className="text-green-600 font-medium">Certified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Business Intelligence */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Business Intelligence Dashboard</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Top Performing Categories</h4>
                  <div className="space-y-2">
                    {[
                      { name: 'Electronics', sales: '৳45,67,890' },
                      { name: 'Fashion', sales: '৳34,56,789' },
                      { name: 'Home & Garden', sales: '৳23,45,678' }
                    ].map((cat, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm">{cat.name}</span>
                        <span className="text-sm font-medium">{cat.sales}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Regional Performance</h4>
                  <div className="space-y-2">
                    {[
                      { region: 'Dhaka', orders: '3,456' },
                      { region: 'Chittagong', orders: '2,123' },
                      { region: 'Sylhet', orders: '1,234' }
                    ].map((region, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm">{region.region}</span>
                        <span className="text-sm font-medium">{region.orders} orders</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Vendor Performance</h4>
                  <div className="space-y-2">
                    {[
                      { metric: 'Top Vendor Sales', value: '৳12,34,567' },
                      { metric: 'Avg Order Value', value: '৳1,890' },
                      { metric: 'Vendor Satisfaction', value: '4.8/5.0' }
                    ].map((metric, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm">{metric.metric}</span>
                        <span className="text-sm font-medium">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'vendors':
        return <AdminVendorManagement />;
      case 'products':
        return <AdminProductManagement />;
      case 'orders':
        return <AdminOrderManagement />;
      case 'users':
        return <AdminUserManagement />;
      case 'financials':
        return <AdminFinancials />;
      case 'reports':
        return <AdminReports />;
      case 'settings':
        return <AdminSettings />;
      case 'notifications':
        return <AdminNotifications />;
      default:
        return (
          <div className="space-y-6">
            <AdminStats />
            <AdminCharts />
            <AdminRecentActivity />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AdminDashboardHeader 
          userProfile={userProfile}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Main Layout with Sidebar and Content */}
      <div className="flex flex-1 pt-[120px]">
        {/* Fixed Sidebar */}
        <AdminSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
          
          {/* Footer positioned normally within the content flow */}
          <AdminDashboardFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
