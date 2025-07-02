import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Shield, 
  Phone,
  Package,
  Star,
  Plane,
  Building
} from 'lucide-react';

interface PaperflyShippingProps {
  pickupAddress: string;
  deliveryAddress: string;
  packageWeight: number;
  packageValue: number;
  onShippingSelected: (shippingData: any) => void;
  language?: 'en' | 'bn';
}

export const PaperflyShipping: React.FC<PaperflyShippingProps> = ({
  pickupAddress,
  deliveryAddress,
  packageWeight,
  packageValue,
  onShippingSelected,
  language = 'en'
}) => {
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { toast } = useToast();

  const texts = {
    en: {
      title: 'Paperfly Logistics',
      subtitle: 'Professional E-commerce Delivery Solutions',
      estimatedCost: 'Delivery Cost',
      deliveryTime: 'Delivery Time',
      selectOption: 'Select This Service',
      selected: 'Selected',
      features: {
        tracking: 'Advanced Tracking',
        cod: 'Cash on Delivery',
        returns: 'Easy Returns',
        integration: 'E-commerce Integration'
      },
      serviceTypes: {
        standard: 'Standard Delivery',
        express: 'Express Delivery',
        premium: 'Premium Service',
        bulk: 'Bulk Delivery'
      }
    },
    bn: {
      title: 'পেপারফ্লাই লজিস্টিকস',
      subtitle: 'পেশাদার ই-কমার্স ডেলিভারি সমাধান',
      estimatedCost: 'ডেলিভারি খরচ',
      deliveryTime: 'ডেলিভারি সময়',
      selectOption: 'এই সেবাটি নির্বাচন করুন',
      selected: 'নির্বাচিত',
      features: {
        tracking: 'উন্নত ট্র্যাকিং',
        cod: 'ক্যাশ অন ডেলিভারি',
        returns: 'সহজ রিটার্ন',
        integration: 'ই-কমার্স ইন্টিগ্রেশন'
      },
      serviceTypes: {
        standard: 'স্ট্যান্ডার্ড ডেলিভারি',
        express: 'এক্সপ্রেস ডেলিভারি',
        premium: 'প্রিমিয়াম সেবা',
        bulk: 'বাল্ক ডেলিভারি'
      }
    }
  };

  const t = texts[language];

  useEffect(() => {
    loadShippingOptions();
  }, [pickupAddress, deliveryAddress, packageWeight]);

  const loadShippingOptions = async () => {
    setLoading(true);
    try {
      // Mock Paperfly API integration
      const options = await getPaperflyShippingRates({
        pickup: pickupAddress,
        delivery: deliveryAddress,
        weight: packageWeight,
        value: packageValue
      });
      
      setShippingOptions(options);
    } catch (error) {
      console.error('Failed to load shipping options:', error);
      toast({
        title: "Error",
        description: "Failed to load shipping options. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPaperflyShippingRates = async (params: any) => {
    // Mock Paperfly shipping rates calculation
    const isWithinDhaka = params.pickup.toLowerCase().includes('dhaka') && 
                         params.delivery.toLowerCase().includes('dhaka');
    const isWithinChittagong = params.pickup.toLowerCase().includes('chittagong') && 
                              params.delivery.toLowerCase().includes('chittagong');
    
    const baseRate = isWithinDhaka || isWithinChittagong ? 60 : 120;
    const weightMultiplier = Math.max(1, Math.ceil(params.weight / 0.5)); // Every 500g
    const valueMultiplier = params.value > 5000 ? 1.1 : 1; // 10% extra for high-value items

    return [
      {
        id: 'paperfly-standard',
        type: 'standard',
        name: t.serviceTypes.standard,
        description: 'Regular delivery service with tracking',
        icon: Package,
        price: Math.round(baseRate * weightMultiplier * valueMultiplier),
        currency: 'BDT',
        estimatedTime: isWithinDhaka || isWithinChittagong ? '1-2 days' : '2-4 days',
        features: ['Real-time tracking', 'SMS notifications', 'Proof of delivery', 'Customer support'],
        available: true,
        rating: 4.6,
        serviceLevel: 'standard',
        deliveryAttempts: 3,
        insuranceCovered: true
      },
      {
        id: 'paperfly-express',
        type: 'express',
        name: t.serviceTypes.express,
        description: 'Priority delivery with faster processing',
        icon: Plane,
        price: Math.round(baseRate * weightMultiplier * valueMultiplier * 1.5),
        currency: 'BDT',
        estimatedTime: isWithinDhaka || isWithinChittagong ? 'Same day' : '1-2 days',
        features: ['Express processing', 'Priority delivery', 'Real-time tracking', 'Dedicated support'],
        available: true,
        rating: 4.8,
        serviceLevel: 'express',
        badge: 'Express',
        deliveryAttempts: 3,
        insuranceCovered: true
      },
      {
        id: 'paperfly-premium',
        type: 'premium',
        name: t.serviceTypes.premium,
        description: 'White-glove service with special handling',
        icon: Building,
        price: Math.round(baseRate * weightMultiplier * valueMultiplier * 2),
        currency: 'BDT',
        estimatedTime: isWithinDhaka || isWithinChittagong ? '4-6 hours' : 'Next day',
        features: ['Premium packaging', 'White-glove service', 'Dedicated agent', 'Flexible timing'],
        available: params.value > 1000, // Only for higher value items
        rating: 4.9,
        serviceLevel: 'premium',
        badge: 'Premium',
        deliveryAttempts: 5,
        insuranceCovered: true
      },
      {
        id: 'paperfly-cod',
        type: 'cod',
        name: 'Cash on Delivery',
        description: 'Collect payment upon delivery',
        icon: Package,
        price: Math.round(baseRate * weightMultiplier * valueMultiplier * 1.2), // 20% extra for COD
        currency: 'BDT',
        estimatedTime: isWithinDhaka || isWithinChittagong ? '1-2 days' : '2-4 days',
        features: ['Cash collection', 'Payment verification', 'Real-time tracking', 'Return handling'],
        available: true,
        rating: 4.5,
        serviceLevel: 'standard',
        badge: 'COD',
        deliveryAttempts: 3,
        insuranceCovered: true,
        codEnabled: true
      }
    ].filter(option => option.available);
  };

  const handleSelectOption = (option: any) => {
    setSelectedOption(option.id);
    onShippingSelected({
      provider: 'Paperfly',
      serviceId: option.id,
      serviceName: option.name,
      price: option.price,
      currency: option.currency,
      estimatedTime: option.estimatedTime,
      features: option.features,
      type: option.type,
      insuranceCovered: option.insuranceCovered,
      deliveryAttempts: option.deliveryAttempts,
      codEnabled: option.codEnabled || false
    });

    toast({
      title: "Shipping Option Selected",
      description: `${option.name} selected for ৳${option.price}`,
      variant: "default"
    });
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'express': return Plane;
      case 'premium': return Building;
      case 'cod': return Package;
      default: return Truck;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t.title}</h3>
              <p className="text-sm text-gray-600 font-normal">{t.subtitle}</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              Trusted Partner
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(t.features).map(([key, value]) => (
          <div key={key} className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-8 h-8 mx-auto mb-2 text-blue-600">
              {key === 'tracking' && <MapPin className="w-full h-full" />}
              {key === 'cod' && <Package className="w-full h-full" />}
              {key === 'returns' && <Shield className="w-full h-full" />}
              {key === 'integration' && <Building className="w-full h-full" />}
            </div>
            <p className="text-xs font-medium text-blue-700">{value}</p>
          </div>
        ))}
      </div>

      {/* Coverage Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">64</p>
              <p className="text-sm text-blue-700">Districts Covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">500+</p>
              <p className="text-sm text-blue-700">Upazilas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">50K+</p>
              <p className="text-sm text-blue-700">Daily Deliveries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Options */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Available Services</h4>
        {shippingOptions.map((option) => {
          const IconComponent = getServiceIcon(option.type);
          const isSelected = selectedOption === option.id;
          
          return (
            <Card 
              key={option.id} 
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md border-gray-200'
              }`}
              onClick={() => handleSelectOption(option)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-500' : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        isSelected ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold">{option.name}</h5>
                        {option.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {option.badge}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-600">{option.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{option.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4 text-gray-500" />
                          <span>Insured</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span>{option.deliveryAttempts} attempts</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ৳{option.price}
                      </p>
                      <p className="text-sm text-gray-600">{t.estimatedCost}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {option.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="mt-4">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled
                    >
                      ✓ {t.selected}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Service Guarantee */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-blue-800">Paperfly Service Guarantee</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
              <span>✓ 99.5% Delivery Success Rate</span>
              <span>✓ Real-time Package Tracking</span>
              <span>✓ Professional Customer Support</span>
              <span>✓ Secure & Insured Delivery</span>
            </div>
            <div className="flex justify-center gap-4 text-sm text-blue-700 mt-3">
              <span>📞 +880-9611-222444</span>
              <span>📧 support@paperfly.com.bd</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};