
import { SubCategory } from '../types';

interface HierarchicalItem {
  name: string;
  count: number;
}

interface HierarchicalSubSubCategory {
  name: string;
  items: HierarchicalItem[];
}

interface HierarchicalSubCategory {
  name: string;
  subcategories: Record<string, HierarchicalSubSubCategory>;
}

interface HierarchicalMainCategory {
  name: string;
  subcategories: Record<string, HierarchicalSubCategory>;
}

interface HierarchicalStructure {
  name: string;
  subcategories: Record<string, HierarchicalMainCategory>;
}

// Complete hierarchical structure for Women's Fashion as per guidelines
export const womensFashionHierarchical: HierarchicalStructure = {
  name: "Women's Fashion",
  subcategories: {
    'traditional-ethnic': {
      name: 'Traditional & Ethnic Wear',
      subcategories: {
        'womens-traditional': {
          name: "Women's Traditional",
          subcategories: {
            'saree': {
              name: 'Saree',
              items: [
                { name: 'Cotton Saree', count: 15420 },
                { name: 'Silk Saree', count: 12850 },
                { name: 'Muslin Saree', count: 8965 },
                { name: 'Jamdani Saree', count: 7432 },
                { name: 'Tant Saree', count: 6789 },
                { name: 'Tangail Saree', count: 5432 },
                { name: 'Banarasi Saree', count: 4567 },
                { name: 'Designer Saree', count: 8901 },
                { name: 'Bridal Saree', count: 3456 },
                { name: 'Casual Saree', count: 9876 },
                { name: 'Party Saree', count: 6543 }
              ]
            },
            'salwar-kameez': {
              name: 'Salwar Kameez',
              items: [
                { name: 'Cotton Salwar Kameez', count: 18765 },
                { name: 'Silk Salwar Kameez', count: 12340 },
                { name: 'Georgette Salwar Kameez', count: 9876 },
                { name: 'Anarkali Suits', count: 8765 },
                { name: 'Straight Cut Suits', count: 7654 },
                { name: 'Palazzo Suits', count: 6543 },
                { name: 'Party Wear Salwar Kameez', count: 5432 },
                { name: 'Casual Salwar Kameez', count: 14321 },
                { name: 'Designer Suits', count: 4321 }
              ]
            },
            'lehenga-sharara': {
              name: 'Lehenga & Sharara',
              items: [
                { name: 'Bridal Lehenga', count: 3210 },
                { name: 'Party Lehenga', count: 4321 },
                { name: 'Cotton Lehenga', count: 2109 },
                { name: 'Designer Lehenga', count: 5432 },
                { name: 'Sharara Set', count: 2876 },
                { name: 'Gharara Set', count: 1987 }
              ]
            },
            'kurtis-tunics': {
              name: 'Kurtis & Tunics',
              items: [
                { name: 'Cotton Kurtis', count: 16789 },
                { name: 'Silk Kurtis', count: 8765 },
                { name: 'Designer Kurtis', count: 6543 },
                { name: 'Casual Kurtis', count: 12345 },
                { name: 'Party Kurtis', count: 4567 },
                { name: 'Printed Kurtis', count: 9876 }
              ]
            }
          }
        }
      }
    },
    'western-modern': {
      name: 'Western & Modern Clothing',
      subcategories: {
        'womens-western': {
          name: "Women's Western Wear",
          subcategories: {
            'dresses': {
              name: 'Dresses',
              items: [
                { name: 'Cocktail Dresses', count: 4321 },
                { name: 'Evening Gowns', count: 2109 },
                { name: 'Maxi Dresses', count: 7654 },
                { name: 'Midi Dresses', count: 8765 },
                { name: 'Mini Dresses', count: 5432 },
                { name: 'Sundresses', count: 6543 },
                { name: 'Wrap Dresses', count: 3456 },
                { name: 'Shirt Dresses', count: 4567 },
                { name: 'Casual Dresses', count: 12345 },
                { name: 'Party Dresses', count: 6789 },
                { name: 'Office Dresses', count: 5678 }
              ]
            },
            'tops-blouses': {
              name: 'Tops & Blouses',
              items: [
                { name: 'Casual Tops', count: 18765 },
                { name: 'Crop Tops', count: 9876 },
                { name: 'Tunics', count: 7654 },
                { name: 'Button-Down Blouses', count: 6543 },
                { name: 'Peplum Tops', count: 4321 },
                { name: 'Off-Shoulder Tops', count: 5432 },
                { name: 'Camisoles', count: 3456 },
                { name: 'Sleeveless Tops', count: 8765 },
                { name: 'Tank Tops', count: 7654 },
                { name: 'Formal Shirts', count: 5678 }
              ]
            },
            't-shirts': {
              name: 'T-Shirts',
              items: [
                { name: 'Graphic Tees', count: 12456 },
                { name: 'Plain Tees', count: 15432 },
                { name: 'V-Neck Tees', count: 8765 },
                { name: 'Long Sleeve Tees', count: 6543 },
                { name: 'Henley Tees', count: 4321 },
                { name: 'Polo Shirts', count: 7654 }
              ]
            },
            'bottoms': {
              name: 'Bottoms',
              items: [
                { name: 'Skinny Jeans', count: 14321 },
                { name: 'Straight-Leg Jeans', count: 12345 },
                { name: 'Bootcut Jeans', count: 8765 },
                { name: 'Wide-Leg Jeans', count: 6543 },
                { name: 'Dress Trousers', count: 7654 },
                { name: 'Wide-Leg Trousers', count: 5432 },
                { name: 'Cropped Trousers', count: 4321 },
                { name: 'Palazzo Trousers', count: 6789 },
                { name: 'Leggings', count: 9876 },
                { name: 'Shorts', count: 5678 },
                { name: 'Skirts', count: 8234 }
              ]
            },
            'suits-blazers': {
              name: 'Suits & Blazers',
              items: [
                { name: 'Pantsuits', count: 3456 },
                { name: 'Skirt Suits', count: 2345 },
                { name: 'Blazers', count: 6789 },
                { name: 'Tailored Blazers', count: 4567 },
                { name: 'Double-Breasted Blazers', count: 2876 },
                { name: 'Casual Blazers', count: 5432 }
              ]
            },
            'outerwear': {
              name: 'Outerwear',
              items: [
                { name: 'Denim Jackets', count: 7654 },
                { name: 'Leather Jackets', count: 4321 },
                { name: 'Trench Coats', count: 3456 },
                { name: 'Puffer Jackets', count: 5432 },
                { name: 'Parkas', count: 2876 },
                { name: 'Capes', count: 1987 },
                { name: 'Cardigans', count: 8765 }
              ]
            }
          }
        }
      }
    },
    'activewear': {
      name: 'Activewear & Sportswear',
      subcategories: {
        'womens-activewear': {
          name: "Women's Activewear",
          subcategories: {
            'workout-essentials': {
              name: 'Workout Essentials',
              items: [
                { name: 'Sports Bras', count: 8765 },
                { name: 'Workout Tops', count: 7654 },
                { name: 'Athletic Tanks', count: 6543 },
                { name: 'Yoga Pants', count: 9876 },
                { name: 'Running Tights', count: 5432 },
                { name: 'Athletic Shorts', count: 4321 },
                { name: 'Track Jackets Women', count: 3456 },
                { name: 'Yoga Sets', count: 4567 },
                { name: 'Leggings Fitness', count: 6789 },
                { name: 'Sports Tops', count: 5678 },
                { name: 'Fitness Wear', count: 6789 }
              ]
            }
          }
        }
      }
    },
    'sleepwear': {
      name: 'Sleepwear & Loungewear',
      subcategories: {
        'womens-sleepwear': {
          name: "Women's Sleepwear",
          subcategories: {
            'night-essentials': {
              name: 'Night Essentials',
              items: [
                { name: 'Women Pajama Sets', count: 8765 },
                { name: 'Nightgowns', count: 5432 },
                { name: 'Women Sleep Shirts', count: 4321 },
                { name: 'Women Robes', count: 3456 },
                { name: 'Women Lounge Pants', count: 6543 },
                { name: 'Women Sleep Shorts', count: 4567 },
                { name: 'Loungewear Sets', count: 5678 }
              ]
            }
          }
        }
      }
    },
    'swimwear': {
      name: 'Swimwear',
      subcategories: {
        'womens-swimwear': {
          name: "Women's Swimwear",
          subcategories: {
            'swim-collection': {
              name: 'Swim Collection',
              items: [
                { name: 'Bikinis', count: 6789 },
                { name: 'One-Piece Swimsuits', count: 5432 },
                { name: 'Tankinis', count: 3456 },
                { name: 'Swim Dresses', count: 2109 },
                { name: 'Cover-Ups', count: 4321 },
                { name: 'Rash Guards Women', count: 2876 }
              ]
            }
          }
        }
      }
    },
    'intimates': {
      name: 'Intimates & Undergarments',
      subcategories: {
        'womens-intimates': {
          name: "Women's Intimates",
          subcategories: {
            'bras': {
              name: 'Bras',
              items: [
                { name: 'Everyday Bras', count: 12345 },
                { name: 'T-Shirt Bras', count: 9876 },
                { name: 'Sports Bras Intimate', count: 8765 },
                { name: 'Push-Up Bras', count: 7654 },
                { name: 'Strapless Bras', count: 5432 },
                { name: 'Minimizer Bras', count: 4321 },
                { name: 'Nursing Bras', count: 3456 },
                { name: 'Bralettes', count: 6789 }
              ]
            },
            'panties': {
              name: 'Panties',
              items: [
                { name: 'Briefs', count: 8765 },
                { name: 'Thongs', count: 6543 },
                { name: 'Boyshorts', count: 5432 },
                { name: 'Bikini', count: 7654 },
                { name: 'Hipster', count: 4321 },
                { name: 'High-Cut Panties', count: 3456 }
              ]
            },
            'shapewear': {
              name: 'Shapewear',
              items: [
                { name: 'Bodysuits', count: 4321 },
                { name: 'Waist Cinchers', count: 3456 },
                { name: 'Control Briefs', count: 2876 },
                { name: 'Shaping Slips', count: 2345 },
                { name: 'Thigh Shapers', count: 1987 }
              ]
            }
          }
        }
      }
    },
    'seasonal-weather': {
      name: 'Seasonal & Weather Specific',
      subcategories: {
        'summer-wear': {
          name: 'Summer Wear',
          subcategories: {
            'hot-weather': {
              name: 'Hot Weather Clothing',
              items: [
                { name: 'Light Cotton Shirts', count: 7654 },
                { name: 'Sleeveless Tops', count: 9876 },
                { name: 'Light Trousers', count: 5432 },
                { name: 'Summer Dresses', count: 8765 },
                { name: 'Tank Tops Summer', count: 6543 },
                { name: 'Linen Shirts', count: 4321 }
              ]
            }
          }
        },
        'monsoon-wear': {
          name: 'Monsoon Wear',
          subcategories: {
            'rainy-season': {
              name: 'Rainy Season Essentials',
              items: [
                { name: 'Waterproof Jackets', count: 3456 },
                { name: 'Quick-Dry Pants', count: 2876 },
                { name: 'Rain Jackets', count: 4321 },
                { name: 'Raincoats', count: 3654 },
                { name: 'Windbreakers', count: 2987 },
                { name: 'Water-Resistant Clothing', count: 2345 }
              ]
            }
          }
        },
        'winter-wear': {
          name: 'Winter Wear',
          subcategories: {
            'cold-weather': {
              name: 'Cold Weather Clothing',
              items: [
                { name: 'Light Sweaters', count: 6789 },
                { name: 'Jackets', count: 5432 },
                { name: 'Shawls and Wraps', count: 4321 },
                { name: 'Scarves', count: 3456 },
                { name: 'Fleece Jackets', count: 2876 }
              ]
            }
          }
        }
      }
    },
    'festival-special': {
      name: 'Festival & Special Occasion',
      subcategories: {
        'eid-collection': {
          name: 'Eid Collection',
          subcategories: {
            'eid-specials': {
              name: 'Eid Specials',
              items: [
                { name: 'Eid Saree', count: 5432 },
                { name: 'Eid Salwar Kameez', count: 6789 },
                { name: 'Eid Lehenga', count: 3456 }
              ]
            }
          }
        },
        'pohela-boishakh': {
          name: 'Pohela Boishakh (Bengali New Year)',
          subcategories: {
            'new-year-specials': {
              name: 'New Year Specials',
              items: [
                { name: 'Traditional White Saree with Red Border', count: 4321 },
                { name: 'Pohela Boishakh Kurtas', count: 3456 },
                { name: 'Traditional Bangladeshi Outfits', count: 2876 }
              ]
            }
          }
        },
        'wedding-party': {
          name: 'Wedding & Party Wear',
          subcategories: {
            'special-occasions': {
              name: 'Special Occasions',
              items: [
                { name: 'Wedding Sarees', count: 4567 },
                { name: 'Bridal Lehengas', count: 3456 },
                { name: 'Party Dresses', count: 5432 },
                { name: 'Cocktail Outfits', count: 4321 },
                { name: 'Reception Wear', count: 3654 }
              ]
            }
          }
        }
      }
    },
    'accessories': {
      name: 'Accessories & Add-ons',
      subcategories: {
        'fashion-accessories': {
          name: 'Fashion Accessories',
          subcategories: {
            'style-essentials': {
              name: 'Style Essentials',
              items: [
                { name: 'Scarves & Hijabs', count: 6789 },
                { name: 'Belts', count: 5432 },
                { name: 'Hair Accessories', count: 4321 },
                { name: 'Fashion Jewelry', count: 7654 },
                { name: 'Handbags & Purses', count: 8765 }
              ]
            }
          }
        },
        'traditional-accessories': {
          name: 'Traditional Accessories',
          subcategories: {
            'ethnic-accessories': {
              name: 'Ethnic Accessories',
              items: [
                { name: 'Dupattas', count: 5432 },
                { name: 'Traditional Jewelry', count: 4321 },
                { name: 'Bangles', count: 6543 },
                { name: 'Ethnic Bags', count: 3456 },
                { name: 'Traditional Footwear', count: 4567 }
              ]
            }
          }
        }
      }
    }
  }
};

// Convert to flat structure for compatibility
export const womensFashionDataConverted: SubCategory = {
  name: "Women's Fashion",
  subcategories: Object.values(womensFashionHierarchical.subcategories).reduce((acc, mainCategory) => {
    Object.values(mainCategory.subcategories).forEach(subCategory => {
      Object.values(subCategory.subcategories).forEach(subSubCategory => {
        acc.push(...subSubCategory.items);
      });
    });
    return acc;
  }, [] as Array<{ name: string; count: number }>)
};
