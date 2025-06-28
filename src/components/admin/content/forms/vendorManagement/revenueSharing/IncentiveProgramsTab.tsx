
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Star, Trophy, Target, Plus } from 'lucide-react';

export const IncentiveProgramsTab: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState('');

  const incentivePrograms = [
    {
      id: 'performance',
      name: 'Performance Bonus',
      type: 'Tiered Rewards',
      description: 'Extra commission for top performers',
      bonus: '1-3%',
      status: 'active',
      participants: 245
    },
    {
      id: 'loyalty',
      name: 'Loyalty Program',
      type: 'Long-term Incentive',
      description: 'Rewards for vendor loyalty and consistency',
      bonus: '0.5-2%',
      status: 'active',
      participants: 892
    },
    {
      id: 'volume',
      name: 'Volume Incentive',
      type: 'Sales-based',
      description: 'Higher commission rates for volume sellers',
      bonus: '2-5%',
      status: 'draft',
      participants: 0
    }
  ];

  const performanceTiers = [
    { tier: 'Bronze', rating: '4.0+', bonus: '1%', color: 'bg-orange-100 text-orange-800' },
    { tier: 'Silver', rating: '4.3+', bonus: '2%', color: 'bg-gray-100 text-gray-800' },
    { tier: 'Gold', rating: '4.6+', bonus: '3%', color: 'bg-yellow-100 text-yellow-800' },
    { tier: 'Platinum', rating: '4.8+', bonus: '5%', color: 'bg-purple-100 text-purple-800' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Incentive Programs</h3>
          <p className="text-gray-600">Manage vendor incentives and bonus structures</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Program
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {incentivePrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{program.name}</CardTitle>
                <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                  {program.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{program.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bonus:</span>
                  <span className="text-sm text-green-600 font-bold">{program.bonus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Participants:</span>
                  <span className="text-sm">{program.participants}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Performance Tiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceTiers.map((tier, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">{tier.tier}</p>
                    <p className="text-sm text-gray-500">Rating {tier.rating}</p>
                  </div>
                </div>
                <Badge className={tier.color}>
                  +{tier.bonus} Bonus
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Create New Incentive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Program Name</Label>
              <Input placeholder="Enter program name" />
            </div>

            <div className="space-y-2">
              <Label>Incentive Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance-based</SelectItem>
                  <SelectItem value="volume">Volume-based</SelectItem>
                  <SelectItem value="loyalty">Loyalty-based</SelectItem>
                  <SelectItem value="category">Category-specific</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bonus Percentage (%)</Label>
              <Input placeholder="2.5" />
            </div>

            <div className="space-y-2">
              <Label>Eligibility Criteria</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select criteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Minimum Rating</SelectItem>
                  <SelectItem value="sales">Sales Volume</SelectItem>
                  <SelectItem value="duration">Account Duration</SelectItem>
                  <SelectItem value="category">Category Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">
              Create Incentive Program
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">TechWorld Electronics</p>
                  <p className="text-sm text-gray-500">Platinum Tier • 4.9★ • ৳145K revenue</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-yellow-100 text-yellow-800">+5% Bonus</Badge>
                <p className="text-xs text-gray-500 mt-1">Extra ৳7.25K earned</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Fashion Hub BD</p>
                  <p className="text-sm text-gray-500">Gold Tier • 4.7★ • ৳128K revenue</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-yellow-100 text-yellow-800">+3% Bonus</Badge>
                <p className="text-xs text-gray-500 mt-1">Extra ৳3.84K earned</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Home Essentials</p>
                  <p className="text-sm text-gray-500">Silver Tier • 4.4★ • ৳95K revenue</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-gray-100 text-gray-800">+2% Bonus</Badge>
                <p className="text-xs text-gray-500 mt-1">Extra ৳1.90K earned</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
