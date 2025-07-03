/**
 * Field Validation with Bangladesh Formats
 * GetIt Multi-Vendor Ecommerce Platform
 * 
 * Features:
 * - Bangladesh-specific validations (NID, mobile, address)
 * - Multi-language error messages
 * - Business rule validations
 * - Performance optimized regex patterns
 * - Comprehensive validation suite
 */

import { ERROR_TYPES, GetItError } from './error-handler.js';

// Bangladesh-specific validation patterns
const BANGLADESH_PATTERNS = {
  // Mobile number patterns (11 digits starting with 01)
  MOBILE_NUMBER: /^01[3-9]\d{8}$/,
  
  // National ID patterns (10, 13, or 17 digits)
  NID_OLD: /^\d{10}$/,           // Old 10-digit NID
  NID_NEW: /^\d{13}$/,           // New 13-digit NID
  NID_SMART: /^\d{17}$/,         // Smart card 17-digit NID
  
  // TIN (Tax Identification Number) - 12 digits
  TIN: /^\d{12}$/,
  
  // Trade License - varies by authority but typically 6-12 digits
  TRADE_LICENSE: /^[A-Z0-9]{6,12}$/i,
  
  // Bangladesh postal codes (4 digits)
  POSTAL_CODE: /^\d{4}$/,
  
  // Bank account numbers (varies by bank, typically 10-20 digits)
  BANK_ACCOUNT: /^\d{10,20}$/,
  
  // Vehicle registration (Dhaka: GA-XX-XXXX format)
  VEHICLE_REG: /^[A-Z]{2}-\d{2}-\d{4}$/i
};

// Address validation patterns for Bangladesh
const ADDRESS_PATTERNS = {
  // Division names in Bangladesh
  DIVISIONS: [
    'dhaka', 'chittagong', 'rajshahi', 'khulna', 'barisal', 'sylhet', 'rangpur', 'mymensingh'
  ],
  
  // Major city patterns
  MAJOR_CITIES: [
    'dhaka', 'chittagong', 'khulna', 'rajshahi', 'sylhet', 'barisal', 'rangpur', 'comilla',
    'gazipur', 'narayanganj', 'savar', 'brahmanbaria', 'tangail', 'jamalpur', 'mymensingh'
  ]
};

// Business validation rules
const BUSINESS_RULES = {
  // Product validation
  PRODUCT: {
    MIN_PRICE: 1,
    MAX_PRICE: 10000000, // 1 crore BDT
    MIN_DISCOUNT: 0,
    MAX_DISCOUNT: 90,
    MIN_STOCK: 0,
    MAX_STOCK: 999999,
    MAX_TITLE_LENGTH: 200,
    MAX_DESCRIPTION_LENGTH: 5000
  },
  
  // Order validation
  ORDER: {
    MIN_ORDER_VALUE: 100, // 100 BDT minimum
    MAX_ORDER_VALUE: 1000000, // 10 lakh BDT maximum
    MAX_ITEMS_PER_ORDER: 100,
    SHIPPING_WEIGHT_LIMIT: 50000 // 50kg in grams
  },
  
  // Vendor validation
  VENDOR: {
    MIN_COMMISSION: 5,
    MAX_COMMISSION: 50,
    MIN_SHOP_NAME_LENGTH: 3,
    MAX_SHOP_NAME_LENGTH: 100,
    REQUIRED_DOCUMENTS: ['trade_license', 'nid', 'bank_statement']
  },
  
  // Payment validation
  PAYMENT: {
    MIN_PAYMENT_AMOUNT: 10,
    MAX_PAYMENT_AMOUNT: 500000, // 5 lakh BDT
    ALLOWED_CURRENCIES: ['BDT', 'USD'],
    BKASH_LIMITS: { min: 10, max: 25000 },
    NAGAD_LIMITS: { min: 10, max: 25000 },
    ROCKET_LIMITS: { min: 10, max: 20000 }
  }
};

