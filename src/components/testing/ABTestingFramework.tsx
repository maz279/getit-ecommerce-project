import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  FlaskConical, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  Settings,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ABExperiment {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  type: string;
  variants: Array<{
    id: string;
    name: string;
    allocation: number;
    conversions: number;
    participants: number;
  }>;
  metrics: {
    primary: string;
    secondary: string[];
  };
  startDate?: string;
  endDate?: string;
  significance: number;
  confidence: number;
}

const ABTestingFramework: React.FC = () => {
  const { toast } = useToast();
  const [experiments, setExperiments] = useState<ABExperiment[]>([]);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [newExperiment, setNewExperiment] = useState({
    name: '',
    description: '',
    type: 'ui_test',
    primaryMetric: 'conversion_rate',
    secondaryMetrics: [] as string[],
    variants: [
      { name: 'Control', allocation: 50 },
      { name: 'Variant A', allocation: 50 }
    ]
  });

  const mockExperiments: ABExperiment[] = [
    {
      id: '1',
      name: 'Product Page CTA Button Color',
      description: 'Testing different button colors for add to cart',
      status: 'running',
      type: 'ui_test',
      variants: [
        { id: '1a', name: 'Control (Blue)', allocation: 50, conversions: 145, participants: 1200 },
        { id: '1b', name: 'Red Button', allocation: 50, conversions: 167, participants: 1180 }
      ],
      metrics: {
        primary: 'add_to_cart_rate',
        secondary: ['time_on_page', 'bounce_rate']
      },
      startDate: '2024-11-25',
      significance: 92,
      confidence: 95
    },
    {
      id: '2',
      name: 'Checkout Page Layout',
      description: 'Single page vs multi-step checkout process',
      status: 'completed',
      type: 'funnel_test',
      variants: [
        { id: '2a', name: 'Single Page', allocation: 50, conversions: 234, participants: 890 },
        { id: '2b', name: 'Multi-Step', allocation: 50, conversions: 198, participants: 910 }
      ],
      metrics: {
        primary: 'checkout_completion',
        secondary: ['cart_abandonment', 'time_to_complete']
      },
      startDate: '2024-11-15',
      endDate: '2024-11-30',
      significance: 87,
      confidence: 95
    },
    {
      id: '3',
      name: 'Homepage Hero Banner',
      description: 'Testing different hero banner designs and messaging',
      status: 'draft',
      type: 'content_test',
      variants: [
        { id: '3a', name: 'Current Design', allocation: 33, conversions: 0, participants: 0 },
        { id: '3b', name: 'Minimalist', allocation: 33, conversions: 0, participants: 0 },
        { id: '3c', name: 'Product Focus', allocation: 34, conversions: 0, participants: 0 }
      ],
      metrics: {
        primary: 'click_through_rate',
        secondary: ['engagement_time', 'scroll_depth']
      },
      significance: 0,
      confidence: 95
    }
  ];

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const { data, error } = await supabase
        .from('ab_experiments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching experiments:', error);
        setExperiments(mockExperiments);
      } else {
        // Transform data to match our interface
        const transformedExperiments = data?.map(exp => ({
          id: exp.id,
          name: exp.experiment_name,
          description: exp.description || '',
          status: exp.status as 'draft' | 'running' | 'paused' | 'completed',
          type: exp.experiment_type,
          variants: Array.isArray(exp.variants) ? exp.variants : [],
          metrics: {
            primary: Array.isArray(exp.success_metrics) ? exp.success_metrics[0] || 'conversion_rate' : 'conversion_rate',
            secondary: Array.isArray(exp.success_metrics) ? exp.success_metrics.slice(1) : []
          },
          startDate: exp.start_date,
          endDate: exp.end_date,
          significance: exp.statistical_significance || 0,
          confidence: 95
        })) || [];
        
        setExperiments(transformedExperiments.length > 0 ? transformedExperiments : mockExperiments);
      }
    } catch (error) {
      console.error('Error:', error);
      setExperiments(mockExperiments);
    } finally {
      setLoading(false);
    }
  };

  const createExperiment = async () => {
    try {
      setCreating(true);
      
      const experiment = {
        experiment_name: newExperiment.name,
        description: newExperiment.description,
        experiment_type: newExperiment.type,
        status: 'draft',
        variants: newExperiment.variants,
        success_metrics: [newExperiment.primaryMetric, ...newExperiment.secondaryMetrics],
        traffic_allocation: { total: 100 },
        target_audience: {},
        created_by: 'current-user' // This would be the actual user ID
      };

      const { data, error } = await supabase
        .from('ab_experiments')
        .insert([experiment])
        .select();

      if (error) throw error;

      toast({
        title: "Experiment Created",
        description: `"${newExperiment.name}" has been created successfully.`
      });

      // Reset form
      setNewExperiment({
        name: '',
        description: '',
        type: 'ui_test',
        primaryMetric: 'conversion_rate',
        secondaryMetrics: [],
        variants: [
          { name: 'Control', allocation: 50 },
          { name: 'Variant A', allocation: 50 }
        ]
      });

      // Refresh experiments
      fetchExperiments();
    } catch (error) {
      console.error('Error creating experiment:', error);
      toast({
        title: "Error",
        description: "Failed to create experiment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const updateExperimentStatus = async (experimentId: string, newStatus: string) => {
    try {
      setExperiments(prev => prev.map(exp => 
        exp.id === experimentId ? { ...exp, status: newStatus as any } : exp
      ));

      toast({
        title: "Status Updated",
        description: `Experiment has been ${newStatus}.`
      });
    } catch (error) {
      console.error('Error updating experiment:', error);
      toast({
        title: "Error",
        description: "Failed to update experiment status.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'draft': return <Settings className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const calculateConversionRate = (conversions: number, participants: number) => {
    return participants > 0 ? ((conversions / participants) * 100).toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <FlaskConical className="h-8 w-8 mr-3 text-primary" />
            A/B Testing Framework
          </h1>
          <p className="text-muted-foreground">Design, run, and analyze experiments to optimize your platform</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tests</p>
                <p className="text-2xl font-bold">{experiments.filter(e => e.status === 'running').length}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Tests</p>
                <p className="text-2xl font-bold">{experiments.filter(e => e.status === 'completed').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold">
                  {experiments.reduce((acc, exp) => 
                    acc + exp.variants.reduce((sum, variant) => sum + variant.participants, 0), 0
                  ).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Significance</p>
                <p className="text-2xl font-bold">
                  {(experiments.filter(e => e.significance > 0).reduce((acc, exp) => acc + exp.significance, 0) / 
                   experiments.filter(e => e.significance > 0).length || 0).toFixed(0)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="experiments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="create">Create Test</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="experiments" className="space-y-6">
          <div className="grid gap-6">
            {experiments.map((experiment) => (
              <Card key={experiment.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        {experiment.name}
                        <Badge className={`ml-3 ${getStatusColor(experiment.status)}`}>
                          {getStatusIcon(experiment.status)}
                          <span className="ml-1">{experiment.status}</span>
                        </Badge>
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">{experiment.description}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {experiment.status === 'draft' && (
                        <Button 
                          size="sm"
                          onClick={() => updateExperimentStatus(experiment.id, 'running')}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      
                      {experiment.status === 'running' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateExperimentStatus(experiment.id, 'paused')}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => updateExperimentStatus(experiment.id, 'completed')}
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        </>
                      )}
                      
                      {experiment.status === 'paused' && (
                        <Button 
                          size="sm"
                          onClick={() => updateExperimentStatus(experiment.id, 'running')}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Primary Metric</p>
                      <p className="font-semibold">{experiment.metrics.primary.replace('_', ' ')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Participants</p>
                      <p className="font-semibold">
                        {experiment.variants.reduce((sum, v) => sum + v.participants, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Statistical Significance</p>
                      <p className="font-semibold">{experiment.significance}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">
                        {experiment.startDate && new Date(experiment.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {experiment.status !== 'draft' && (
                    <div className="space-y-3">
                      {experiment.variants.map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{variant.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {calculateConversionRate(variant.conversions, variant.participants)}% conversion
                              </span>
                            </div>
                            <Progress 
                              value={variant.participants > 0 ? (variant.conversions / variant.participants) * 100 : 0} 
                              className="w-full" 
                            />
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-sm text-muted-foreground">
                              {variant.conversions} / {variant.participants}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {variant.allocation}% traffic
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New A/B Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Experiment Name</label>
                    <Input
                      placeholder="e.g., Homepage Hero Banner Test"
                      value={newExperiment.name}
                      onChange={(e) => setNewExperiment(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe what you're testing and why..."
                      value={newExperiment.description}
                      onChange={(e) => setNewExperiment(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Test Type</label>
                    <Select 
                      value={newExperiment.type} 
                      onValueChange={(value) => setNewExperiment(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ui_test">UI/UX Test</SelectItem>
                        <SelectItem value="content_test">Content Test</SelectItem>
                        <SelectItem value="funnel_test">Funnel Test</SelectItem>
                        <SelectItem value="pricing_test">Pricing Test</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Primary Metric</label>
                    <Select 
                      value={newExperiment.primaryMetric}
                      onValueChange={(value) => setNewExperiment(prev => ({ ...prev, primaryMetric: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                        <SelectItem value="click_through_rate">Click Through Rate</SelectItem>
                        <SelectItem value="add_to_cart_rate">Add to Cart Rate</SelectItem>
                        <SelectItem value="checkout_completion">Checkout Completion</SelectItem>
                        <SelectItem value="revenue_per_visitor">Revenue per Visitor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Test Variants</label>
                    <div className="space-y-2">
                      {newExperiment.variants.map((variant, index) => (
                        <div key={index} className="flex space-x-2">
                          <Input
                            placeholder="Variant name"
                            value={variant.name}
                            onChange={(e) => {
                              const newVariants = [...newExperiment.variants];
                              newVariants[index].name = e.target.value;
                              setNewExperiment(prev => ({ ...prev, variants: newVariants }));
                            }}
                          />
                          <Input
                            type="number"
                            placeholder="Traffic %"
                            value={variant.allocation}
                            onChange={(e) => {
                              const newVariants = [...newExperiment.variants];
                              newVariants[index].allocation = parseInt(e.target.value) || 0;
                              setNewExperiment(prev => ({ ...prev, variants: newVariants }));
                            }}
                            className="w-24"
                          />
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setNewExperiment(prev => ({
                        ...prev,
                        variants: [...prev.variants, { name: `Variant ${String.fromCharCode(65 + prev.variants.length - 1)}`, allocation: 0 }]
                      }))}
                    >
                      Add Variant
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setNewExperiment({
                    name: '',
                    description: '',
                    type: 'ui_test',
                    primaryMetric: 'conversion_rate',
                    secondaryMetrics: [],
                    variants: [
                      { name: 'Control', allocation: 50 },
                      { name: 'Variant A', allocation: 50 }
                    ]
                  })}
                >
                  Reset
                </Button>
                <Button 
                  onClick={createExperiment}
                  disabled={creating || !newExperiment.name || !newExperiment.description}
                >
                  {creating ? 'Creating...' : 'Create Experiment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/10 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Performance charts would go here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistical Significance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experiments.filter(e => e.status === 'running' || e.status === 'completed').map(exp => (
                    <div key={exp.id} className="flex items-center justify-between">
                      <span className="text-sm">{exp.name}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={exp.significance} className="w-20" />
                        <span className="text-sm w-12">{exp.significance}%</span>
                        {exp.significance >= 95 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ABTestingFramework;