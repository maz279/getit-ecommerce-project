import React from 'react';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const CurrencyConverter: React.FC = () => {
  const [currentCurrency, setCurrentCurrency] = React.useState('BDT');

  const currencies = [
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 1 },
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.009 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.008 },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 0.75 },
  ];

  const current = currencies.find(curr => curr.code === currentCurrency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <DollarSign className="h-4 w-4" />
          <span>{current?.symbol}</span>
          <span className="hidden sm:inline">{current?.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setCurrentCurrency(currency.code)}
            className="cursor-pointer"
          >
            <span className="mr-2">{currency.symbol}</span>
            {currency.name} ({currency.code})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};