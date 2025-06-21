
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const RegisterPageHeader: React.FC = () => {
  return (
    <div className="mb-6">
      <Link 
        to="/" 
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to GetIt
      </Link>
    </div>
  );
};
