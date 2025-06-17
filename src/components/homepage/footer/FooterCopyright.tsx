
import React from 'react';

export const FooterCopyright: React.FC = () => {
  return (
    <div className="border-t border-gray-700 mt-8 pt-6 text-center">
      <p className="text-sm text-gray-400 mb-2">
        © 2025 GETIT Limited. All Rights Reserved. | Best ecommerce platform in Bangladesh
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-blue-300 mb-3">
        <span>🇧🇩 Serving all 64 districts of Bangladesh</span>
        <span>•</span>
        <span>Dhaka • Chittagong • Sylhet • Rajshahi • Khulna • Barisal • Rangpur • Mymensingh</span>
      </div>
      <p className="text-xs text-gray-500">
        Business Registration: GETIT Limited (Company No: C-123456/2018) | 
        Trade License: TRAD/DSCC/123456/2018 | 
        E-Commerce License: 123456789
      </p>
    </div>
  );
};
