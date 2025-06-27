
export interface ElasticsearchCommissionDocument {
  id: string;
  vendor_id: string;
  vendor_name?: string;
  transaction_id: string;
  commission_type: string;
  commission_amount: number;
  gross_amount: number;
  status: string;
  payment_status: string;
  transaction_date: string;
  category?: string;
  payment_method?: string;
  tags: string[];
  search_content: string;
  created_at: string;
  updated_at: string;
}

export interface CommissionSearchFilters {
  vendor_ids?: string[];
  commission_types?: string[];
  statuses?: string[];
  payment_statuses?: string[];
  amount_range?: { min?: number; max?: number };
  date_range?: { from?: string; to?: string };
  categories?: string[];
  payment_methods?: string[];
}

export interface CommissionSearchResult {
  total: number;
  results: ElasticsearchCommissionDocument[];
  aggregations?: {
    by_status: { [key: string]: number };
    by_vendor: { [key: string]: number };
    by_payment_method: { [key: string]: number };
    amount_ranges: { [key: string]: number };
  };
  took?: number;
}

export class CommissionElasticsearchService {
  private static readonly INDEX_NAME = 'commission_tracking';
  private static readonly API_BASE = '/functions/v1/elasticsearch-commission';

  static async indexCommission(commission: ElasticsearchCommissionDocument): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/index`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: this.INDEX_NAME,
          id: commission.id,
          document: {
            ...commission,
            search_content: this.buildSearchContent(commission),
            indexed_at: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Indexing failed: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Commission indexing error:', error);
      return false;
    }
  }

  static async searchCommissions(
    query: string,
    filters?: CommissionSearchFilters,
    options?: {
      limit?: number;
      offset?: number;
      sort_by?: string;
      sort_order?: 'asc' | 'desc';
      include_aggregations?: boolean;
    }
  ): Promise<CommissionSearchResult> {
    try {
      const searchRequest = {
        index: this.INDEX_NAME,
        query: this.buildElasticsearchQuery(query, filters),
        size: options?.limit || 20,
        from: options?.offset || 0,
        sort: this.buildSortClause(options?.sort_by, options?.sort_order),
        aggs: options?.include_aggregations ? this.buildAggregations() : undefined
      };

      const response = await fetch(`${this.API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchRequest)
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const result = await response.json();
      return this.formatSearchResults(result);
    } catch (error) {
      console.error('Commission search error:', error);
      throw error;
    }
  }

  static async updateCommissionIndex(id: string, updates: Partial<ElasticsearchCommissionDocument>): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: this.INDEX_NAME,
          id,
          document: {
            ...updates,
            updated_at: new Date().toISOString()
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Commission index update error:', error);
      return false;
    }
  }

  static async deleteFromIndex(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE}/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: this.INDEX_NAME,
          id
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Commission index deletion error:', error);
      return false;
    }
  }

  static async bulkIndexCommissions(commissions: ElasticsearchCommissionDocument[]): Promise<{
    success: number;
    failed: number;
    errors: any[];
  }> {
    try {
      const bulkData = commissions.flatMap(commission => [
        { index: { _index: this.INDEX_NAME, _id: commission.id } },
        {
          ...commission,
          search_content: this.buildSearchContent(commission),
          indexed_at: new Date().toISOString()
        }
      ]);

      const response = await fetch(`${this.API_BASE}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operations: bulkData })
      });

      if (!response.ok) {
        throw new Error(`Bulk indexing failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Bulk commission indexing error:', error);
      return { success: 0, failed: commissions.length, errors: [error] };
    }
  }

  private static buildSearchContent(commission: ElasticsearchCommissionDocument): string {
    return [
      commission.transaction_id,
      commission.vendor_name || '',
      commission.commission_type,
      commission.status,
      commission.payment_status,
      commission.category || '',
      commission.payment_method || '',
      ...commission.tags
    ].filter(Boolean).join(' ').toLowerCase();
  }

  private static buildElasticsearchQuery(query: string, filters?: CommissionSearchFilters): any {
    const mustClauses: any[] = [];
    const filterClauses: any[] = [];

    // Text search
    if (query && query.trim()) {
      mustClauses.push({
        multi_match: {
          query: query.trim(),
          fields: [
            'search_content^2',
            'transaction_id^3',
            'vendor_name^2',
            'commission_type',
            'category',
            'tags'
          ],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      });
    }

    // Apply filters
    if (filters) {
      if (filters.vendor_ids?.length) {
        filterClauses.push({ terms: { vendor_id: filters.vendor_ids } });
      }
      if (filters.commission_types?.length) {
        filterClauses.push({ terms: { commission_type: filters.commission_types } });
      }
      if (filters.statuses?.length) {
        filterClauses.push({ terms: { status: filters.statuses } });
      }
      if (filters.payment_statuses?.length) {
        filterClauses.push({ terms: { payment_status: filters.payment_statuses } });
      }
      if (filters.categories?.length) {
        filterClauses.push({ terms: { category: filters.categories } });
      }
      if (filters.payment_methods?.length) {
        filterClauses.push({ terms: { payment_method: filters.payment_methods } });
      }

      // Amount range
      if (filters.amount_range) {
        const rangeClause: any = {};
        if (filters.amount_range.min !== undefined) {
          rangeClause.gte = filters.amount_range.min;
        }
        if (filters.amount_range.max !== undefined) {
          rangeClause.lte = filters.amount_range.max;
        }
        if (Object.keys(rangeClause).length > 0) {
          filterClauses.push({ range: { commission_amount: rangeClause } });
        }
      }

      // Date range
      if (filters.date_range) {
        const dateRangeClause: any = {};
        if (filters.date_range.from) {
          dateRangeClause.gte = filters.date_range.from;
        }
        if (filters.date_range.to) {
          dateRangeClause.lte = filters.date_range.to;
        }
        if (Object.keys(dateRangeClause).length > 0) {
          filterClauses.push({ range: { transaction_date: dateRangeClause } });
        }
      }
    }

    return {
      bool: {
        must: mustClauses.length > 0 ? mustClauses : [{ match_all: {} }],
        filter: filterClauses
      }
    };
  }

  private static buildSortClause(sortBy?: string, sortOrder?: 'asc' | 'desc'): any[] {
    const defaultSort = [
      { transaction_date: { order: 'desc' } },
      { created_at: { order: 'desc' } }
    ];

    if (!sortBy) return defaultSort;

    const customSort: any = {};
    customSort[sortBy] = { order: sortOrder || 'desc' };

    return [customSort, ...defaultSort];
  }

  private static buildAggregations(): any {
    return {
      by_status: {
        terms: { field: 'status', size: 10 }
      },
      by_vendor: {
        terms: { field: 'vendor_id', size: 20 }
      },
      by_payment_method: {
        terms: { field: 'payment_method', size: 10 }
      },
      amount_ranges: {
        range: {
          field: 'commission_amount',
          ranges: [
            { key: '0-1000', to: 1000 },
            { key: '1000-5000', from: 1000, to: 5000 },
            { key: '5000-10000', from: 5000, to: 10000 },
            { key: '10000+', from: 10000 }
          ]
        }
      }
    };
  }

  private static formatSearchResults(elasticsearchResult: any): CommissionSearchResult {
    const hits = elasticsearchResult.hits?.hits || [];
    const total = elasticsearchResult.hits?.total?.value || 0;
    const took = elasticsearchResult.took;

    const results = hits.map((hit: any) => ({
      ...hit._source,
      _score: hit._score
    }));

    const aggregations: any = {};
    if (elasticsearchResult.aggregations) {
      const aggs = elasticsearchResult.aggregations;
      
      if (aggs.by_status) {
        aggregations.by_status = aggs.by_status.buckets.reduce((acc: any, bucket: any) => {
          acc[bucket.key] = bucket.doc_count;
          return acc;
        }, {});
      }
      
      if (aggs.by_vendor) {
        aggregations.by_vendor = aggs.by_vendor.buckets.reduce((acc: any, bucket: any) => {
          acc[bucket.key] = bucket.doc_count;
          return acc;
        }, {});
      }
      
      if (aggs.by_payment_method) {
        aggregations.by_payment_method = aggs.by_payment_method.buckets.reduce((acc: any, bucket: any) => {
          acc[bucket.key] = bucket.doc_count;
          return acc;
        }, {});
      }
      
      if (aggs.amount_ranges) {
        aggregations.amount_ranges = aggs.amount_ranges.buckets.reduce((acc: any, bucket: any) => {
          acc[bucket.key] = bucket.doc_count;
          return acc;
        }, {});
      }
    }

    return {
      total,
      results,
      aggregations: Object.keys(aggregations).length > 0 ? aggregations : undefined,
      took
    };
  }
}
