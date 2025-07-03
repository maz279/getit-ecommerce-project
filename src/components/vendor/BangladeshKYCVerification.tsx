import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, CheckCircle, Clock, AlertCircle, FileText, Shield, Building, CreditCard, User, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface KYCDocument {
  id: string;
  document_type: string;
  document_number: string;
  verification_status: string;
  file_name: string;
  created_at: string;
  verified_at?: string;
  rejection_reason?: string;
  expiry_date?: string;
}

interface WorkflowStep {
  workflow_step: string;
  status: string;
  step_order: number;
  completed_at?: string;
}

export const BangladeshKYCVerification: React.FC<{ vendorId: string }> = ({ vendorId }) => {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [workflow, setWorkflow] = useState<WorkflowStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const documentTypes = [
    {
      type: 'trade_license',
      title: 'Trade License',
      icon: <Building className="h-5 w-5" />,
      description: 'Valid Bangladesh trade license from city corporation',
      required: true,
      fields: [
        { name: 'license_number', label: 'License Number', type: 'text', placeholder: 'e.g., TRAD123456789' },
        { name: 'business_name', label: 'Business Name', type: 'text', placeholder: 'Registered business name' },
        { name: 'issue_date', label: 'Issue Date', type: 'date' },
        { name: 'expiry_date', label: 'Expiry Date', type: 'date' }
      ]
    },
    {
      type: 'tin_certificate',
      title: 'TIN Certificate',
      icon: <FileText className="h-5 w-5" />,
      description: 'Tax Identification Number certificate from NBR',
      required: true,
      fields: [
        { name: 'tin_number', label: 'TIN Number', type: 'text', placeholder: 'e.g., 123456789012' },
        { name: 'taxpayer_name', label: 'Taxpayer Name', type: 'text', placeholder: 'Name as per TIN' },
        { name: 'issue_date', label: 'Issue Date', type: 'date' }
      ]
    },
    {
      type: 'bank_statement',
      title: 'Bank Statement',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Recent bank statement (last 3 months)',
      required: true,
      fields: [
        { name: 'account_number', label: 'Account Number', type: 'text', placeholder: 'e.g., 1234567890123456' },
        { name: 'bank_name', label: 'Bank Name', type: 'text', placeholder: 'e.g., Dutch Bangla Bank' },
        { name: 'account_holder_name', label: 'Account Holder Name', type: 'text', placeholder: 'Name as per bank' },
        { name: 'statement_date', label: 'Statement Date', type: 'date' }
      ]
    },
    {
      type: 'national_id',
      title: 'National ID',
      icon: <User className="h-5 w-5" />,
      description: 'Valid Bangladesh National ID card',
      required: true,
      fields: [
        { name: 'nid_number', label: 'NID Number', type: 'text', placeholder: 'e.g., 1234567890123' },
        { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Name as per NID' },
        { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
        { name: 'address', label: 'Address', type: 'textarea', placeholder: 'Address as per NID' }
      ]
    },
    {
      type: 'business_address',
      title: 'Business Address Proof',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Utility bill or rental agreement',
      required: false,
      fields: [
        { name: 'address_type', label: 'Address Type', type: 'select', options: ['Utility Bill', 'Rental Agreement', 'Property Document'] },
        { name: 'address_line', label: 'Business Address', type: 'textarea', placeholder: 'Complete business address' },
        { name: 'document_date', label: 'Document Date', type: 'date' }
      ]
    }
  ];

  useEffect(() => {
    fetchKYCData();
  }, [vendorId]);

  const fetchKYCData = async () => {
    try {
      setLoading(true);
      
      // Fetch documents
      const { data: docs, error: docsError } = await supabase
        .from('vendor_kyc_documents')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;
      setDocuments(docs || []);

      // Fetch workflow
      const { data: workflow, error: workflowError } = await supabase
        .from('vendor_verification_workflow')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('step_order');

      if (workflowError) throw workflowError;
      setWorkflow(workflow || []);

    } catch (error: any) {
      console.error('Error fetching KYC data:', error);
      toast.error('Failed to load KYC data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    try {
      setUploadingDoc(documentType);

      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${vendorId}/${documentType}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vendor-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Submit document via edge function
      const response = await supabase.functions.invoke('vendor-management-enhanced', {
        body: {
          vendor_id: vendorId,
          document_type: documentType,
          document_number: formData[documentType]?.document_number || formData[documentType]?.license_number || formData[documentType]?.tin_number || formData[documentType]?.account_number || formData[documentType]?.nid_number,
          file_path: uploadData.path,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          metadata: formData[documentType] || {}
        }
      });

      if (response.error) throw response.error;

      toast.success('Document uploaded successfully');
      await fetchKYCData();
      
      // Clear form data for this document type
      setFormData(prev => ({ ...prev, [documentType]: {} }));

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploadingDoc(null);
    }
  };

  const getDocumentStatus = (docType: string) => {
    const doc = documents.find(d => d.document_type === docType);
    if (!doc) return 'pending';
    return doc.verification_status;
  };

  const getWorkflowProgress = () => {
    const completedSteps = workflow.filter(step => step.status === 'completed').length;
    return (completedSteps / workflow.length) * 100;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'verified': 'default',
      'pending': 'secondary',
      'rejected': 'destructive',
      'expired': 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            KYC Verification Progress
          </CardTitle>
          <CardDescription>
            Complete your Know Your Customer verification to start selling on GetIt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(getWorkflowProgress())}%</span>
            </div>
            <Progress value={getWorkflowProgress()} className="h-3" />
            
            {workflow.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {workflow.map((step, index) => (
                  <div key={step.workflow_step} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        step.status === 'completed' ? 'bg-success text-success-foreground' :
                        step.status === 'in_progress' ? 'bg-warning text-warning-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium capitalize">
                        {step.workflow_step.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {getStatusIcon(step.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Tabs */}
      <Tabs defaultValue="trade_license" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {documentTypes.map((docType) => (
            <TabsTrigger key={docType.type} value={docType.type} className="text-xs">
              <div className="flex items-center gap-1">
                {docType.icon}
                <span className="hidden sm:inline">{docType.title}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {documentTypes.map((docType) => (
          <TabsContent key={docType.type} value={docType.type}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {docType.icon}
                    {docType.title}
                    {docType.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </div>
                  {getStatusBadge(getDocumentStatus(docType.type))}
                </CardTitle>
                <CardDescription>{docType.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {docType.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={`${docType.type}_${field.name}`}>{field.label}</Label>
                      {field.type === 'select' ? (
                        <select
                          id={`${docType.type}_${field.name}`}
                          className="w-full px-3 py-2 border border-input rounded-md"
                          value={formData[docType.type]?.[field.name] || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            [docType.type]: {
                              ...prev[docType.type],
                              [field.name]: e.target.value
                            }
                          }))}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          id={`${docType.type}_${field.name}`}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 border border-input rounded-md"
                          rows={3}
                          value={formData[docType.type]?.[field.name] || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            [docType.type]: {
                              ...prev[docType.type],
                              [field.name]: e.target.value
                            }
                          }))}
                        />
                      ) : (
                        <Input
                          id={`${docType.type}_${field.name}`}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[docType.type]?.[field.name] || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            [docType.type]: {
                              ...prev[docType.type],
                              [field.name]: e.target.value
                            }
                          }))}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <Label>Upload Document</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: PDF, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id={`file-${docType.type}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, docType.type);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById(`file-${docType.type}`)?.click()}
                      disabled={uploadingDoc === docType.type}
                    >
                      {uploadingDoc === docType.type ? 'Uploading...' : 'Select File'}
                    </Button>
                  </div>
                </div>

                {/* Document Status */}
                {documents.find(d => d.document_type === docType.type) && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Document uploaded on {new Date(documents.find(d => d.document_type === docType.type)!.created_at).toLocaleDateString()}.
                      Status: {getDocumentStatus(docType.type)}
                      {documents.find(d => d.document_type === docType.type)?.rejection_reason && (
                        <div className="mt-2 text-destructive">
                          Rejection reason: {documents.find(d => d.document_type === docType.type)?.rejection_reason}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};