
import React from 'react';
import { Home } from 'lucide-react';
import { MainCategory } from '../categoriesData';

export const homeGardenData: MainCategory = {
  id: 'home-garden',
  name: 'Home & Garden',
  icon: React.createElement(Home, { className: "w-8 h-8" }),
  color: 'text-green-500',
  count: 8456,
  featured: true,
  subcategories: {
    'furniture': {
      name: 'Furniture',
      subcategories: [
        {
          name: 'Living Room Furniture',
          count: 1234,
          items: [
            // Sofas & Seating
            '3-Seater Sofas', '2-Seater Sofas', 'Sectional Sofas', 'Recliners',
            'Bean Bags', 'Ottomans', 'Accent Chairs', 'Rocking Chairs',
            // Tables
            'Coffee Tables', 'Side Tables', 'Console Tables', 'TV Units', 'Center Tables',
            // Storage
            'TV Cabinets', 'Display Units', 'Bookshelves', 'Storage Cabinets',
            'Entertainment Centers', 'Media Storage', 'Floor Lamps', 'Table Lamps'
          ]
        },
        {
          name: 'Bedroom Furniture',
          count: 987,
          items: [
            // Beds
            'Single Beds', 'Double Beds', 'Queen Size Beds', 'King Size Beds',
            'Bunk Beds', 'Storage Beds', 'Platform Beds', 'Bed Frames', 'Headboards',
            // Storage
            'Wardrobes', 'Chest of Drawers', 'Bedside Tables', 'Dressing Tables',
            'Almirahs', 'Armoires', 'Storage Benches',
            // Mattresses
            'Spring Mattresses', 'Foam Mattresses', 'Memory Foam Mattresses',
            'Orthopedic Mattresses', 'Coir Mattresses', 'Mattress Toppers'
          ]
        },
        {
          name: 'Dining Room Furniture',
          count: 567,
          items: [
            // Dining Sets
            '4-Seater Dining Sets', '6-Seater Dining Sets', '8-Seater Dining Sets',
            'Bar Tables', 'Counter Height Tables', 'Dining Tables',
            // Dining Chairs
            'Wooden Chairs', 'Upholstered Chairs', 'Bar Stools', 'Folding Chairs',
            'Dining Benches', 'China Cabinets', 'Buffets & Sideboards',
            'Wine Racks', 'Serving Carts', 'Kitchen Islands'
          ]
        },
        {
          name: 'Study & Office Furniture',
          count: 445,
          items: [
            'Study Tables', 'Computer Tables', 'Writing Desks', 'Standing Desks',
            'Study Chairs', 'Office Chairs', 'Executive Chairs', 'Filing Cabinets',
            'Office Storage', 'Bookshelves', 'Conference Tables', 'Reception Desks',
            'Desk Accessories', 'Ergonomic Furniture', 'Home Office Sets'
          ]
        },
        {
          name: 'Outdoor Furniture',
          count: 334,
          items: [
            'Garden Furniture', 'Patio Sets', 'Outdoor Chairs', 'Garden Benches',
            'Outdoor Tables', 'Outdoor Sofas', 'Umbrellas & Shade', 'Fire Pits',
            'Outdoor Storage', 'Hammocks', 'Swing Sets', 'Pool Furniture',
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
          count: 789,
          items: [
            // Wall Art
            'Paintings', 'Canvas Prints', 'Wall Hangings', 'Islamic Calligraphy',
            'Photo Frames', 'Wall Mirrors', 'Wall Stickers', 'Wall Shelves',
            'Metal Wall Art', 'Wooden Wall Decor', 'Wall Decals', 'Clocks',
            'Gallery Walls', 'Religious Wall Art', 'Nature Prints', 'Abstract Art',
            'Tapestries', 'Wall Hooks'
          ]
        },
        {
          name: 'Decorative Items',
          count: 656,
          items: [
            // Showpieces
            'Vases', 'Figurines', 'Candle Holders', 'Decorative Bowls',
            'Antique Items', 'Handicrafts', 'Sculptures', 'Table Centerpieces',
            'Artificial Flowers', 'Decorative Trays', 'Bookends', 'Decorative Boxes',
            // Plants & Planters
            'Indoor Plants', 'Artificial Plants', 'Planters', 'Gardening Tools',
            'Wind Chimes', 'Lanterns', 'Seasonal Decor', 'Holiday Decorations'
          ]
        },
        {
          name: 'Lighting',
          count: 567,
          items: [
            // Ceiling Lights
            'Chandeliers', 'Pendant Lights', 'Ceiling Fans with Lights', 'Flush Mount Lights',
            'Ceiling Lights', 'Track Lighting',
            // Lamps
            'Table Lamps', 'Floor Lamps', 'Desk Lamps', 'Night Lights',
            'String Lights', 'Wall Sconces', 'LED Lights', 'Smart Lighting',
            'Lamp Shades', 'Under Cabinet Lighting', 'Solar Lights', 'Outdoor Lighting'
          ]
        },
        {
          name: 'Window Treatments',
          count: 445,
          items: [
            // Curtains & Drapes
            'Blackout Curtains', 'Sheer Curtains', 'Printed Curtains', 'Plain Curtains',
            'Door Curtains', 'Curtains & Drapes', 'Valances', 'Curtain Rods',
            'Curtain Tiebacks',
            // Blinds
            'Venetian Blinds', 'Vertical Blinds', 'Roller Blinds', 'Bamboo Blinds',
            'Roman Shades', 'Motorized Blinds', 'Window Films', 'Shades'
          ]
        }
      ]
    },
    'kitchen-dining': {
      name: 'Kitchen & Dining',
      subcategories: [
        {
          name: 'Cookware',
          count: 823,
          items: [
            // Pots & Pans
            'Non-stick Cookware', 'Stainless Steel Cookware', 'Cast Iron Cookware',
            'Aluminum Cookware', 'Pressure Cookers', 'Rice Cookers', 'Pots & Pans',
            'Woks', 'Stockpots', 'Skillets & Frying Pans', 'Saucepans',
            'Dutch Ovens', 'Roasting Pans', 'Grill Pans', 'Steamer Pots', 'Cookware Sets'
          ]
        },
        {
          name: 'Tableware & Cutlery',
          count: 678,
          items: [
            // Dinnerware
            'Dinner Sets', 'Plates', 'Bowls', 'Serving Dishes', 'Melamine Sets',
            'Dinner Plates', 'Cups & Mugs', 'Dinnerware Sets', 'Fine China',
            'Kids Dinnerware', 'Disposable Tableware',
            // Glassware
            'Drinking Glasses', 'Wine Glasses', 'Mugs & Cups', 'Water Bottles',
            'Jugs & Pitchers', 'Glassware', 'Travel Mugs',
            // Cutlery
            'Spoon Sets', 'Knife Sets', 'Fork Sets', 'Serving Spoons',
            'Knives & Cutlery', 'Flatware', 'Serving Utensils'
          ]
        },
        {
          name: 'Kitchen Storage & Tools',
          count: 567,
          items: [
            // Storage Containers
            'Food Storage Containers', 'Spice Containers', 'Rice Containers',
            'Lunch Boxes', 'Glass Storage', 'Plastic Storage', 'Storage Jars',
            'Airtight Containers', 'Meal Prep Containers', 'Pantry Storage',
            // Kitchen Tools
            'Cutting Boards', 'Kitchen Knives', 'Measuring Tools', 'Kitchen Scales',
            'Can Openers', 'Mixing Bowls', 'Peelers & Graters', 'Tongs & Spatulas',
            'Whisks', 'Ladles', 'Kitchen Shears', 'Timers', 'Kitchen Organizers'
          ]
        },
        {
          name: 'Kitchen Appliances',
          count: 734,
          items: [
            // Small Appliances
            'Blenders', 'Juicers', 'Food Processors', 'Mixer Grinders', 'Toasters',
            'Coffee Makers', 'Electric Kettles', 'Rice Cookers', 'Air Fryers',
            'Microwave Ovens', 'Pressure Cookers', 'Induction Cooktops', 'Stand Mixers',
            'Slow Cookers', 'Electric Grills', 'Refrigerators'
          ]
        }
      ]
    },
    'bedding-bath': {
      name: 'Bedding & Bath',
      subcategories: [
        {
          name: 'Bedding',
          count: 678,
          items: [
            // Bed Sheets
            'Cotton Bed Sheets', 'Silk Bed Sheets', 'Satin Bed Sheets',
            'Fitted Sheets', 'Bed Sheet Sets', 'Bed Sheets', 'Pillowcases',
            'Luxury Bedding', 'Organic Bedding', 'Kids Bedding', 'Seasonal Bedding',
            // Pillows & Cushions
            'Bed Pillows', 'Cushion Covers', 'Pillow Covers', 'Memory Foam Pillows',
            'Decorative Cushions', 'Pillows', 'Throw Pillows',
            // Blankets & Comforters
            'Cotton Blankets', 'Woolen Blankets', 'Quilts', 'Comforters',
            'Duvets', 'Bed Covers', 'Blankets', 'Duvet Covers', 'Bed Skirts'
          ]
        },
        {
          name: 'Bath Essentials',
          count: 534,
          items: [
            // Towels
            'Bath Towels', 'Hand Towels', 'Face Towels', 'Beach Towels',
            'Towel Sets', 'Washcloths', 'Luxury Towels', 'Quick Dry Towels',
            'Organic Towels', 'Kids Bath Towels', 'Travel Towels', 'Hair Towels',
            // Bathroom Accessories
            'Shower Curtains', 'Bath Mats', 'Soap Dispensers', 'Toothbrush Holders',
            'Bathroom Storage', 'Bath Rugs', 'Toilet Paper Holders', 'Towel Bars',
            'Shower Caddies', 'Bath Organizers', 'Mirrors', 'Scales', 'Trash Cans'
          ]
        }
      ]
    },
    'cleaning-laundry': {
      name: 'Cleaning & Laundry',
      subcategories: [
        {
          name: 'Cleaning Supplies',
          count: 445,
          items: [
            // Cleaning Products
            'Floor Cleaners', 'Glass Cleaners', 'Bathroom Cleaners', 'Kitchen Cleaners',
            'Disinfectants', 'All-Purpose Cleaners', 'Stain Removers', 'Polish',
            // Cleaning Tools
            'Mops', 'Brooms', 'Vacuum Cleaners', 'Robot Vacuums', 'Steam Mops',
            'Cleaning Cloths', 'Buckets', 'Sponges', 'Scrub Brushes',
            'Carpet Cleaners', 'Pressure Washers', 'Window Cleaners'
          ]
        },
        {
          name: 'Laundry',
          count: 356,
          items: [
            // Laundry Products
            'Detergents', 'Fabric Softeners', 'Stain Removers', 'Bleach',
            'Laundry Pods', 'Eco-Friendly Detergents',
            // Laundry Accessories
            'Laundry Baskets', 'Clothes Hangers', 'Drying Racks', 'Ironing Boards',
            'Irons', 'Laundry Bags', 'Clothespins', 'Garment Steamers',
            'Washing Machines', 'Dryers'
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
