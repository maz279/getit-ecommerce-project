
import React from 'react';
import { Home } from 'lucide-react';
import { MainCategory } from '../categoriesData';

export const homeGardenData: MainCategory = {
  id: 'home-garden',
  name: 'Home & Garden',
  icon: React.createElement(Home, { className: "w-8 h-8" }),
  color: 'text-green-500',
  count: 6456,
  featured: true,
  subcategories: {
    'furniture': {
      name: 'Furniture',
      subcategories: [
        {
          name: 'Living Room Furniture',
          count: 834,
          items: [
            'Sofas & Couches', 'Coffee Tables', 'TV Stands & Entertainment Centers', 'Recliners',
            'Sectional Sofas', 'Accent Chairs', 'Ottoman & Footstools', 'Side Tables',
            'Floor Lamps', 'Table Lamps', 'Bookshelves', 'Display Cabinets',
            'Living Room Sets', 'Bean Bags', 'Rocking Chairs', 'Media Storage'
          ]
        },
        {
          name: 'Bedroom Furniture',
          count: 689,
          items: [
            'Beds & Bed Frames', 'Mattresses', 'Wardrobes & Closets', 'Dressing Tables',
            'Nightstands', 'Chest of Drawers', 'Bedroom Sets', 'Headboards',
            'Mattress Toppers', 'Bed Linens', 'Pillows', 'Blankets & Comforters',
            'Bedroom Mirrors', 'Bedroom Lighting', 'Storage Benches', 'Armoires'
          ]
        },
        {
          name: 'Dining Room Furniture',
          count: 445,
          items: [
            'Dining Tables', 'Dining Chairs', 'Dining Sets', 'Bar Stools',
            'China Cabinets', 'Buffets & Sideboards', 'Bar Tables', 'Dining Benches',
            'Counter Height Tables', 'Outdoor Dining Sets', 'Kitchen Islands',
            'Wine Racks', 'Serving Carts', 'Dining Room Lighting'
          ]
        },
        {
          name: 'Office Furniture',
          count: 367,
          items: [
            'Office Chairs', 'Office Desks', 'Computer Desks', 'Filing Cabinets',
            'Office Storage', 'Bookshelves', 'Standing Desks', 'Executive Chairs',
            'Conference Tables', 'Reception Desks', 'Office Lighting', 'Desk Accessories',
            'Ergonomic Furniture', 'Home Office Sets', 'Office Partitions'
          ]
        },
        {
          name: 'Outdoor Furniture',
          count: 278,
          items: [
            'Patio Sets', 'Outdoor Chairs', 'Outdoor Tables', 'Garden Benches',
            'Outdoor Sofas', 'Umbrellas & Shade', 'Fire Pits', 'Outdoor Storage',
            'Hammocks', 'Swing Sets', 'Pool Furniture', 'Outdoor Cushions',
            'Gazebos & Pergolas', 'Outdoor Rugs', 'Garden Stools'
          ]
        }
      ]
    },
    'home-decor': {
      name: 'Home Decor',
      subcategories: [
        {
          name: 'Wall Decor',
          count: 567,
          items: [
            'Wall Art & Paintings', 'Photo Frames', 'Wall Mirrors', 'Wall Stickers',
            'Canvas Prints', 'Metal Wall Art', 'Wooden Wall Decor', 'Wall Shelves',
            'Clocks', 'Wall Hooks', 'Tapestries', 'Wall Decals', 'Gallery Walls',
            'Religious Wall Art', 'Nature Prints', 'Abstract Art'
          ]
        },
        {
          name: 'Decorative Accessories',
          count: 723,
          items: [
            'Vases & Planters', 'Candles & Holders', 'Decorative Bowls', 'Figurines & Sculptures',
            'Table Centerpieces', 'Artificial Flowers', 'Decorative Trays', 'Picture Frames',
            'Decorative Pillows', 'Throw Blankets', 'Bookends', 'Decorative Boxes',
            'Wind Chimes', 'Lanterns', 'Seasonal Decor', 'Holiday Decorations'
          ]
        },
        {
          name: 'Lighting',
          count: 445,
          items: [
            'Ceiling Lights', 'Table Lamps', 'Floor Lamps', 'Wall Sconces',
            'Pendant Lights', 'Chandeliers', 'LED Lights', 'String Lights',
            'Night Lights', 'Desk Lamps', 'Outdoor Lighting', 'Smart Lighting',
            'Lamp Shades', 'Track Lighting', 'Under Cabinet Lighting', 'Solar Lights'
          ]
        },
        {
          name: 'Window Treatments',
          count: 334,
          items: [
            'Curtains & Drapes', 'Blinds', 'Shades', 'Valances',
            'Curtain Rods', 'Sheer Curtains', 'Blackout Curtains', 'Window Films',
            'Roman Shades', 'Venetian Blinds', 'Vertical Blinds', 'Roller Blinds',
            'Bamboo Blinds', 'Motorized Blinds', 'Curtain Tiebacks'
          ]
        }
      ]
    },
    'kitchen-dining': {
      name: 'Kitchen & Dining',
      subcategories: [
        {
          name: 'Cookware',
          count: 678,
          items: [
            'Pots & Pans', 'Non-stick Cookware', 'Stainless Steel Cookware', 'Cast Iron Cookware',
            'Pressure Cookers', 'Woks', 'Stockpots', 'Skillets & Frying Pans',
            'Saucepans', 'Dutch Ovens', 'Roasting Pans', 'Grill Pans',
            'Steamer Pots', 'Cookware Sets', 'Specialty Cookware'
          ]
        },
        {
          name: 'Kitchen Tools & Gadgets',
          count: 567,
          items: [
            'Knives & Cutlery', 'Cutting Boards', 'Mixing Bowls', 'Measuring Tools',
            'Can Openers', 'Peelers & Graters', 'Kitchen Scales', 'Timers',
            'Tongs & Spatulas', 'Whisks', 'Ladles', 'Kitchen Shears',
            'Mandoline Slicers', 'Food Storage', 'Spice Racks', 'Kitchen Organizers'
          ]
        },
        {
          name: 'Dinnerware',
          count: 445,
          items: [
            'Dinner Plates', 'Bowls', 'Cups & Mugs', 'Glassware',
            'Dinnerware Sets', 'Serving Dishes', 'Flatware', 'Serving Utensils',
            'Wine Glasses', 'Water Bottles', 'Travel Mugs', 'Kids Dinnerware',
            'Disposable Tableware', 'Melamine Dinnerware', 'Fine China'
          ]
        },
        {
          name: 'Food Storage',
          count: 356,
          items: [
            'Food Containers', 'Glass Storage', 'Plastic Storage', 'Vacuum Bags',
            'Lunch Boxes', 'Thermos Bottles', 'Food Wraps', 'Storage Jars',
            'Refrigerator Organizers', 'Freezer Bags', 'Airtight Containers',
            'Meal Prep Containers', 'Spice Containers', 'Pantry Storage'
          ]
        }
      ]
    },
    'bedding-bath': {
      name: 'Bedding & Bath',
      subcategories: [
        {
          name: 'Bedding',
          count: 534,
          items: [
            'Bed Sheets', 'Pillowcases', 'Comforters', 'Duvet Covers',
            'Blankets', 'Pillows', 'Mattress Protectors', 'Bed Skirts',
            'Quilts', 'Throw Pillows', 'Bedding Sets', 'Kids Bedding',
            'Luxury Bedding', 'Organic Bedding', 'Seasonal Bedding'
          ]
        },
        {
          name: 'Bath Towels & Linens',
          count: 423,
          items: [
            'Bath Towels', 'Hand Towels', 'Washcloths', 'Beach Towels',
            'Towel Sets', 'Bath Mats', 'Shower Curtains', 'Bath Rugs',
            'Luxury Towels', 'Quick Dry Towels', 'Organic Towels',
            'Kids Bath Towels', 'Travel Towels', 'Hair Towels'
          ]
        },
        {
          name: 'Bathroom Accessories',
          count: 367,
          items: [
            'Soap Dispensers', 'Toothbrush Holders', 'Toilet Paper Holders', 'Towel Bars',
            'Shower Caddies', 'Bath Organizers', 'Mirrors', 'Scales',
            'Trash Cans', 'Toilet Seat Covers', 'Shower Heads', 'Faucets',
            'Bathroom Storage', 'Medicine Cabinets', 'Bathroom Lighting'
          ]
        }
      ]
    },
    'garden-outdoor': {
      name: 'Garden & Outdoor',
      subcategories: [
        {
          name: 'Gardening Tools',
          count: 445,
          items: [
            'Hand Tools', 'Shovels & Spades', 'Pruning Tools', 'Watering Equipment',
            'Garden Hoses', 'Sprinklers', 'Wheelbarrows', 'Garden Gloves',
            'Lawn Mowers', 'Hedge Trimmers', 'Leaf Blowers', 'Garden Kneelers',
            'Tool Storage', 'Weeding Tools', 'Garden Tool Sets'
          ]
        },
        {
          name: 'Plants & Seeds',
          count: 678,
          items: [
            'Indoor Plants', 'Outdoor Plants', 'Flowering Plants', 'Succulents',
            'Herbs', 'Vegetable Seeds', 'Flower Seeds', 'Tree Seedlings',
            'Fruit Plants', 'Medicinal Plants', 'Air Purifying Plants',
            'Low Maintenance Plants', 'Rare Plants', 'Seasonal Plants'
          ]
        },
        {
          name: 'Planters & Pots',
          count: 356,
          items: [
            'Ceramic Pots', 'Plastic Planters', 'Wooden Planters', 'Metal Planters',
            'Hanging Planters', 'Self Watering Pots', 'Large Planters', 'Small Pots',
            'Decorative Planters', 'Indoor Planters', 'Outdoor Planters',
            'Window Boxes', 'Planter Sets', 'Smart Planters'
          ]
        },
        {
          name: 'Outdoor Decor',
          count: 289,
          items: [
            'Garden Statues', 'Water Fountains', 'Garden Lights', 'Wind Chimes',
            'Garden Stones', 'Outdoor Candles', 'Bird Feeders', 'Garden Signs',
            'Stepping Stones', 'Garden Borders', 'Outdoor Art', 'Solar Decor',
            'Weather Vanes', 'Garden Mirrors', 'Outdoor Sculptures'
          ]
        }
      ]
    },
    'storage-organization': {
      name: 'Storage & Organization',
      subcategories: [
        {
          name: 'Closet Organization',
          count: 423,
          items: [
            'Hangers', 'Closet Organizers', 'Shoe Racks', 'Storage Bins',
            'Closet Rods', 'Drawer Organizers', 'Garment Bags', 'Closet Shelving',
            'Tie & Belt Racks', 'Jewelry Organizers', 'Vacuum Storage Bags',
            'Cedar Blocks', 'Mothballs', 'Closet Deodorizers'
          ]
        },
        {
          name: 'Storage Furniture',
          count: 356,
          items: [
            'Storage Ottomans', 'Storage Benches', 'Bookcases', 'Storage Cabinets',
            'Hall Trees', 'Storage Trunks', 'Under Bed Storage', 'Storage Stools',
            'Wall Mounted Storage', 'Corner Storage', 'Multi-purpose Furniture',
            'Kids Storage Furniture', 'Bathroom Storage', 'Kitchen Storage'
          ]
        },
        {
          name: 'Garage & Utility',
          count: 267,
          items: [
            'Garage Storage', 'Tool Storage', 'Sports Equipment Storage', 'Utility Shelving',
            'Storage Racks', 'Pegboards', 'Garage Organizers', 'Workbenches',
            'Tool Chests', 'Storage Lockers', 'Overhead Storage', 'Wall Storage Systems',
            'Mobile Storage', 'Heavy Duty Storage', 'Industrial Storage'
          ]
        }
      ]
    }
  }
};
