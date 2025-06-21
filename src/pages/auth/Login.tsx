
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
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
      }
      // Note: For OAuth, the redirect happens automatically
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
      // Placeholder for other social login implementations
      console.log(`Login with ${provider} - Not implemented yet`);
      setError(`${provider} login is not yet implemented`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-6xl flex gap-8 items-center">
          <WelcomeSection />

          {/* Login Form Section */}
          <div className="w-full max-w-md lg:max-w-lg">
            {/* Back to Home Link */}
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
                {/* Social Login Options */}
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

                {/* Login Form */}
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
                />

                {/* Links */}
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
              </CardContent>
            </Card>

            {/* Additional Info */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
