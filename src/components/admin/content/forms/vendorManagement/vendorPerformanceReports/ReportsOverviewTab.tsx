
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Eye, Edit, Trash2, Download, Calendar } from 'lucide-react';
import { VendorPerformanceService, VendorPerformanceReport } from '@/services/database/VendorPerformanceService';
import { toast } from 'sonner';

export const ReportsOverviewTab: React.FC = () => {
  const [reports, setReports] = useState<VendorPerformanceReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<VendorPerformanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportTypeFilter, setReportTypeFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchTerm, statusFilter, reportTypeFilter]);

  const loadReports = async () => {
    try {
      const data = await VendorPerformanceService.getPerformanceReports();
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.vendor_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (reportTypeFilter !== 'all') {
      filtered = filtered.filter(report => report.report_type === reportTypeFilter);
    }

    setFilteredReports(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search reports by vendor ID or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No reports found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Vendor ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Period</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Orders</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{report.vendor_id}</div>
                        <div className="text-sm text-gray-500">
                          Level: {report.seller_level || 'bronze'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {report.report_period_start} to {report.report_period_end}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{report.report_type}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {formatCurrency(report.total_revenue || 0)}
                        </div>
                        <div className="text-sm text-gray-500">
                          AOV: {formatCurrency(report.average_order_value || 0)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{report.total_orders || 0}</div>
                        <div className="text-sm text-gray-500">
                          Conv: {report.conversion_rate || 0}%
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">⭐</span>
                          <span className="font-medium">{report.average_rating || 0}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {report.review_count || 0} reviews
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(report.status || 'draft')}>
                          {report.status || 'draft'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye size={14} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit size={14} />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download size={14} />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
