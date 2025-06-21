
import React from 'react';
import { Shield, Smartphone, AlertTriangle, Clock, Monitor, Lock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SecurityFeatures: React.FC = () => {
  const securityFeatures = [
    {
      icon: Shield,
      title: 'Multi-Factor Authentication (MFA)',
      description: 'Extra layer of security with SMS verification',
      status: 'active'
    },
    {
      icon: Smartphone,
      title: 'SMS OTP via trusted BD providers',
      description: 'Secure SMS delivery through SSL Wireless',
      status: 'active'
    },
    {
      icon: AlertTriangle,
      title: 'Rate limiting: 5 attempts per session',
      description: 'Protection against brute force attacks',
      status: 'active'
    },
    {
      icon: Lock,
      title: 'Account lockout protection',
      description: 'Temporary lockout after failed attempts',
      status: 'active'
    },
    {
      icon: Monitor,
      title: 'Suspicious activity detection',
      description: 'AI-powered threat monitoring',
      status: 'active'
    },
    {
      icon: Clock,
      title: 'Session timeout management',
      description: 'Automatic logout for inactive sessions',
      status: 'active'
    },
    {
      icon: Shield,
      title: 'Device recognition & alerts',
      description: 'Notifications for new device logins',
      status: 'active'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
          🛡️ Security Features
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {securityFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg border border-green-100">
              <div className="flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <IconComponent className="w-4 h-4 text-gray-600" />
                  <h4 className="font-medium text-gray-800 text-sm leading-tight">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
        
        {/* Bank-level security badge */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">🔒 Bank-Level Security</span>
          </div>
          <p className="text-blue-100 text-xs leading-relaxed">
            Your data is protected with enterprise-grade encryption and security protocols
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
