import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UploadProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  sku: string;
  initial_stock: number;
  minimum_stock: number;
  unit_cost: number;
  image_url?: string;
}

const BulkProductUpload: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState('');
  const [uploadMode, setUploadMode] = useState<'csv' | 'json'>('csv');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0
  });
  const [errors, setErrors] = useState<string[]>([]);

  const sampleCSVData = `name,description,price,category_id,sku,initial_stock,minimum_stock,unit_cost
"Sample Product 1","Description for product 1",99.99,"cat-123","SKU001",100,10,50.00
"Sample Product 2","Description for product 2",199.99,"cat-456","SKU002",50,5,100.00`;

  const sampleJSONData = `[
  {
    "name": "Sample Product 1",
    "description": "Description for product 1",
    "price": 99.99,
    "category_id": "cat-123",
    "sku": "SKU001",
    "initial_stock": 100,
    "minimum_stock": 10,
    "unit_cost": 50.00
  },
  {
    "name": "Sample Product 2", 
    "description": "Description for product 2",
    "price": 199.99,
    "category_id": "cat-456",
    "sku": "SKU002",
    "initial_stock": 50,
    "minimum_stock": 5,
    "unit_cost": 100.00
  }
]`;

  const downloadTemplate = (format: 'csv' | 'json') => {
    const content = format === 'csv' ? sampleCSVData : sampleJSONData;
    const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
    const filename = `bulk-product-template.${format}`;

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: `${format.toUpperCase()} template downloaded successfully`,
    });
  };

  const parseCSV = (csvText: string): ProductData[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      const product: any = {};
      
      headers.forEach((header, i) => {
        const value = values[i];
        if (header === 'price' || header === 'initial_stock' || header === 'minimum_stock' || header === 'unit_cost') {
          product[header] = parseFloat(value) || 0;
        } else {
          product[header] = value;
        }
      });
      
      return product;
    });
  };

  const validateProductData = (products: ProductData[]): string[] => {
    const errors: string[] = [];
    const requiredFields = ['name', 'price', 'sku'];

    products.forEach((product, index) => {
      requiredFields.forEach(field => {
        if (!product[field as keyof ProductData]) {
          errors.push(`Row ${index + 2}: Missing required field '${field}'`);
        }
      });

      if (product.price <= 0) {
        errors.push(`Row ${index + 2}: Price must be greater than 0`);
      }

      if (product.initial_stock < 0) {
        errors.push(`Row ${index + 2}: Initial stock cannot be negative`);
      }
    });

    return errors;
  };

  const processUpload = async () => {
    try {
      setUploading(true);
      setErrors([]);
      setProgress({ total: 0, processed: 0, successful: 0, failed: 0 });

      let products: ProductData[] = [];

      if (uploadMode === 'csv' && csvFile) {
        const csvText = await csvFile.text();
        products = parseCSV(csvText);
      } else if (uploadMode === 'json' && jsonData) {
        products = JSON.parse(jsonData);
      } else {
        throw new Error('Please provide data to upload');
      }

      // Validate data
      const validationErrors = validateProductData(products);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setProgress(prev => ({ ...prev, total: products.length }));

      // Upload products via API
      const { data, error } = await supabase.functions.invoke('vendor-product-management', {
        body: {
          action: 'bulk-upload',
          products: products
        }
      });

      if (error) throw error;

      setProgress(prev => ({
        ...prev,
        processed: products.length,
        successful: data.imported || 0,
        failed: products.length - (data.imported || 0)
      }));

      toast({
        title: "Upload Complete",
        description: `Successfully imported ${data.imported} products`,
      });

      // Reset form
      setCsvFile(null);
      setJsonData('');

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setErrors([errorMessage]);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Bulk Product Upload</h2>
        <p className="text-muted-foreground">Import multiple products at once using CSV or JSON format</p>
      </div>

      {/* Upload Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Method</CardTitle>
          <CardDescription>Choose how you want to upload your product data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button 
              variant={uploadMode === 'csv' ? 'default' : 'outline'}
              onClick={() => setUploadMode('csv')}
            >
              <FileText className="w-4 h-4 mr-2" />
              CSV Upload
            </Button>
            <Button 
              variant={uploadMode === 'json' ? 'default' : 'outline'}
              onClick={() => setUploadMode('json')}
            >
              <FileText className="w-4 h-4 mr-2" />
              JSON Upload
            </Button>
          </div>

          <div className="flex gap-2 mb-4">
            <Button variant="outline" onClick={() => downloadTemplate('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>
            <Button variant="outline" onClick={() => downloadTemplate('json')}>
              <Download className="w-4 h-4 mr-2" />
              Download JSON Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Data</CardTitle>
          <CardDescription>
            {uploadMode === 'csv' 
              ? 'Select a CSV file containing your product data'
              : 'Paste JSON data containing your product information'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadMode === 'csv' ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="csv-file" className="text-lg font-medium cursor-pointer">
                      Click to upload CSV file
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Or drag and drop your CSV file here
                    </p>
                  </div>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                    className="mt-4"
                  />
                </div>
              </div>
              
              {csvFile && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    File selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="json-data">JSON Data</Label>
              <Textarea
                id="json-data"
                placeholder="Paste your JSON data here..."
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Data Requirements</CardTitle>
          <CardDescription>Ensure your data includes these required fields</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Required Fields:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>name</strong> - Product name</li>
                <li>• <strong>price</strong> - Selling price</li>
                <li>• <strong>sku</strong> - Unique product SKU</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Optional Fields:</h4>
              <ul className="space-y-1 text-sm">
                <li>• <strong>description</strong> - Product description</li>
                <li>• <strong>category_id</strong> - Category identifier</li>
                <li>• <strong>initial_stock</strong> - Starting inventory</li>
                <li>• <strong>minimum_stock</strong> - Reorder threshold</li>
                <li>• <strong>unit_cost</strong> - Cost per unit</li>
                <li>• <strong>image_url</strong> - Product image URL</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress and Errors */}
      {uploading && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={(progress.processed / progress.total) * 100} />
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{progress.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{progress.processed}</p>
                  <p className="text-sm text-muted-foreground">Processed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-500">{progress.successful}</p>
                  <p className="text-sm text-muted-foreground">Successful</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">{progress.failed}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Validation Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      <div className="flex justify-end">
        <Button 
          onClick={processUpload} 
          disabled={uploading || (!csvFile && !jsonData)}
          size="lg"
        >
          {uploading ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Products
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BulkProductUpload;