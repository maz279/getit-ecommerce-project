
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSubcategoryDetails } from '../utils/subcategoryDetails';

interface SubcategoryDetailsProps {
  selectedSubSubcategory: string;
}

export const SubcategoryDetails: React.FC<SubcategoryDetailsProps> = ({
  selectedSubSubcategory
}) => {
  const details = getSubcategoryDetails(selectedSubSubcategory);

  return (
    <div className="w-80 flex-shrink-0">
      <Card className="p-6 sticky top-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {details.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {details.description}
            </p>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Price Range</h4>
            <Badge variant="outline" className="text-green-600 border-green-200">
              {details.priceRange}
            </Badge>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Key Features</h4>
            <div className="space-y-2">
              {details.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Perfect For */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Perfect For</h4>
            <div className="flex flex-wrap gap-2">
              {details.occasions.map((occasion: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {occasion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Popular Items */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Popular Items</h4>
            <div className="space-y-2">
              {details.popular.map((item: string, index: number) => (
                <div key={index} className="p-2 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Shopping Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check size chart before ordering</li>
              <li>• Read customer reviews</li>
              <li>• Compare prices from different vendors</li>
              <li>• Look for free shipping offers</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
