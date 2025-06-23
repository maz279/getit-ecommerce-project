
export interface DocumentAnalysis {
  documentType: 'business_license' | 'tax_certificate' | 'identity_document' | 'bank_statement' | 'other';
  extractedData: {
    businessName?: string;
    registrationNumber?: string;
    taxId?: string;
    ownerName?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    issueDate?: string;
    expiryDate?: string;
    issuingAuthority?: string;
  };
  confidence: number;
  riskAssessment: {
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    verificationStatus: 'pending' | 'verified' | 'rejected';
    complianceScore: number;
  };
  validationChecks: {
    formatValidation: boolean;
    dataConsistency: boolean;
    documentAuthenticity: boolean;
    requiredFieldsPresent: boolean;
  };
  recommendedActions: string[];
}

export interface KYCAnalysis {
  vendorId: string;
  overallRiskScore: number;
  riskCategory: 'low_risk' | 'medium_risk' | 'high_risk' | 'prohibited';
  documentAnalysis: DocumentAnalysis[];
  businessAnalysis: {
    businessDescription: string;
    industryRisk: 'low' | 'medium' | 'high';
    geographicRisk: 'low' | 'medium' | 'high';
    reputationScore: number;
    onlinePresence: {
      website: boolean;
      socialMedia: boolean;
      reviews: number;
      avgRating: number;
    };
  };
  complianceChecks: {
    sanctionsList: boolean;
    blacklistCheck: boolean;
    regulatoryCompliance: boolean;
    taxCompliance: boolean;
  };
  recommendations: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
  }>;
}

export class DocumentProcessor {
  private static instance: DocumentProcessor;
  private ocrEngine: any = null;
  private validationRules: Map<string, any> = new Map();

  public static getInstance(): DocumentProcessor {
    if (!DocumentProcessor.instance) {
      DocumentProcessor.instance = new DocumentProcessor();
    }
    return DocumentProcessor.instance;
  }

  async initialize(): Promise<void> {
    console.log('📄 Initializing Document Processor...');
    
    // Initialize validation rules
    this.setupValidationRules();
    
    console.log('✅ Document Processor initialized');
  }

  // Analyze uploaded document for vendor KYC
  async analyzeDocument(documentFile: File, documentType?: string): Promise<DocumentAnalysis> {
    console.log('Document Analysis: Processing document:', documentFile.name);

    const extractedText = await this.performOCR(documentFile);
    const detectedType = documentType || this.detectDocumentType(extractedText);
    const extractedData = this.extractStructuredData(extractedText, detectedType);
    const confidence = this.calculateConfidence(extractedText, extractedData);
    const riskAssessment = this.performRiskAssessment(extractedData, detectedType);
    const validationChecks = this.performValidationChecks(extractedData, detectedType);
    const recommendedActions = this.generateRecommendations(riskAssessment, validationChecks);

    return {
      documentType: detectedType as any,
      extractedData,
      confidence,
      riskAssessment,
      validationChecks,
      recommendedActions
    };
  }

  // Comprehensive KYC analysis for vendor onboarding
  async performKYCAnalysis(vendorId: string, documents: DocumentAnalysis[], businessInfo: any): Promise<KYCAnalysis> {
    console.log('KYC Analysis: Analyzing vendor:', vendorId);

    const businessAnalysis = await this.analyzeBusinessProfile(businessInfo);
    const complianceChecks = await this.performComplianceChecks(vendorId, businessInfo);
    const overallRiskScore = this.calculateOverallRisk(documents, businessAnalysis, complianceChecks);
    const riskCategory = this.categorizeRisk(overallRiskScore);
    const recommendations = this.generateKYCRecommendations(overallRiskScore, documents, businessAnalysis);

    return {
      vendorId,
      overallRiskScore,
      riskCategory,
      documentAnalysis: documents,
      businessAnalysis,
      complianceChecks,
      recommendations
    };
  }

