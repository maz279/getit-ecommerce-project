import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface KYCVerificationProps {
  vendorId: string;
  onVerificationComplete?: (status: string) => void;
}

type VerificationType = 'nid' | 'passport' | 'trade_license' | 'tin';
type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

interface VerificationDocument {
  type: VerificationType;
  label: string;
  status: VerificationStatus;
  documentNumber?: string;
  expiryDate?: string;
  rejectionReason?: string;
}

export const KYCVerification: React.FC<KYCVerificationProps> = ({
  vendorId,
  onVerificationComplete
}) => {
  const [verificationType, setVerificationType] = useState<VerificationType>('nid');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [verifications, setVerifications] = useState<VerificationDocument[]>([
    { type: 'nid', label: 'National ID', status: 'pending' },
    { type: 'trade_license', label: 'Trade License', status: 'pending' },
    { type: 'tin', label: 'TIN Certificate', status: 'pending' },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setUploadedFile(file);
    }
  };

  const handleSubmitVerification = async () => {
    if (!documentNumber || !uploadedFile) {
      toast({
        title: "Missing Information",
        description: "Please provide document number and upload the document",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call for document verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update verification status
      setVerifications(prev => 
        prev.map(v => 
          v.type === verificationType 
            ? { ...v, status: 'pending', documentNumber, expiryDate }
            : v
        )
      );

      toast({
        title: "Document Submitted",
        description: "Your document has been submitted for verification",
        variant: "default"
      });

      // Reset form
      setDocumentNumber('');
      setExpiryDate('');
      setUploadedFile(null);
      
      onVerificationComplete?.('pending');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    const variants = {
      verified: 'default',
      rejected: 'destructive',
      pending: 'secondary',
      expired: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Verification Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {verifications.map((verification) => (
              <div key={verification.type} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(verification.status)}
                  <div>
                    <div className="font-medium">{verification.label}</div>
                    {verification.documentNumber && (
                      <div className="text-sm text-muted-foreground">
                        Doc: {verification.documentNumber}
                      </div>
                    )}
                  </div>
                </div>
                {getStatusBadge(verification.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit New Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={verificationType} onValueChange={(value: VerificationType) => setVerificationType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nid">National ID Card</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="trade_license">Trade License</SelectItem>
                <SelectItem value="tin">TIN Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-number">Document Number</Label>
            <Input
              id="doc-number"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Enter document number"
            />
          </div>

          {(verificationType === 'passport' || verificationType === 'trade_license') && (
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="document-upload">Upload Document</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                id="document-upload"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {uploadedFile ? uploadedFile.name : 'Click to upload document'}
                </div>
                <div className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, PDF (Max 5MB)
                </div>
              </label>
            </div>
          </div>

          <Button 
            onClick={handleSubmitVerification}
            disabled={isSubmitting || !documentNumber || !uploadedFile}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Documents are verified within 24-48 hours. You'll receive an email notification.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};