
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileWelcome } from './MobileWelcome';
import { LoginTabsContent } from './LoginTabsContent';

interface LoginCardProps {
  loginAttempts: number;
  suspiciousActivityDetected: boolean;
  showOTPVerification: boolean;
  loading: boolean;
  error: string;
  loginMethod: 'email' | 'phone' | 'phone-otp';
  setLoginMethod: (method: 'email' | 'phone' | 'phone-otp') => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  enableTwoFactor: boolean;
  setEnableTwoFactor: (enable: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSendOTP: () => void;
  onVerifyOTP: (otp: string) => void;
  onResendOTP: () => void;
  onSocialLogin: (provider: string) => void;
  isAccountLocked: boolean;
}

export const LoginCard: React.FC<LoginCardProps> = (props) => {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <MobileWelcome />
        <CardTitle className="text-2xl font-bold text-gray-800">
          Sign In
        </CardTitle>
        <CardDescription className="text-base text-gray-600 mt-2">
          Continue your shopping journey with GetIt
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginTabsContent {...props} />
      </CardContent>
    </Card>
  );
};
