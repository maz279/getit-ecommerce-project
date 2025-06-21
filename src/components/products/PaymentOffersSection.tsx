
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';

export const PaymentOffersSection: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-100 to-green-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            💰 EID Payment Bonuses
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            View All Payment Offers
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">📱 Mobile Banking Special</h3>
              <div className="space-y-2 text-sm mb-4">
                <div>💸 Extra 8% Cashback (Up to $80)</div>
                <div>🎁 Instant $20 bonus on first payment</div>
                <div>🔄 0% transaction fee for all EID purchases</div>
                <div>💰 Double rewards points until EID</div>
                <div>📱 Easy 1-tap checkout for repeat purchases</div>
              </div>
              <Button variant="secondary" className="w-full text-pink-600 font-bold">
                💳 Pay with Mobile Banking
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">📱 Digital Wallet Mega Offer</h3>
              <div className="space-y-2 text-sm mb-4">
                <div>💸 Up to 10% Cashback (Maximum $100)</div>
                <div>🎊 Special EID scratch cards with every payment</div>
                <div>🎁 Win EID gifts worth up to $1,000</div>
                <div>🏆 Lucky draw for trip (2 winners)</div>
                <div>💵 Instant payment processing</div>
              </div>
              <Button variant="secondary" className="w-full text-orange-600 font-bold">
                💳 Pay with Digital Wallet
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-blue-500 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">📱 Online Banking Power Offer</h3>
              <div className="space-y-2 text-sm mb-4">
                <div>💸 6% Instant Cashback (Up to $60)</div>
                <div>🎁 Free mobile recharge vouchers</div>
                <div>💰 No minimum purchase requirement</div>
                <div>🔐 Extra security with PIN + OTP</div>
                <div>📊 Track all EID expenses in app</div>
              </div>
              <Button variant="secondary" className="w-full text-purple-600 font-bold">
                💳 Pay with Online Banking
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-600 to-gray-800 text-white border-none shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">💳 Bank Cards & COD</h3>
              <div className="space-y-2 text-sm mb-4">
                <div>💳 Credit/Debit Cards: 3% cashback</div>
                <div>🏦 Bank Transfer: 2% discount on orders above $500</div>
                <div>💰 Cash on Delivery: FREE COD on EID orders</div>
                <div>📱 EMI Options: 0% interest up to 12 months</div>
                <div>🎯 All payments 100% secure with bank-level encryption</div>
              </div>
              <Button variant="secondary" className="w-full text-gray-600 font-bold">
                💳 Other Payment Options
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
