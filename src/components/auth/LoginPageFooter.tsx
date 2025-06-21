
import React from 'react';
import { Link } from 'react-router-dom';

interface LoginPageFooterProps {
  showOTPVerification: boolean;
}

export const LoginPageFooter: React.FC<LoginPageFooterProps> = ({ showOTPVerification }) => {
  if (showOTPVerification) return null;

  return (
    <div className="mt-6 text-center text-xs text-gray-500">
      <p>
        By signing in, you agree to our{' '}
        <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
      </p>
    </div>
  );
};