// Validation error messages in multiple languages
const VALIDATION_MESSAGES = {
  MOBILE_INVALID: {
    en: 'Please enter a valid Bangladesh mobile number (01XXXXXXXXX)',
    bn: 'অনুগ্রহ করে একটি বৈধ বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)'
  },
  NID_INVALID: {
    en: 'Please enter a valid National ID number (10, 13, or 17 digits)',
    bn: 'অনুগ্রহ করে একটি বৈধ জাতীয় পরিচয়পত্র নম্বর দিন (10, 13, বা 17 সংখ্যা)'
  },
  TIN_INVALID: {
    en: 'Please enter a valid TIN number (12 digits)',
    bn: 'অনুগ্রহ করে একটি বৈধ টিন নম্বর দিন (12 সংখ্যা)'
  },
  EMAIL_INVALID: {
    en: 'Please enter a valid email address',
    bn: 'অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা দিন'
  },
  REQUIRED_FIELD: {
    en: 'This field is required',
    bn: 'এই ক্ষেত্রটি আবশ্যক'
  },
  PRICE_RANGE: {
    en: 'Price must be between ৳1 and ৳1,00,00,000',
    bn: 'দাম ৳১ থেকে ৳১,০০,০০,০০০ এর মধ্যে হতে হবে'
  },
  ADDRESS_INVALID: {
    en: 'Please provide a valid Bangladesh address',
    bn: 'অনুগ্রহ করে একটি বৈধ বাংলাদেশি ঠিকানা প্রদান করুন'
  }
};

class BangladeshValidator {
  constructor() {
    this.cache = new Map(); // Cache validation results for performance
  }

