import React from 'react';
import { Truck, MapPin, Clock, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PathaoShippingProps {
  fromAddress: string;
  toAddress: string;
  weight: number;
  onSelect: (option: ShippingOption) => void;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  type: 'regular' | 'express' | 'same-day';
}

export const PathaoShipping: React.FC<PathaoShippingProps> = ({
  fromAddress,
  toAddress,
  weight,
  onSelect
}) => {
  const [shippingOptions, setShippingOptions] = React.useState<ShippingOption[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate Pathao API call for shipping rates
    const fetchShippingRates = async () => {
      setIsLoading(true);
      
      // Mock shipping options
      const options: ShippingOption[] = [
        {
          id: 'pathao-regular',
          name: 'Pathao Regular',
          description: 'Standard delivery within Dhaka',
          price: 60,
          duration: '1-2 business days',
          type: 'regular'
        },
        {
          id: 'pathao-express',
          name: 'Pathao Express',
          description: 'Fast delivery with priority handling',
          price: 120,
          duration: '24 hours',
          type: 'express'
        },
        {
          id: 'pathao-same-day',
          name: 'Pathao Same Day',
          description: 'Delivery within the same day',
          price: 200,
          duration: '4-6 hours',
          type: 'same-day'
        }
      ];

      setTimeout(() => {
        setShippingOptions(options);
        setIsLoading(false);
      }, 2000);
    };

    fetchShippingRates();
  }, [fromAddress, toAddress, weight]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'regular': return 'bg-blue-100 text-blue-800';
      case 'express': return 'bg-orange-100 text-orange-800';
      case 'same-day': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-red-600">Pathao Delivery</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Calculating shipping rates...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-red-600">Pathao Delivery</CardTitle>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>From: {fromAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>To: {toAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>Weight: {weight}kg</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {shippingOptions.map((option) => (
          <div 
            key={option.id}
            className="border rounded-lg p-4 hover:border-red-300 transition-colors cursor-pointer"
            onClick={() => onSelect(option)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{option.name}</h4>
                <Badge className={getTypeColor(option.type)}>
                  {option.type}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">৳{option.price}</div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {option.description}
            </p>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-red-600" />
              <span>{option.duration}</span>
            </div>
          </div>
        ))}

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-red-50 rounded">
          <h5 className="font-semibold mb-1">Pathao Benefits:</h5>
          <ul className="space-y-1">
            <li>• Real-time tracking available</li>
            <li>• Cash on delivery support</li>
            <li>• Insurance coverage included</li>
            <li>• Doorstep pickup available</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};