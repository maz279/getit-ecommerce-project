
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { WelcomeSection } from '@/components/auth/WelcomeSection';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { LoginForm } from '@/components/auth/LoginForm';
import { TrustIndicators } from '@/components/auth/TrustIndicators';
import { MobileWelcome } from '@/components/auth/MobileWelcome';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'phone-otp'>('email');
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectTo = location.state?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginCredential = loginMethod === 'email' ? email : phone;
      const { error } = await signIn(loginCredential, password);
      if (error) {
        setError(error.message);
      } else {
        navigate(redirectTo);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      // Here you would integrate with Supabase SMS OTP
      // For now, we'll simulate the flow
      console.log('Sending OTP to:', phone);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show OTP verification screen
      setShowOTPVerification(true);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setLoading(true);
    setError('');

    try {
      // Here you would verify the OTP with Supabase
      console.log('Verifying OTP:', otp, 'for phone:', phone);
      
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit code
      if (otp.length === 6) {
        console.log('OTP verified successfully');
        navigate(redirectTo);
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Resending OTP to:', phone);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset any error states
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'google') {
      handleGoogleLogin();
    } else {
      console.log(`Login with ${provider} - Not implemented yet`);
      setError(`${provider} login is not yet implemented`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-6xl flex gap-8 items-center">
          <WelcomeSection />

          <div className="w-full max-w-md lg:max-w-lg">
            <div className="mb-6">
              <Link 
                to="/" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to GetIt
              </Link>
            </div>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <MobileWelcome />
                
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Sign In
                </CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Continue your shopping journey with GetIt
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Show social login only if not in OTP verification mode */}
                {!showOTPVerification && (
                  <>
                    <SocialLoginButtons 
                      onSocialLogin={handleSocialLogin}
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
                  onSubmit={handleSubmit}
                  onSendOTP={handleSendOTP}
                  onVerifyOTP={handleVerifyOTP}
                  onResendOTP={handleResendOTP}
                  showOTPVerification={showOTPVerification}
                />

                {/* Show links only if not in OTP verification mode */}
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
              </CardContent>
            </Card>

            {!showOTPVerification && (
              <div className="mt-8 text-center text-xs text-gray-500">
                <p>
                  By signing in, you agree to our{' '}
                  <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
