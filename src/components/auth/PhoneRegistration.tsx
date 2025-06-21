
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PhoneRegistrationProps {
  phone: string;
  setPhone: (phone: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  loading: boolean;
  error: string;
  onPhoneRegister: (phone: string) => void;
  onVerifyOTP: (otp: string) => void;
  showOTPVerification: boolean;
}

export const PhoneRegistration: React.FC<PhoneRegistrationProps> = ({
  phone,
  setPhone,
  fullName,
  setFullName,
  loading,
  error,
  onPhoneRegister,
  onVerifyOTP,
  showOTPVerification,
}) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showOTPVerification) {
      onVerifyOTP(otp);
    } else {
      onPhoneRegister(phone);
    }
  };

  if (showOTPVerification) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Phone className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Verify Your Phone</h3>
            <p className="text-sm text-gray-600 mt-1">
              We sent a 6-digit code to <span className="font-medium">{phone}</span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-center block">Enter Verification Code</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-semibold" 
          disabled={loading || otp.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify & Create Account'}
        </Button>

        <div className="text-center space-y-3">
          <Button
            type="button"
            variant="ghost"
            className="text-sm text-gray-600 hover:text-gray-800"
            onClick={() => onPhoneRegister(phone)}
            disabled={loading}
          >
            Didn't receive code? Resend
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mx-auto"
            onClick={() => window.location.reload()}
          >
            <ArrowLeft className="w-4 h-4" />
            Change Phone Number
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXX XXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500">
            We'll send you a verification code via SMS
          </p>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
        {loading ? 'Sending Code...' : 'Send Verification Code'}
      </Button>

      <div className="text-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Already have an account?</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          <Link to="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            Sign in to your account
          </Link>
        </p>
      </div>
    </form>
  );
};