  // Batch process multiple documents
  async batchProcessDocuments(documents: Array<{
    file: File;
    type?: string;
    vendorId?: string;
  }>): Promise<Array<DocumentAnalysis & { fileId: string }>> {
    console.log('Document Batch Processing:', documents.length, 'documents');

    const results = await Promise.all(
      documents.map(async (doc, index) => {
        const analysis = await this.analyzeDocument(doc.file, doc.type);
        return {
          ...analysis,
          fileId: `doc_${index}_${Date.now()}`
        };
      })
    );

    return results;
  }

  // Extract specific information types
  async extractBusinessInformation(documentText: string): Promise<{
    businessName: string | null;
    registrationNumber: string | null;
    businessType: string | null;
    establishedDate: string | null;
    authorizedCapital: number | null;
    directors: string[];
    registeredAddress: string | null;
  }> {
    console.log('Document Extraction: Extracting business information');

    return {
      businessName: this.extractBusinessName(documentText),
      registrationNumber: this.extractRegistrationNumber(documentText),
      businessType: this.extractBusinessType(documentText),
      establishedDate: this.extractEstablishedDate(documentText),
      authorizedCapital: this.extractAuthorizedCapital(documentText),
      directors: this.extractDirectors(documentText),
      registeredAddress: this.extractAddress(documentText)
    };
  }

  // Validate document authenticity
  async validateDocumentAuthenticity(documentAnalysis: DocumentAnalysis): Promise<{
    isAuthentic: boolean;
    confidence: number;
    verificationMethods: string[];
    suspiciousPatterns: string[];
    recommendations: string[];
  }> {
    const isAuthentic = documentAnalysis.confidence > 0.8 && documentAnalysis.validationChecks.documentAuthenticity;
    const suspiciousPatterns = this.detectSuspiciousPatterns(documentAnalysis);
    
    return {
      isAuthentic,
      confidence: documentAnalysis.confidence,
      verificationMethods: ['OCR analysis', 'Format validation', 'Data consistency check'],
      suspiciousPatterns,
      recommendations: isAuthentic 
        ? ['Document appears authentic', 'Proceed with onboarding']
        : ['Manual review required', 'Request additional documentation']
    };
  }

  // Private helper methods
  private async performOCR(documentFile: File): Promise<string> {
    // Mock OCR implementation
    console.log('OCR: Processing document', documentFile.name);
    
    // Simulate different document types
    const mockTexts = {
      'business_license': `
        GOVERNMENT OF BANGLADESH
        REGISTRAR OF JOINT STOCK COMPANIES AND FIRMS
        CERTIFICATE OF INCORPORATION
        
        Company Name: Tech Solutions Bangladesh Ltd.
        Registration Number: C-123456789
        Date of Incorporation: 15/03/2022
        Registered Office: 123 Gulshan Avenue, Dhaka 1212
        Authorized Capital: BDT 5,00,000
        
        Director: MD. Rahman Ahmed
        Director: Mrs. Fatima Begum
      `,
      'tax_certificate': `
        NATIONAL BOARD OF REVENUE
        TAX IDENTIFICATION NUMBER CERTIFICATE
        
        Business Name: Tech Solutions Bangladesh Ltd.
        TIN: 123456789012
        Issue Date: 20/03/2022
        Tax Circle: Dhaka Zone-3
        Business Address: 123 Gulshan Avenue, Dhaka 1212
      `
    };

    // Return mock text based on file name or random selection
    const textKeys = Object.keys(mockTexts);
    const randomKey = textKeys[Math.floor(Math.random() * textKeys.length)];
    return mockTexts[randomKey as keyof typeof mockTexts];
  }

  private detectDocumentType(text: string): string {
    const typePatterns = {
      'business_license': ['certificate of incorporation', 'registrar of joint stock', 'company registration'],
      'tax_certificate': ['tax identification', 'national board of revenue', 'tin certificate'],
      'identity_document': ['national id', 'passport', 'driving license'],
      'bank_statement': ['account statement', 'bank balance', 'transaction history']
    };

    const lowerText = text.toLowerCase();
    
    for (const [type, patterns] of Object.entries(typePatterns)) {
      if (patterns.some(pattern => lowerText.includes(pattern))) {
        return type;
      }
    }

    return 'other';
  }

