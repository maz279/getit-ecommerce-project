
import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductControls } from './ProductControls';
import { ProductPagination } from './ProductPagination';
import { EmptyState } from './EmptyState';
import { sampleProducts } from '@/data/sampleProducts';
import { cottonSareeProducts } from '@/data/products/cottonSareeProducts';
import { silkSareeProducts } from '@/data/products/silkSareeProducts';
import { muslinSareeProducts } from '@/data/products/muslinSareeProducts';
import { jamdaniSareeProducts } from '@/data/products/jamdaniSareeProducts';
import { tantSareeProducts } from '@/data/products/tantSareeProducts';
import { tangailSareeProducts } from '@/data/products/tangailSareeProducts';
import { bananasiSareeProducts } from '@/data/products/bananasiSareeProducts';
import { designerSareeProducts } from '@/data/products/designerSareeProducts';
import { bridalSareeProducts } from '@/data/products/bridalSareeProducts';
import { casualSareeProducts } from '@/data/products/casualSareeProducts';
import { partySareeProducts } from '@/data/products/partySareeProducts';
import { Search } from 'lucide-react';

interface ProductGridProps {
  category?: string | null;
  submenu?: string | null;
  tab?: string | null;
  activeTab: string;
  tabType?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  category,
  submenu,
  tab,
  activeTab,
  tabType = 'all'
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const getGridCols = () => {
    switch (viewMode) {
      case 'compact':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
      case 'list':
        return 'grid-cols-1';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  const getFilteredProducts = () => {
    // Handle different saree types
    const sareeProductMap: Record<string, any[]> = {
      'Cotton Saree': cottonSareeProducts,
      'Silk Saree': silkSareeProducts,
      'Muslin Saree': muslinSareeProducts,
      'Jamdani Saree': jamdaniSareeProducts,
      'Tant Saree': tantSareeProducts,
      'Tangail Saree': tangailSareeProducts,
      'Banarasi Saree': bananasiSareeProducts,
      'Designer Saree': designerSareeProducts,
      'Bridal Saree': bridalSareeProducts,
      'Casual Saree': casualSareeProducts,
      'Party Saree': partySareeProducts
    };

    // Check if we're viewing a specific saree type
    if (tab && sareeProductMap[tab]) {
      console.log(`Showing ${tab} products`);
      return sareeProductMap[tab];
    }

    // Default product filtering logic
    switch (tabType) {
      case 'featured':
        return sampleProducts.filter(p => p.rating >= 4.5);
      case 'trending':
        return sampleProducts.filter(p => p.sold && p.sold > 50);
      case 'new':
        return sampleProducts.slice(0, 4);
      case 'bestsellers':
        return sampleProducts.filter(p => p.sold && p.sold > 30).sort((a, b) => (b.sold || 0) - (a.sold || 0));
      default:
        return sampleProducts;
    }
  };

  const filteredProducts = getFilteredProducts();

  const getSareeTypeInfo = (sareeType: string) => {
    const sareeInfo: Record<string, { title: string; description: string; features: string[] }> = {
      'Cotton Saree': {
        title: 'Cotton Saree Collection',
        description: 'Discover our premium collection of authentic Bengali cotton sarees. From traditional handloom designs to modern printed patterns, find the perfect saree for every occasion.',
        features: ['✓ 100% Pure Cotton', '✓ Handloom Available', '✓ Traditional Designs', '✓ Free Shipping']
      },
      'Silk Saree': {
        title: 'Silk Saree Collection',
        description: 'Explore our exquisite range of silk sarees featuring luxurious fabrics and intricate designs. Perfect for special occasions and celebrations.',
        features: ['✓ Premium Silk Quality', '✓ Rich Textures', '✓ Elegant Designs', '✓ Special Occasions']
      },
      'Muslin Saree': {
        title: 'Muslin Saree Collection',
        description: 'Experience the heritage of Bengal with our authentic muslin sarees. These handcrafted masterpieces represent centuries of tradition.',
        features: ['✓ Heritage Quality', '✓ Handcrafted', '✓ Limited Edition', '✓ Premium Collection']
      },
      'Jamdani Saree': {
        title: 'Jamdani Saree Collection',
        description: 'Discover the artistic beauty of Jamdani sarees with their intricate handwoven motifs and traditional craftsmanship.',
        features: ['✓ Handwoven Motifs', '✓ Traditional Art', '✓ UNESCO Heritage', '✓ Artisan Made']
      },
      'Tant Saree': {
        title: 'Tant Saree Collection',
        description: 'Embrace tradition with our Bengal Tant sarees. Known for their comfort and classic designs, perfect for daily wear.',
        features: ['✓ Traditional Bengal', '✓ Comfortable Wear', '✓ Classic Designs', '✓ Affordable Price']
      },
      'Tangail Saree': {
        title: 'Tangail Saree Collection',
        description: 'Experience the elegance of Tangail sarees with their distinctive borders and traditional weaving techniques.',
        features: ['✓ Distinctive Borders', '✓ Traditional Weaving', '✓ Regional Heritage', '✓ Quality Craftsmanship']
      },
      'Banarasi Saree': {
        title: 'Banarasi Saree Collection',
        description: 'Indulge in luxury with our Banarasi silk sarees featuring rich gold and silver brocade work.',
        features: ['✓ Luxury Silk', '✓ Gold Zari Work', '✓ Wedding Collection', '✓ Premium Quality']
      },
      'Designer Saree': {
        title: 'Designer Saree Collection',
        description: 'Stay fashionable with our contemporary designer sarees that blend traditional elegance with modern style.',
        features: ['✓ Contemporary Designs', '✓ Fashion Forward', '✓ Modern Styling', '✓ Trendy Patterns']
      },
      'Bridal Saree': {
        title: 'Bridal Saree Collection',
        description: 'Make your special day memorable with our stunning bridal sarees featuring heavy embroidery and luxurious fabrics.',
        features: ['✓ Bridal Special', '✓ Heavy Embroidery', '✓ Luxury Fabrics', '✓ Wedding Ready']
      },
      'Casual Saree': {
        title: 'Casual Saree Collection',
        description: 'Find comfort and style with our casual sarees perfect for daily wear, office, and everyday occasions.',
        features: ['✓ Daily Comfort', '✓ Easy Care', '✓ Versatile Style', '✓ Affordable Range']
      },
      'Party Saree': {
        title: 'Party Saree Collection',
        description: 'Shine at every celebration with our glamorous party sarees featuring sequins, embellishments, and vibrant colors.',
        features: ['✓ Party Perfect', '✓ Glamorous Design', '✓ Special Events', '✓ Eye-catching Style']
      }
    };

    return sareeInfo[sareeType] || null;
  };

  const renderProductGrid = () => {
    if (filteredProducts.length === 0) {
      return (
        <EmptyState
          icon={Search}
          title="No products found"
          description="Try adjusting your filters or search criteria"
        />
      );
    }

    return (
      <div className={`grid gap-4 ${getGridCols()}`}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>
    );
  };

  const sareeInfo = tab ? getSareeTypeInfo(tab) : null;

  return (
    <div className="p-6">
      {/* Header section for Saree categories */}
      {sareeInfo && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{sareeInfo.title}</h2>
          <p className="text-gray-600 mb-4">{sareeInfo.description}</p>
          <div className="flex flex-wrap gap-2">
            {sareeInfo.features.map((feature, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  index % 4 === 0 ? 'bg-green-100 text-green-800' :
                  index % 4 === 1 ? 'bg-blue-100 text-blue-800' :
                  index % 4 === 2 ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      <ProductControls
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        totalProducts={filteredProducts.length}
      />

      {renderProductGrid()}
      
      <ProductPagination
        currentProducts={filteredProducts.length}
        totalProducts={tab && getSareeTypeInfo(tab) ? filteredProducts.length : 2456789}
      />
    </div>
  );
};
