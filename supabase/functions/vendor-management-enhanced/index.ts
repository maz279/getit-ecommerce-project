import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Bangladesh KYC Validation Rules
const KYC_VALIDATION_RULES = {
  trade_license: {
    pattern: /^[A-Z0-9]{8,12}$/,
    required_fields: ['license_number', 'business_name', 'issue_date', 'expiry_date'],
    expiry_check: true
  },
  tin_certificate: {
    pattern: /^[0-9]{9,12}$/,
    required_fields: ['tin_number', 'taxpayer_name', 'issue_date'],
    expiry_check: false
  },
  bank_statement: {
    pattern: /^[0-9]{10,20}$/,
    required_fields: ['account_number', 'bank_name', 'account_holder_name', 'statement_date'],
    expiry_check: false
  },
  national_id: {
    pattern: /^[0-9]{10,17}$/,
    required_fields: ['nid_number', 'full_name', 'date_of_birth', 'address'],
    expiry_check: false
  }
};

// Vendor Service Class
class VendorService {
  
  // Vendor Registration with Bangladesh KYC
  async registerVendor(vendorData: any) {
    try {
      console.log('Registering new vendor:', vendorData.email);
      
      // Create vendor profile
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          user_id: vendorData.user_id,
          business_name: vendorData.business_name,
          email: vendorData.email,
          phone: vendorData.phone,
          business_type: vendorData.business_type,
          business_address: vendorData.business_address,
          status: 'pending_verification',
          registration_step: 'basic_info',
          bangladesh_specific_data: {
            division: vendorData.division,
            district: vendorData.district,
            upazila: vendorData.upazila,
            preferred_language: vendorData.preferred_language || 'bn'
          }
        })
        .select()
        .single();

      if (vendorError) throw vendorError;

      // Initialize verification workflow
      await this.initializeVerificationWorkflow(vendor.id);

      // Create default store
      await this.createDefaultStore(vendor.id, vendorData.business_name);

