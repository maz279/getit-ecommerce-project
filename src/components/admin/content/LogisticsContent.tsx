
import React from 'react';

interface LogisticsContentProps {
  selectedSubmenu: string;
}

export const LogisticsContent: React.FC<LogisticsContentProps> = ({ selectedSubmenu }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Logistics & Shipping</h1>
      <p className="text-gray-600">Logistics content for {selectedSubmenu}</p>
    </div>
  );
};
