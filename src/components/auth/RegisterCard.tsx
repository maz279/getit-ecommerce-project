
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileWelcome } from './MobileWelcome';
import { RegistrationTabs } from './RegistrationTabs';

interface RegisterCardProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phone: string;
    role: 'customer';
  };
  setFormData: (data: any) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onSocialRegister: (provider: string) => void;
  onPhoneRegister: (phone: string) => void;
  onVerifyOTP: (otp: string) => void;
  showOTPVerification: boolean;
}

export const RegisterCard: React.FC<RegisterCardProps> = (props) => {
  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <MobileWelcome />
        <CardTitle className="text-2xl font-bold text-gray-800">
          Join GetIt
        </CardTitle>
        <CardDescription className="text-base text-gray-600 mt-2">
          Choose your preferred registration method
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegistrationTabs {...props} />
      </CardContent>
    </Card>
  );
};
