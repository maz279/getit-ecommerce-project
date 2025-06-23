
export class ElasticsearchService {
  private static baseUrl = '/functions/v1/elasticsearch-search';

  static async search(
    query: string,
    filters?: Record<string, any>,
    limit: number = 10,
    offset: number = 0
  ): Promise<{
    results: any[];
    total: number;
    took?: number;
    source: string;
  }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters, limit, offset })
      });
      
      if (!response.ok) {
        throw new Error(`Search failed with status ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Elasticsearch search error:', error);
      throw error;
    }
  }

  static async indexDocument(
    index: string,
    id: string,
    document: Record<string, any>
  ): Promise<boolean> {
    try {
      // This would typically be done server-side
      console.log('Document indexing request:', { index, id, document });
      return true;
    } catch (error) {
      console.error('Elasticsearch index error:', error);
      return false;
    }
  }
}
