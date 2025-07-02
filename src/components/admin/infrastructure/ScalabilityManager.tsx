import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Zap, 
  Globe, 
  Shield, 
  Database, 
  Cloud,
  Activity,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react';

export const ScalabilityManager = () => {
  const [cacheStatus, setCacheStatus] = useState({
    redis: { status: 'active', hitRate: 94.2, memoryUsed: 67 },
    cloudflare: { status: 'active', hitRate: 89.7, bandwidth: 89 },
    application: { status: 'active', hitRate: 76.3, size: 45 }
  });

  const [cdnStatus, setCdnStatus] = useState({
    regions: 12,
    totalRequests: '1.2M',
    cacheHitRatio: 92.4,
    avgResponseTime: '45ms',
    bandwidthSaved: '67%'
  });

  const [microservices, setMicroservices] = useState([
    { name: 'User Service', status: 'healthy', instances: 3, cpu: 45, memory: 67 },
    { name: 'Product Service', status: 'healthy', instances: 5, cpu: 67, memory: 89 },
    { name: 'Order Service', status: 'healthy', instances: 4, cpu: 34, memory: 56 },
    { name: 'Payment Service', status: 'healthy', instances: 3, cpu: 23, memory: 34 },
    { name: 'Notification Service', status: 'warning', instances: 2, cpu: 89, memory: 91 }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Scalability Infrastructure</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Health Check
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Auto Scale Config
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Load</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">34%</div>
            <p className="text-xs text-muted-foreground">
              Optimal performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Instances</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17</div>
            <p className="text-xs text-muted-foreground">
              Auto-scaled services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <p className="text-xs text-muted-foreground">
              Excellent caching
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Latency</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">45ms</div>
            <p className="text-xs text-muted-foreground">
              Worldwide average
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="microservices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="microservices">Microservices</TabsTrigger>
          <TabsTrigger value="caching">Advanced Caching</TabsTrigger>
          <TabsTrigger value="cdn">CDN Management</TabsTrigger>
          <TabsTrigger value="autoscaling">Auto Scaling</TabsTrigger>
        </TabsList>

        <TabsContent value="microservices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Microservices Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {microservices.map((service, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.instances} instances running</p>
                      </div>
                      <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>
                        {service.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">CPU Usage</span>
                          <span className="text-sm">{service.cpu}%</span>
                        </div>
                        <Progress value={service.cpu} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Memory Usage</span>
                          <span className="text-sm">{service.memory}%</span>
                        </div>
                        <Progress value={service.memory} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Scale Up</Button>
                      <Button size="sm" variant="outline">View Logs</Button>
                      <Button size="sm" variant="outline">Restart</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="caching" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-red-500" />
                  Redis Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Hit Rate</span>
                      <span className="text-sm font-bold text-green-600">{cacheStatus.redis.hitRate}%</span>
                    </div>
                    <Progress value={cacheStatus.redis.hitRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Memory Used</span>
                      <span className="text-sm">{cacheStatus.redis.memoryUsed}%</span>
                    </div>
                    <Progress value={cacheStatus.redis.memoryUsed} />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Flush Cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-orange-500" />
                  CloudFlare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Hit Rate</span>
                      <span className="text-sm font-bold text-green-600">{cacheStatus.cloudflare.hitRate}%</span>
                    </div>
                    <Progress value={cacheStatus.cloudflare.hitRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Bandwidth Saved</span>
                      <span className="text-sm">{cacheStatus.cloudflare.bandwidth}%</span>
                    </div>
                    <Progress value={cacheStatus.cloudflare.bandwidth} />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Application Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Hit Rate</span>
                      <span className="text-sm font-bold text-green-600">{cacheStatus.application.hitRate}%</span>
                    </div>
                    <Progress value={cacheStatus.application.hitRate} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Cache Size</span>
                      <span className="text-sm">{cacheStatus.application.size}%</span>
                    </div>
                    <Progress value={cacheStatus.application.size} />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Optimize</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cdn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                CDN Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{cdnStatus.regions}</div>
                  <div className="text-sm text-muted-foreground">Global Regions</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{cdnStatus.totalRequests}</div>
                  <div className="text-sm text-muted-foreground">Total Requests/Day</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{cdnStatus.cacheHitRatio}%</div>
                  <div className="text-sm text-muted-foreground">Cache Hit Ratio</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{cdnStatus.avgResponseTime}</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Geographic Distribution</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>Asia-Pacific: 45%</div>
                    <div>North America: 25%</div>
                    <div>Europe: 20%</div>
                    <div>Others: 10%</div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Performance Optimization</h4>
                  <div className="flex gap-2">
                    <Button size="sm">Purge Cache</Button>
                    <Button size="sm" variant="outline">Configure Rules</Button>
                    <Button size="sm" variant="outline">Analytics</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="autoscaling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto Scaling Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Horizontal Auto Scaling</h4>
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">CPU Threshold:</span> 70%
                    </div>
                    <div>
                      <span className="font-medium">Memory Threshold:</span> 80%
                    </div>
                    <div>
                      <span className="font-medium">Min Instances:</span> 2
                    </div>
                    <div>
                      <span className="font-medium">Max Instances:</span> 10
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Load Balancing</h4>
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Algorithm:</span> Round Robin
                    </div>
                    <div>
                      <span className="font-medium">Health Checks:</span> Enabled
                    </div>
                    <div>
                      <span className="font-medium">Session Affinity:</span> Disabled
                    </div>
                    <div>
                      <span className="font-medium">Timeout:</span> 30s
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Resource Monitoring</h4>
                    <Switch defaultChecked />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Alert Threshold:</span> 85%
                    </div>
                    <div>
                      <span className="font-medium">Check Interval:</span> 1 minute
                    </div>
                    <div>
                      <span className="font-medium">Scale Up Delay:</span> 2 minutes
                    </div>
                    <div>
                      <span className="font-medium">Scale Down Delay:</span> 5 minutes
                    </div>
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