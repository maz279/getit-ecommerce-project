
import React, { useState } from 'react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { RegisterPageHeader } from '@/components/auth/RegisterPageHeader';
import { RegisterCard } from '@/components/auth/RegisterCard';
import { RegisterPageFooter } from '@/components/auth/RegisterPageFooter';
import { RegisterWelcomeSection } from '@/components/auth/RegisterWelcomeSection';
import { RegistrationBenefits } from '@/components/auth/RegistrationBenefits';
import { useRegistrationHandlers } from '@/hooks/useRegistrationHandlers';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: 'customer' as 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    loading,
    error,
    showOTPVerification,
    handleEmailSubmit,
    handleSocialRegister,
    handlePhoneRegister,
    handleVerifyOTP,
  } = useRegistrationHandlers();

  const onSubmit = (e: React.FormEvent) => handleEmailSubmit(e, formData);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Welcome Section */}
            <RegisterWelcomeSection />

            {/* Main Registration Section */}
            <div className="lg:col-span-1 w-full max-w-md mx-auto">
              <RegisterPageHeader />

              <RegisterCard
                formData={formData}
                setFormData={setFormData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                loading={loading}
                error={error}
                onSubmit={onSubmit}
                onSocialRegister={handleSocialRegister}
                onPhoneRegister={handlePhoneRegister}
                onVerifyOTP={handleVerifyOTP}
                showOTPVerification={showOTPVerification}
              />

              <RegisterPageFooter />
            </div>

            {/* Benefits Panel - Desktop Only */}
            <div className="hidden lg:block">
              <RegistrationBenefits />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
