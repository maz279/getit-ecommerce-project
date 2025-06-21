
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegistrationForm } from './RegistrationForm';
import { SocialRegistration } from './SocialRegistration';
import { PhoneRegistration } from './PhoneRegistration';
import { Mail, Phone, Users } from 'lucide-react';

interface RegistrationTabsProps {
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

export const RegistrationTabs: React.FC<RegistrationTabsProps> = (props) => {
  const [activeTab, setActiveTab] = useState('email');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline">Email</span>
        </TabsTrigger>
        <TabsTrigger value="phone" className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Phone</span>
        </TabsTrigger>
        <TabsTrigger value="social" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Social</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email" className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Create Account with Email</h3>
          <p className="text-sm text-gray-600">Enter your details to get started</p>
        </div>
        <RegistrationForm {...props} />
      </TabsContent>

      <TabsContent value="phone" className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Register with Phone Number</h3>
          <p className="text-sm text-gray-600">We'll send you a verification code</p>
        </div>
        <PhoneRegistration
          phone={props.formData.phone}
          setPhone={(phone) => props.setFormData({ ...props.formData, phone })}
          fullName={props.formData.fullName}
          setFullName={(fullName) => props.setFormData({ ...props.formData, fullName })}
          loading={props.loading}
          error={props.error}
          onPhoneRegister={props.onPhoneRegister}
          onVerifyOTP={props.onVerifyOTP}
          showOTPVerification={props.showOTPVerification}
        />
      </TabsContent>

      <TabsContent value="social" className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Quick Registration</h3>
          <p className="text-sm text-gray-600">Sign up with your social media account</p>
        </div>
        <SocialRegistration
          onSocialRegister={props.onSocialRegister}
          loading={props.loading}
          error={props.error}
        />
      </TabsContent>
    </Tabs>
  );
};
