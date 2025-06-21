
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, ArrowLeft, ArrowRight, AlertCircle, Camera, Folder, X, Eye, RotateCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface KYCDocumentsStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface DocumentStatus {
  uploaded: boolean;
  error?: string;
  uploading?: boolean;
  progress?: number;
}

const documentTypes = [
  {
    key: 'nidFront',
    title: 'National ID Card (Front)',
    description: 'Clear, well-lit photo of NID front side',
    required: true,
    tips: ['All text should be readable', 'Avoid shadows and glare', 'JPG, PNG, PDF accepted (Max 5MB)']
  },
  {
    key: 'nidBack',
    title: 'National ID Card (Back)',
    description: 'Clear, well-lit photo of NID back side',
    required: true,
    tips: ['All text should be readable', 'Avoid shadows and glare', 'JPG, PNG, PDF accepted (Max 5MB)']
  },
  {
    key: 'tradeLicense',
    title: 'Trade License',
    description: 'Valid trade license from city corporation',
    required: false, // Required only if hasTradeLicense is true
    tips: ['Document should be valid', 'License number should match entered data', 'Clear scan or photo required']
  },
  {
    key: 'tinCertificate',
    title: 'TIN Certificate',
    description: 'Tax Identification Number certificate',
    required: true,
    tips: ['TIN number should match entered data', 'Clear, readable image required', 'Issued by Income Tax department']
  },
  {
    key: 'bankStatement',
    title: 'Bank Statement (Last 3 months)',
    description: 'Recent bank statement showing business transactions',
    required: true,
    tips: ['Account holder name should match business name', 'Regular business transactions visible', 'Account number should match provided details']
  },
  {
    key: 'addressProof',
    title: 'Business Address Proof',
    description: 'Utility bill, rent agreement, or property documents',
    required: true,
    tips: ['Date should be within last 3 months', 'Address should match business address', 'Utility bills, rent agreement, or property documents accepted']
  }
];

