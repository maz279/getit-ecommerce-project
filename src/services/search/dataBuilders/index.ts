
import { PageDataBuilder } from './PageDataBuilder';
import { CategoryDataBuilder } from './CategoryDataBuilder';
import { ProductDataBuilder } from './ProductDataBuilder';
import { VendorDataBuilder } from './VendorDataBuilder';
import { ContentDataBuilder } from './ContentDataBuilder';

export { PageDataBuilder } from './PageDataBuilder';
export { CategoryDataBuilder } from './CategoryDataBuilder';
export { ProductDataBuilder } from './ProductDataBuilder';
export { VendorDataBuilder } from './VendorDataBuilder';
export { ContentDataBuilder } from './ContentDataBuilder';

// Main SearchDataBuilder class
export class SearchDataBuilder {
  private pageBuilder = new PageDataBuilder();
  private categoryBuilder = new CategoryDataBuilder();
  private productBuilder = new ProductDataBuilder();
  private vendorBuilder = new VendorDataBuilder();
  private contentBuilder = new ContentDataBuilder();

  buildPageData() {
    return this.pageBuilder.buildPageData();
  }

  buildCategoryData() {
    return this.categoryBuilder.buildCategoryData();
  }

  buildProductData() {
    return this.productBuilder.buildProductData();
  }

  buildVendorData() {
    return this.vendorBuilder.buildVendorData();
  }

  buildContentData() {
    return this.contentBuilder.buildContentData();
  }
}
