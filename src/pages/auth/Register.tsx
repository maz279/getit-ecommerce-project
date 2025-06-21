
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';
import { RegisterPageHeader } from '@/components/auth/RegisterPageHeader';
import { RegisterCard } from '@/components/auth/RegisterCard';
import { RegisterPageFooter } from '@/components/auth/RegisterPageFooter';
import { RegisterWelcomeSection } from '@/components/auth/RegisterWelcomeSection';
import { RegistrationBenefits } from '@/components/auth/RegistrationBenefits';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: 'customer' as 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
        role: formData.role,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate('/auth/verify-email', { 
          state: { email: formData.email } 
        });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Welcome Section */}
            <RegisterWelcomeSection />

            {/* Main Registration Section */}
            <div className="lg:col-span-1 w-full max-w-md mx-auto">
              <RegisterPageHeader />

              <RegisterCard
                formData={formData}
                setFormData={setFormData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
              />

              <RegisterPageFooter />
            </div>

            {/* Benefits Panel - Desktop Only */}
            <div className="hidden lg:block">
              <RegistrationBenefits />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
