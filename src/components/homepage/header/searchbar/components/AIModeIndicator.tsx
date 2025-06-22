
import React from 'react';

interface AIModeIndicatorProps {
  isAIMode: boolean;
}

export const AIModeIndicator: React.FC<AIModeIndicatorProps> = ({ isAIMode }) => {
  if (!isAIMode) return null;

  return (
    <div className="hidden md:block absolute top-full right-0 mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs">
      AI Enhanced
    </div>
  );
};
