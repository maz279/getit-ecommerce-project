
import React from 'react';
import { Lock, Shield, CheckCircle } from 'lucide-react';

export const Security: React.FC = () => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Security & Compliance</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-blue-50 p-8 rounded-lg">
          <Lock className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Data Protection</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <span>End-to-end encryption for all sensitive data</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <span>GDPR compliance for international users</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <span>Bangladesh-specific data protection compliance</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <span>Regular security audits and penetration testing</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 p-8 rounded-lg">
          <Shield className="w-12 h-12 text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Financial Security</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <span>PCI DSS compliance for payment processing</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <span>Advanced fraud detection using machine learning</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <span>Secure API communication with tokenization</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <span>Regular financial audits and compliance monitoring</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
