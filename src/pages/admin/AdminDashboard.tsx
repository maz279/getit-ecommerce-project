
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ComprehensiveAdminSidebar } from '@/components/admin/ComprehensiveAdminSidebar';
import { AdminDashboardHeader } from '@/components/admin/AdminDashboardHeader';
import { AdminDashboardFooter } from '@/components/admin/AdminDashboardFooter';
import { ComprehensiveMainContent } from '@/components/admin/ComprehensiveMainContent';
import { seoService } from '@/services/seo/SEOService';

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col font-['Inter',sans-serif]">
      {/* Fixed Header - 70px height as specified */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[70px]">
        <AdminDashboardHeader 
          userProfile={userProfile}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Main Layout with Comprehensive Sidebar and Content */}
      <div className="flex flex-1 pt-[70px]">
        {/* Comprehensive Fixed Sidebar - 280px width (collapsible to 60px) */}
        <ComprehensiveAdminSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
        
        {/* Comprehensive Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
          <main className="flex-1 p-6" style={{ minHeight: 'calc(100vh - 70px)' }}>
            <div className="max-w-7xl mx-auto">
              <ComprehensiveMainContent activeTab={activeTab} />
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
