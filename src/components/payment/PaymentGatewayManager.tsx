import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  is_active: boolean;
  supported_currencies: any; // Changed from string[] to any to handle Json type
  transaction_fee_percentage: number;
  transaction_fee_fixed: number;
}

interface PaymentTransaction {
  id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
  orders: {
    order_number: string;
  };
  payment_gateways: {
    name: string;
  };
}

export default function PaymentGatewayManager() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      // Load payment gateways
      const { data: gatewayData, error: gatewayError } = await supabase
        .from('payment_gateways')
        .select('*')
        .order('name');

      if (gatewayError) throw gatewayError;
      setGateways(gatewayData || []);

      // Load recent transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('payment_transactions')
        .select(`
          *,
          orders (order_number),
          payment_gateways (name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionError) throw transactionError;
      setTransactions(transactionData || []);

    } catch (error) {
      console.error('Error loading payment data:', error);
      toast({
        title: "Error",
        description: "Failed to load payment data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (orderId: string, gatewayProvider: string, amount: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('payment-processing', {
        body: {
          action: 'create_payment',
          data: {
            orderId,
            gatewayProvider,
            paymentMethod: 'card',
            customerDetails: {
              name: 'Demo Customer',
              email: 'demo@example.com'
            }
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: data.message,
      });

      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
      }

      loadPaymentData(); // Refresh data
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': case 'processing': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return <div className="p-6">Loading payment gateway manager...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Payment Gateway Manager</h1>

      {/* Payment Gateways */}
      <Card>
        <CardHeader>
          <CardTitle>Available Payment Gateways</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gateway</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Currencies</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gateways.map((gateway) => (
                <TableRow key={gateway.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {gateway.name}
                    </div>
                  </TableCell>
                  <TableCell>{gateway.provider}</TableCell>
                  <TableCell>
                    <Badge variant={gateway.is_active ? 'default' : 'secondary'}>
                      {gateway.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(gateway.supported_currencies) 
                      ? gateway.supported_currencies.join(', ')
                      : JSON.stringify(gateway.supported_currencies)
                    }
                  </TableCell>
                  <TableCell>
                    {gateway.transaction_fee_percentage}% + ৳{gateway.transaction_fee_fixed}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => processPayment('demo-order', gateway.provider, 1000)}
                      disabled={!gateway.is_active}
                    >
                      Test Payment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.transaction_id}
                  </TableCell>
                  <TableCell>{transaction.orders.order_number}</TableCell>
                  <TableCell>{transaction.payment_gateways.name}</TableCell>
                  <TableCell>
                    {transaction.currency} {transaction.amount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}