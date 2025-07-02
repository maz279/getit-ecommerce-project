import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommissionCalculation {
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  platformFee: number;
  netCommission: number;
  taxDeduction: number;
  finalPayout: number;
}

export const CommissionCalculator: React.FC = () => {
  const [grossAmount, setGrossAmount] = useState<string>('');
  const [productCategory, setProductCategory] = useState<string>('');
  const [calculation, setCalculation] = useState<CommissionCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [commissionRates, setCommissionRates] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCommissionRates();
  }, []);

  const fetchCommissionRates = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_commission_rates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommissionRates(data || []);
    } catch (error) {
      console.error('Error fetching commission rates:', error);
    }
  };

  const calculateCommission = async () => {
    if (!grossAmount || parseFloat(grossAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid gross amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('calculate_vendor_commission', {
        p_vendor_id: null, // For general calculation
        p_gross_amount: parseFloat(grossAmount),
        p_product_category: productCategory || null,
        p_transaction_date: new Date().toISOString().split('T')[0]
      });

      if (error) throw error;

      const result = data[0];
      const taxRate = 0.05; // 5% tax
      const taxDeduction = result.net_commission * taxRate;
      const finalPayout = result.net_commission - taxDeduction;

      setCalculation({
        grossAmount: parseFloat(grossAmount),
        commissionRate: result.commission_rate,
        commissionAmount: result.commission_amount,
        platformFee: result.platform_fee,
        netCommission: result.net_commission,
        taxDeduction,
        finalPayout
      });

      toast({
        title: "Commission Calculated",
        description: "Commission breakdown calculated successfully",
      });
    } catch (error) {
      console.error('Error calculating commission:', error);
      toast({
        title: "Calculation Error",
        description: "Failed to calculate commission",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetCalculation = () => {
    setGrossAmount('');
    setProductCategory('');
    setCalculation(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Commission Calculator
          </CardTitle>
          <CardDescription>
            Calculate commission breakdown for sales transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gross-amount">Gross Sale Amount (BDT)</Label>
              <Input
                id="gross-amount"
                type="number"
                placeholder="Enter sale amount"
                value={grossAmount}
                onChange={(e) => setGrossAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Product Category (Optional)</Label>
              <Input
                id="category"
                placeholder="e.g., Electronics, Fashion"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={calculateCommission} disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate Commission'}
            </Button>
            <Button variant="outline" onClick={resetCalculation}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Commission Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gross Amount</span>
                  <Badge variant="outline">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ৳{calculation.grossAmount.toLocaleString()}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Commission Rate</span>
                  <Badge variant="secondary">
                    <Percent className="h-3 w-3 mr-1" />
                    {calculation.commissionRate}%
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Commission Amount</span>
                  <Badge variant="default">
                    ৳{calculation.commissionAmount.toLocaleString()}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Platform Fee</span>
                <span className="text-red-600">-৳{calculation.platformFee.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax Deduction (5%)</span>
                <span className="text-red-600">-৳{calculation.taxDeduction.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Final Payout</span>
                <span className="text-green-600">৳{calculation.finalPayout.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Calculation Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Commission earned: ৳{calculation.commissionAmount.toLocaleString()} ({calculation.commissionRate}% of gross)</p>
                <p>• Platform fee deducted: ৳{calculation.platformFee.toLocaleString()}</p>
                <p>• Tax deducted: ৳{calculation.taxDeduction.toLocaleString()} (5% of net commission)</p>
                <p>• <strong>You will receive: ৳{calculation.finalPayout.toLocaleString()}</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Commission Rates</CardTitle>
          <CardDescription>Active commission rates by category</CardDescription>
        </CardHeader>
        <CardContent>
          {commissionRates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commissionRates.map((rate) => (
                <div key={rate.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {rate.product_type || 'General'}
                    </span>
                    <Badge>{rate.base_rate}%</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Platform Fee: {rate.platform_fee_rate || 0}%</p>
                    {rate.minimum_amount && (
                      <p>Min: ৳{rate.minimum_amount.toLocaleString()}</p>
                    )}
                    {rate.maximum_amount && (
                      <p>Max: ৳{rate.maximum_amount.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No commission rates configured</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};