import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Container, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  HardDrive, 
  Network,
  MemoryStick
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InfrastructureHealth {
  overall_status: 'healthy' | 'degraded' | 'unhealthy';
  deployments_health: Record<string, { total: number; healthy: number }>;
  clusters_health: Record<string, { total: number; running: number; auto_scaling: number }>;
  pipelines_health: {
    total: number;
    successful: number;
    success_percentage: number;
    average_success_rate: number;
  };
  timestamp: string;
}

interface Deployment {
  id: string;
  deployment_name: string;
  environment: string;
  infrastructure_type: string;
  deployment_status: string;
  health_status: string;
  resource_utilization: any;
  deployed_at: string;
}

interface KubernetesCluster {
  id: string;
  cluster_name: string;
  environment: string;
  provider: string;
  cluster_status: string;
  cluster_version: string;
  auto_scaling_enabled: boolean;
  monitoring_enabled: boolean;
  created_at: string;
}

export const InfrastructureDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [infrastructureHealth, setInfrastructureHealth] = useState<InfrastructureHealth | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [clusters, setClusters] = useState<KubernetesCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInfrastructureData();
    const interval = setInterval(fetchInfrastructureData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchInfrastructureData = async () => {
    try {
      setLoading(true);

      // Fetch infrastructure health
      const healthResponse = await supabase.functions.invoke('infrastructure-manager', {
        body: { action: 'get_infrastructure_health' }
      });

      if (healthResponse.error) throw healthResponse.error;
      setInfrastructureHealth(healthResponse.data.health_summary);

      // Fetch deployments
      const { data: deploymentsData, error: deploymentsError } = await supabase
        .from('infrastructure_deployments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (deploymentsError) throw deploymentsError;
      setDeployments(deploymentsData || []);

      // Fetch clusters
      const { data: clustersData, error: clustersError } = await supabase
        .from('kubernetes_clusters')
        .select('*')
        .order('created_at', { ascending: false });

      if (clustersError) throw clustersError;
      setClusters(clustersData || []);

    } catch (error) {
      console.error('Failed to fetch infrastructure data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch infrastructure data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeployInfrastructure = async (type: string, environment: string) => {
    try {
      const response = await supabase.functions.invoke('infrastructure-manager', {
        body: {
          action: 'deploy_infrastructure',
          deployment_name: `${type}-${environment}-${Date.now()}`,
          environment,
          infrastructure_type: type,
          configuration: getDefaultConfiguration(type)
        }
      });

      if (response.error) throw response.error;

      toast({
        title: 'Deployment Initiated',
        description: `${type} deployment started for ${environment} environment`,
      });

      fetchInfrastructureData();
    } catch (error) {
      console.error('Deployment failed:', error);
      toast({
        title: 'Deployment Failed',
        description: 'Failed to initiate infrastructure deployment',
        variant: 'destructive',
      });
    }
  };

  const getDefaultConfiguration = (type: string) => {
    const configs = {
      kubernetes: {
        kubernetes_version: '1.28',
        node_pools: [
          { name: 'default', min_nodes: 1, max_nodes: 5, instance_type: 't3.medium' }
        ]
      },
      terraform: {
        terraform_version: '1.6.0',
        modules: ['vpc', 'ecs', 'rds']
      },
      docker: {
        docker_version: '24.0',
        compose_version: '2.0'
      },
      ansible: {
        ansible_version: '2.15',
        playbooks: ['site.yml']
      }
    };
    return configs[type as keyof typeof configs] || {};
  };

  const getStatusColor = (status: string) => {
    const colors = {
      healthy: 'bg-green-500',
      running: 'bg-green-500',
      deployed: 'bg-green-500',
      degraded: 'bg-yellow-500',
      deploying: 'bg-blue-500',
      provisioning: 'bg-blue-500',
      unhealthy: 'bg-red-500',
      failed: 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      healthy: <CheckCircle className="h-4 w-4" />,
      running: <CheckCircle className="h-4 w-4" />,
      deployed: <CheckCircle className="h-4 w-4" />,
      degraded: <AlertTriangle className="h-4 w-4" />,
      deploying: <Clock className="h-4 w-4" />,
      provisioning: <Clock className="h-4 w-4" />,
      unhealthy: <AlertTriangle className="h-4 w-4" />,
      failed: <AlertTriangle className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons] || <Activity className="h-4 w-4" />;
  };

  if (loading && !infrastructureHealth) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Infrastructure Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your infrastructure deployments and clusters
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleDeployInfrastructure('kubernetes', 'production')}
            variant="outline"
          >
            <Container className="h-4 w-4 mr-2" />
            Deploy K8s
          </Button>
          <Button 
            onClick={fetchInfrastructureData}
            variant="outline"
          >
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Overview Cards */}
      {infrastructureHealth && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
              {getStatusIcon(infrastructureHealth.overall_status)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge className={getStatusColor(infrastructureHealth.overall_status)}>
                  {infrastructureHealth.overall_status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                System-wide infrastructure status
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deployments</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deployments.length}</div>
              <p className="text-xs text-muted-foreground">
                Active deployments across environments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">K8s Clusters</CardTitle>
              <Container className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clusters.length}</div>
              <p className="text-xs text-muted-foreground">
                Running Kubernetes clusters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Success</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(infrastructureHealth.pipelines_health.success_percentage)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Recent pipeline success rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="clusters">Clusters</TabsTrigger>
          <TabsTrigger value="pipelines">CI/CD Pipelines</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Environment Health */}
            <Card>
              <CardHeader>
                <CardTitle>Environment Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {infrastructureHealth && Object.entries(infrastructureHealth.deployments_health).map(([env, health]) => (
                  <div key={env} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{env}</span>
                      <span className="text-sm text-muted-foreground">
                        {health.healthy}/{health.total}
                      </span>
                    </div>
                    <Progress 
                      value={health.total > 0 ? (health.healthy / health.total) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Deployments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deployments.slice(0, 5).map((deployment) => (
                    <div key={deployment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(deployment.deployment_status)}
                        <div>
                          <p className="text-sm font-medium">{deployment.deployment_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {deployment.environment} • {deployment.infrastructure_type}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(deployment.deployment_status)}>
                        {deployment.deployment_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Infrastructure Deployments</h3>
            <div className="space-x-2">
              <Button 
                onClick={() => handleDeployInfrastructure('terraform', 'staging')}
                variant="outline"
                size="sm"
              >
                Deploy Terraform
              </Button>
              <Button 
                onClick={() => handleDeployInfrastructure('ansible', 'production')}
                variant="outline"
                size="sm"
              >
                Deploy Ansible
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {deployments.map((deployment) => (
              <Card key={deployment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(deployment.health_status)}`} />
                      <div>
                        <h4 className="text-lg font-semibold">{deployment.deployment_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {deployment.environment} • {deployment.infrastructure_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {deployment.deployment_status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {deployment.resource_utilization && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">CPU</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(deployment.resource_utilization.cpu)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MemoryStick className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Memory</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(deployment.resource_utilization.memory)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Disk</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(deployment.resource_utilization.disk)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Network</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(deployment.resource_utilization.network)} MB/s
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Kubernetes Clusters</h3>
            <Button 
              onClick={() => handleDeployInfrastructure('kubernetes', 'production')}
              variant="outline"
              size="sm"
            >
              Create Cluster
            </Button>
          </div>

          <div className="grid gap-4">
            {clusters.map((cluster) => (
              <Card key={cluster.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(cluster.cluster_status)}`} />
                      <div>
                        <h4 className="text-lg font-semibold">{cluster.cluster_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cluster.environment} • {cluster.provider} • v{cluster.cluster_version}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {cluster.cluster_status}
                      </Badge>
                      {cluster.auto_scaling_enabled && (
                        <Badge variant="secondary">Auto-scaling</Badge>
                      )}
                      {cluster.monitoring_enabled && (
                        <Badge variant="secondary">Monitoring</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              CI/CD Pipeline management is available. Configure your pipelines to automate deployments.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Advanced monitoring and alerting is configured. View detailed metrics in your monitoring dashboard.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};