  // Validate Bangladesh mobile number
  validateMobile(mobile, required = true) {
    if (!mobile && !required) return { isValid: true };
    if (!mobile && required) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.REQUIRED_FIELD,
        code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
      };
    }

    // Clean mobile number (remove spaces, dashes, country code)
    const cleanMobile = mobile.toString()
      .replace(/[\s\-\+]/g, '')
      .replace(/^88/, ''); // Remove country code if present

    const isValid = BANGLADESH_PATTERNS.MOBILE_NUMBER.test(cleanMobile);
    
    return {
      isValid,
      cleanValue: isValid ? cleanMobile : null,
      error: isValid ? null : VALIDATION_MESSAGES.MOBILE_INVALID,
      code: isValid ? null : ERROR_TYPES.VALIDATION_PHONE_NUMBER_INVALID
    };
  }

  // Validate National ID (NID)
  validateNID(nid, required = true) {
    if (!nid && !required) return { isValid: true };
    if (!nid && required) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.REQUIRED_FIELD,
        code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
      };
    }

    const cleanNID = nid.toString().replace(/\s/g, '');
    const isValid = BANGLADESH_PATTERNS.NID_OLD.test(cleanNID) ||
                    BANGLADESH_PATTERNS.NID_NEW.test(cleanNID) ||
                    BANGLADESH_PATTERNS.NID_SMART.test(cleanNID);

    return {
      isValid,
      cleanValue: isValid ? cleanNID : null,
      nidType: this.detectNIDType(cleanNID),
      error: isValid ? null : VALIDATION_MESSAGES.NID_INVALID,
      code: isValid ? null : ERROR_TYPES.KYC_NID_INVALID
    };
  }

  // Detect NID type
  detectNIDType(nid) {
    if (BANGLADESH_PATTERNS.NID_OLD.test(nid)) return 'old';
    if (BANGLADESH_PATTERNS.NID_NEW.test(nid)) return 'new';
    if (BANGLADESH_PATTERNS.NID_SMART.test(nid)) return 'smart';
    return 'unknown';
  }

  // Validate TIN (Tax Identification Number)
  validateTIN(tin, required = true) {
    if (!tin && !required) return { isValid: true };
    if (!tin && required) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.REQUIRED_FIELD,
        code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
      };
    }

    const cleanTIN = tin.toString().replace(/\s/g, '');
    const isValid = BANGLADESH_PATTERNS.TIN.test(cleanTIN);

    return {
      isValid,
      cleanValue: isValid ? cleanTIN : null,
      error: isValid ? null : VALIDATION_MESSAGES.TIN_INVALID,
      code: isValid ? null : ERROR_TYPES.KYC_VERIFICATION_FAILED
    };
  }

  // Validate trade license
  validateTradeLicense(license, required = true) {
    if (!license && !required) return { isValid: true };
    if (!license && required) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.REQUIRED_FIELD,
        code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
      };
    }

    const cleanLicense = license.toString().replace(/\s/g, '').toUpperCase();
    const isValid = BANGLADESH_PATTERNS.TRADE_LICENSE.test(cleanLicense);

    return {
      isValid,
      cleanValue: isValid ? cleanLicense : null,
      error: isValid ? null : VALIDATION_MESSAGES.REQUIRED_FIELD,
      code: isValid ? null : ERROR_TYPES.KYC_TRADE_LICENSE_EXPIRED
    };
  }

  // Validate Bangladesh address
  validateAddress(address, required = true) {
    if (!address && !required) return { isValid: true };
    if (!address && required) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.REQUIRED_FIELD,
        code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
      };
    }

    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    // Check required fields
    const requiredFields = ['district', 'upazila', 'address_line'];
    for (const field of requiredFields) {
      if (!address[field] || address[field].trim().length === 0) {
        validation.isValid = false;
        validation.errors.push({
          field,
          message: VALIDATION_MESSAGES.REQUIRED_FIELD,
          code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
        });
      }
    }

    // Validate postal code if provided
    if (address.postal_code && !BANGLADESH_PATTERNS.POSTAL_CODE.test(address.postal_code)) {
      validation.isValid = false;
      validation.errors.push({
        field: 'postal_code',
        message: { en: 'Postal code must be 4 digits', bn: 'পোস্টাল কোড 4 সংখ্যা হতে হবে' },
        code: ERROR_TYPES.VALIDATION_INVALID_FORMAT
      });
    }

    // Check if division is valid Bangladesh division
    if (address.division) {
      const division = address.division.toLowerCase();
      if (!ADDRESS_PATTERNS.DIVISIONS.includes(division)) {
        validation.warnings.push({
          field: 'division',
          message: { en: 'Please verify the division name', bn: 'অনুগ্রহ করে বিভাগের নাম যাচাই করুন' }
        });
      }
    }

    return validation;
  }

  // Validate email address
  validateEmail(email, required = true) {
    if (!email && !required) return { isValid: true };
    if (!email && required) {
      return {
        isValid: false,
        error: VALIDATION_MESSAGES.REQUIRED_FIELD,
        code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    return {
      isValid,
      cleanValue: isValid ? email.toLowerCase().trim() : null,
      error: isValid ? null : VALIDATION_MESSAGES.EMAIL_INVALID,
      code: isValid ? null : ERROR_TYPES.VALIDATION_EMAIL_INVALID
    };
  }

  // Validate product data
  validateProduct(product) {
    const validation = { isValid: true, errors: [], warnings: [] };

    // Required fields validation
    const requiredFields = ['name', 'price', 'category_id', 'vendor_id'];
    for (const field of requiredFields) {
      if (!product[field]) {
        validation.isValid = false;
        validation.errors.push({
          field,
          message: VALIDATION_MESSAGES.REQUIRED_FIELD,
          code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
        });
      }
    }

    // Price validation
    if (product.price) {
      const price = parseFloat(product.price);
      if (price < BUSINESS_RULES.PRODUCT.MIN_PRICE || price > BUSINESS_RULES.PRODUCT.MAX_PRICE) {
        validation.isValid = false;
        validation.errors.push({
          field: 'price',
          message: VALIDATION_MESSAGES.PRICE_RANGE,
          code: ERROR_TYPES.VALIDATION_INVALID_FORMAT
        });
      }
    }

    // Discount validation
    if (product.discount_percentage) {
      const discount = parseFloat(product.discount_percentage);
      if (discount < BUSINESS_RULES.PRODUCT.MIN_DISCOUNT || discount > BUSINESS_RULES.PRODUCT.MAX_DISCOUNT) {
        validation.isValid = false;
        validation.errors.push({
          field: 'discount_percentage',
          message: { en: 'Discount must be between 0% and 90%', bn: 'ছাড় 0% থেকে 90% এর মধ্যে হতে হবে' },
          code: ERROR_TYPES.VALIDATION_INVALID_FORMAT
        });
      }
    }

    // Stock validation
    if (product.stock_quantity !== undefined) {
      const stock = parseInt(product.stock_quantity);
      if (stock < BUSINESS_RULES.PRODUCT.MIN_STOCK || stock > BUSINESS_RULES.PRODUCT.MAX_STOCK) {
        validation.warnings.push({
          field: 'stock_quantity',
          message: { en: 'Stock quantity seems unusual', bn: 'স্টক পরিমাণ অস্বাভাবিক মনে হচ্ছে' }
        });
      }
    }

    return validation;
  }

  // Validate order data
  validateOrder(order) {
    const validation = { isValid: true, errors: [], warnings: [] };

    // Required fields
    const requiredFields = ['customer_id', 'items', 'shipping_address'];
    for (const field of requiredFields) {
      if (!order[field]) {
        validation.isValid = false;
        validation.errors.push({
          field,
          message: VALIDATION_MESSAGES.REQUIRED_FIELD,
          code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
        });
      }
    }

    // Order value validation
    if (order.total_amount) {
      const total = parseFloat(order.total_amount);
      if (total < BUSINESS_RULES.ORDER.MIN_ORDER_VALUE) {
        validation.isValid = false;
        validation.errors.push({
          field: 'total_amount',
          message: { en: 'Minimum order value is ৳100', bn: 'সর্বনিম্ন অর্ডার মূল্য ৳১০০' },
          code: ERROR_TYPES.VALIDATION_INVALID_FORMAT
        });
      }
      if (total > BUSINESS_RULES.ORDER.MAX_ORDER_VALUE) {
        validation.warnings.push({
          field: 'total_amount',
          message: { en: 'Large order amount - verification may be required', bn: 'বড় অর্ডার পরিমাণ - যাচাইকরণের প্রয়োজন হতে পারে' }
        });
      }
    }

    // Items validation
    if (order.items && Array.isArray(order.items)) {
      if (order.items.length === 0) {
        validation.isValid = false;
        validation.errors.push({
          field: 'items',
          message: { en: 'Order must contain at least one item', bn: 'অর্ডারে কমপক্ষে একটি আইটেম থাকতে হবে' },
          code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
        });
      }
      if (order.items.length > BUSINESS_RULES.ORDER.MAX_ITEMS_PER_ORDER) {
        validation.isValid = false;
        validation.errors.push({
          field: 'items',
          message: { en: 'Too many items in single order', bn: 'একক অর্ডারে অনেক বেশি আইটেম' },
          code: ERROR_TYPES.VALIDATION_INVALID_FORMAT
        });
      }
    }

    // Validate shipping address
    if (order.shipping_address) {
      const addressValidation = this.validateAddress(order.shipping_address);
      if (!addressValidation.isValid) {
        validation.isValid = false;
        validation.errors.push(...addressValidation.errors);
      }
      validation.warnings.push(...(addressValidation.warnings || []));
    }

    return validation;
  }

  // Validate payment data
  validatePayment(payment) {
    const validation = { isValid: true, errors: [], warnings: [] };

    // Required fields
    const requiredFields = ['amount', 'currency', 'payment_method'];
    for (const field of requiredFields) {
      if (!payment[field]) {
        validation.isValid = false;
        validation.errors.push({
          field,
          message: VALIDATION_MESSAGES.REQUIRED_FIELD,
          code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
        });
      }
    }

    // Amount validation
    if (payment.amount) {
      const amount = parseFloat(payment.amount);
      if (amount < BUSINESS_RULES.PAYMENT.MIN_PAYMENT_AMOUNT) {
        validation.isValid = false;
        validation.errors.push({
          field: 'amount',
          message: { en: 'Minimum payment amount is ৳10', bn: 'সর্বনিম্ন পেমেন্ট পরিমাণ ৳১০' },
          code: ERROR_TYPES.VALIDATION_INVALID_FORMAT
        });
      }

      // Payment method specific limits
      if (payment.payment_method === 'bkash') {
        const limits = BUSINESS_RULES.PAYMENT.BKASH_LIMITS;
        if (amount < limits.min || amount > limits.max) {
          validation.isValid = false;
          validation.errors.push({
            field: 'amount',
            message: { en: `bKash amount must be between ৳${limits.min} and ৳${limits.max}`, bn: `বিকাশ পরিমাণ ৳${limits.min} থেকে ৳${limits.max} এর মধ্যে হতে হবে` },
            code: ERROR_TYPES.PAYMENT_BKASH_FAILED
          });
        }
      }
    }

    // Currency validation
    if (payment.currency && !BUSINESS_RULES.PAYMENT.ALLOWED_CURRENCIES.includes(payment.currency)) {
      validation.isValid = false;
      validation.errors.push({
        field: 'currency',
        message: { en: 'Unsupported currency', bn: 'অসমর্থিত মুদ্রা' },
        code: ERROR_TYPES.VALIDATION_INVALID_FORMAT
      });
    }

    return validation;
  }

  // Validate vendor data
  validateVendor(vendor) {
    const validation = { isValid: true, errors: [], warnings: [] };

    // Required fields
    const requiredFields = ['shop_name', 'owner_name', 'mobile_number', 'email', 'nid'];
    for (const field of requiredFields) {
      if (!vendor[field]) {
        validation.isValid = false;
        validation.errors.push({
          field,
          message: VALIDATION_MESSAGES.REQUIRED_FIELD,
          code: ERROR_TYPES.VALIDATION_REQUIRED_FIELD
        });
      }
    }

    // Shop name validation
    if (vendor.shop_name) {
      const length = vendor.shop_name.trim().length;
      if (length < BUSINESS_RULES.VENDOR.MIN_SHOP_NAME_LENGTH || length > BUSINESS_RULES.VENDOR.MAX_SHOP_NAME_LENGTH) {
        validation.isValid = false;
        validation.errors.push({
          field: 'shop_name',
          message: { en: 'Shop name must be between 3 and 100 characters', bn: 'দোকানের নাম 3 থেকে 100 অক্ষরের মধ্যে হতে হবে' },
          code: ERROR_TYPES.VALIDATION_INVALID_FORMAT
        });
      }
    }

    // Mobile validation
    if (vendor.mobile_number) {
      const mobileValidation = this.validateMobile(vendor.mobile_number);
      if (!mobileValidation.isValid) {
        validation.isValid = false;
        validation.errors.push({
          field: 'mobile_number',
          message: mobileValidation.error,
          code: mobileValidation.code
        });
      }
    }

    // Email validation
    if (vendor.email) {
      const emailValidation = this.validateEmail(vendor.email);
      if (!emailValidation.isValid) {
        validation.isValid = false;
        validation.errors.push({
          field: 'email',
          message: emailValidation.error,
          code: emailValidation.code
        });
      }
    }

    // NID validation
    if (vendor.nid) {
      const nidValidation = this.validateNID(vendor.nid);
      if (!nidValidation.isValid) {
        validation.isValid = false;
        validation.errors.push({
          field: 'nid',
          message: nidValidation.error,
          code: nidValidation.code
        });
      }
    }

    // Commission rate validation
    if (vendor.commission_rate) {
      const rate = parseFloat(vendor.commission_rate);
      if (rate < BUSINESS_RULES.VENDOR.MIN_COMMISSION || rate > BUSINESS_RULES.VENDOR.MAX_COMMISSION) {
        validation.warnings.push({
          field: 'commission_rate',
          message: { en: 'Commission rate should be between 5% and 50%', bn: 'কমিশনের হার 5% থেকে 50% এর মধ্যে হওয়া উচিত' }
        });
      }
    }

    return validation;
  }

  // Bulk validation for multiple records
  validateBulk(data, validationType) {
    const results = {
      totalRecords: data.length,
      validRecords: 0,
      invalidRecords: 0,
      results: [],
      summary: {
        commonErrors: {},
        fieldErrors: {}
      }
    };

    for (let i = 0; i < data.length; i++) {
      let validation;
      
      switch (validationType) {
        case 'product':
          validation = this.validateProduct(data[i]);
          break;
        case 'vendor':
          validation = this.validateVendor(data[i]);
          break;
        case 'order':
          validation = this.validateOrder(data[i]);
          break;
        default:
          validation = { isValid: false, errors: [{ message: 'Unknown validation type' }] };
      }

      results.results.push({
        index: i,
        data: data[i],
        ...validation
      });

      if (validation.isValid) {
        results.validRecords++;
      } else {
        results.invalidRecords++;
        
        // Track common errors
        validation.errors?.forEach(error => {
          const errorKey = error.code || 'UNKNOWN_ERROR';
          results.summary.commonErrors[errorKey] = (results.summary.commonErrors[errorKey] || 0) + 1;
          
          results.summary.fieldErrors[error.field] = (results.summary.fieldErrors[error.field] || 0) + 1;
        });
      }
    }

    return results;
  }

  // Get validation schema for frontend
  getValidationSchema(type) {
    const schemas = {
      mobile: {
        pattern: BANGLADESH_PATTERNS.MOBILE_NUMBER.source,
        example: '01712345678',
        description: 'Bangladesh mobile number starting with 01'
      },
      nid: {
        patterns: [
          BANGLADESH_PATTERNS.NID_OLD.source,
          BANGLADESH_PATTERNS.NID_NEW.source,
          BANGLADESH_PATTERNS.NID_SMART.source
        ],
        examples: ['1234567890', '1234567890123', '12345678901234567'],
        description: 'National ID: 10, 13, or 17 digits'
      },
      tin: {
        pattern: BANGLADESH_PATTERNS.TIN.source,
        example: '123456789012',
        description: 'Tax Identification Number: 12 digits'
      },
      email: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        example: 'user@example.com',
        description: 'Valid email address'
      }
    };

    return schemas[type] || null;
  }
}

// Create singleton instance
const validator = new BangladeshValidator();

export default validator;
export { BangladeshValidator, BANGLADESH_PATTERNS, BUSINESS_RULES, VALIDATION_MESSAGES };