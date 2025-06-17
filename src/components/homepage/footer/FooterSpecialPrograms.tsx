
import React from 'react';

export const FooterSpecialPrograms: React.FC = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-green-300 mb-4">Special Programs</h4>
      <div className="space-y-2">
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">GETIT Prime</a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Student Discount</a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Senior Citizen Benefits</a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Corporate Accounts</a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Loyalty Program</a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Affiliate Program</a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Referral Rewards</a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors block">Bulk Purchase</a>
      </div>
    </div>
  );
};
