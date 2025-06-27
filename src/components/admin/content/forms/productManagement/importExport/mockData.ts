
import { ImportExportStats, ImportOperation, ExportOperation, BulkOperation, ImportTemplate, ExportTemplate } from './types';

export const mockImportExportData = {
  stats: {
    totalImports: 156,
    totalExports: 89,
    successfulOperations: 221,
    failedOperations: 24,
    avgProcessingTime: 45, // minutes
    dataProcessedToday: 15420, // records
    activeOperations: 3,
    scheduledOperations: 7
  } as ImportExportStats,

  activeOperations: [
    {
      id: '1',
      fileName: 'electronics_inventory_2024.xlsx',
      fileSize: 2456789,
      fileType: 'xlsx' as const,
      status: 'processing' as const,
      progress: 67,
      totalRows: 15420,
      processedRows: 10331,
      successfulRows: 9876,
      failedRows: 455,
      startTime: new Date('2024-01-15T10:30:00'),
      errors: [
        { row: 234, field: 'price', message: 'Invalid price format', severity: 'error' as const, value: 'abc' },
        { row: 567, field: 'sku', message: 'Duplicate SKU found', severity: 'warning' as const, value: 'ELC-001' }
      ],
      mapping: [
        { sourceField: 'Product Name', targetField: 'name', required: true },
        { sourceField: 'Price', targetField: 'price', required: true },
        { sourceField: 'Stock', targetField: 'stock_quantity', required: true }
      ],
      validationRules: [
        { field: 'price', rule: 'numeric' as const, message: 'Price must be numeric' },
        { field: 'sku', rule: 'unique' as const, message: 'SKU must be unique' }
      ],
      duplicateHandling: 'update' as const,
      createdBy: 'admin@getit.com'
    }
  ] as ImportOperation[],

  importHistory: [
    {
      id: '2',
      fileName: 'fashion_products_jan.csv',
      fileSize: 1234567,
      fileType: 'csv' as const,
      status: 'completed' as const,
      progress: 100,
      totalRows: 8956,
      processedRows: 8956,
      successfulRows: 8734,
      failedRows: 222,
      startTime: new Date('2024-01-14T09:15:00'),
      endTime: new Date('2024-01-14T09:47:00'),
      errors: [],
      mapping: [],
      validationRules: [],
      duplicateHandling: 'skip' as const,
      createdBy: 'admin@getit.com'
    },
    {
      id: '3',
      fileName: 'home_garden_products.xlsx',
      fileSize: 3456789,
      fileType: 'xlsx' as const,
      status: 'failed' as const,
      progress: 23,
      totalRows: 12000,
      processedRows: 2760,
      successfulRows: 0,
      failedRows: 2760,
      startTime: new Date('2024-01-13T14:20:00'),
      endTime: new Date('2024-01-13T14:35:00'),
      errors: [
        { row: 1, field: 'format', message: 'Invalid file format', severity: 'error' as const, value: null }
      ],
      mapping: [],
      validationRules: [],
      duplicateHandling: 'skip' as const,
      createdBy: 'admin@getit.com'
    }
  ] as ImportOperation[],

  exportHistory: [
    {
      id: '4',
      fileName: 'all_electronics_export_2024.xlsx',
      fileType: 'xlsx' as const,
      status: 'completed' as const,
      progress: 100,
      totalRecords: 25689,
      processedRecords: 25689,
      startTime: new Date('2024-01-14T16:30:00'),
      endTime: new Date('2024-01-14T16:45:00'),
      filters: [
        { field: 'category', operator: 'equals' as const, value: 'Electronics' }
      ],
      fields: ['name', 'sku', 'price', 'stock_quantity', 'category'],
      format: {
        includeHeaders: true,
        encoding: 'UTF-8',
        dateFormat: 'YYYY-MM-DD'
      },
      createdBy: 'admin@getit.com',
      downloadUrl: '/exports/all_electronics_export_2024.xlsx'
    }
  ] as ExportOperation[],

  bulkOperations: [
    {
      id: '5',
      operationType: 'update-prices' as const,
      status: 'completed' as const,
      progress: 100,
      totalItems: 5670,
      processedItems: 5670,
      successfulItems: 5623,
      failedItems: 47,
      startTime: new Date('2024-01-15T11:00:00'),
      endTime: new Date('2024-01-15T11:12:00'),
      criteria: {
        categories: ['Electronics', 'Fashion'],
        priceRange: [100, 5000]
      },
      changes: {
        price: {
          type: 'percentage' as const,
          value: 10
        }
      },
      createdBy: 'admin@getit.com'
    }
  ] as BulkOperation[],

  templates: [
    {
      id: '1',
      name: 'Standard Product Import',
      description: 'Default template for importing products with basic fields',
      fileType: 'xlsx' as const,
      fieldMappings: [
        { sourceField: 'Product Name', targetField: 'name', required: true },
        { sourceField: 'SKU', targetField: 'sku', required: true },
        { sourceField: 'Price', targetField: 'price', required: true },
        { sourceField: 'Stock', targetField: 'stock_quantity', required: true },
        { sourceField: 'Category', targetField: 'category', required: true }
      ],
      validationRules: [
        { field: 'price', rule: 'numeric' as const, message: 'Price must be a valid number' },
        { field: 'stock_quantity', rule: 'numeric' as const, message: 'Stock must be a valid number' },
        { field: 'sku', rule: 'unique' as const, message: 'SKU must be unique' }
      ],
      sampleData: [
        {
          'Product Name': 'iPhone 15 Pro',
          'SKU': 'IP15P-256',
          'Price': 142000,
          'Stock': 50,
          'Category': 'Electronics'
        }
      ],
      isDefault: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      usageCount: 45
    },
    {
      id: '2',
      name: 'Fashion Products Import',
      description: 'Template for importing fashion products with size and color variants',
      fileType: 'csv' as const,
      fieldMappings: [
        { sourceField: 'Product Name', targetField: 'name', required: true },
        { sourceField: 'SKU', targetField: 'sku', required: true },
        { sourceField: 'Price', targetField: 'price', required: true },
        { sourceField: 'Size', targetField: 'size', required: false },
        { sourceField: 'Color', targetField: 'color', required: false }
      ],
      validationRules: [],
      sampleData: [],
      isDefault: false,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-10'),
      usageCount: 23
    }
  ] as ImportTemplate[]
};