export const KYCDocumentsStep: React.FC<KYCDocumentsStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}) => {
  const [documentStatus, setDocumentStatus] = useState<Record<string, DocumentStatus>>({});

  const handleFileUpload = async (key: string, file: File | null) => {
    if (!file) {
      updateData({ [key]: null });
      setDocumentStatus(prev => ({ ...prev, [key]: { uploaded: false } }));
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setDocumentStatus(prev => ({ 
        ...prev, 
        [key]: { uploaded: false, error: 'File size should be less than 5MB' }
      }));
      return;
    }

    // Simulate upload process
    setDocumentStatus(prev => ({ 
      ...prev, 
      [key]: { uploaded: false, uploading: true, progress: 0 }
    }));

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setDocumentStatus(prev => {
        const current = prev[key];
        if (current && current.progress !== undefined && current.progress < 100) {
          return {
            ...prev,
            [key]: { ...current, progress: current.progress + 20 }
          };
        }
        return prev;
      });
    }, 200);

    // Complete upload after 1 second
    setTimeout(() => {
      clearInterval(uploadInterval);
      
      // Simulate validation check
      const isValid = Math.random() > 0.3; // 70% success rate for demo
      
      if (isValid) {
        updateData({ [key]: file });
        setDocumentStatus(prev => ({ 
          ...prev, 
          [key]: { uploaded: true, uploading: false }
        }));
      } else {
        setDocumentStatus(prev => ({ 
          ...prev, 
          [key]: { 
            uploaded: false, 
            uploading: false, 
            error: 'Image quality too low. Please upload a clearer image.' 
          }
        }));
      }
    }, 1000);
  };

  const getDocumentStatus = (key: string): DocumentStatus => {
    return documentStatus[key] || { uploaded: !!data[key] };
  };

  const requiredDocsUploaded = documentTypes
    .filter(doc => doc.required || (doc.key === 'tradeLicense' && data.hasTradeLicense))
    .every(doc => getDocumentStatus(doc.key).uploaded);

  const totalProgress = () => {
    const requiredDocs = documentTypes.filter(doc => doc.required || (doc.key === 'tradeLicense' && data.hasTradeLicense));
    const uploadedCount = requiredDocs.filter(doc => getDocumentStatus(doc.key).uploaded).length;
    return (uploadedCount / requiredDocs.length) * 100;
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload clear, readable copies of your documents. All documents will be verified within 24-48 hours.
        </AlertDescription>
      </Alert>

      {/* Upload Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Upload Progress</span>
            <span className="text-sm text-gray-600">{Math.round(totalProgress())}% Complete</span>
          </div>
          <Progress value={totalProgress()} className="h-3" />
        </CardContent>
      </Card>

      {/* Document Upload Cards */}
      <div className="grid gap-6">
        {documentTypes.map((doc) => {
          const status = getDocumentStatus(doc.key);
          const file = data[doc.key] as File | null;
          const isRequired = doc.required || (doc.key === 'tradeLicense' && data.hasTradeLicense);
          const shouldShow = doc.key !== 'tradeLicense' || data.hasTradeLicense;

          if (!shouldShow) return null;
          
          return (
            <Card key={doc.key} className={`border-2 transition-colors ${
              status.uploaded 
                ? 'border-green-200 bg-green-50' 
                : status.error
                ? 'border-red-200 bg-red-50'
                : 'border-dashed border-gray-200 hover:border-gray-300'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {doc.title}
                      {isRequired && <span className="text-red-500 text-sm">*</span>}
                    </CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </div>
                  {status.uploaded && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Uploaded</span>
                    </div>
                  )}
                  {status.error && (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Error</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {status.uploaded && file ? (
                    <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-green-600" />
                        <div>
                          <span className="text-sm font-medium text-green-800">{file.name}</span>
                          <p className="text-xs text-green-600">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB • Uploaded successfully
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileUpload(doc.key, null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : status.uploading ? (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">Uploading...</span>
                        <span className="text-sm text-blue-600">{status.progress}%</span>
                      </div>
                      <Progress value={status.progress} className="h-2" />
                    </div>
                  ) : status.error ? (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-red-800">Upload Failed</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDocumentStatus(prev => ({ ...prev, [doc.key]: { uploaded: false } }))}
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-red-600 mb-3">{status.error}</p>
                      <div className="flex gap-2">
                        <Label htmlFor={`${doc.key}-retry`} className="cursor-pointer">
                          <Button size="sm" variant="outline">
                            <Camera className="w-4 h-4 mr-2" />
                            Retake Photo
                          </Button>
                        </Label>
                        <Label htmlFor={`${doc.key}-retry`} className="cursor-pointer">
                          <Button size="sm" variant="outline">
                            <Folder className="w-4 h-4 mr-2" />
                            Choose New File
                          </Button>
                        </Label>
                        <input
                          id={`${doc.key}-retry`}
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleFileUpload(doc.key, file);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor={doc.key} className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center p-6 border border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm font-medium text-gray-600">
                            Click to upload {doc.title.toLowerCase()}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PDF, JPG, PNG (Max 5MB)
                          </span>
                        </div>
                      </Label>
                      <input
                        id={doc.key}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileUpload(doc.key, file);
                        }}
                      />
                      <div className="flex gap-2 mt-2">
                        <Label htmlFor={doc.key} className="cursor-pointer flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Camera className="w-4 h-4 mr-2" />
                            Take Photo
                          </Button>
                        </Label>
                        <Label htmlFor={doc.key} className="cursor-pointer flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Folder className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                        </Label>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">💡 Tips:</h5>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {doc.tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Document Verification Process */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-blue-800 mb-3">Document Verification Process</h4>
          <ul className="text-sm text-blue-700 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Documents are verified within 24-48 hours
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              You'll receive an email notification once verified
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Can start listing products immediately after approval
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Contact support if you need help with documents
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="min-w-[120px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={!requiredDocsUploaded} className="min-w-[120px]">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
