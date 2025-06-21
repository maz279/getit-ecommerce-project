
import React from 'react';
import { Link } from 'react-router-dom';

export const RegisterPageFooter: React.FC = () => {
  return (
    <div className="mt-6 text-center text-xs text-gray-500">
      <p>
        By creating an account, you agree to our{' '}
        <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
      </p>
    </div>
  );
};
