
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Lock, Shield, Smartphone, Phone } from 'lucide-react';

interface LoginFormProps {
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
  loading: boolean;
  error: string;
  loginMethod: 'email' | 'phone';
  setLoginMethod: (method: 'email' | 'phone') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
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
  loading,
  error,
  loginMethod,
  setLoginMethod,
  onSubmit,
}) => {
  return (
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

      <form onSubmit={onSubmit} className="space-y-5 mt-6">
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
  );
};
