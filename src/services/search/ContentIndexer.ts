
import { SearchResult } from './types';
import { 
  PageDataBuilder, 
  CategoryDataBuilder, 
  ProductDataBuilder, 
  VendorDataBuilder, 
  ContentDataBuilder 
} from './dataBuilders/index';

export class ContentIndexer {
  private pageBuilder = new PageDataBuilder();
  private categoryBuilder = new CategoryDataBuilder();
  private productBuilder = new ProductDataBuilder();
  private vendorBuilder = new VendorDataBuilder();
  private contentBuilder = new ContentDataBuilder();

  indexAllContent(): SearchResult[] {
    console.log('ContentIndexer: Building comprehensive search index');
    
    const allContent: SearchResult[] = [
      ...this.pageBuilder.buildPageData(),
      ...this.categoryBuilder.buildCategoryData(),
      ...this.productBuilder.buildProductData(),
      ...this.vendorBuilder.buildVendorData(),
      ...this.contentBuilder.buildContentData()
    ];

    console.log(`ContentIndexer: Indexed ${allContent.length} total items`);
    return allContent;
  }

  indexPageContent(): SearchResult[] {
    return this.pageBuilder.buildPageData();
  }

  indexCategoryContent(): SearchResult[] {
    return this.categoryBuilder.buildCategoryData();
  }

  indexProductContent(): SearchResult[] {
    return this.productBuilder.buildProductData();
  }

  indexVendorContent(): SearchResult[] {
    return this.vendorBuilder.buildVendorData();
  }

  indexGeneralContent(): SearchResult[] {
    return this.contentBuilder.buildContentData();
  }
}
