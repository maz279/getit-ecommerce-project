import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface KYCVerificationRequest {
  vendor_id: string;
  verification_type: 'nid' | 'trade_license' | 'tin' | 'bank_account';
  document_number: string;
  document_data: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (req.method) {
      case 'POST':
        if (action === 'verify') {
          return await verifyDocument(req, supabaseClient);
        } else if (action === 'bulk-verify') {
          return await bulkVerifyDocuments(req, supabaseClient);
        }
        break;
      
      case 'GET':
        if (action === 'status') {
          return await getVerificationStatus(req, supabaseClient);
        }
        break;
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('KYC verification error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function verifyDocument(req: Request, supabaseClient: any) {
  const { vendor_id, verification_type, document_number, document_data }: KYCVerificationRequest = await req.json();

  console.log(`Verifying ${verification_type} for vendor ${vendor_id}`);

  let verificationResponse;

  switch (verification_type) {
    case 'nid':
      verificationResponse = await verifyNID(document_number, document_data);
      break;
    
    case 'trade_license':
      verificationResponse = await verifyTradeLicense(document_number, document_data);
      break;
    
    case 'tin':
      verificationResponse = await verifyTIN(document_number, document_data);
      break;
    
    case 'bank_account':
      verificationResponse = await verifyBankAccount(document_number, document_data);
      break;
    
    default:
      throw new Error(`Unsupported verification type: ${verification_type}`);
  }

  // Save verification record
  const { data: verification, error: insertError } = await supabaseClient
    .from('bd_kyc_verifications')
    .insert({
      vendor_id,
      verification_type,
      document_number,
      document_data,
      verification_status: verificationResponse.verified ? 'verified' : 'rejected',
      api_response: verificationResponse,
      expiry_date: verificationResponse.expiry_date,
      rejection_reason: verificationResponse.error || null
    })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to save verification: ${insertError.message}`);
  }

  return new Response(JSON.stringify({
    success: true,
    verification_id: verification.id,
    verified: verificationResponse.verified,
    details: verificationResponse
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function bulkVerifyDocuments(req: Request, supabaseClient: any) {
  const { verifications } = await req.json();

  console.log(`Processing bulk verification for ${verifications.length} documents`);

  const results = [];

  for (const verification of verifications) {
    try {
      let verificationResponse;

      switch (verification.verification_type) {
        case 'nid':
          verificationResponse = await verifyNID(verification.document_number, verification.document_data);
          break;
        case 'trade_license':
          verificationResponse = await verifyTradeLicense(verification.document_number, verification.document_data);
          break;
        case 'tin':
          verificationResponse = await verifyTIN(verification.document_number, verification.document_data);
          break;
        case 'bank_account':
          verificationResponse = await verifyBankAccount(verification.document_number, verification.document_data);
          break;
        default:
          throw new Error(`Unsupported verification type: ${verification.verification_type}`);
      }

      // Save verification record
      const { data: savedVerification, error: insertError } = await supabaseClient
        .from('bd_kyc_verifications')
        .insert({
          vendor_id: verification.vendor_id,
          verification_type: verification.verification_type,
          document_number: verification.document_number,
          document_data: verification.document_data,
          verification_status: verificationResponse.verified ? 'verified' : 'rejected',
          api_response: verificationResponse,
          expiry_date: verificationResponse.expiry_date,
          rejection_reason: verificationResponse.error || null
        })
        .select()
        .single();

      results.push({
        vendor_id: verification.vendor_id,
        verification_type: verification.verification_type,
        success: !insertError,
        verified: verificationResponse.verified,
        verification_id: savedVerification?.id,
        error: insertError?.message || verificationResponse.error
      });

    } catch (error) {
      results.push({
        vendor_id: verification.vendor_id,
        verification_type: verification.verification_type,
        success: false,
        verified: false,
        error: error.message
      });
    }
  }

  return new Response(JSON.stringify({
    success: true,
    results,
    total_processed: verifications.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getVerificationStatus(req: Request, supabaseClient: any) {
  const url = new URL(req.url);
  const vendor_id = url.searchParams.get('vendor_id');
  const verification_type = url.searchParams.get('verification_type');

  if (!vendor_id) {
    return new Response(JSON.stringify({ error: 'vendor_id is required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let query = supabaseClient
    .from('bd_kyc_verifications')
    .select('*')
    .eq('vendor_id', vendor_id);

  if (verification_type) {
    query = query.eq('verification_type', verification_type);
  }

  const { data: verifications, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch verifications: ${error.message}`);
  }

  return new Response(JSON.stringify({
    success: true,
    verifications
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// NID Verification using Bangladesh Election Commission API (simulated)
async function verifyNID(nid_number: string, nid_data: any) {
  try {
    // In production, this would integrate with Bangladesh Election Commission's API
    // For now, we'll simulate the verification process
    
    console.log(`Verifying NID: ${nid_number}`);

    // Basic NID number format validation
    if (!/^\d{10}|\d{13}|\d{17}$/.test(nid_number)) {
      return {
        verified: false,
        error: 'Invalid NID number format',
        confidence_score: 0
      };
    }

    // Simulate API call to Election Commission
    // const response = await fetch('https://services.nidw.gov.bd/nid-verify', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ nid: nid_number, name: nid_data.name, dob: nid_data.date_of_birth })
    // });

    // Simulated response for demonstration
    const isValid = Math.random() > 0.1; // 90% success rate for demo

    return {
      verified: isValid,
      confidence_score: isValid ? 0.95 : 0.1,
      verified_data: isValid ? {
        name: nid_data.name,
        father_name: nid_data.father_name,
        mother_name: nid_data.mother_name,
        date_of_birth: nid_data.date_of_birth,
        address: nid_data.address,
        photo_verified: true
      } : null,
      expiry_date: null, // NID doesn't expire
      verification_timestamp: new Date().toISOString(),
      error: isValid ? null : 'NID verification failed - data mismatch'
    };

  } catch (error) {
    return {
      verified: false,
      error: error.message,
      confidence_score: 0
    };
  }
}

// Trade License Verification using RJSC API (simulated)
async function verifyTradeLicense(license_number: string, license_data: any) {
  try {
    console.log(`Verifying Trade License: ${license_number}`);

    // In production, integrate with RJSC (Registrar of Joint Stock Companies and Firms) API
    
    // Basic format validation
    if (!/^[A-Z]{4}-\d{6,8}$/.test(license_number)) {
      return {
        verified: false,
        error: 'Invalid trade license format',
        confidence_score: 0
      };
    }

    // Simulated verification
    const isValid = Math.random() > 0.15; // 85% success rate

    return {
      verified: isValid,
      confidence_score: isValid ? 0.92 : 0.05,
      verified_data: isValid ? {
        business_name: license_data.business_name,
        business_type: license_data.business_type,
        registration_date: license_data.registration_date,
        expiry_date: license_data.expiry_date,
        registered_address: license_data.address,
        proprietor_name: license_data.proprietor_name,
        status: 'Active'
      } : null,
      expiry_date: license_data.expiry_date,
      verification_timestamp: new Date().toISOString(),
      error: isValid ? null : 'Trade license verification failed'
    };

  } catch (error) {
    return {
      verified: false,
      error: error.message,
      confidence_score: 0
    };
  }
}

// TIN Verification using NBR API (simulated)
async function verifyTIN(tin_number: string, tin_data: any) {
  try {
    console.log(`Verifying TIN: ${tin_number}`);

    // In production, integrate with NBR (National Board of Revenue) API
    
    // Basic TIN format validation
    if (!/^\d{12}$/.test(tin_number)) {
      return {
        verified: false,
        error: 'Invalid TIN format - must be 12 digits',
        confidence_score: 0
      };
    }

    // Simulated verification
    const isValid = Math.random() > 0.12; // 88% success rate

    return {
      verified: isValid,
      confidence_score: isValid ? 0.93 : 0.08,
      verified_data: isValid ? {
        taxpayer_name: tin_data.name,
        business_name: tin_data.business_name,
        registration_date: tin_data.registration_date,
        tax_circle: tin_data.tax_circle,
        zone: tin_data.zone,
        status: 'Active',
        last_return_filed: tin_data.last_return_date
      } : null,
      expiry_date: null, // TIN doesn't expire but can be deactivated
      verification_timestamp: new Date().toISOString(),
      error: isValid ? null : 'TIN verification failed'
    };

  } catch (error) {
    return {
      verified: false,
      error: error.message,
      confidence_score: 0
    };
  }
}

// Bank Account Verification (simulated)
async function verifyBankAccount(account_number: string, account_data: any) {
  try {
    console.log(`Verifying Bank Account: ${account_number}`);

    // In production, integrate with Bangladesh Bank's Account Verification Service
    
    // Basic account number validation
    if (account_number.length < 10 || account_number.length > 20) {
      return {
        verified: false,
        error: 'Invalid account number length',
        confidence_score: 0
      };
    }

    // Simulated verification
    const isValid = Math.random() > 0.08; // 92% success rate

    return {
      verified: isValid,
      confidence_score: isValid ? 0.96 : 0.05,
      verified_data: isValid ? {
        account_holder_name: account_data.account_holder_name,
        bank_name: account_data.bank_name,
        branch_name: account_data.branch_name,
        account_type: account_data.account_type,
        status: 'Active',
        routing_number: account_data.routing_number
      } : null,
      expiry_date: null,
      verification_timestamp: new Date().toISOString(),
      error: isValid ? null : 'Bank account verification failed'
    };

  } catch (error) {
    return {
      verified: false,
      error: error.message,
      confidence_score: 0
    };
  }
}