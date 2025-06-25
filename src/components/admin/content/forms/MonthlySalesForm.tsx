
import React, { useState } from 'react';
import { Calendar, Download, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MonthlyFilters } from './monthlySales/MonthlyFilters';
import { MonthlyMetrics } from './monthlySales/MonthlyMetrics';
import { MonthlyTrendsTab } from './monthlySales/MonthlyTrendsTab';
import { MonthlyGoalsTab } from './monthlySales/MonthlyGoalsTab';
import { 
  monthlyTrendsData, 
  categoryTrendsData, 
  customerSegmentData, 
  monthlyGoalsData, 
  predictiveData 
} from './monthlySales/monthlyData';

export const MonthlySalesForm: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedQuarter, setSelectedQuarter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('trends');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => setIsGeneratingReport(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            Monthly Sales Trends
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive monthly performance analysis and forecasting</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleGenerateReport} disabled={isGeneratingReport}>
            {isGeneratingReport ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Export Report
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Configure Goals
          </Button>
        </div>
      </div>

      {/* Filters */}
      <MonthlyFilters
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedQuarter={selectedQuarter}
        setSelectedQuarter={setSelectedQuarter}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Key Metrics */}
      <MonthlyMetrics />

      {/* Dynamic Content Based on View Mode */}
      {viewMode === 'trends' && (
        <MonthlyTrendsTab
          monthlyTrendsData={monthlyTrendsData}
          categoryTrendsData={categoryTrendsData}
          customerSegmentData={customerSegmentData}
        />
      )}
      {viewMode === 'goals' && (
        <MonthlyGoalsTab
          monthlyGoalsData={monthlyGoalsData}
          predictiveData={predictiveData}
        />
      )}
      {viewMode === 'comparison' && (
        <MonthlyTrendsTab
          monthlyTrendsData={monthlyTrendsData}
          categoryTrendsData={categoryTrendsData}
          customerSegmentData={customerSegmentData}
        />
      )}
    </div>
  );
};
