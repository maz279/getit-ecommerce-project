
// Elasticsearch service for advanced search and analytics
export interface SearchQuery {
  query: string;
  filters?: Record<string, any>;
  sort?: { field: string; direction: 'asc' | 'desc' }[];
  from?: number;
  size?: number;
}

export interface SearchResult {
  total: number;
  hits: any[];
  aggregations?: Record<string, any>;
}

export class ElasticsearchService {
  // Use a fallback URL instead of process.env which is not available in browser
  private static baseUrl = 'http://localhost:9200';
  
  static async search(index: string, query: SearchQuery): Promise<SearchResult> {
    try {
      // Build Elasticsearch query
      const esQuery: any = {
        query: {
          bool: {
            must: [],
            filter: []
          }
        },
        from: query.from || 0,
        size: query.size || 10
      };

      // Add text search
      if (query.query) {
        esQuery.query.bool.must.push({
          multi_match: {
            query: query.query,
            fields: ['title^2', 'description', 'content'],
            type: 'best_fields',
            fuzziness: 'AUTO'
          }
        });
      }

      // Add filters
      if (query.filters) {
        Object.entries(query.filters).forEach(([field, value]) => {
          if (Array.isArray(value)) {
            esQuery.query.bool.filter.push({
              terms: { [field]: value }
            });
          } else {
            esQuery.query.bool.filter.push({
              term: { [field]: value }
            });
          }
        });
      }

      // Add sorting
      if (query.sort) {
        esQuery.sort = query.sort.map(s => ({
          [s.field]: { order: s.direction }
        }));
      }

      // For demo purposes, return mock data since we don't have real Elasticsearch
      const mockResults = await this.getMockSearchResults(query);
      return mockResults;

    } catch (error) {
      console.error('Elasticsearch search error:', error);
      throw error;
    }
  }

  static async indexDocument(index: string, id: string, document: any): Promise<boolean> {
    try {
      // In production, this would make an actual API call to Elasticsearch
      console.log(`Indexing document ${id} in index ${index}:`, document);
      return true;
    } catch (error) {
      console.error('Elasticsearch index error:', error);
      return false;
    }
  }

  static async deleteDocument(index: string, id: string): Promise<boolean> {
    try {
      // In production, this would make an actual API call to Elasticsearch
      console.log(`Deleting document ${id} from index ${index}`);
      return true;
    } catch (error) {
      console.error('Elasticsearch delete error:', error);
      return false;
    }
  }

  static async bulkIndex(index: string, documents: Array<{ id: string; document: any }>): Promise<boolean> {
    try {
      // In production, this would use Elasticsearch bulk API
      console.log(`Bulk indexing ${documents.length} documents to index ${index}`);
      return true;
    } catch (error) {
      console.error('Elasticsearch bulk index error:', error);
      return false;
    }
  }

  static async aggregate(index: string, aggregations: Record<string, any>): Promise<Record<string, any>> {
    try {
      // Mock aggregation results for demo
      return {
        categories: {
          buckets: [
            { key: 'revenue', doc_count: 150 },
            { key: 'users', doc_count: 89 },
            { key: 'orders', doc_count: 234 }
          ]
        },
        time_series: {
          buckets: [
            { key: '2024-01-01', doc_count: 45, avg_value: { value: 1250.5 } },
            { key: '2024-01-02', doc_count: 67, avg_value: { value: 1456.7 } },
            { key: '2024-01-03', doc_count: 89, avg_value: { value: 1789.2 } }
          ]
        }
      };
    } catch (error) {
      console.error('Elasticsearch aggregation error:', error);
      throw error;
    }
  }

  private static async getMockSearchResults(query: SearchQuery): Promise<SearchResult> {
    // Mock search results for demo purposes
    const mockHits = [
      {
        _id: '1',
        _source: {
          title: 'Revenue Analytics Dashboard',
          description: 'Comprehensive revenue tracking and analysis',
          category: 'revenue',
          value: 156789.50,
          created_at: '2024-01-15T10:30:00Z'
        }
      },
      {
        _id: '2',
        _source: {
          title: 'User Activity Metrics',
          description: 'Real-time user engagement tracking',
          category: 'users',
          value: 12847,
          created_at: '2024-01-15T09:15:00Z'
        }
      },
      {
        _id: '3',
        _source: {
          title: 'System Performance Monitor',
          description: 'API and database performance metrics',
          category: 'performance',
          value: 245.5,
          created_at: '2024-01-15T08:45:00Z'
        }
      }
    ];

    // Apply simple filtering for demo
    let filteredHits = mockHits;
    if (query.filters?.category) {
      filteredHits = mockHits.filter(hit => 
        hit._source.category === query.filters?.category
      );
    }

    if (query.query) {
      filteredHits = filteredHits.filter(hit =>
        hit._source.title.toLowerCase().includes(query.query.toLowerCase()) ||
        hit._source.description.toLowerCase().includes(query.query.toLowerCase())
      );
    }

    return {
      total: filteredHits.length,
      hits: filteredHits.slice(query.from || 0, (query.from || 0) + (query.size || 10))
    };
  }
}
