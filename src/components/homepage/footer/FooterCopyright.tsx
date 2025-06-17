
import React from 'react';

export const FooterCopyright: React.FC = () => {
  return (
    <div className="border-t border-gray-700 mt-8 pt-6 text-center">
      <p className="text-sm text-gray-400 mb-2">
        © 2025 GETIT Corporation. All Rights Reserved. | Trusted by millions across Southeast Asia and Latin America
      </p>
      <div className="flex flex-wrap justify-center gap-2 text-xs text-blue-300 mb-3">
        <span>🇸🇬 Singapore</span>
        <span>•</span>
        <span>🇮🇩 Indonesia</span>
        <span>•</span>
        <span>🇹🇭 Thailand</span>
        <span>•</span>
        <span>🇲🇾 Malaysia</span>
        <span>•</span>
        <span>🇻🇳 Vietnam</span>
        <span>•</span>
        <span>🇵🇭 Philippines</span>
        <span>•</span>
        <span>🇧🇷 Brazil</span>
        <span>•</span>
        <span>🇲🇽 México</span>
        <span>•</span>
        <span>🇨🇴 Colombia</span>
      </div>
      <p className="text-xs text-gray-500">
        Business Registration: GETIT PTE LTD (UEN: 201812345G) | GST Reg: M2-0012345-6 | 
        Operating License: E-Commerce License #EC2018-SG-001
      </p>
    </div>
  );
};
