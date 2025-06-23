
import React from 'react';

interface CategoryInfo {
  title: string;
  description: string;
  features: string[];
}

interface ProductGridHeaderProps {
  categoryInfo: CategoryInfo | null;
  colorScheme?: 'saree' | 'dress' | 'salwar' | 'suits';
}

export const ProductGridHeader: React.FC<ProductGridHeaderProps> = ({ 
  categoryInfo, 
  colorScheme = 'saree' 
}) => {
  if (!categoryInfo) return null;

  const getColorClasses = (index: number) => {
    switch (colorScheme) {
      case 'dress':
        return index % 4 === 0 ? 'bg-red-100 text-red-800' :
               index % 4 === 1 ? 'bg-pink-100 text-pink-800' :
               index % 4 === 2 ? 'bg-purple-100 text-purple-800' :
               'bg-amber-100 text-amber-800';
      case 'salwar':
        return index % 4 === 0 ? 'bg-teal-100 text-teal-800' :
               index % 4 === 1 ? 'bg-green-100 text-green-800' :
               index % 4 === 2 ? 'bg-emerald-100 text-emerald-800' :
               'bg-cyan-100 text-cyan-800';
      case 'suits':
        return index % 4 === 0 ? 'bg-indigo-100 text-indigo-800' :
               index % 4 === 1 ? 'bg-purple-100 text-purple-800' :
               index % 4 === 2 ? 'bg-violet-100 text-violet-800' :
               'bg-blue-100 text-blue-800';
      default: // saree
        return index % 4 === 0 ? 'bg-green-100 text-green-800' :
               index % 4 === 1 ? 'bg-blue-100 text-blue-800' :
               index % 4 === 2 ? 'bg-purple-100 text-purple-800' :
               'bg-orange-100 text-orange-800';
    }
  };

  const getGradientClasses = () => {
    switch (colorScheme) {
      case 'dress':
        return 'bg-gradient-to-r from-rose-50 to-orange-50';
      case 'salwar':
        return 'bg-gradient-to-r from-green-50 to-teal-50';
      case 'suits':
        return 'bg-gradient-to-r from-indigo-50 to-purple-50';
      default: // saree
        return 'bg-gradient-to-r from-blue-50 to-purple-50';
    }
  };

  return (
    <div className={`mb-6 ${getGradientClasses()} p-6 rounded-lg border`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{categoryInfo.title}</h2>
      <p className="text-gray-600 mb-4">{categoryInfo.description}</p>
      <div className="flex flex-wrap gap-2">
        {categoryInfo.features.map((feature, index) => (
          <span 
            key={index}
            className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClasses(index)}`}
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};
