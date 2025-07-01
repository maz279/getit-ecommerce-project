import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedLoginHandlers = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [suspiciousActivityDetected, setSuspiciousActivityDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const redirectTo = location.state?.from || '/';

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent, loginMethod: string, email: string, phone: string, password: string) => {
    e.preventDefault();
    
    if (isAccountLocked) {
      setError('Account is temporarily locked. Please try again later.');
      return;
    }

    // Form validation
    if (loginMethod === 'email') {
      if (!email.trim()) {
        setError('Email is required');
        return;
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
    } else if (loginMethod === 'phone') {
      if (!phone.trim()) {
        setError('Phone number is required');
        return;
      }
      if (!validatePhone(phone)) {
        setError('Please enter a valid Bangladesh phone number');
        return;
      }
    }

    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loginCredential = loginMethod === 'email' ? email : phone;
      const { data, error: authError } = await authApi.signIn({
        email: loginCredential,
        password
      });
      
      if (authError) {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        // Account lockout after 5 attempts
        if (newAttempts >= 5) {
          setIsAccountLocked(true);
          setError('Account locked due to multiple failed attempts. Please contact support or try again in 15 minutes.');
        } else {
          setError(authError.message || 'Login failed. Please check your credentials.');
        }
        
        // Suspicious activity detection
        if (newAttempts >= 3) {
          setSuspiciousActivityDetected(true);
        }
      } else if (data) {
        // Reset attempts on successful login
        setLoginAttempts(0);
        setIsAccountLocked(false);
        setSuspiciousActivityDetected(false);
        
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });
        
        navigate(redirectTo);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoginAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (phone: string) => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid Bangladesh phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement OTP sending via SMS service
      console.log('Sending OTP to:', phone);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowOTPVerification(true);
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
      });
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string, phone: string) => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement OTP verification
      console.log('Verifying OTP:', otp, 'for phone:', phone);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otp === '123456') { // Mock verification
        toast({
          title: "Login Successful",
          description: "Phone number verified successfully!",
        });
        navigate(redirectTo);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (phone: string) => {
    setLoading(true);
    setError('');

    try {
      console.log('Resending OTP to:', phone);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP Resent",
        description: `New verification code sent to ${phone}`,
      });
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
      // TODO: Implement social login with real providers
      console.log(`${provider} login initiated`);
      
      toast({
        title: "Social Login",
        description: `${provider} login initiated successfully`,
      });

      // Mock successful social login
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate(redirectTo);
    } catch (err) {
      setError(`Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};