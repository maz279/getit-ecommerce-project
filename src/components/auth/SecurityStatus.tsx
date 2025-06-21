
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface SecurityStatusProps {
  loginAttempts?: number;
  isAccountLocked?: boolean;
  sessionTimeRemaining?: number;
}

export const SecurityStatus: React.FC<SecurityStatusProps> = ({
  loginAttempts = 0,
  isAccountLocked = false,
  sessionTimeRemaining = 1800 // 30 minutes default
}) => {
  const [timeRemaining, setTimeRemaining] = useState(sessionTimeRemaining);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getAttemptsColor = () => {
    if (loginAttempts >= 4) return 'text-red-600';
    if (loginAttempts >= 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAttemptsIcon = () => {
    if (loginAttempts >= 4) return AlertTriangle;
    if (loginAttempts >= 2) return Shield;
    return CheckCircle;
  };

  if (isAccountLocked) {
    return (
      <Alert variant="destructive" className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-red-800">
          Account temporarily locked due to multiple failed attempts. Please try again in 15 minutes or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  const AttemptsIcon = getAttemptsIcon();

  return (
    <div className="space-y-3">
      {/* Login attempts indicator */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2">
          <AttemptsIcon className={`w-4 h-4 ${getAttemptsColor()}`} />
          <span className="text-sm text-gray-700">Login attempts:</span>
        </div>
        <span className={`text-sm font-medium ${getAttemptsColor()}`}>
          {loginAttempts}/5
        </span>
      </div>

      {/* Session timeout indicator */}
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-gray-700">Session timeout:</span>
        </div>
        <span className="text-sm font-medium text-blue-600">
          {formatTime(timeRemaining)}
        </span>
      </div>

      {/* Security reminder */}
      {loginAttempts >= 3 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Shield className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Security reminder: {5 - loginAttempts} attempt{5 - loginAttempts !== 1 ? 's' : ''} remaining before temporary lockout.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
