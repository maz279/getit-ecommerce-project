import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, Clock, CheckCircle, XCircle, Truck, AlertTriangle, 
  PlayCircle, PauseCircle, SkipForward, RotateCcw, MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  customer_id: string;
  created_at: string;
  customer?: {
    full_name: string;
  };
}

interface WorkflowStep {
  id: string;
  order_id: string;
  step_name: string;
  step_status: string;
  started_at: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  notes: string | null;
  estimated_completion: string | null;
  metadata: any;
  created_at?: string;
  updated_at?: string;
}

const WORKFLOW_STEPS = [
  { key: 'payment_confirmed', label: 'Payment Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'picking', label: 'Picking', icon: Package },
  { key: 'packing', label: 'Packing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const AdvancedOrderWorkflow: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [updateNotes, setUpdateNotes] = useState('');

  // Real-time subscription for order updates
  useEffect(() => {
    const subscription = supabase
      .channel('order-workflow')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'order_workflow_steps' },
        (payload) => {
          console.log('Workflow update:', payload);
          if (selectedOrder) {
            fetchWorkflowSteps(selectedOrder.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('vendor-order-management', {
        body: { action: 'orders' }
      });

      if (error) throw error;
      setOrders(data?.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkflowSteps = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_workflow_steps')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setWorkflowSteps(data || []);
    } catch (error) {
      console.error('Error fetching workflow steps:', error);
    }
  };

  const updateWorkflowStep = async (orderId: string, stepName: string, newStatus: string, notes?: string) => {
    try {
      const now = new Date().toISOString();
      let updateData: any = {
        step_status: newStatus,
        notes: notes || null
      };

      if (newStatus === 'in_progress') {
        updateData.started_at = now;
      } else if (newStatus === 'completed') {
        updateData.completed_at = now;
      }

      const { error } = await supabase
        .from('order_workflow_steps')
        .upsert({
          order_id: orderId,
          step_name: stepName,
          ...updateData
        }, {
          onConflict: 'order_id,step_name'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Order step ${stepName} updated to ${newStatus}`,
      });

      fetchWorkflowSteps(orderId);
    } catch (error) {
      console.error('Error updating workflow step:', error);
      toast({
        title: "Error",
        description: "Failed to update workflow step",
        variant: "destructive",
      });
    }
  };

  const getStepProgress = (steps: WorkflowStep[]) => {
    const totalSteps = WORKFLOW_STEPS.length;
    const completedSteps = steps.filter(step => step.step_status === 'completed').length;
    return (completedSteps / totalSteps) * 100;
  };

  const getStepStatus = (stepKey: string, steps: WorkflowStep[]) => {
    const step = steps.find(s => s.step_name === stepKey);
    return step?.step_status || 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return ['pending', 'processing'].includes(order.status);
    if (activeTab === 'shipped') return ['shipped', 'out_for_delivery'].includes(order.status);
    if (activeTab === 'delivered') return order.status === 'delivered';
    return true;
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Order Workflow</h2>
          <p className="text-muted-foreground">Manage order processing with detailed workflow tracking</p>
        </div>
        <Button onClick={fetchOrders} variant="outline">
          Refresh Orders
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold">#{order.order_number}</h3>
                      <Badge variant={getStatusColor(order.status) as any}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer: {order.customer?.full_name || 'Unknown'}
                    </p>
                    <p className="font-medium">৳{order.total_amount}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            fetchWorkflowSteps(order.id);
                          }}
                        >
                          View Workflow
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order Workflow - #{order.order_number}</DialogTitle>
                          <DialogDescription>
                            Track and manage the order processing workflow
                          </DialogDescription>
                        </DialogHeader>

                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Progress Overview */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Progress Overview</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <Progress value={getStepProgress(workflowSteps)} className="w-full" />
                                  <p className="text-sm text-muted-foreground">
                                    {workflowSteps.filter(s => s.step_status === 'completed').length} of {WORKFLOW_STEPS.length} steps completed
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Workflow Steps */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Workflow Steps</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  {WORKFLOW_STEPS.map((step, index) => {
                                    const stepStatus = getStepStatus(step.key, workflowSteps);
                                    const stepData = workflowSteps.find(s => s.step_name === step.key);
                                    const IconComponent = step.icon;

                                    return (
                                      <div key={step.key} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                          <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium w-6">
                                              {index + 1}
                                            </span>
                                            {getStatusIcon(stepStatus)}
                                            <IconComponent className="w-5 h-5 text-muted-foreground" />
                                          </div>
                                          <div>
                                            <p className="font-medium">{step.label}</p>
                                            {stepData?.notes && (
                                              <p className="text-sm text-muted-foreground">{stepData.notes}</p>
                                            )}
                                            {stepData?.started_at && (
                                              <p className="text-xs text-muted-foreground">
                                                Started: {new Date(stepData.started_at).toLocaleString()}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                          <Badge variant={getStatusColor(stepStatus) as any}>
                                            {stepStatus.replace('_', ' ')}
                                          </Badge>
                                          
                                          {stepStatus === 'pending' && (
                                            <Button
                                              size="sm"
                                              onClick={() => updateWorkflowStep(selectedOrder.id, step.key, 'in_progress')}
                                            >
                                              Start
                                            </Button>
                                          )}
                                          
                                          {stepStatus === 'in_progress' && (
                                            <div className="flex space-x-1">
                                              <Dialog>
                                                <DialogTrigger asChild>
                                                  <Button size="sm">Complete</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                  <DialogHeader>
                                                    <DialogTitle>Complete Step: {step.label}</DialogTitle>
                                                    <DialogDescription>
                                                      Add any notes about completing this step
                                                    </DialogDescription>
                                                  </DialogHeader>
                                                  <div className="space-y-4">
                                                    <div>
                                                      <Label htmlFor="notes">Notes (optional)</Label>
                                                      <Textarea
                                                        id="notes"
                                                        value={updateNotes}
                                                        onChange={(e) => setUpdateNotes(e.target.value)}
                                                        placeholder="Add completion notes..."
                                                      />
                                                    </div>
                                                    <Button
                                                      onClick={() => {
                                                        updateWorkflowStep(selectedOrder.id, step.key, 'completed', updateNotes);
                                                        setUpdateNotes('');
                                                      }}
                                                      className="w-full"
                                                    >
                                                      Mark as Completed
                                                    </Button>
                                                  </div>
                                                </DialogContent>
                                              </Dialog>
                                              
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateWorkflowStep(selectedOrder.id, step.key, 'failed')}
                                              >
                                                Mark Failed
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Timeline */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Timeline</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  {workflowSteps
                                    .filter(step => step.started_at)
                                    .sort((a, b) => new Date(a.started_at!).getTime() - new Date(b.started_at!).getTime())
                                    .map((step) => (
                                      <div key={step.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                                        {getStatusIcon(step.step_status)}
                                        <div className="flex-1">
                                          <p className="font-medium capitalize">
                                            {step.step_name.replace('_', ' ')}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {step.started_at && new Date(step.started_at).toLocaleString()}
                                          </p>
                                          {step.notes && (
                                            <p className="text-sm mt-1">{step.notes}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders found for this filter</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedOrderWorkflow;