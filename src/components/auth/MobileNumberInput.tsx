
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Flag } from 'lucide-react';

interface MobileNumberInputProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  onSendOTP: () => void;
  loading: boolean;
  error: string;
}

export const MobileNumberInput: React.FC<MobileNumberInputProps> = ({
  phoneNumber,
  setPhoneNumber,
  onSendOTP,
  loading,
  error,
}) => {
  const [isValidNumber, setIsValidNumber] = useState(false);

  const validateBangladeshNumber = (number: string) => {
    // Remove all non-digits
    const cleanNumber = number.replace(/\D/g, '');
    
    // Bangladesh mobile number patterns
    // 01XXXXXXXXX (11 digits) or 8801XXXXXXXXX (13 digits)
    if (cleanNumber.length === 11 && cleanNumber.startsWith('01')) {
      return true;
    }
    if (cleanNumber.length === 13 && cleanNumber.startsWith('88001')) {
      return true;
    }
    if (cleanNumber.length === 14 && cleanNumber.startsWith('88001')) {
      return true;
    }
    
    return false;
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    let cleanValue = value.replace(/\D/g, '');
    
    // Auto-add country code if starting with 01
    if (cleanValue.startsWith('01')) {
      cleanValue = '880' + cleanValue;
    }
    
    // Ensure it starts with 880
    if (!cleanValue.startsWith('880')) {
      cleanValue = '880' + cleanValue;
    }
    
    // Limit to 13 digits (880 + 10 digit mobile)
    cleanValue = cleanValue.substring(0, 13);
    
    // Format as +880 1XXX-XXXXXX
    if (cleanValue.length >= 3) {
      let formatted = '+' + cleanValue.substring(0, 3);
      if (cleanValue.length > 3) {
        formatted += ' ' + cleanValue.substring(3, 4);
        if (cleanValue.length > 4) {
          formatted += cleanValue.substring(4, 7);
          if (cleanValue.length > 7) {
            formatted += '-' + cleanValue.substring(7);
          }
        }
      }
      return formatted;
    }
    
    return '+' + cleanValue;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setIsValidNumber(validateBangladeshNumber(formatted));
  };

  const getBangladeshOperator = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    const prefix = cleanNumber.substring(3, 6); // Get the operator prefix
    
    const operators = {
      '017': 'Grameenphone',
      '013': 'Grameenphone',
      '019': 'Banglalink',
      '014': 'Banglalink',
      '018': 'Robi',
      '016': 'Airtel',
      '015': 'Teletalk',
    };
    
    return operators[prefix as keyof typeof operators] || 'Bangladesh Mobile';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Enter Mobile Number</h2>
        <p className="text-gray-600">
          We'll send you a verification code via SMS
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Phone Input */}
      <div className="space-y-2">
        <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
          Mobile Number
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <div className="w-6 h-4 bg-green-600 rounded-sm flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <Flag className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            id="mobile"
            type="tel"
            placeholder="+880 1XXX-XXXXXX"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="pl-20 py-6 text-base border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        
        {/* Operator Display */}
        {isValidNumber && (
          <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{getBangladeshOperator(phoneNumber)} • Valid Number</span>
          </div>
        )}
        
        {phoneNumber && !isValidNumber && (
          <div className="text-sm text-red-600 mt-2">
            Please enter a valid Bangladesh mobile number
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-blue-800">Supported Operators</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
          <div>• Grameenphone (017, 013)</div>
          <div>• Robi (018)</div>
          <div>• Banglalink (019, 014)</div>
          <div>• Airtel (016)</div>
          <div>• Teletalk (015)</div>
        </div>
      </div>

      {/* Send OTP Button */}
      <Button 
        onClick={onSendOTP}
        disabled={!isValidNumber || loading}
        className="w-full py-6 text-base font-medium bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
            Sending OTP...
          </>
        ) : (
          'Send Verification Code'
        )}
      </Button>

      {/* Terms */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>By continuing, you agree to receive SMS messages</p>
        <p>Standard messaging rates may apply</p>
      </div>
    </div>
  );
};
