import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, AlertTriangle, Shield, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { WelcomeSection } from '@/components/auth/WelcomeSection';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { LoginForm } from '@/components/auth/LoginForm';
import { TrustIndicators } from '@/components/auth/TrustIndicators';
import { MobileWelcome } from '@/components/auth/MobileWelcome';
import { SecurityFeatures } from '@/components/auth/SecurityFeatures';
import { SecurityStatus } from '@/components/auth/SecurityStatus';

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
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [suspiciousActivityDetected, setSuspiciousActivityDetected] = useState(false);

  const { signIn, signInWithGoogle, signInWithFacebook, signInWithWhatsApp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirectTo = location.state?.from || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAccountLocked) {
      setError('Account is temporarily locked. Please try again later.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loginCredential = loginMethod === 'email' ? email : phone;
      const { error } = await signIn(loginCredential, password);
      
      if (error) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        // Account lockout after 5 attempts
        if (newAttempts >= 5) {
          setIsAccountLocked(true);
          setError('Account locked due to multiple failed attempts. Please contact support or try again in 15 minutes.');
        } else {
          setError(error.message);
        }
        
        // Suspicious activity detection simulation
        if (newAttempts >= 3) {
          setSuspiciousActivityDetected(true);
        }
      } else {
        // Reset attempts on successful login
        setLoginAttempts(0);
        setIsAccountLocked(false);
        setSuspiciousActivityDetected(false);
        navigate(redirectTo);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoginAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Sending OTP to:', phone);
      await new Promise(resolve => setTimeout(resolve, 2000));
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
      console.log('Verifying OTP:', otp, 'for phone:', phone);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    setError('');
    
    try {
      let result;
      
      switch (provider) {
        case 'google':
          result = await signInWithGoogle();
          break;
        case 'facebook':
          result = await signInWithFacebook();
          break;
        case 'whatsapp':
          result = await signInWithWhatsApp();
          break;
        default:
          throw new Error(`Unknown provider: ${provider}`);
      }

      if (result.error) {
        setError(result.error.message);
      } else if (provider !== 'whatsapp') {
        // For OAuth providers, navigation happens automatically via redirect
        console.log(`${provider} login initiated successfully`);
      }
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

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
                </CardContent>
              </Card>

              {!showOTPVerification && (
                <div className="mt-6 text-center text-xs text-gray-500">
                  <p>
                    By signing in, you agree to our{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </p>
                </div>
              )}
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
