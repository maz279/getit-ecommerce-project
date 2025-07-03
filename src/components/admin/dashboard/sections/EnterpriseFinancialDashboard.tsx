import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, PieChart, Calculator, FileText, BarChart3 } from "lucide-react";

interface FinancialData {
  chart_of_accounts: any[];
  vat_transactions: any[];
  income_tax_records: any[];
  financial_invoices: any[];
  budget_plans: any[];
}

export const EnterpriseFinancialDashboard = () => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    chart_of_accounts: [],
    vat_transactions: [],
    income_tax_records: [],
    financial_invoices: [],
    budget_plans: []
  });
  const [loading, setLoading] = useState(true);
  const [vatCalculation, setVatCalculation] = useState({
    vendor_id: '',
    order_id: '',
    taxable_amount: '',
    product_category: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const [accounts, vatTrans, taxRecords, invoices, budgets] = await Promise.all([
        supabase.from('chart_of_accounts').select('*').limit(10),
        supabase.from('vat_transactions').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('income_tax_records').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('financial_invoices').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('budget_plans').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      setFinancialData({
        chart_of_accounts: accounts.data || [],
        vat_transactions: vatTrans.data || [],
        income_tax_records: taxRecords.data || [],
        financial_invoices: invoices.data || [],
        budget_plans: budgets.data || []
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch financial data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateVAT = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('financial-management-service', {
        body: {
          action: 'calculate_vat',
          data: {
            ...vatCalculation,
            taxable_amount: parseFloat(vatCalculation.taxable_amount)
          }
        }
      });

      if (error) throw error;

      toast({
        title: "VAT Calculated",
        description: `VAT Amount: ৳${data.vat_amount.toFixed(2)} (${data.vat_rate}%)`,
      });

      fetchFinancialData(); // Refresh data
    } catch (error) {
      console.error('VAT calculation error:', error);
      toast({
        title: "Error",
        description: "Failed to calculate VAT",
        variant: "destructive",
      });
    }
  };

  const generateFinancialStatement = async (statementType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('financial-management-service', {
        body: {
          action: 'get_financial_statements',
          data: {
            statement_type: statementType,
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0]
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Financial Statement Generated",
        description: `${data.statement_type} for ${data.period}`,
      });
    } catch (error) {
      console.error('Statement generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate financial statement",
        variant: "destructive",
      });
    }
  };

  // Calculate summary metrics
  const totalVATAmount = financialData.vat_transactions.reduce((sum, vat) => sum + (vat.vat_amount || 0), 0);
  const totalInvoiceAmount = financialData.financial_invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const pendingInvoices = financialData.financial_invoices.filter(inv => inv.status === 'sent').length;
  const totalBudget = financialData.budget_plans.reduce((sum, budget) => sum + (budget.budgeted_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Enterprise Financial Management</h2>
        <Button onClick={fetchFinancialData} disabled={loading}>
          {loading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium">Total VAT Collected</p>
                <p className="text-2xl font-bold">৳{totalVATAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Invoices</p>
                <p className="text-2xl font-bold">৳{totalInvoiceAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Pending Invoices</p>
                <p className="text-2xl font-bold">{pendingInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm font-medium">Total Budget</p>
                <p className="text-2xl font-bold">৳{totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="vat">VAT Management</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="invoices">Invoice Management</TabsTrigger>
          <TabsTrigger value="tax">Income Tax</TabsTrigger>
          <TabsTrigger value="statements">Financial Statements</TabsTrigger>
        </TabsList>

        <TabsContent value="vat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VAT Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Bangladesh VAT Calculator (15%)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="vendor_id">Vendor ID</Label>
                  <Input
                    id="vendor_id"
                    value={vatCalculation.vendor_id}
                    onChange={(e) => setVatCalculation({...vatCalculation, vendor_id: e.target.value})}
                    placeholder="Enter vendor ID"
                  />
                </div>
                <div>
                  <Label htmlFor="order_id">Order ID</Label>
                  <Input
                    id="order_id"
                    value={vatCalculation.order_id}
                    onChange={(e) => setVatCalculation({...vatCalculation, order_id: e.target.value})}
                    placeholder="Enter order ID"
                  />
                </div>
                <div>
                  <Label htmlFor="taxable_amount">Taxable Amount (BDT)</Label>
                  <Input
                    id="taxable_amount"
                    type="number"
                    value={vatCalculation.taxable_amount}
                    onChange={(e) => setVatCalculation({...vatCalculation, taxable_amount: e.target.value})}
                    placeholder="Enter taxable amount"
                  />
                </div>
                <div>
                  <Label htmlFor="product_category">Product Category</Label>
                  <Select 
                    value={vatCalculation.product_category} 
                    onValueChange={(value) => setVatCalculation({...vatCalculation, product_category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="groceries">Groceries</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={calculateVAT} className="w-full">
                  Calculate VAT
                </Button>
              </CardContent>
            </Card>

            {/* Recent VAT Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent VAT Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {financialData.vat_transactions.slice(0, 5).map((vat, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">Order: {vat.order_id}</p>
                        <p className="text-sm text-muted-foreground">Rate: {vat.vat_rate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">৳{vat.vat_amount.toLocaleString()}</p>
                        <Badge variant={vat.status === 'active' ? 'default' : 'secondary'}>
                          {vat.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {financialData.chart_of_accounts.map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{account.account_name}</p>
                      <p className="text-sm text-muted-foreground">Code: {account.account_code}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={account.account_type === 'revenue' ? 'default' : 'secondary'}>
                        {account.account_type}
                      </Badge>
                      <p className="text-sm mt-1">{account.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {financialData.financial_invoices.map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{invoice.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">Type: {invoice.invoice_type}</p>
                      <p className="text-sm text-muted-foreground">Due: {invoice.due_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">৳{invoice.total_amount.toLocaleString()}</p>
                      <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Tax Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {financialData.income_tax_records.map((tax, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Tax Year: {tax.tax_year}</p>
                      <p className="text-sm text-muted-foreground">Gross Income: ৳{tax.gross_income.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Due: {tax.due_date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">৳{tax.tax_amount.toLocaleString()}</p>
                      <Badge variant={tax.filing_status === 'paid' ? 'default' : 'secondary'}>
                        {tax.filing_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Statement Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => generateFinancialStatement('profit_loss')} className="h-20 flex-col">
                  <PieChart className="h-6 w-6 mb-2" />
                  Profit & Loss Statement
                </Button>
                <Button onClick={() => generateFinancialStatement('balance_sheet')} className="h-20 flex-col" variant="outline">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Balance Sheet
                </Button>
                <Button onClick={() => generateFinancialStatement('cash_flow')} className="h-20 flex-col" variant="outline">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Cash Flow Statement
                </Button>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Financial Period Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Period:</p>
                    <p className="font-medium">January 1, 2025 - January 31, 2025</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status:</p>
                    <Badge variant="default">Open</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};