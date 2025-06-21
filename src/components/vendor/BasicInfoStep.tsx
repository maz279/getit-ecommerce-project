
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Store } from 'lucide-react';

interface BasicInfoStepProps {
  data: {
    businessName: string;
    ownerName: string;
    email: string;
    phone: string;
  };
  updateData: (data: any) => void;
  onNext: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData, onNext }) => {
  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  const isValid = data.businessName && data.ownerName && data.email && data.phone;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <div className="relative">
            <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="businessName"
              placeholder="Your business name"
              value={data.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerName">Owner Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="ownerName"
              placeholder="Your full name"
              value={data.ownerName}
              onChange={(e) => handleChange('ownerName', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="+880 1XXX-XXXXXX"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Why Join GetIt?</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Access to 10+ million customers</li>
          <li>• Zero setup fees for the first 3 months</li>
          <li>• Dedicated seller support team</li>
          <li>• Marketing and promotional support</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!isValid} className="min-w-[120px]">
          Continue
        </Button>
      </div>
    </div>
  );
};
