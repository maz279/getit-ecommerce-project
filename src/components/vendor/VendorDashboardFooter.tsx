import React from 'react';

export const VendorDashboardFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            © 2024 GetIt Vendor Portal. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-900">Help</a>
            <a href="#" className="hover:text-gray-900">Support</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};