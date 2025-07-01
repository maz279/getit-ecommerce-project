import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  phone?: string;
}

export const useEnhancedRegistrationHandlers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters long');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
    if (!/\d/.test(password)) errors.push('Password must contain at least one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('Password must contain at least one special character');
    return errors;
  };

  const validateForm = (formData: any): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid Bangladesh phone number (+8801XXXXXXXXX or 01XXXXXXXXX)';
    }

    // Password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0]; // Show first error
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleEmailSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    const errors = validateForm(formData);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setLoading(false);
      setError('Please fix the validation errors');
      return;
    }

    try {
      const { data, error: authError } = await authApi.signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone: formData.phone,
        role: formData.role,
      });

      if (authError) {
        setError(authError.message || 'Registration failed. Please try again.');
      } else if (data) {
        toast({
          title: "Registration Successful",
          description: "Please check your email to confirm your account.",
        });
        
        navigate('/auth/verify-email', { 
          state: { email: formData.email } 
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: string) => {
    setLoading(true);
    setError('');
    
    try {
      // TODO: Implement social registration with real providers
      console.log(`${provider} registration initiated`);
      
      toast({
        title: "Social Registration",
        description: `${provider} registration initiated successfully`,
      });

      // Mock successful social registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/');
    } catch (err) {
      setError(`Failed to register with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneRegister = async (phone: string) => {
    if (!validatePhone(phone)) {
      setError('Please enter a valid Bangladesh phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement phone registration with OTP
      console.log('Sending OTP to:', phone);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowOTPVerification(true);
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${phone}`,
      });
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement OTP verification
      console.log('Verifying OTP:', otp);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (otp === '123456') { // Mock verification
        toast({
          title: "Registration Successful",
          description: "Phone number verified successfully!",
        });
        navigate('/');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    showOTPVerification,
    validationErrors,
    handleEmailSubmit,
    handleSocialRegister,
    handlePhoneRegister,
    handleVerifyOTP,
  };
};