import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CurrencyConverterProps {
  initialAmount?: number;
  fromCurrency?: string;
  toCurrency?: string;
  showCard?: boolean;
  onConversionChange?: (result: ConversionResult) => void;
}

interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  lastUpdated: string;
}

const currencies = [
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' }
];

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  initialAmount = 1,
  fromCurrency = 'USD',
  toCurrency = 'BDT',
  showCard = true,
  onConversionChange
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [from, setFrom] = useState(fromCurrency);
  const [to, setTo] = useState(toCurrency);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (amount > 0) {
      convertCurrency();
    }
  }, [amount, from, to]);

  const convertCurrency = async () => {
    if (from === to) {
      const sameResult: ConversionResult = {
        fromAmount: amount,
        toAmount: amount,
        fromCurrency: from,
        toCurrency: to,
        rate: 1,
        lastUpdated: new Date().toISOString()
      };
      setResult(sameResult);
      onConversionChange?.(sameResult);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bangladesh-localization', {
        body: {
          action: 'get_currency_rate',
          fromCurrency: from,
          toCurrency: to
        }
      });

      if (error) throw error;

      if (data?.success) {
        const rate = data.data.rate;
        const convertedAmount = amount * rate;
        
        const conversionResult: ConversionResult = {
          fromAmount: amount,
          toAmount: Number(convertedAmount.toFixed(2)),
          fromCurrency: from,
          toCurrency: to,
          rate,
          lastUpdated: data.data.last_updated
        };

        setResult(conversionResult);
        onConversionChange?.(conversionResult);
      }
    } catch (error) {
      console.error('Currency conversion error:', error);
      toast({
        title: "Conversion Failed",
        description: "Unable to fetch current exchange rates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
  };

  const getCurrencyInfo = (code: string) => {
    return currencies.find(c => c.code === code) || currencies[0];
  };

  const formatAmount = (amount: number, currency: string) => {
    const currencyInfo = getCurrencyInfo(currency);
    return `${currencyInfo.symbol}${amount.toLocaleString()}`;
  };

  const content = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter amount"
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center gap-2">
                    <span>{currency.flag}</span>
                    <span>{currency.code}</span>
                    <span className="text-sm text-gray-500">- {currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <div className="flex gap-2">
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span>{currency.code}</span>
                      <span className="text-sm text-gray-500">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              title="Swap currencies"
            >
              ⇄
            </Button>
          </div>
        </div>
      </div>

      {result && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <div className="text-lg">
                <span className="font-medium">{formatAmount(result.fromAmount, result.fromCurrency)}</span>
                <span className="mx-2 text-gray-500">=</span>
                <span className="font-bold text-green-600 text-xl">
                  {formatAmount(result.toAmount, result.toCurrency)}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <Badge variant="secondary">
                  Rate: 1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}
                </Badge>
                {loading && (
                  <div className="flex items-center gap-1">
                    <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full"></div>
                    <span>Updating...</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                Last updated: {new Date(result.lastUpdated).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {to === 'BDT' && (
        <div className="text-center text-sm text-gray-600 space-y-1">
          <p>💡 <strong>Bangladesh Banking Hours:</strong> 9:00 AM - 5:00 PM (Sat-Thu)</p>
          <p>🏦 <strong>Popular Banks:</strong> Dutch Bangla, Brac, City Bank, Standard Chartered</p>
        </div>
      )}
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">💱</span>
          Currency Converter
          <Badge variant="outline">Live Rates</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};