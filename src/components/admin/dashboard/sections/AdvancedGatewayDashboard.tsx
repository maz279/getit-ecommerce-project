import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Zap, Smartphone, MapPin, TrendingUp, Server } from "lucide-react";

export function AdvancedGatewayDashboard() {
  const [graphqlMetrics, setGraphqlMetrics] = useState<any[]>([]);
  const [edgeNodes, setEdgeNodes] = useState<any[]>([]);
  const [walletStats, setWalletStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [graphqlData, edgeData, walletData] = await Promise.all([
        supabase.from('graphql_federation_metrics').select('*').limit(10),
        supabase.from('edge_nodes').select('*').eq('health_status', 'healthy'),
        supabase.from('mobile_money_wallets').select('wallet_provider, verification_status')
      ]);

      setGraphqlMetrics(graphqlData.data || []);
      setEdgeNodes(edgeData.data || []);
      
      const walletsByProvider = (walletData.data || []).reduce((acc: any, wallet: any) => {
        acc[wallet.wallet_provider] = (acc[wallet.wallet_provider] || 0) + 1;
        return acc;
      }, {});
      setWalletStats(walletsByProvider);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading advanced gateway metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Server className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Advanced Gateway & Bangladesh Features</h2>
      </div>

      <Tabs defaultValue="graphql" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="graphql">GraphQL Federation</TabsTrigger>
          <TabsTrigger value="edge">Edge Computing</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
          <TabsTrigger value="cultural">Cultural Features</TabsTrigger>
        </TabsList>

        <TabsContent value="graphql" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{graphqlMetrics.length}</div>
                <p className="text-xs text-muted-foreground">GraphQL operations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((graphqlMetrics.filter(m => m.cache_hit).length / Math.max(graphqlMetrics.length, 1)) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground">Query cache efficiency</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(graphqlMetrics.reduce((sum, m) => sum + m.execution_time_ms, 0) / Math.max(graphqlMetrics.length, 1))}ms
                </div>
                <p className="text-xs text-muted-foreground">Federation latency</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Services</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(graphqlMetrics.map(m => m.service_name)).size}
                </div>
                <p className="text-xs text-muted-foreground">Active federated services</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="edge" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Edge Nodes Status
                </CardTitle>
                <CardDescription>Geographic distribution of edge nodes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {edgeNodes.map((node) => (
                    <div key={node.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{node.node_name}</div>
                        <div className="text-sm text-muted-foreground">{node.city}, {node.country_code}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={node.health_status === 'healthy' ? 'default' : 'destructive'}>
                          {node.health_status}
                        </Badge>
                        <span className="text-sm">{Math.round(node.current_load)}% load</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rural Optimization</CardTitle>
                <CardDescription>Bangladesh-specific edge optimizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rural-enabled nodes:</span>
                    <span className="font-medium">{edgeNodes.filter(n => n.rural_optimization_enabled).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total edge nodes:</span>
                    <span className="font-medium">{edgeNodes.length}</span>
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    Optimize for Rural Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(walletStats).map(([provider, count]) => (
              <Card key={provider}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">{provider}</CardTitle>
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count as number}</div>
                  <p className="text-xs text-muted-foreground">Connected wallets</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Bangladesh Mobile Money Features</CardTitle>
              <CardDescription>Advanced payment orchestration capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2">
                <Badge variant="outline">Cross-wallet transfers</Badge>
                <Badge variant="outline">Installment payments</Badge>
                <Badge variant="outline">Micro-payment aggregation</Badge>
                <Badge variant="outline">Multi-provider support</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cultural" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Optimizations</CardTitle>
                <CardDescription>Bangladesh-specific features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Bengali NLP Processing</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Islamic Calendar</span>
                    <Badge variant="default">Integrated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Festival Optimizations</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Regional Business Hours</span>
                    <Badge variant="default">Configured</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rural Connectivity</CardTitle>
                <CardDescription>Bandwidth optimization features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Offline Sync</span>
                    <Badge variant="default">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SMS Fallback</span>
                    <Badge variant="default">Configured</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Compression</span>
                    <Badge variant="default">Adaptive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}