const { Pool } = require('pg');
const logger = require('../utils/logger');

class PostgreSQLService {
  constructor() {
    this.pools = new Map();
    this.defaultConfig = {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };
  }

  // Create connection pool for specific database
  createPool(database, config = {}) {
    const poolConfig = {
      ...this.defaultConfig,
      database,
      ...config
    };

    const pool = new Pool(poolConfig);
    
    pool.on('error', (err, client) => {
      logger.error('Unexpected error on idle client', { error: err, database });
    });

    this.pools.set(database, pool);
    logger.info(`PostgreSQL pool created for database: ${database}`);
    
    return pool;
  }

  // Get pool for specific database
  getPool(database) {
    if (!this.pools.has(database)) {
      return this.createPool(database);
    }
    return this.pools.get(database);
  }

  // Execute query with automatic connection management
  async query(database, text, params = []) {
    const start = Date.now();
    const pool = this.getPool(database);
    
    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      
      logger.info('Executed query', {
        database,
        duration,
        rows: result.rowCount,
        query: text.substring(0, 100)
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error('Query failed', {
        database,
        duration,
        error: error.message,
        query: text.substring(0, 100),
        params
      });
      throw error;
    }
  }

  // Transaction support
  async transaction(database, queries) {
    const pool = this.getPool(database);
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      const results = [];
      
      for (const { text, params } of queries) {
        const result = await client.query(text, params);
        results.push(result);
      }
      
      await client.query('COMMIT');
      logger.info('Transaction committed successfully', { database, queryCount: queries.length });
      
      return results;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Transaction rolled back', { database, error: error.message });
      throw error;
    } finally {
      client.release();
    }
  }

  // Bulk insert with conflict resolution
  async bulkInsert(database, table, columns, values, onConflict = 'DO NOTHING') {
    const pool = this.getPool(database);
    
    if (values.length === 0) return { rowCount: 0 };
    
    const placeholders = values.map((_, index) => {
      const start = index * columns.length + 1;
      const end = start + columns.length - 1;
      const params = Array.from({ length: columns.length }, (_, i) => `$${start + i}`);
      return `(${params.join(', ')})`;
    }).join(', ');
    
    const flatValues = values.flat();
    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES ${placeholders}
      ON CONFLICT ${onConflict}
    `;
    
    return await this.query(database, query, flatValues);
  }

  // Health check
  async healthCheck(database) {
    try {
      const result = await this.query(database, 'SELECT 1 as health');
      return { healthy: true, database };
    } catch (error) {
      return { healthy: false, database, error: error.message };
    }
  }

  // Get connection pool statistics
  getPoolStats(database) {
    const pool = this.getPool(database);
    return {
      database,
      totalCount: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
  }

  // Close all connections
  async closeAll() {
    const promises = Array.from(this.pools.entries()).map(async ([database, pool]) => {
      try {
        await pool.end();
        logger.info(`Closed pool for database: ${database}`);
      } catch (error) {
        logger.error(`Error closing pool for database: ${database}`, { error: error.message });
      }
    });
    
    await Promise.all(promises);
    this.pools.clear();
  }
}

module.exports = new PostgreSQLService();