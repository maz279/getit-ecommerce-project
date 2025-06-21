
import React from 'react';
import { Shield, Globe, Lock } from 'lucide-react';

export const TrustIndicators: React.FC = () => {
  return (
    <div className="pt-6 border-t border-gray-200">
      <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          <span>GDPR Compliant</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          <span>Data Protected</span>
        </div>
      </div>
    </div>
  );
};
