const crypto = require('crypto');
const bcrypt = require('bcrypt');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.secretKey = process.env.ENCRYPTION_KEY || 'default-secret-key-change-in-production';
    this.saltRounds = 12;
  }

  // Hash password using bcrypt
  async hashPassword(password) {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  // Verify password
  async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Password verification failed: ${error.message}`);
    }
  }

  // Encrypt sensitive data
  encrypt(text) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(this.algorithm, this.secretKey);
      cipher.setAAD(Buffer.from('GetIt-Platform'));
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  // Decrypt sensitive data
  decrypt(encryptedData) {
    try {
      const { encrypted, iv, authTag } = encryptedData;
      const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
      
      decipher.setAAD(Buffer.from('GetIt-Platform'));
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  // Generate secure random token
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash sensitive data for storage
  hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Generate API key
  generateApiKey() {
    const timestamp = Date.now().toString();
    const randomData = crypto.randomBytes(16).toString('hex');
    return `getit_${timestamp}_${randomData}`;
  }

  // Encrypt Bangladesh-specific sensitive data (NID, Bank Account)
  encryptBangladeshData(data) {
    const sensitiveFields = ['nid', 'bankAccount', 'tin', 'tradeLicense'];
    const encrypted = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (sensitiveFields.includes(key) && value) {
        encrypted[key] = this.encrypt(value.toString());
      } else {
        encrypted[key] = value;
      }
    }
    
    return encrypted;
  }

  // Decrypt Bangladesh-specific sensitive data
  decryptBangladeshData(encryptedData) {
    const sensitiveFields = ['nid', 'bankAccount', 'tin', 'tradeLicense'];
    const decrypted = {};
    
    for (const [key, value] of Object.entries(encryptedData)) {
      if (sensitiveFields.includes(key) && value && typeof value === 'object') {
        decrypted[key] = this.decrypt(value);
      } else {
        decrypted[key] = value;
      }
    }
    
    return decrypted;
  }
}

module.exports = new EncryptionService();