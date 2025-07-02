import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyConverterProps {
  amount?: number;
  onConvert?: (convertedAmount: number, fromCurrency: string, toCurrency: string) => void;
  compact?: boolean;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  amount: initialAmount = 0,
  onConvert,
  compact = false
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('BDT');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(110); // Default rate
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (amount > 0) {
      performConversion();
    }
  }, [amount, exchangeRate]);

  const fetchExchangeRate = async () => {
    try {
      const { data, error } = await supabase
        .from('bd_currency_rates')
        .select('rate')
        .eq('from_currency', fromCurrency)
        .eq('to_currency', toCurrency)
        .eq('is_active', true)
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setExchangeRate(data.rate);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    }
  };

  const performConversion = () => {
    setLoading(true);
    setTimeout(() => {
      const converted = amount * exchangeRate;
      setConvertedAmount(converted);
      onConvert?.(converted, fromCurrency, toCurrency);
      setLoading(false);
    }, 300);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setExchangeRate(1 / exchangeRate);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <DollarSign className="h-4 w-4" />
        <span>
          {fromCurrency} {amount.toFixed(2)} = {toCurrency} {convertedAmount.toFixed(2)}
        </span>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter amount"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-2">
            <Label>From</Label>
            <select 
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="USD">USD ($)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={swapCurrencies}
            className="mt-6"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 space-y-2">
            <Label>To</Label>
            <select 
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>
        
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Converted Amount</div>
            <div className="text-2xl font-bold">
              {loading ? '...' : `${toCurrency} ${convertedAmount.toFixed(2)}`}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </div>
          </div>
        </div>
        
        <Button onClick={performConversion} className="w-full" disabled={loading}>
          {loading ? 'Converting...' : 'Convert'}
        </Button>
      </CardContent>
    </Card>
  );
};