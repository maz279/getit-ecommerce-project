
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Lock, Shield } from 'lucide-react';
import { SocialLoginButtons } from './SocialLoginButtons';
import { LoginForm } from './LoginForm';
import { TrustIndicators } from './TrustIndicators';
import { SecurityStatus } from './SecurityStatus';
import { SecurityFeatures } from './SecurityFeatures';

interface LoginTabsContentProps {
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

export const LoginTabsContent: React.FC<LoginTabsContentProps> = ({
  loginAttempts,
  suspiciousActivityDetected,
  showOTPVerification,
  loading,
  error,
  loginMethod,
  setLoginMethod,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  enableTwoFactor,
  setEnableTwoFactor,
  onSubmit,
  onSendOTP,
  onVerifyOTP,
  onResendOTP,
  onSocialLogin,
  isAccountLocked,
}) => {
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login" className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Login
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="space-y-6">
        {/* Security Status - Compact */}
        {(loginAttempts > 0 || suspiciousActivityDetected) && (
          <div className="space-y-3">
            {/* Suspicious Activity Alert */}
            {suspiciousActivityDetected && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm">
                  Suspicious activity detected. Security alert sent to your email.
                </AlertDescription>
              </Alert>
            )}

            {/* Login attempts indicator - compact */}
            {loginAttempts > 0 && (
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                <span className="text-sm text-yellow-800">Login attempts:</span>
                <span className="text-sm font-medium text-yellow-600">{loginAttempts}/5</span>
              </div>
            )}
          </div>
        )}

        {!showOTPVerification && (
          <>
            <SocialLoginButtons 
              onSocialLogin={onSocialLogin}
              loading={loading}
            />

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">Or continue with</span>
              </div>
            </div>
          </>
        )}

        <LoginForm
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
          loading={loading}
          error={error}
          loginMethod={loginMethod}
          setLoginMethod={setLoginMethod}
          onSubmit={onSubmit}
          onSendOTP={onSendOTP}
          onVerifyOTP={onVerifyOTP}
          onResendOTP={onResendOTP}
          showOTPVerification={showOTPVerification}
        />

        {!showOTPVerification && (
          <>
            <div className="space-y-4 text-center">
              <Link 
                to="/auth/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Forgot your password?
              </Link>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Create Account
                  </Link>
                </p>
                
                <p className="text-sm text-gray-600">
                  Want to sell on GetIt?{' '}
                  <Link to="/vendor/register" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                    Become a Vendor
                  </Link>
                </p>
              </div>
            </div>

            <TrustIndicators />
          </>
        )}
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <SecurityStatus 
          loginAttempts={loginAttempts}
          isAccountLocked={isAccountLocked}
        />
        
        <div className="lg:hidden">
          <SecurityFeatures />
        </div>
      </TabsContent>
    </Tabs>
  );
};
