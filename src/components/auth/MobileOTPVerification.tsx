
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Phone, Clock, RefreshCw } from 'lucide-react';

interface MobileOTPVerificationProps {
  phoneNumber: string;
  onVerifySuccess: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
  onResendOTP: () => void;
  onVerifyOTP: (otp: string) => void;
}

export const MobileOTPVerification: React.FC<MobileOTPVerificationProps> = ({
  phoneNumber,
  onVerifySuccess,
  onBack,
  loading,
  error,
  onResendOTP,
  onVerifyOTP,
}) => {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = () => {
    if (otp.length === 6) {
      onVerifyOTP(otp);
    }
  };

  const handleResend = () => {
    onResendOTP();
    setCountdown(60);
    setCanResend(false);
    setOtp('');
  };

  const formatPhoneDisplay = (phone: string) => {
    // Format +8801234567890 to +880 1234-567890
    if (phone.startsWith('+880')) {
      const number = phone.substring(4);
      return `+880 ${number.substring(0, 4)}-${number.substring(4)}`;
    }
    return phone;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Verify Your Number</h2>
        <p className="text-gray-600">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-semibold text-gray-800">
          {formatPhoneDisplay(phoneNumber)}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* OTP Input */}
      <div className="space-y-4">
        <Label htmlFor="otp" className="text-sm font-medium text-gray-700 block text-center">
          Enter Verification Code
        </Label>
        
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="gap-3"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      {/* Verify Button */}
      <Button 
        onClick={handleVerify}
        disabled={otp.length !== 6 || loading}
        className="w-full py-6 text-base font-medium bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
            Verifying...
          </>
        ) : (
          'Verify & Continue'
        )}
      </Button>

      {/* Resend Section */}
      <div className="text-center space-y-3">
        {!canResend ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Resend code in {countdown}s</span>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={loading}
            className="text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Resend Code
          </Button>
        )}
        
        <div className="text-xs text-gray-500">
          Didn't receive the code? Check your SMS or try again
        </div>
      </div>

      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="w-full"
        disabled={loading}
      >
        ← Use Different Number
      </Button>

      {/* SMS Provider Info */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>SMS delivered via SSL Wireless</p>
        <p>Standard SMS rates may apply</p>
      </div>
    </div>
  );
};
