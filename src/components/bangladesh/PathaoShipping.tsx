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
  Bike,
  Car
} from 'lucide-react';

interface PathaoShippingProps {
  pickupAddress: string;
  deliveryAddress: string;
  packageWeight: number;
  packageValue: number;
  onShippingSelected: (shippingData: any) => void;
  language?: 'en' | 'bn';
}

export const PathaoShipping: React.FC<PathaoShippingProps> = ({
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
      title: 'Pathao Courier Service',
      subtitle: 'Fast & Reliable Delivery Across Bangladesh',
      estimatedCost: 'Estimated Cost',
      deliveryTime: 'Delivery Time',
      selectOption: 'Select This Option',
      selected: 'Selected',
      features: {
        tracking: 'Real-time Tracking',
        insurance: 'Package Insurance',
        support: '24/7 Customer Support',
        network: 'Nationwide Network'
      },
      serviceTypes: {
        bike: 'Pathao Bike',
        car: 'Pathao Car',
        truck: 'Pathao Truck'
      }
    },
    bn: {
      title: 'পাঠাও কুরিয়ার সেবা',
      subtitle: 'বাংলাদেশ জুড়ে দ্রুত ও নির্ভরযোগ্য ডেলিভারি',
      estimatedCost: 'আনুমানিক খরচ',
      deliveryTime: 'ডেলিভারি সময়',
      selectOption: 'এই অপশনটি নির্বাচন করুন',
      selected: 'নির্বাচিত',
      features: {
        tracking: 'রিয়েল-টাইম ট্র্যাকিং',
        insurance: 'প্যাকেজ বীমা',
        support: '২৪/৭ গ্রাহক সেবা',
        network: 'দেশব্যাপী নেটওয়ার্ক'
      },
      serviceTypes: {
        bike: 'পাঠাও বাইক',
        car: 'পাঠাও কার',
        truck: 'পাঠাও ট্রাক'
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
      // Mock Pathao API integration
      const options = await getPathaoShippingRates({
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

  const getPathaoShippingRates = async (params: any) => {
    // Mock Pathao shipping rates calculation
    const baseRates = {
      bike: { rate: 60, timeMin: 30, timeMax: 60, maxWeight: 5 },
      car: { rate: 100, timeMin: 45, timeMax: 90, maxWeight: 20 },
      truck: { rate: 200, timeMin: 120, timeMax: 240, maxWeight: 100 }
    };

    const distanceMultiplier = Math.random() * 0.5 + 1; // 1x to 1.5x
    const urgencyMultiplier = 1.2; // For express delivery

    return [
      {
        id: 'pathao-bike',
        type: 'bike',
        name: t.serviceTypes.bike,
        description: 'Perfect for small packages',
        icon: Bike,
        price: Math.round(baseRates.bike.rate * distanceMultiplier),
        currency: 'BDT',
        estimatedTime: `${baseRates.bike.timeMin}-${baseRates.bike.timeMax} mins`,
        maxWeight: baseRates.bike.maxWeight,
        features: ['Real-time tracking', 'SMS updates', 'Fast delivery'],
        available: params.weight <= baseRates.bike.maxWeight,
        rating: 4.8,
        serviceLevel: 'standard'
      },
      {
        id: 'pathao-bike-express',
        type: 'bike',
        name: `${t.serviceTypes.bike} Express`,
        description: 'Priority delivery for urgent packages',
        icon: Bike,
        price: Math.round(baseRates.bike.rate * distanceMultiplier * urgencyMultiplier),
        currency: 'BDT',
        estimatedTime: `${Math.round(baseRates.bike.timeMin * 0.7)}-${Math.round(baseRates.bike.timeMax * 0.7)} mins`,
        maxWeight: baseRates.bike.maxWeight,
        features: ['Express delivery', 'Priority handling', 'Real-time tracking'],
        available: params.weight <= baseRates.bike.maxWeight,
        rating: 4.9,
        serviceLevel: 'express',
        badge: 'Express'
      },
      {
        id: 'pathao-car',
        type: 'car',
        name: t.serviceTypes.car,
        description: 'Ideal for medium-sized packages',
        icon: Car,
        price: Math.round(baseRates.car.rate * distanceMultiplier),
        currency: 'BDT',
        estimatedTime: `${baseRates.car.timeMin}-${baseRates.car.timeMax} mins`,
        maxWeight: baseRates.car.maxWeight,
        features: ['Climate controlled', 'Secure transport', 'Real-time tracking'],
        available: params.weight <= baseRates.car.maxWeight,
        rating: 4.7,
        serviceLevel: 'standard'
      },
      {
        id: 'pathao-truck',
        type: 'truck',
        name: t.serviceTypes.truck,
        description: 'For large and heavy packages',
        icon: Truck,
        price: Math.round(baseRates.truck.rate * distanceMultiplier),
        currency: 'BDT',
        estimatedTime: `${Math.round(baseRates.truck.timeMin / 60)}-${Math.round(baseRates.truck.timeMax / 60)} hours`,
        maxWeight: baseRates.truck.maxWeight,
        features: ['Heavy duty transport', 'Bulk delivery', 'Professional handling'],
        available: true,
        rating: 4.6,
        serviceLevel: 'standard'
      }
    ].filter(option => option.available);
  };

  const handleSelectOption = (option: any) => {
    setSelectedOption(option.id);
    onShippingSelected({
      provider: 'Pathao',
      serviceId: option.id,
      serviceName: option.name,
      price: option.price,
      currency: option.currency,
      estimatedTime: option.estimatedTime,
      features: option.features,
      type: option.type
    });

    toast({
      title: "Shipping Option Selected",
      description: `${option.name} selected for ৳${option.price}`,
      variant: "default"
    });
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'bike': return Bike;
      case 'car': return Car;
      case 'truck': return Truck;
      default: return Package;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
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
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t.title}</h3>
              <p className="text-sm text-gray-600 font-normal">{t.subtitle}</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              Pathao Limited
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(t.features).map(([key, value]) => (
          <div key={key} className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 mx-auto mb-2 text-green-600">
              {key === 'tracking' && <MapPin className="w-full h-full" />}
              {key === 'insurance' && <Shield className="w-full h-full" />}
              {key === 'support' && <Phone className="w-full h-full" />}
              {key === 'network' && <Truck className="w-full h-full" />}
            </div>
            <p className="text-xs font-medium text-green-700">{value}</p>
          </div>
        ))}
      </div>

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
                  ? 'ring-2 ring-green-500 bg-green-50' 
                  : 'hover:shadow-md border-gray-200'
              }`}
              onClick={() => handleSelectOption(option)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-green-500' : 'bg-gray-100'
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
                          <Package className="w-4 h-4 text-gray-500" />
                          <span>Max {option.maxWeight}kg</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
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
                      className="w-full bg-green-600 hover:bg-green-700"
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

      {/* Contact Info */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-green-800">
              Need Help? Contact Pathao Customer Service
            </p>
            <div className="flex justify-center gap-4 text-sm text-green-700">
              <span>📞 +880-9678-777777</span>
              <span>📧 support@pathao.com</span>
            </div>
            <p className="text-xs text-green-600">Available 24/7 for assistance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};