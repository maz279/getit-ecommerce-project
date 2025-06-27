
import React from 'react';
import { AllProductsContent } from './AllProductsContent';
import { ProductSearchContent } from './ProductSearchContent';
import { FeaturedProductsContent } from './FeaturedProductsContent';
import { ProductImportExportContent } from './ProductImportExportContent';
import { CategoryStructureContent } from './CategoryStructureContent';
import { CategoryPerformanceContent } from './CategoryPerformanceContent';
import { CategoryAnalyticsContent } from './CategoryAnalyticsContent';
import { SeasonalCategoriesContent } from './SeasonalCategoriesContent';
import { StockOverviewContent } from './StockOverviewContent';
import { PendingApprovalContent } from './PendingApprovalContent';
import { ContentReviewContent } from './ContentReviewContent';
import { QualityControlContent } from './QualityControlContent';
import { RejectedProductsContent } from './RejectedProductsContent';
import { ProductCatalogOverview } from './ProductCatalogOverview';
import { InventoryManagementOverview } from './InventoryManagementOverview';
import { LowStockAlertsContent } from './LowStockAlertsContent';
import { InventoryReportsContent } from './InventoryReportsContent';
import { WarehouseManagementContent } from './WarehouseManagementContent';
import { BestSellersContent } from './BestSellersContent';

interface ProductManagementRouterProps {
  selectedSubmenu: string;
}

export const ProductManagementRouter: React.FC<ProductManagementRouterProps> = ({ selectedSubmenu }) => {
  console.log('🔍 ProductManagementRouter - selectedSubmenu:', selectedSubmenu);
  
  switch (selectedSubmenu) {
    // Stock and inventory related routes - PRIORITY ROUTING
    case 'stock-overview':
    case 'inventory-overview':
      console.log('✅ Routing to StockOverviewContent');
      return <StockOverviewContent />;
    case 'low-stock-alerts':
    case 'low-stock':
    case 'reorder-alerts':
      console.log('✅ Routing to LowStockAlertsContent');
      return <LowStockAlertsContent />;
    case 'inventory-reports':
    case 'stock-reports':
    case 'inventory-analytics':
      console.log('✅ Routing to InventoryReportsContent');
      return <InventoryReportsContent />;
    case 'warehouse-management':
    case 'warehouse-operations':
    case 'warehouse-analytics':
      console.log('✅ Routing to WarehouseManagementContent');
      return <WarehouseManagementContent />;
    case 'stock-management':
    case 'inventory-tracking':
    case 'stock-analytics':
      return <StockOverviewContent />;
    // Best sellers and product analytics routes - ADDED PRIORITY ROUTING
    case 'best-sellers':
    case 'best-seller':
    case 'top-selling':
    case 'bestsellers':
      console.log('✅ Routing to BestSellersContent');
      return <BestSellersContent />;
    case 'product-catalog':
    case 'products':
      return <ProductCatalogOverview />;
    case 'all-products':
      return <AllProductsContent />;
    case 'product-search':
      return <ProductSearchContent />;
    case 'featured-products':
      return <FeaturedProductsContent />;
    case 'import-export':
    case 'product-import':
    case 'product-export':
    case 'bulk-operations':
      return <ProductImportExportContent />;
    case 'category-structure':
    case 'category-management':
    case 'category-hierarchy':
    case 'category-attributes':
    case 'category-rules':
    case 'category-seo':
      return <CategoryStructureContent selectedSubmenu={selectedSubmenu} />;
    case 'category-performance':
      return <CategoryPerformanceContent />;
    case 'category-analytics':
      return <CategoryAnalyticsContent />;
    case 'seasonal-categories':
    case 'seasonal-category-management':
    case 'seasonal-campaigns':
    case 'seasonal-analytics':
      return <SeasonalCategoriesContent />;
    // Product moderation routes - ENHANCED ROUTING
    case 'product-moderation':
    case 'pending-approval':
      console.log('✅ Routing to PendingApprovalContent');
      return <PendingApprovalContent />;
    case 'content-review':
      console.log('✅ Routing to ContentReviewContent');
      return <ContentReviewContent />;
    case 'quality-control':
      console.log('✅ Routing to QualityControlContent');
      return <QualityControlContent />;
    case 'rejected-products':
      console.log('✅ Routing to RejectedProductsContent');
      return <RejectedProductsContent />;
    case 'inventory-management':
    case 'stock-levels':
      return <InventoryManagementOverview />;
    case 'add-product':
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
          <p className="text-gray-600">Product creation form would be here...</p>
        </div>
      );
    case 'product-analytics':
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Product Analytics</h1>
          <p className="text-gray-600">Detailed product performance analytics...</p>
        </div>
      );
    default:
      console.log('⚠️ ProductManagementRouter - no matching submenu found for:', selectedSubmenu);
      console.log('⚠️ Falling back to product catalog');
      return <ProductCatalogOverview />;
  }
};
