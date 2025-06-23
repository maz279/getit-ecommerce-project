
import React from 'react';
import { Zap, Server, Database, Globe, Cpu, HardDrive } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const PlatformPerformanceSection: React.FC = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold flex items-center">
        <Zap className="h-6 w-6 mr-2 text-yellow-600" />
        Platform Performance Metrics
      </h2>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">Real-time</Button>
        <Button variant="outline" size="sm">Last Hour</Button>
        <Button variant="outline" size="sm">Last 24h</Button>
      </div>
    </div>

    {/* Key Performance Indicators */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-700">Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">245ms</div>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-500">Excellent</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-700">Uptime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">99.9%</div>
          <span className="text-xs text-gray-500">Last 30 days</span>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-700">Throughput</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">1.2K</div>
          <span className="text-xs text-gray-500">Requests/minute</span>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-orange-700">Error Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">0.1%</div>
          <span className="text-xs text-gray-500">Very low</span>
        </CardContent>
      </Card>
    </div>

    {/* Server Performance */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="h-5 w-5 mr-2" />
          Server Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center">
              <Cpu className="h-4 w-4 mr-2" />
              CPU Usage
            </h4>
            <div className="space-y-3">
              {[
                { server: 'Web Server 1', usage: 45, status: 'normal' },
                { server: 'Web Server 2', usage: 38, status: 'normal' },
                { server: 'API Server 1', usage: 62, status: 'warning' },
                { server: 'API Server 2', usage: 34, status: 'normal' }
              ].map((server, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{server.server}</span>
                    <Badge variant={server.status === 'warning' ? 'secondary' : 'outline'} className="text-xs">
                      {server.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20">
                      <Progress 
                        value={server.usage} 
                        className={server.usage > 60 ? 'text-orange-500' : 'text-green-500'} 
                      />
                    </div>
                    <span className="text-sm font-medium">{server.usage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Memory Usage
            </h4>
            <div className="space-y-3">
              {[
                { server: 'Web Server 1', usage: 67, status: 'warning' },
                { server: 'Web Server 2', usage: 45, status: 'normal' },
                { server: 'API Server 1', usage: 78, status: 'critical' },
                { server: 'API Server 2', usage: 52, status: 'normal' }
              ].map((server, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{server.server}</span>
                    <Badge 
                      variant={
                        server.status === 'critical' ? 'destructive' : 
                        server.status === 'warning' ? 'secondary' : 'outline'
                      } 
                      className="text-xs"
                    >
                      {server.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20">
                      <Progress 
                        value={server.usage} 
                        className={
                          server.usage > 75 ? 'text-red-500' : 
                          server.usage > 60 ? 'text-orange-500' : 'text-green-500'
                        } 
                      />
                    </div>
                    <span className="text-sm font-medium">{server.usage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Database Performance
            </h4>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Connection Pool</span>
                  <span className="text-sm">45/100</span>
                </div>
                <Progress value={45} />
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Query Response</span>
                  <span className="text-sm">12ms avg</span>
                </div>
                <Progress value={25} className="text-green-500" />
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                  <span className="text-sm">94%</span>
                </div>
                <Progress value={94} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Network & CDN Performance */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Network & CDN Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-4">Geographic Response Times</h4>
            <div className="space-y-3">
              {[
                { region: 'Dhaka', time: '45ms', status: 'excellent' },
                { region: 'Chittagong', time: '67ms', status: 'good' },
                { region: 'Sylhet', time: '89ms', status: 'fair' },
                { region: 'International', time: '234ms', status: 'normal' }
              ].map((region, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      region.status === 'excellent' ? 'bg-green-500' :
                      region.status === 'good' ? 'bg-blue-500' :
                      region.status === 'fair' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium">{region.region}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{region.time}</div>
                    <div className="text-xs text-gray-500 capitalize">{region.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">CDN Statistics</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">89%</div>
                  <div className="text-xs text-gray-600">Cache Hit Rate</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">156ms</div>
                  <div className="text-xs text-gray-600">Avg Load Time</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bandwidth Usage</span>
                  <span className="text-sm font-medium">2.3 TB</span>
                </div>
                <Progress value={68} />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data Transfer</span>
                  <span className="text-sm font-medium">45.6 GB/hour</span>
                </div>
                <Progress value={45} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Performance Alerts */}
    <Card>
      <CardHeader>
        <CardTitle>Recent Performance Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { type: 'warning', message: 'API Server 1 memory usage above 75%', time: '5 minutes ago' },
            { type: 'info', message: 'CDN cache refreshed successfully', time: '12 minutes ago' },
            { type: 'success', message: 'Database optimization completed', time: '1 hour ago' },
            { type: 'warning', message: 'High traffic detected from Dhaka region', time: '2 hours ago' }
          ].map((alert, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  alert.type === 'warning' ? 'bg-yellow-500' :
                  alert.type === 'success' ? 'bg-green-500' :
                  alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <span className="text-sm">{alert.message}</span>
              </div>
              <span className="text-xs text-gray-500">{alert.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