      return { success: true, vendor, workflow_initiated: true };
    } catch (error) {
      console.error('Vendor registration error:', error);
      throw error;
    }
  }

  // Initialize Bangladesh KYC Verification Workflow
  async initializeVerificationWorkflow(vendorId: string) {
    const workflowSteps = [
      { step: 'basic_info_verification', order: 1 },
      { step: 'trade_license_verification', order: 2 },
      { step: 'tin_certificate_verification', order: 3 },
      { step: 'bank_account_verification', order: 4 },
      { step: 'national_id_verification', order: 5 },
      { step: 'business_address_verification', order: 6 },
      { step: 'final_approval', order: 7 }
    ];

    const workflowData = workflowSteps.map(step => ({
      vendor_id: vendorId,
      workflow_step: step.step,
      step_order: step.order,
      status: step.order === 1 ? 'in_progress' : 'pending'
    }));

    const { error } = await supabase
      .from('vendor_verification_workflow')
      .insert(workflowData);

    if (error) throw error;
  }

  // Create Default Store
  async createDefaultStore(vendorId: string, businessName: string) {
    const storeSlug = businessName.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const { error } = await supabase
      .from('vendor_stores')
      .insert({
        vendor_id: vendorId,
        store_name: businessName,
        store_slug: `${storeSlug}-${Date.now()}`,
        store_description: `Welcome to ${businessName}`,
        is_active: false // Activated after verification
      });

    if (error) throw error;
  }

  // KYC Document Upload and Verification
  async uploadKYCDocument(vendorId: string, documentData: any) {
    try {
      console.log('Processing KYC document:', documentData.document_type);

      // Validate document against Bangladesh rules
      const validation = await this.validateKYCDocument(documentData);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      // Store document metadata
      const { data: document, error } = await supabase
        .from('vendor_kyc_documents')
        .insert({
          vendor_id: vendorId,
          document_type: documentData.document_type,
          document_number: documentData.document_number,
          file_path: documentData.file_path,
          file_name: documentData.file_name,
          file_size: documentData.file_size,
          mime_type: documentData.mime_type,
          verification_status: 'pending',
          metadata: documentData.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;

      // Update workflow step
      await this.updateWorkflowStep(vendorId, `${documentData.document_type}_verification`);

      // Auto-verify if validation score is high
      if (validation.autoVerify) {
        await this.autoVerifyDocument(document.id);
      }

      return { success: true, document, auto_verified: validation.autoVerify };
    } catch (error) {
      console.error('KYC document upload error:', error);
      throw error;
    }
  }

  // Validate KYC Document against Bangladesh Rules
  async validateKYCDocument(documentData: any) {
    const rules = KYC_VALIDATION_RULES[documentData.document_type as keyof typeof KYC_VALIDATION_RULES];
    if (!rules) {
      return { isValid: false, errors: ['Invalid document type'] };
    }

    const errors: string[] = [];
    let validationScore = 0;

    // Check required fields
    for (const field of rules.required_fields) {
      if (!documentData.metadata?.[field]) {
        errors.push(`Missing required field: ${field}`);
      } else {
        validationScore += 20;
      }
    }

    // Pattern validation
    if (rules.pattern && documentData.document_number) {
      if (!rules.pattern.test(documentData.document_number)) {
        errors.push('Invalid document number format');
      } else {
        validationScore += 30;
      }
    }

    // Expiry date validation
    if (rules.expiry_check && documentData.metadata?.expiry_date) {
      const expiryDate = new Date(documentData.metadata.expiry_date);
      if (expiryDate <= new Date()) {
        errors.push('Document has expired');
      } else {
        validationScore += 25;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validationScore,
      autoVerify: validationScore >= 85 && errors.length === 0
    };
  }

  // Auto-verify high-confidence documents
  async autoVerifyDocument(documentId: string) {
    const { error } = await supabase
      .from('vendor_kyc_documents')
      .update({
        verification_status: 'verified',
        verified_at: new Date().toISOString(),
        verified_by: null // System verification
      })
      .eq('id', documentId);

    if (error) throw error;
  }

  // Update Verification Workflow Step
  async updateWorkflowStep(vendorId: string, stepName: string, status = 'completed') {
    const { error } = await supabase
      .from('vendor_verification_workflow')
      .update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('vendor_id', vendorId)
      .eq('workflow_step', stepName);

    if (error) throw error;

    // Check if all steps are completed for final approval
    await this.checkForFinalApproval(vendorId);
  }

  // Check for Final Approval
  async checkForFinalApproval(vendorId: string) {
    const { data: workflow } = await supabase
      .from('vendor_verification_workflow')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('step_order');

    if (!workflow) return;

    const completedSteps = workflow.filter(step => step.status === 'completed');
    const totalSteps = workflow.length - 1; // Excluding final_approval step

    if (completedSteps.length >= totalSteps) {
      // Auto-approve vendor
      await this.approveVendor(vendorId);
    }
  }

  // Approve Vendor
  async approveVendor(vendorId: string) {
    try {
      // Update vendor status
      const { error: vendorError } = await supabase
        .from('vendors')
        .update({
          status: 'active',
          verified_at: new Date().toISOString(),
          registration_step: 'completed'
        })
        .eq('id', vendorId);

      if (vendorError) throw vendorError;

      // Activate store
      const { error: storeError } = await supabase
        .from('vendor_stores')
        .update({ is_active: true })
        .eq('vendor_id', vendorId);

      if (storeError) throw storeError;

      // Assign to Bronze tier
      const { data: bronzeTier } = await supabase
        .from('vendor_tiers')
        .select('id')
        .eq('tier_name', 'Bronze')
        .single();

      if (bronzeTier) {
        await supabase
          .from('vendor_performance_analytics')
          .insert({
            vendor_id: vendorId,
            tier_id: bronzeTier.id,
            performance_score: 75 // Starting score
          });
      }

      // Complete final workflow step
      await supabase
        .from('vendor_verification_workflow')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('vendor_id', vendorId)
        .eq('workflow_step', 'final_approval');

      console.log('Vendor approved successfully:', vendorId);
    } catch (error) {
      console.error('Vendor approval error:', error);
      throw error;
    }
  }

  // Get Vendor Performance Analytics
  async getVendorAnalytics(vendorId: string, period = '30d') {
    try {
      const { data: analytics } = await supabase
        .from('vendor_performance_analytics')
        .select(`
          *,
          vendor_tiers (tier_name, benefits, commission_discount)
        `)
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('vendor_id', vendorId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Calculate metrics
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const avgOrderValue = orders?.length ? totalRevenue / orders.length : 0;

      return {
        success: true,
        analytics,
        metrics: {
          total_orders: orders?.length || 0,
          total_revenue: totalRevenue,
          avg_order_value: avgOrderValue,
          period
        }
      };
    } catch (error) {
      console.error('Analytics retrieval error:', error);
      throw error;
    }
  }

  // Bangladesh Compliance Check
  async checkCompliance(vendorId: string) {
    try {
      const { data: compliance } = await supabase
        .from('vendor_compliance')
        .select('*')
        .eq('vendor_id', vendorId);

      const complianceStatus = {
        overall_status: 'compliant',
        checks: {
          vat_registration: false,
          trade_license: false,
          tin_certificate: false,
          bank_verification: false,
          aml_check: false
        },
        expiring_soon: [],
        non_compliant: []
      };

      compliance?.forEach(item => {
        complianceStatus.checks[item.compliance_type as keyof typeof complianceStatus.checks] = 
          item.status === 'compliant';

        if (item.status === 'non_compliant') {
          complianceStatus.non_compliant.push(item.compliance_type);
          complianceStatus.overall_status = 'non_compliant';
        }

        if (item.expiry_date && new Date(item.expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
          complianceStatus.expiring_soon.push({
            type: item.compliance_type,
            expiry_date: item.expiry_date
          });
        }
      });

      return { success: true, compliance: complianceStatus };
    } catch (error) {
      console.error('Compliance check error:', error);
      throw error;
    }
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace('/functions/v1/vendor-management-enhanced', '');
    const method = req.method;

    const vendorService = new VendorService();
    let result;

    // Route handling
    switch (true) {
      case method === 'POST' && path === '/register':
        const registerData = await req.json();
        result = await vendorService.registerVendor(registerData);
        break;

      case method === 'POST' && path.startsWith('/kyc/upload'):
        const vendorId = url.searchParams.get('vendor_id');
        const uploadData = await req.json();
        result = await vendorService.uploadKYCDocument(vendorId!, uploadData);
        break;

      case method === 'GET' && path.startsWith('/analytics'):
        const analyticsVendorId = url.searchParams.get('vendor_id');
        const period = url.searchParams.get('period') || '30d';
        result = await vendorService.getVendorAnalytics(analyticsVendorId!, period);
        break;

      case method === 'GET' && path.startsWith('/compliance'):
        const complianceVendorId = url.searchParams.get('vendor_id');
        result = await vendorService.checkCompliance(complianceVendorId!);
        break;

      case method === 'POST' && path.startsWith('/approve'):
        const approveVendorId = url.searchParams.get('vendor_id');
        await vendorService.approveVendor(approveVendorId!);
        result = { success: true, message: 'Vendor approved successfully' };
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Route not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Vendor service error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);