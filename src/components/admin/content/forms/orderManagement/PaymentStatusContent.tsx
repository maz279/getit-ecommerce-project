
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

export const PaymentStatusContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Status</h1>
          <p className="text-gray-600 mt-1">Monitor payment processing and transaction status</p>
        </div>
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          Process Payments
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,456</div>
            <p className="text-xs text-muted-foreground">94.2% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳23,45,670</div>
            <p className="text-xs text-muted-foreground">Today's collections</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '#PAY-2024-001', order: '#ORD-2024-001', customer: 'Sarah Ahmed', amount: '৳2,850', method: 'bKash', status: 'Success', time: '2 min ago' },
              { id: '#PAY-2024-002', order: '#ORD-2024-002', customer: 'Mohammad Rahman', amount: '৳1,650', method: 'Credit Card', status: 'Pending', time: '5 min ago' },
              { id: '#PAY-2024-003', order: '#ORD-2024-003', customer: 'Fatima Khan', amount: '৳3,200', method: 'Nagad', status: 'Success', time: '8 min ago' },
              { id: '#PAY-2024-004', order: '#ORD-2024-004', customer: 'Ahmed Hassan', amount: '৳850', method: 'Rocket', status: 'Failed', time: '12 min ago' }
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
                  </div>
                  <Badge className={
                    payment.status === 'Success' ? 'bg-green-100 text-green-800' :
                    payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {payment.status}
                  </Badge>
                  <div className="text-xs text-gray-500">{payment.time}</div>
                  <Button size="sm" variant="outline">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
