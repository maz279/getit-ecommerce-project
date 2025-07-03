const { MongoClient, ObjectId } = require('mongodb');
const logger = require('../utils/logger');

class MongoDBService {
  constructor() {
    this.clients = new Map();
    this.databases = new Map();
    this.defaultConfig = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
  }

  // Create MongoDB client and connect
  async connect(database, uri, config = {}) {
    try {
      const clientConfig = { ...this.defaultConfig, ...config };
      const client = new MongoClient(uri, clientConfig);
      
      await client.connect();
      
      this.clients.set(database, client);
      this.databases.set(database, client.db(database));
      
      logger.info(`Connected to MongoDB database: ${database}`);
      
      return client;
    } catch (error) {
      logger.error(`Failed to connect to MongoDB: ${database}`, { error: error.message });
      throw error;
    }
  }

  // Get database instance
  getDatabase(database) {
    if (!this.databases.has(database)) {
      throw new Error(`Database ${database} not connected`);
    }
    return this.databases.get(database);
  }

  // Insert document
  async insertOne(database, collection, document) {
    try {
      const db = this.getDatabase(database);
      const result = await db.collection(collection).insertOne({
        ...document,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      logger.info('Document inserted', {
        database,
        collection,
        documentId: result.insertedId
      });
      
      return result;
    } catch (error) {
      logger.error('Insert failed', {
        database,
        collection,
        error: error.message
      });
      throw error;
    }
  }

  // Insert multiple documents
  async insertMany(database, collection, documents) {
    try {
      const db = this.getDatabase(database);
      const now = new Date();
      const documentsWithTimestamps = documents.map(doc => ({
        ...doc,
        createdAt: now,
        updatedAt: now
      }));
      
      const result = await db.collection(collection).insertMany(documentsWithTimestamps);
      
      logger.info('Documents inserted', {
        database,
        collection,
        count: result.insertedCount
      });
      
      return result;
    } catch (error) {
      logger.error('Bulk insert failed', {
        database,
        collection,
        error: error.message
      });
      throw error;
    }
  }

  // Find documents with pagination
  async find(database, collection, query = {}, options = {}) {
    try {
      const db = this.getDatabase(database);
      const { page = 1, limit = 10, sort = {}, projection = {} } = options;
      
      const skip = (page - 1) * limit;
      
      const cursor = db.collection(collection)
        .find(query, { projection })
        .sort(sort)
        .skip(skip)
        .limit(limit);
      
      const documents = await cursor.toArray();
      const total = await db.collection(collection).countDocuments(query);
      
      return {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Find failed', {
        database,
        collection,
        error: error.message
      });
      throw error;
    }
  }

  // Update document
  async updateOne(database, collection, filter, update) {
    try {
      const db = this.getDatabase(database);
      const result = await db.collection(collection).updateOne(
        filter,
        {
          $set: {
            ...update,
            updatedAt: new Date()
          }
        }
      );
      
      logger.info('Document updated', {
        database,
        collection,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      });
      
      return result;
    } catch (error) {
      logger.error('Update failed', {
        database,
        collection,
        error: error.message
      });
      throw error;
    }
  }

  // Delete document
  async deleteOne(database, collection, filter) {
    try {
      const db = this.getDatabase(database);
      const result = await db.collection(collection).deleteOne(filter);
      
      logger.info('Document deleted', {
        database,
        collection,
        deletedCount: result.deletedCount
      });
      
      return result;
    } catch (error) {
      logger.error('Delete failed', {
        database,
        collection,
        error: error.message
      });
      throw error;
    }
  }

  // Aggregate pipeline
  async aggregate(database, collection, pipeline) {
    try {
      const db = this.getDatabase(database);
      const result = await db.collection(collection).aggregate(pipeline).toArray();
      
      logger.info('Aggregation executed', {
        database,
        collection,
        resultCount: result.length
      });
      
      return result;
    } catch (error) {
      logger.error('Aggregation failed', {
        database,
        collection,
        error: error.message
      });
      throw error;
    }
  }

  // Create index
  async createIndex(database, collection, indexSpec, options = {}) {
    try {
      const db = this.getDatabase(database);
      const result = await db.collection(collection).createIndex(indexSpec, options);
      
      logger.info('Index created', {
        database,
        collection,
        indexName: result
      });
      
      return result;
    } catch (error) {
      logger.error('Index creation failed', {
        database,
        collection,
        error: error.message
      });
      throw error;
    }
  }

  // Health check
  async healthCheck(database) {
    try {
      const db = this.getDatabase(database);
      await db.admin().ping();
      return { healthy: true, database };
    } catch (error) {
      return { healthy: false, database, error: error.message };
    }
  }

  // Close connections
  async closeAll() {
    const promises = Array.from(this.clients.entries()).map(async ([database, client]) => {
      try {
        await client.close();
        logger.info(`Closed MongoDB connection for database: ${database}`);
      } catch (error) {
        logger.error(`Error closing MongoDB connection: ${database}`, { error: error.message });
      }
    });
    
    await Promise.all(promises);
    this.clients.clear();
    this.databases.clear();
  }

  // Utility method to create ObjectId
  createObjectId(id) {
    return id ? new ObjectId(id) : new ObjectId();
  }

  // Validate ObjectId
  isValidObjectId(id) {
    return ObjectId.isValid(id);
  }
}

module.exports = new MongoDBService();