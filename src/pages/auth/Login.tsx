
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, Shield, Smartphone, Globe, ArrowLeft, Facebook, Chrome, ShoppingCart, Users, Star, MapPin, Truck, Phone } from 'lucide-react';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';

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

  const { signIn } = useAuth();
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

  const handleSocialLogin = (provider: string) => {
    // Placeholder for social login implementation
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-6xl flex gap-8 items-center">
          {/* Welcome Section */}
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-8">
            <div className="max-w-md text-center space-y-8">
              {/* Main Welcome Message */}
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🛍️ Welcome Back!
                </h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  আবার স্বাগতম!
                </h2>
                <p className="text-lg text-gray-600">
                  Sign in to your GetIt account
                </p>
              </div>

              {/* Platform Benefits */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Discover thousands of products from trusted vendors across Bangladesh
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm">10,000+ Trusted Vendors</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm">1M+ Products Available</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm">All 64 Districts Covered</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm">Fast & Secure Delivery</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-500" />
                    <span>Data Protected</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Trusted by 500,000+ Users</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1 text-center">
                    Secured with 256-bit SSL encryption
                  </p>
                </div>
              </div>

              {/* Bangladesh Flag Colors Accent */}
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 ml-2">Made for Bangladesh</span>
              </div>
            </div>
          </div>

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
                {/* Mobile Welcome for small screens */}
                <div className="lg:hidden mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
                      <ShoppingCart className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    🛍️ Welcome Back!
                  </h1>
                  <p className="text-sm text-gray-600">
                    Sign in to your GetIt account
                  </p>
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Sign In
                </CardTitle>
                <CardDescription className="text-base text-gray-600 mt-2">
                  Continue your shopping journey with GetIt
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Social Login Options */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-6 text-base font-medium hover:bg-red-50 hover:border-red-200"
                    onClick={() => handleSocialLogin('google')}
                  >
                    <Chrome className="w-5 h-5 mr-3" />
                    Continue with Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-6 text-base font-medium hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => handleSocialLogin('facebook')}
                  >
                    <Facebook className="w-5 h-5 mr-3" />
                    Continue with Facebook
                  </Button>
                </div>

                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-4 text-sm text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Login Method Tabs */}
                <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </TabsTrigger>
                  </TabsList>

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                    {error && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Email/Phone Field */}
                    <TabsContent value="email" className="space-y-2 mt-0">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-11 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="phone" className="space-y-2 mt-0">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number (+880...)"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-11 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Format: +8801XXXXXXXXX or 01XXXXXXXXX
                      </p>
                    </TabsContent>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-11 pr-11 py-6 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Advanced Security Options */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-700 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security Options
                      </h4>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember-me" 
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <label htmlFor="remember-me" className="text-sm text-gray-600">
                          Keep me signed in for 30 days
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="two-factor" 
                          checked={enableTwoFactor}
                          onCheckedChange={(checked) => setEnableTwoFactor(checked as boolean)}
                        />
                        <label htmlFor="two-factor" className="text-sm text-gray-600 flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          Enable two-factor authentication (Recommended)
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full py-6 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-200" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In to GetIt'
                      )}
                    </Button>
                  </form>
                </Tabs>

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

                {/* Trust Indicators */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Data Protected</span>
                    </div>
                  </div>
                </div>
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
