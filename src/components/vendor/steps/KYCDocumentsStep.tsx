
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, Camera, FileText, CheckCircle, XCircle, RotateCcw, Eye, Trash2 } from 'lucide-react';

interface KYCDocumentsStepProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface DocumentStatus {
  status: 'pending' | 'uploaded' | 'failed' | 'uploading';
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  error?: string;
  progress?: number;
}

export const KYCDocumentsStep: React.FC<KYCDocumentsStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}) => {
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, DocumentStatus>>({
    nidFront: { status: 'pending' },
    nidBack: { status: 'pending' },
    tradeLicense: { 
      status: 'uploaded', 
      fileName: 'trade-license.pdf',
      fileSize: '1.2 MB',
      uploadedAt: '2 minutes ago'
    },
    tinCertificate: { 
      status: 'failed', 
      fileName: 'tin-certificate-blurry.jpg',
      error: 'Image quality too low'
    },
    bankStatement: { 
      status: 'uploading', 
      fileName: 'bank-statement-jan-mar-2024.pdf',
      progress: 80
    },
    addressProof: { status: 'pending' }
  });

  const handleFileUpload = (documentType: string, file: File) => {
    setDocumentStatuses(prev => ({
      ...prev,
      [documentType]: {
        status: 'uploading',
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        progress: 0
      }
    }));

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setDocumentStatuses(prev => {
        const current = prev[documentType];
        if (current.progress! >= 100) {
          clearInterval(progressInterval);
          return {
            ...prev,
            [documentType]: {
              ...current,
              status: 'uploaded',
              uploadedAt: 'Just now',
              progress: undefined
            }
          };
        }
        return {
          ...prev,
          [documentType]: {
            ...current,
            progress: current.progress! + 10
          }
        };
      });
    }, 200);

    updateData({ [documentType]: file });
  };

  const removeDocument = (documentType: string) => {
    setDocumentStatuses(prev => ({
      ...prev,
      [documentType]: { status: 'pending' }
    }));
    updateData({ [documentType]: null });
  };

  const retryUpload = (documentType: string) => {
    setDocumentStatuses(prev => ({
      ...prev,
      [documentType]: { status: 'pending' }
    }));
  };

  const DocumentUploadCard = ({ 
    title, 
    documentType, 
    tips, 
    required = true 
  }: { 
    title: string; 
    documentType: string; 
    tips: string[]; 
    required?: boolean;
  }) => {
    const status = documentStatuses[documentType];
    
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{title}</h4>
              <div className="flex items-center gap-2">
                {status.status === 'pending' && (
                  <span className="text-yellow-600 flex items-center gap-1">
                    ⏳ Pending Upload
                  </span>
                )}
                {status.status === 'uploaded' && (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Uploaded Successfully
                  </span>
                )}
                {status.status === 'failed' && (
                  <span className="text-red-600 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Upload Failed
                  </span>
                )}
                {status.status === 'uploading' && (
                  <span className="text-blue-600 flex items-center gap-1">
                    ⏳ Uploading... {status.progress}%
                  </span>
                )}
              </div>
            </div>

            {status.status === 'pending' && (
              <div className="space-y-3">
                {documentType === 'nidFront' || documentType === 'nidBack' ? (
                  <div>
                    <p className="text-sm font-medium mb-2">
                      {documentType === 'nidFront' ? 'Upload Front Side:' : 'Upload Back Side:'}
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 mb-2">📄 Drag & Drop or Click to Upload</p>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          📱 Take Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          📁 Choose File
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600 mb-2">📄 Upload {title}</p>
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        📱 Take Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        📁 Choose File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {status.status === 'uploaded' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="font-medium">📄 {status.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                      👁️ Preview
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeDocument(documentType)}>
                      <Trash2 className="w-4 h-4" />
                      🗑️ Remove
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Uploaded: {status.uploadedAt}</p>
                  <p>File Size: {status.fileSize}</p>
                </div>
                
                {documentType === 'tradeLicense' && (
                  <div className="space-y-1 text-sm text-green-600">
                    <p>✅ Document quality check passed</p>
                    <p>✅ License number matches entered data</p>
                    <p>✅ Expiry date valid (11 months remaining)</p>
                  </div>
                )}
              </div>
            )}

            {status.status === 'failed' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span className="font-medium">📄 {status.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => retryUpload(documentType)}>
                      <RotateCcw className="w-4 h-4" />
                      🔄 Retry
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeDocument(documentType)}>
                      <Trash2 className="w-4 h-4" />
                      🗑️ Remove
                    </Button>
                  </div>
                </div>
                <div className="text-red-600 text-sm">
                  <p>Error: {status.error}</p>
                </div>
                
                {documentType === 'tinCertificate' && (
                  <div className="space-y-1 text-sm text-red-600">
                    <p>❌ Please upload a clearer image:</p>
                    <p>• Ensure all text is readable</p>
                    <p>• Avoid shadows and glare</p>
                    <p>• Use good lighting</p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    📱 Retake Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    📁 Choose New File
                  </Button>
                </div>
              </div>
            )}

            {status.status === 'uploading' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">📄 {status.fileName}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={status.progress} className="h-2" />
                  <p className="text-sm text-gray-600">
                    Uploading: {(status.progress! * 5.1 / 100).toFixed(1)} MB / 5.1 MB
                  </p>
                </div>
              </div>
            )}

            {tips.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">💡 Tips:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  {tips.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📋 Step 4 of 9: KYC Document Verification</h2>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '44%' }}></div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold mb-6">📑 Required Documents for Verification</h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-4">1️⃣ National ID Card (NID)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentUploadCard
              title="NID Front Side"
              documentType="nidFront"
              tips={[
                'Clear, well-lit photos',
                'All text should be readable',
                'JPG, PNG, PDF accepted (Max 5MB each)'
              ]}
            />
            <DocumentUploadCard
              title="NID Back Side"
              documentType="nidBack"
              tips={[
                'Clear, well-lit photos',
                'All text should be readable',
                'JPG, PNG, PDF accepted (Max 5MB each)'
              ]}
            />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">2️⃣ Trade License (For Business Vendors)</h4>
          <DocumentUploadCard
            title="Trade License"
            documentType="tradeLicense"
            tips={[
              'Must be valid and not expired',
              'Business name should match registration',
              'Clear scan or photo required'
            ]}
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">3️⃣ TIN Certificate</h4>
          <DocumentUploadCard
            title="TIN Certificate"
            documentType="tinCertificate"
            tips={[
              'TIN number must match entered data',
              'Valid certificate from tax authority',
              'High quality image required'
            ]}
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">4️⃣ Bank Statement (Last 3 months)</h4>
          <DocumentUploadCard
            title="Bank Statement"
            documentType="bankStatement"
            tips={[
              'Account holder name matching business name',
              'Regular business transactions',
              'Account number matching provided details'
            ]}
          />
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">5️⃣ Business Address Proof</h4>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Address Proof</h4>
                  <span className="text-yellow-600 flex items-center gap-1">
                    ⏳ Pending Upload
                  </span>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-800 mb-2">Accepted Documents:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Utility Bill (Electricity/Gas/Water)</li>
                    <li>• Rent Agreement</li>
                    <li>• Property Ownership Documents</li>
                    <li>• Municipal Tax Receipt</li>
                  </ul>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 mb-2">📄 Upload Address Proof</p>
                  <p className="text-sm text-gray-500 mb-4">Date should be within last 3 months</p>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Progress Summary */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-green-800 mb-3">📊 Upload Progress Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Documents Uploaded:</span>
              <span className="font-semibold">1 of 5</span>
            </div>
            <Progress value={20} className="h-2" />
            <p className="text-xs text-green-600">Complete all uploads to proceed to the next step</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={onPrev} variant="outline" className="min-w-[120px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          ← Back
        </Button>
        <Button onClick={onNext} className="min-w-[120px]">
          Save & Continue →
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
