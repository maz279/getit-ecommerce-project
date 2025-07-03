import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface BulkUploadInterfaceProps {
  vendorId?: string;
}

export const BulkUploadInterface: React.FC<BulkUploadInterfaceProps> = ({ 
  vendorId 
}) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSessions, setUploadSessions] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    
    // Preview CSV data
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      const rows = lines.slice(1, 6).map(line => line.split(',')); // Preview first 5 rows
      
      setPreviewData([headers, ...rows]);
      
      // Validate CSV structure
      validateCSVStructure(headers);
    }
  };

  const validateCSVStructure = (headers: string[]) => {
    const requiredFields = ['name', 'price', 'category_id', 'sku'];
    const optionalFields = ['description', 'images', 'stock_quantity', 'name_bn', 'material_type'];
    
    const errors = [];
    const missingRequired = requiredFields.filter(field => !headers.includes(field));
    
    if (missingRequired.length > 0) {
      errors.push({
        type: 'missing_fields',
        message: `Missing required fields: ${missingRequired.join(', ')}`,
        severity: 'error'
      });
    }

    const extraFields = headers.filter(header => 
      !requiredFields.includes(header) && !optionalFields.includes(header)
    );
    
    if (extraFields.length > 0) {
      errors.push({
        type: 'unknown_fields',
        message: `Unknown fields (will be ignored): ${extraFields.join(', ')}`,
        severity: 'warning'
      });
    }

    setValidationErrors(errors);
  };

  const startBulkUpload = async () => {
    if (!uploadFile || !vendorId) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create upload session
      const { data: session } = await supabase.functions.invoke('product-management-enhanced', {
        body: {
          endpoint: 'bulk/create-session',
          data: {
            session: {
              vendor_id: vendorId,
              file_name: uploadFile.name,
              file_size: uploadFile.size,
              upload_type: 'csv',
              status: 'preparing'
            }
          }
        }
      });

      if (session?.data) {
        // Simulate file processing
        const totalSteps = 5;
        for (let step = 1; step <= totalSteps; step++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          setUploadProgress((step / totalSteps) * 100);
        }

        // Start processing
        await supabase.functions.invoke('product-management-enhanced', {
          body: {
            endpoint: 'bulk/process',
            data: {
              session_id: session.data.id,
              total_records: previewData.length - 1 // Exclude header
            }
          }
        });

        setUploading(false);
        setUploadProgress(100);
        loadUploadSessions();
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
    }
  };

  const loadUploadSessions = async () => {
    if (!vendorId) return;

    try {
      const { data } = await supabase.functions.invoke('product-management-enhanced', {
        body: {
          endpoint: 'bulk/sessions',
          data: { vendor_id: vendorId }
        }
      });

      if (data?.data) {
        setUploadSessions(data.data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  React.useEffect(() => {
    loadUploadSessions();
  }, [vendorId]);

  const downloadTemplate = () => {
    const csvContent = `name,name_bn,description,price,compare_price,category_id,sku,stock_quantity,material_type,traditional_size,festival_suitable,origin_tag,images
"Sample Product","নমুনা পণ্য","Product description",1500,2000,"category-uuid","SKU001",100,"cotton","M","eid,puja","Made in Bangladesh","image1.jpg,image2.jpg"
"Sample Saree","নমুনা শাড়ি","Beautiful traditional saree",3500,4000,"category-uuid","SKU002",50,"silk","Free Size","eid,wedding","Made in Bangladesh","saree1.jpg,saree2.jpg"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-upload-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderUploadForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Product Upload
        </CardTitle>
        <CardDescription>
          Upload multiple products at once using CSV format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
          <div>
            <h3 className="font-medium">Download CSV Template</h3>
            <p className="text-sm text-muted-foreground">
              Start with our template to ensure proper formatting
            </p>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select CSV File</label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadFile ? uploadFile.name : 'Choose CSV File'}
            </Button>
            {uploadFile && (
              <Badge variant="outline">
                {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
              </Badge>
            )}
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="space-y-2">
            {validationErrors.map((error, index) => (
              <div 
                key={index}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  error.severity === 'error' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                }`}
              >
                {error.severity === 'error' ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{error.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Preview Data */}
        {previewData.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Preview (First 5 rows)</h3>
            <div className="overflow-x-auto border rounded">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {previewData[0]?.map((header: string, index: number) => (
                      <th key={index} className="p-2 text-left font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(1).map((row: string[], rowIndex: number) => (
                    <tr key={rowIndex} className="border-b">
                      {row.map((cell: string, cellIndex: number) => (
                        <td key={cellIndex} className="p-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Upload Progress</span>
              <span className="text-sm text-muted-foreground">{uploadProgress.toFixed(0)}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Upload Button */}
        <Button 
          onClick={startBulkUpload}
          disabled={!uploadFile || uploading || validationErrors.some(e => e.severity === 'error')}
          className="w-full"
        >
          {uploading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {uploading ? 'Processing...' : 'Start Upload'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderUploadHistory = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload History
        </CardTitle>
        <CardDescription>
          Track your bulk upload sessions and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {uploadSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No upload sessions found
          </div>
        ) : (
          <div className="space-y-4">
            {uploadSessions.map((session: any) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {session.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : session.status === 'failed' ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                  )}
                  <div>
                    <div className="font-medium">{session.file_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={
                      session.status === 'completed' ? 'default' :
                      session.status === 'failed' ? 'destructive' : 
                      'secondary'
                    }
                  >
                    {session.status}
                  </Badge>
                  {session.processed_records && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {session.successful_records}/{session.processed_records} successful
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderBulkOperations = () => (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
        <CardDescription>Perform bulk operations on existing products</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Upload className="h-6 w-6" />
            <span>Bulk Price Update</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Download className="h-6 w-6" />
            <span>Export Products</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <RefreshCw className="h-6 w-6" />
            <span>Bulk Status Update</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <FileText className="h-6 w-6" />
            <span>Generate Reports</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Products</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
          <TabsTrigger value="operations">Bulk Operations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          {renderUploadForm()}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          {renderUploadHistory()}
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-4">
          {renderBulkOperations()}
        </TabsContent>
      </Tabs>
    </div>
  );
};