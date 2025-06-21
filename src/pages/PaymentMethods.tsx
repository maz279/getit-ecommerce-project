
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { CreditCard, Smartphone, Banknote, Shield, CheckCircle } from 'lucide-react';

const PaymentMethods: React.FC = () => {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Payment Methods</h1>
            <p className="text-xl mb-8">Choose from multiple secure payment options</p>
          </div>
        </section>

        {/* Payment Options */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Available Payment Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Mobile Banking */}
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-emerald-200">
                <Smartphone className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">Mobile Banking</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">bKash (5% cashback)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Nagad (5% cashback)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Rocket (5% cashback)</span>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <span className="text-emerald-700 font-semibold">Most Popular</span>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-orange-200">
                <Banknote className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">Cash on Delivery</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Pay when you receive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Available nationwide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">No advance payment</span>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <span className="text-orange-700 font-semibold">Trusted & Safe</span>
                </div>
              </div>

              {/* Credit/Debit Cards */}
              <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-200">
                <CreditCard className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">Cards</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Visa & Mastercard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Debit & Credit cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Secure SSL encryption</span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <span className="text-blue-700 font-semibold">International</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Your Security is Our Priority</h3>
                <p className="text-gray-600">All payments are processed through secure, encrypted channels</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-1">SSL Encrypted</h4>
                  <p className="text-sm text-gray-600">256-bit encryption</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-1">PCI Compliant</h4>
                  <p className="text-sm text-gray-600">Industry standards</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Fraud Protection</h4>
                  <p className="text-sm text-gray-600">24/7 monitoring</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-1">Money Back</h4>
                  <p className="text-sm text-gray-600">Guarantee policy</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentMethods;
