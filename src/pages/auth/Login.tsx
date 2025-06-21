
import React, { useState } from 'react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { WelcomeSection } from '@/components/auth/WelcomeSection';
import { SecurityFeatures } from '@/components/auth/SecurityFeatures';
import { LoginPageHeader } from '@/components/auth/LoginPageHeader';
import { LoginCard } from '@/components/auth/LoginCard';
import { LoginPageFooter } from '@/components/auth/LoginPageFooter';
import { useLoginHandlers } from '@/hooks/useLoginHandlers';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'phone-otp'>('email');

  const {
    loginAttempts,
    isAccountLocked,
    suspiciousActivityDetected,
    loading,
    error,
    showOTPVerification,
    handleSubmit,
    handleSendOTP,
    handleVerifyOTP,
    handleResendOTP,
    handleSocialLogin,
  } = useLoginHandlers();

  const onSubmit = (e: React.FormEvent) => handleSubmit(e, loginMethod, email, phone, password);
  const onSendOTP = () => handleSendOTP(phone);
  const onVerifyOTP = (otp: string) => handleVerifyOTP(otp, phone);
  const onResendOTP = () => handleResendOTP(phone);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Welcome Section */}
            <WelcomeSection />

            {/* Main Login Section */}
            <div className="lg:col-span-1 w-full max-w-md mx-auto">
              <LoginPageHeader />

              <LoginCard
                loginAttempts={loginAttempts}
                suspiciousActivityDetected={suspiciousActivityDetected}
                showOTPVerification={showOTPVerification}
                loading={loading}
                error={error}
                loginMethod={loginMethod}
                setLoginMethod={setLoginMethod}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                enableTwoFactor={enableTwoFactor}
                setEnableTwoFactor={setEnableTwoFactor}
                onSubmit={onSubmit}
                onSendOTP={onSendOTP}
                onVerifyOTP={onVerifyOTP}
                onResendOTP={onResendOTP}
                onSocialLogin={handleSocialLogin}
                isAccountLocked={isAccountLocked}
              />

              <LoginPageFooter showOTPVerification={showOTPVerification} />
            </div>

            {/* Security Features Panel - Desktop Only */}
            <div className="hidden lg:block">
              <SecurityFeatures />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
