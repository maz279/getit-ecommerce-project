import React from 'react';
import { Check, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentMethod } from '@/types';
import { usePaymentContext } from './PaymentMethods';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  className?: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  className
}) => {
  const { selectedMethod, setSelectedMethod } = usePaymentContext();

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
      <div className="grid gap-3">
        {methods.map((method) => (
          <Card 
            key={method.id}
            className={cn(
              'cursor-pointer transition-all border-2',
              selectedMethod?.id === method.id 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            )}
            onClick={() => setSelectedMethod(method)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {method.icon ? (
                      <img src={method.icon} alt={method.name} className="w-6 h-6" />
                    ) : (
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-muted-foreground">{method.namebn}</p>
                    {method.processingFee > 0 && (
                      <p className="text-xs text-orange-600">
                        Processing fee: {method.processingFee}%
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!method.isActive && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Unavailable
                    </span>
                  )}
                  {selectedMethod?.id === method.id && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};