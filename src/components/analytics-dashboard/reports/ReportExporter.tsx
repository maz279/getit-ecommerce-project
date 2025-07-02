import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, FileSpreadsheet, Image } from 'lucide-react';

export const ReportExporter: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Report Exporter</h2>
        <p className="text-muted-foreground">Export reports in multiple formats</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
          <CardDescription>Configure your export settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Export Format</label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};