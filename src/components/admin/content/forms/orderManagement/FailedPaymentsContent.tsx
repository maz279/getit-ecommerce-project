
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, RefreshCw, CreditCard, XCircle } from 'lucide-react';

export const FailedPaymentsContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Failed Payments</h1>
          <p className="text-gray-600 mt-1">Monitor and resolve payment failures</p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs opacity-80">Payment failures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retry Success Rate</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <p className="text-xs text-muted-foreground">Successful retries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lost Revenue</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳12,450</div>
            <p className="text-xs text-muted-foreground">Potential revenue loss</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Failure Reason</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43%</div>
            <p className="text-xs text-muted-foreground">Insufficient funds</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Failed Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '#PAY-2024-005', order: '#ORD-2024-005', customer: 'Nusrat Jahan', amount: '৳1,200', method: 'bKash', reason: 'Insufficient funds', time: '10 min ago' },
              { id: '#PAY-2024-006', order: '#ORD-2024-006', customer: 'Karim Sheikh', amount: '৳2,400', method: 'Credit Card', reason: 'Card expired', time: '15 min ago' },
              { id: '#PAY-2024-007', order: '#ORD-2024-007', customer: 'Ruma Akter', amount: '৳950', method: 'Nagad', reason: 'Network error', time: '20 min ago' },
              { id: '#PAY-2024-008', order: '#ORD-2024-008', customer: 'Habib Rahman', amount: '৳1,750', method: 'Rocket', reason: 'Transaction timeout', time: '25 min ago' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold">{payment.id}</p>
                    <p className="text-sm text-gray-600">{payment.customer}</p>
                    <p className="text-xs text-gray-500">Order: {payment.order}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold">{payment.amount}</p>
                    <p className="text-xs text-gray-500">{payment.method}</p>
                    <p className="text-xs text-red-600">{payment.reason}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    Failed
                  </Badge>
                  <div className="text-xs text-gray-500">{payment.time}</div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
