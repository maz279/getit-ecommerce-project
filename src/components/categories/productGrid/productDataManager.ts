
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
import { cocktailDressProducts } from '@/data/products/cocktailDressProducts';
import { eveningGownProducts } from '@/data/products/eveningGownProducts';
import { maxiDressProducts } from '@/data/products/maxiDressProducts';
import { midiDressProducts } from '@/data/products/midiDressProducts';
import { miniDressProducts } from '@/data/products/miniDressProducts';
import { cottonSalwarKameezProducts } from '@/data/products/cottonSalwarKameezProducts';
import { silkSalwarKameezProducts } from '@/data/products/silkSalwarKameezProducts';
import { printedSalwarKameezProducts } from '@/data/products/printedSalwarKameezProducts';
import { embroideredSalwarKameezProducts } from '@/data/products/embroideredSalwarKameezProducts';
import { partySalwarKameezProducts } from '@/data/products/partySalwarKameezProducts';
import { casualSalwarKameezProducts } from '@/data/products/casualSalwarKameezProducts';
import { designerSuitsProducts } from '@/data/products/designerSuitsProducts';

export const getFilteredProducts = (tab: string | null, tabType: string = 'all') => {
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

  // Handle different dress types
  const dressProductMap: Record<string, any[]> = {
    'Cocktail Dresses': cocktailDressProducts,
    'Evening Gowns': eveningGownProducts,
    'Maxi Dresses': maxiDressProducts,
    'Midi Dresses': midiDressProducts,
    'Mini Dresses': miniDressProducts
  };

  // Handle different salwar kameez types
  const salwarKameezProductMap: Record<string, any[]> = {
    'Cotton Salwar Kameez': cottonSalwarKameezProducts,
    'Silk Salwar Kameez': silkSalwarKameezProducts,
    'Printed Salwar Kameez': printedSalwarKameezProducts,
    'Embroidered Salwar Kameez': embroideredSalwarKameezProducts,
    'Party Salwar Kameez': partySalwarKameezProducts,
    'Casual Salwar Kameez': casualSalwarKameezProducts
  };

  // Handle suits
  const suitsProductMap: Record<string, any[]> = {
    'Designer Suits': designerSuitsProducts
  };

  // Check if we're viewing a specific saree type
  if (tab && sareeProductMap[tab]) {
    console.log(`Showing ${tab} products`);
    return sareeProductMap[tab];
  }

  // Check if we're viewing a specific dress type
  if (tab && dressProductMap[tab]) {
    console.log(`Showing ${tab} products`);
    return dressProductMap[tab];
  }

  // Check if we're viewing a specific salwar kameez type
  if (tab && salwarKameezProductMap[tab]) {
    console.log(`Showing ${tab} products`);
    return salwarKameezProductMap[tab];
  }

  // Check if we're viewing a specific suits type
  if (tab && suitsProductMap[tab]) {
    console.log(`Showing ${tab} products`);
    return suitsProductMap[tab];
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
