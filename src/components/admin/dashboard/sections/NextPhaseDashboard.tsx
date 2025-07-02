import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Search, 
  Globe, 
  TrendingUp, 
  Users, 
  Zap,
  Brain,
  Target,
  Gauge,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PricingModel {
  id: string;
  model_name: string;
  model_type: string;
  is_active: boolean;
  configuration: any;
}

interface OptimizationResult {
  id: string;
  product_id: string;
  current_price: number;
  suggested_price: number;
  optimization_reason: string;
  confidence_score: number;
  status: string;
}

interface RegionData {
  id: string;
  region_code: string;
  region_name: string;
  is_active: boolean;
  currency_code: string;
}

const NextPhaseDashboard: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pricingModels, setPricingModels] = useState<PricingModel[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [searchMetrics, setSearchMetrics] = useState<any>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPricingModels(),
        loadOptimizationResults(),
        loadRegions(),
        loadSearchMetrics()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPricingModels = async () => {
    const { data, error } = await supabase
      .from('dynamic_pricing_models')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPricingModels(data);
    }
  };

  const loadOptimizationResults = async () => {
    const { data, error } = await supabase
      .from('price_optimization_results')
      .select(`
        id,
        product_id,
        current_price,
        suggested_price,
        optimization_reason,
        confidence_score,
        status
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setOptimizationResults(data);
    }
  };

  const loadRegions = async () => {
    const { data, error } = await supabase
      .from('geo_regions')
      .select('*')
      .eq('is_active', true)
      .order('region_name');

    if (!error && data) {
      setRegions(data);
    }
  };

  const loadSearchMetrics = async () => {
    // Mock search metrics for now
    setSearchMetrics({
      totalSearches: 125840,
      avgResponseTime: 245,
      conversionRate: 12.8,
      personalizedResults: 78.5
    });
  };

  const triggerPriceOptimization = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/dynamic-pricing-optimization',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'bulk_optimize',
            modelType: 'ai_driven'
          })
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Price optimization started successfully"
        });
        await loadOptimizationResults();
      }
    } catch (error) {
      console.error('Error triggering optimization:', error);
      toast({
        title: "Error",
        description: "Failed to trigger price optimization",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testSearchEngine = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/ai-enhanced-search',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: 'women fashion saree',
            usePersonalization: true,
            useSemanticSearch: true,
            limit: 10
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Search Engine Test",
          description: `Found ${data.products?.length || 0} results with ${data.suggestions?.length || 0} suggestions`
        });
      }
    } catch (error) {
      console.error('Error testing search:', error);
      toast({
        title: "Error",
        description: "Failed to test search engine",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testMultiRegion = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://bbgppsjimspmyrfowytf.supabase.co/functions/v1/multi-region-orchestrator?action=get_config&region=BD-DH',
        {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3Bwc2ptc3BteW1yZm93eXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTUzNTcsImV4cCI6MjA2NTY3MTM1N30.qk_wrVRHkJh-oXBbxFWnZwfGoZmdBK35Ce7bBoRQ0To`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Multi-Region Test",
          description: `Configuration loaded for ${data.config?.regionCode || 'Unknown'} region`
        });
      }
    } catch (error) {
      console.error('Error testing multi-region:', error);
      toast({
        title: "Error",
        description: "Failed to test multi-region setup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPriceOptimizationTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Active Models</p>
                <p className="text-2xl font-bold">{pricingModels.filter(m => m.is_active).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium">Optimizations</p>
                <p className="text-2xl font-bold">{optimizationResults.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Avg Confidence</p>
                <p className="text-2xl font-bold">
                  {optimizationResults.length > 0 
                    ? Math.round(optimizationResults.reduce((acc, r) => acc + r.confidence_score, 0) / optimizationResults.length * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gauge className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium">ROI Impact</p>
                <p className="text-2xl font-bold">+15.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pricing Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pricingModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{model.model_name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{model.model_type.replace('_', ' ')}</p>
                  </div>
                  <Badge variant={model.is_active ? "default" : "secondary"}>
                    {model.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              onClick={triggerPriceOptimization} 
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? "Running..." : "Run Optimization"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {optimizationResults.map((result) => (
                <div key={result.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Product ID: {result.product_id}</h4>
                    <Badge variant={result.status === 'pending' ? "secondary" : "default"}>
                      {result.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-medium">৳{result.current_price}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Suggested: </span>
                      <span className="font-medium text-primary">৳{result.suggested_price}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Confidence</span>
                      <span className="text-xs font-medium">{Math.round(result.confidence_score * 100)}%</span>
                    </div>
                    <Progress value={result.confidence_score * 100} className="h-1 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSearchDiscoveryTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Searches</p>
                <p className="text-2xl font-bold">{searchMetrics.totalSearches?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold">{searchMetrics.avgResponseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold">{searchMetrics.conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Personalized</p>
                <p className="text-2xl font-bold">{searchMetrics.personalizedResults}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Semantic Search</h4>
                  <p className="text-sm text-muted-foreground">AI-powered understanding</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Visual Search</h4>
                  <p className="text-sm text-muted-foreground">Image-based product discovery</p>
                </div>
                <Badge variant="secondary">Development</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Voice Search</h4>
                  <p className="text-sm text-muted-foreground">Bangla voice recognition</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Personalization</h4>
                  <p className="text-sm text-muted-foreground">User-specific results</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            <Button 
              onClick={testSearchEngine} 
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? "Testing..." : "Test Search Engine"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Query Understanding</span>
                  <span className="text-sm">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Result Relevance</span>
                  <span className="text-sm">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">User Satisfaction</span>
                  <span className="text-sm">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Search Coverage</span>
                  <span className="text-sm">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMultiRegionTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium">Active Regions</p>
                <p className="text-2xl font-bold">{regions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Localized Content</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Gauge className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium">Compliance</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Latency</p>
                <p className="text-2xl font-bold">127ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regional Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {regions.map((region) => (
                <div key={region.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{region.region_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {region.region_code} • {region.currency_code}
                    </p>
                  </div>
                  <Badge variant={region.is_active ? "default" : "secondary"}>
                    {region.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              onClick={testMultiRegion} 
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? "Testing..." : "Test Multi-Region Setup"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Content Localization</h4>
                  <p className="text-sm text-muted-foreground">Multi-language support</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Regional Pricing</h4>
                  <p className="text-sm text-muted-foreground">Tax & currency adjustments</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Local Inventory</h4>
                  <p className="text-sm text-muted-foreground">Region-specific stock</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Compliance Monitoring</h4>
                  <p className="text-sm text-muted-foreground">Regulatory compliance</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Next Phase Implementation</h2>
          <p className="text-muted-foreground">
            Dynamic Pricing, Advanced Search & Multi-region Deployment
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Phase 2 • Amazon/Shopee Level
        </Badge>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Dynamic Pricing
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Advanced Search
          </TabsTrigger>
          <TabsTrigger value="region" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Multi-Region
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-6">
          {renderPriceOptimizationTab()}
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          {renderSearchDiscoveryTab()}
        </TabsContent>

        <TabsContent value="region" className="space-y-6">
          {renderMultiRegionTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NextPhaseDashboard;