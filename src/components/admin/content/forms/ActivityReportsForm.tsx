
import React, { useState } from 'react';
import { FileText, Download, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityReportsStats } from './activityReports/ActivityReportsStats';
import { ActivityReportsFilters } from './activityReports/ActivityReportsFilters';
import { ActivityReportsTabs } from './activityReports/ActivityReportsTabs';

export const ActivityReportsForm: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last30days');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => setIsGeneratingReport(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Activity Reports
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive analytics and reporting for user activities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerateReport} disabled={isGeneratingReport}>
            {isGeneratingReport ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Generate Report
          </Button>
          <Button>
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      <ActivityReportsStats />
      
      <ActivityReportsFilters 
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <ActivityReportsTabs />
    </div>
  );
};