  private extractStructuredData(text: string, documentType: string): any {
    const data: any = {};

    // Extract common patterns
    const patterns = {
      businessName: /(?:company name|business name):\s*(.+)/i,
      registrationNumber: /(?:registration number|reg\. no\.|certificate no\.):\s*([A-Z0-9-]+)/i,
      taxId: /(?:tin|tax id|tax identification number):\s*(\d+)/i,
      ownerName: /(?:director|owner|proprietor):\s*(.+)/i,
      address: /(?:registered office|address):\s*(.+)/i,
      phoneNumber: /(?:phone|mobile|contact):\s*([\d\s\-\+]+)/i,
      email: /(?:email|e-mail):\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
      issueDate: /(?:issue date|date of incorporation):\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
      expiryDate: /(?:expiry date|valid until):\s*(\d{1,2}\/\d{1,2}\/\d{4})/i
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        data[key] = match[1].trim();
      }
    }

    return data;
  }

  private calculateConfidence(text: string, extractedData: any): number {
    let confidence = 0.5; // Base confidence

    // More extracted fields = higher confidence
    const fieldCount = Object.keys(extractedData).length;
    confidence += Math.min(fieldCount * 0.05, 0.3);

    // Text quality indicators
    if (text.length > 200) confidence += 0.1;
    if (text.includes('GOVERNMENT') || text.includes('OFFICIAL')) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }

  private performRiskAssessment(extractedData: any, documentType: string): any {
    const riskFactors = [];
    let riskScore = 0;

    // Check for missing critical fields
    if (!extractedData.businessName) {
      riskFactors.push('Missing business name');
      riskScore += 0.3;
    }

    if (!extractedData.registrationNumber && documentType === 'business_license') {
      riskFactors.push('Missing registration number');
      riskScore += 0.4;
    }

    if (!extractedData.address) {
      riskFactors.push('Missing address information');
      riskScore += 0.2;
    }

    // Check for suspicious patterns
    if (extractedData.businessName && extractedData.businessName.length < 5) {
      riskFactors.push('Unusually short business name');
      riskScore += 0.2;
    }

    const riskLevel = riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low';
    const complianceScore = Math.max(0, 1 - riskScore);

    return {
      riskLevel,
      riskFactors,
      verificationStatus: riskLevel === 'high' ? 'rejected' : 'pending',
      complianceScore
    };
  }

  private performValidationChecks(extractedData: any, documentType: string): any {
    return {
      formatValidation: this.validateFormat(extractedData, documentType),
      dataConsistency: this.checkDataConsistency(extractedData),
      documentAuthenticity: this.checkAuthenticity(extractedData),
      requiredFieldsPresent: this.checkRequiredFields(extractedData, documentType)
    };
  }

  private validateFormat(extractedData: any, documentType: string): boolean {
    // Validate specific formats based on document type
    if (documentType === 'business_license' && extractedData.registrationNumber) {
      return /^[A-Z]-\d{8,}$/.test(extractedData.registrationNumber);
    }
    
    if (documentType === 'tax_certificate' && extractedData.taxId) {
      return /^\d{12}$/.test(extractedData.taxId);
    }

    return true; // Default to valid if no specific rules
  }

  private checkDataConsistency(extractedData: any): boolean {
    // Check for basic consistency
    if (extractedData.issueDate && extractedData.expiryDate) {
      const issueDate = new Date(extractedData.issueDate);
      const expiryDate = new Date(extractedData.expiryDate);
      return issueDate < expiryDate;
    }

    return true;
  }

  private checkAuthenticity(extractedData: any): boolean {
    // Simple authenticity checks
    const suspiciousPatterns = [
      'xxx', '000', 'test', 'sample', 'demo'
    ];

    const allText = Object.values(extractedData).join(' ').toLowerCase();
    return !suspiciousPatterns.some(pattern => allText.includes(pattern));
  }

  private checkRequiredFields(extractedData: any, documentType: string): boolean {
    const requiredFields = {
      'business_license': ['businessName', 'registrationNumber'],
      'tax_certificate': ['businessName', 'taxId'],
      'identity_document': ['ownerName'],
      'bank_statement': ['businessName', 'address']
    };

    const required = requiredFields[documentType as keyof typeof requiredFields] || [];
    return required.every(field => extractedData[field]);
  }

  private generateRecommendations(riskAssessment: any, validationChecks: any): string[] {
    const recommendations = [];

    if (riskAssessment.riskLevel === 'high') {
      recommendations.push('Manual review required');
      recommendations.push('Request additional documentation');
    }

    if (!validationChecks.formatValidation) {
      recommendations.push('Verify document format and authenticity');
    }

    if (!validationChecks.requiredFieldsPresent) {
      recommendations.push('Request complete documentation with all required fields');
    }

    if (recommendations.length === 0) {
      recommendations.push('Document appears valid - proceed with verification');
    }

    return recommendations;
  }

  private async analyzeBusinessProfile(businessInfo: any): Promise<any> {
    return {
      businessDescription: businessInfo.description || 'No description provided',
      industryRisk: this.assessIndustryRisk(businessInfo.industry),
      geographicRisk: this.assessGeographicRisk(businessInfo.location),
      reputationScore: Math.random() * 0.4 + 0.6, // Mock score 0.6-1.0
      onlinePresence: {
        website: !!businessInfo.website,
        socialMedia: !!businessInfo.socialMedia,
        reviews: Math.floor(Math.random() * 100),
        avgRating: Math.random() * 2 + 3 // 3-5 rating
      }
    };
  }

  private async performComplianceChecks(vendorId: string, businessInfo: any): Promise<any> {
    // Mock compliance checks
    return {
      sanctionsList: Math.random() > 0.05, // 95% pass rate
      blacklistCheck: Math.random() > 0.02, // 98% pass rate
      regulatoryCompliance: Math.random() > 0.1, // 90% pass rate
      taxCompliance: Math.random() > 0.15 // 85% pass rate
    };
  }

  private calculateOverallRisk(documents: DocumentAnalysis[], businessAnalysis: any, complianceChecks: any): number {
    let riskScore = 0;

    // Document risk
    const avgDocumentRisk = documents.reduce((sum, doc) => {
      const risk = doc.riskAssessment.riskLevel === 'high' ? 0.8 : 
                   doc.riskAssessment.riskLevel === 'medium' ? 0.5 : 0.2;
      return sum + risk;
    }, 0) / documents.length;

    riskScore += avgDocumentRisk * 0.4;

    // Business risk
    const businessRisk = (
      (businessAnalysis.industryRisk === 'high' ? 0.8 : businessAnalysis.industryRisk === 'medium' ? 0.5 : 0.2) +
      (businessAnalysis.geographicRisk === 'high' ? 0.8 : businessAnalysis.geographicRisk === 'medium' ? 0.5 : 0.2) +
      (1 - businessAnalysis.reputationScore)
    ) / 3;

    riskScore += businessRisk * 0.3;

    // Compliance risk
    const complianceRisk = Object.values(complianceChecks).filter(check => !check).length * 0.2;
    riskScore += complianceRisk * 0.3;

    return Math.min(1, riskScore);
  }

  private categorizeRisk(riskScore: number): KYCAnalysis['riskCategory'] {
    if (riskScore >= 0.8) return 'prohibited';
    if (riskScore >= 0.6) return 'high_risk';
    if (riskScore >= 0.4) return 'medium_risk';
    return 'low_risk';
  }

  private generateKYCRecommendations(riskScore: number, documents: DocumentAnalysis[], businessAnalysis: any): any[] {
    const recommendations = [];

    if (riskScore >= 0.8) {
      recommendations.push({
        action: 'Reject application',
        priority: 'high' as const,
        description: 'Risk score too high for onboarding'
      });
    } else if (riskScore >= 0.6) {
      recommendations.push({
        action: 'Enhanced due diligence',
        priority: 'high' as const,
        description: 'Conduct additional verification checks'
      });
    } else if (riskScore >= 0.4) {
      recommendations.push({
        action: 'Standard verification',
        priority: 'medium' as const,
        description: 'Complete standard onboarding process'
      });
    } else {
      recommendations.push({
        action: 'Fast track approval',
        priority: 'low' as const,
        description: 'Low risk - expedite onboarding'
      });
    }

    return recommendations;
  }

  private setupValidationRules(): void {
    // Setup validation rules for different document types
    this.validationRules.set('business_license', {
      requiredFields: ['businessName', 'registrationNumber', 'address'],
      formatRules: {
        registrationNumber: /^[A-Z]-\d{8,}$/
      }
    });

    this.validationRules.set('tax_certificate', {
      requiredFields: ['businessName', 'taxId'],
      formatRules: {
        taxId: /^\d{12}$/
      }
    });
  }

  private assessIndustryRisk(industry: string): 'low' | 'medium' | 'high' {
    const highRiskIndustries = ['gambling', 'cryptocurrency', 'adult', 'weapons'];
    const mediumRiskIndustries = ['finance', 'pharmaceuticals', 'alcohol'];
    
    if (highRiskIndustries.includes(industry?.toLowerCase())) return 'high';
    if (mediumRiskIndustries.includes(industry?.toLowerCase())) return 'medium';
    return 'low';
  }

  private assessGeographicRisk(location: string): 'low' | 'medium' | 'high' {
    // Mock geographic risk assessment
    const highRiskAreas = ['border_regions', 'conflict_zones'];
    const mediumRiskAreas = ['remote_areas'];
    
    if (highRiskAreas.includes(location?.toLowerCase())) return 'high';
    if (mediumRiskAreas.includes(location?.toLowerCase())) return 'medium';
    return 'low';
  }

  // Additional extraction helper methods
  private extractBusinessName(text: string): string | null {
    const patterns = [
      /(?:company name|business name):\s*(.+)/i,
      /(?:name of the company):\s*(.+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    
    return null;
  }

  private extractRegistrationNumber(text: string): string | null {
    const patterns = [
      /(?:registration number|reg\. no\.|certificate no\.):\s*([A-Z0-9-]+)/i,
      /(?:incorporation no\.|company no\.):\s*([A-Z0-9-]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    
    return null;
  }

  private extractBusinessType(text: string): string | null {
    const patterns = [
      /(?:company type|business type):\s*(.+)/i,
      /(private limited|public limited|partnership|sole proprietorship)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    
    return null;
  }

  private extractEstablishedDate(text: string): string | null {
    const patterns = [
      /(?:date of incorporation|established date|registration date):\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
      /(?:incorporated on):\s*(\d{1,2}\/\d{1,2}\/\d{4})/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    
    return null;
  }

  private extractAuthorizedCapital(text: string): number | null {
    const patterns = [
      /(?:authorized capital):\s*(?:BDT|Tk\.?)\s*([\d,]+)/i,
      /(?:capital):\s*(?:BDT|Tk\.?)\s*([\d,]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const amount = match[1].replace(/,/g, '');
        return parseInt(amount);
      }
    }
    
    return null;
  }

  private extractDirectors(text: string): string[] {
    const directors = [];
    const patterns = [
      /(?:director):\s*(.+)/gi,
      /(?:managing director):\s*(.+)/gi
    ];
    
    for (const pattern of patterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        directors.push(match[1].trim());
      }
    }
    
    return directors;
  }

  private extractAddress(text: string): string | null {
    const patterns = [
      /(?:registered office|registered address|address):\s*(.+)/i,
      /(?:office address):\s*(.+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    
    return null;
  }

  private detectSuspiciousPatterns(analysis: DocumentAnalysis): string[] {
    const patterns = [];
    
    if (analysis.confidence < 0.5) {
      patterns.push('Low confidence in OCR extraction');
    }
    
    if (!analysis.validationChecks.formatValidation) {
      patterns.push('Invalid document format detected');
    }
    
    if (analysis.extractedData.businessName && analysis.extractedData.businessName.includes('test')) {
      patterns.push('Test/sample document suspected');
    }
    
    return patterns;
  }
}

export const documentProcessor = DocumentProcessor.getInstance();
