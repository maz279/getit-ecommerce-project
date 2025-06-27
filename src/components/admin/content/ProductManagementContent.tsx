
import React from 'react';
import { ProductManagementRouter } from './forms/productManagement/ProductManagementRouter';

interface ProductManagementContentProps {
  selectedSubmenu: string;
}

export const ProductManagementContent: React.FC<ProductManagementContentProps> = ({ selectedSubmenu }) => {
  return (
    <div className="p-6">
      <ProductManagementRouter selectedSubmenu={selectedSubmenu} />
    </div>
  );
};
