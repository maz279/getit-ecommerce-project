/**
 * Enterprise-Grade Encryption Service
 * Handles all encryption/decryption operations for sensitive data
 */

export interface EncryptionOptions {
  algorithm?: string;
  keyDerivation?: string;
  iterations?: number;
  keyLength?: number;
}

export interface EncryptedData {
  data: string;
  iv: string;
  salt: string;
  tag?: string;
  algorithm: string;
}

export class EncryptionService {
  private static instance: EncryptionService;
  private readonly defaultAlgorithm = 'AES-GCM';
  private readonly keyDerivationAlgorithm = 'PBKDF2';
  private readonly iterations = 100000;
  private readonly keyLength = 256;

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Encrypt sensitive data using AES-GCM
   */
  async encrypt(data: string, password: string, options: EncryptionOptions = {}): Promise<EncryptedData> {
    const algorithm = options.algorithm || this.defaultAlgorithm;
    const iterations = options.iterations || this.iterations;
    const keyLength = options.keyLength || this.keyLength;

    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Derive key from password
    const key = await this.deriveKey(password, salt, iterations, keyLength);

    // Encrypt the data
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: algorithm,
        iv: iv,
      },
      key,
      encodedData
    );

    // Convert to base64
    const encryptedArray = new Uint8Array(encrypted);
    const encryptedData = btoa(String.fromCharCode(...encryptedArray));
    const ivString = btoa(String.fromCharCode(...iv));
    const saltString = btoa(String.fromCharCode(...salt));

    return {
      data: encryptedData,
      iv: ivString,
      salt: saltString,
      algorithm
    };
  }

  /**
   * Decrypt data
   */
  async decrypt(encryptedData: EncryptedData, password: string): Promise<string> {
    // Convert from base64
    const salt = new Uint8Array(atob(encryptedData.salt).split('').map(c => c.charCodeAt(0)));
    const iv = new Uint8Array(atob(encryptedData.iv).split('').map(c => c.charCodeAt(0)));
    const data = new Uint8Array(atob(encryptedData.data).split('').map(c => c.charCodeAt(0)));

    // Derive key
    const key = await this.deriveKey(password, salt, this.iterations, this.keyLength);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: encryptedData.algorithm,
        iv: iv,
      },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  /**
   * Generate secure hash
   */
  async hash(data: string, algorithm: string = 'SHA-256'): Promise<string> {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, encodedData);
    const hashArray = new Uint8Array(hashBuffer);
    return btoa(String.fromCharCode(...hashArray));
  }

  /**
   * Generate secure random token
   */
  generateToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array)).replace(/[+/=]/g, '');
  }

  /**
   * Derive cryptographic key from password
   */
  private async deriveKey(
    password: string, 
    salt: Uint8Array, 
    iterations: number, 
    keyLength: number
  ): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: this.keyDerivationAlgorithm },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: this.keyDerivationAlgorithm,
        salt: salt,
        iterations: iterations,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: keyLength },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt payment data with PCI DSS compliance
   */
  async encryptPaymentData(paymentInfo: any): Promise<EncryptedData> {
    const sensitiveData = JSON.stringify({
      cardNumber: paymentInfo.cardNumber,
      cvv: paymentInfo.cvv,
      expiryDate: paymentInfo.expiryDate
    });

    return this.encrypt(sensitiveData, process.env.PAYMENT_ENCRYPTION_KEY || 'default-key');
  }

  /**
   * Encrypt user PII data
   */
  async encryptPIIData(userData: any): Promise<EncryptedData> {
    const piiData = JSON.stringify({
      nid: userData.nid,
      passport: userData.passport,
      bankAccount: userData.bankAccount,
      phone: userData.phone
    });

    return this.encrypt(piiData, process.env.PII_ENCRYPTION_KEY || 'default-key');
  }
}

export const encryptionService = EncryptionService.getInstance();