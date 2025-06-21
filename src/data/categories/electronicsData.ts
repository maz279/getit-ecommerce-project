
import React from 'react';
import { Smartphone } from 'lucide-react';
import { MainCategory } from '../categoriesData';

export const electronicsData: MainCategory = {
  id: 'electronics',
  name: 'Electronics',
  icon: React.createElement(Smartphone, { className: "w-8 h-8" }),
  color: 'text-blue-500',
  count: 8947,
  featured: true,
  subcategories: {
    'mobile-tablets': {
      name: 'Mobile & Tablets',
      subcategories: [
        {
          name: 'Smartphones',
          count: 1456,
          items: [
            'Android Phones', 'iPhones', 'Samsung Galaxy', 'Xiaomi Phones', 'OnePlus Phones',
            'Huawei Phones', 'Oppo Phones', 'Vivo Phones', 'Realme Phones', 'Nokia Phones',
            'Google Pixel', 'Gaming Phones', 'Rugged Phones', 'Dual SIM Phones',
            'Unlocked Phones', 'Refurbished Phones', 'Budget Smartphones', 'Flagship Phones'
          ]
        },
        {
          name: 'Tablets',
          count: 523,
          items: [
            'iPad', 'iPad Pro', 'iPad Air', 'iPad Mini', 'Android Tablets',
            'Samsung Galaxy Tab', 'Huawei Tablets', 'Lenovo Tablets', 'Microsoft Surface',
            'Windows Tablets', 'E-readers', 'Kindle', 'Drawing Tablets', 'Kids Tablets'
          ]
        },
        {
          name: 'Mobile Accessories',
          count: 834,
          items: [
            'Phone Cases', 'Screen Protectors', 'Phone Chargers', 'Power Banks',
            'Car Chargers', 'Wireless Chargers', 'Phone Holders', 'Selfie Sticks',
            'Phone Grips', 'Camera Lens Attachments', 'Phone Rings', 'Cable Organizers',
            'Bluetooth Adapters', 'Phone Stands', 'Waterproof Cases'
          ]
        },
        {
          name: 'Smartwatches & Wearables',
          count: 345,
          items: [
            'Apple Watch', 'Samsung Galaxy Watch', 'Fitbit', 'Garmin Watches',
            'Xiaomi Mi Band', 'Amazfit Watches', 'Fossil Smartwatches', 'Fitness Trackers',
            'Smart Bands', 'Kids Smartwatches', 'Hybrid Smartwatches', 'Sport Watches'
          ]
        }
      ]
    },
    'computers': {
      name: 'Computers & Laptops',
      subcategories: [
        {
          name: 'Laptops',
          count: 734,
          items: [
            'Gaming Laptops', 'Business Laptops', 'Ultrabooks', 'MacBooks',
            'Chromebooks', 'Budget Laptops', '2-in-1 Laptops', 'Workstation Laptops',
            'Student Laptops', 'Lightweight Laptops', 'High Performance Laptops',
            'Touchscreen Laptops', 'Refurbished Laptops', 'Laptop Bags'
          ]
        },
        {
          name: 'Desktop Computers',
          count: 445,
          items: [
            'Gaming PCs', 'All-in-One PCs', 'Business Desktops', 'Workstations',
            'Mini PCs', 'Budget Desktops', 'Custom Built PCs', 'Refurbished Desktops',
            'Home Office PCs', 'Media Center PCs', 'Server Computers'
          ]
        },
        {
          name: 'Computer Components',
          count: 623,
          items: [
            'Processors (CPU)', 'Graphics Cards (GPU)', 'Motherboards', 'RAM Memory',
            'Storage (SSD/HDD)', 'Power Supplies', 'Computer Cases', 'Cooling Systems',
            'Sound Cards', 'Network Cards', 'Optical Drives', 'Computer Cables'
          ]
        },
        {
          name: 'Computer Accessories',
          count: 556,
          items: [
            'Keyboards', 'Computer Mice', 'Monitors', 'Speakers', 'Webcams',
            'Microphones', 'USB Hubs', 'External Hard Drives', 'Laptop Stands',
            'Mouse Pads', 'Monitor Arms', 'KVM Switches', 'Cable Management',
            'Laptop Cooling Pads', 'Docking Stations'
          ]
        }
      ]
    },
    'audio-video': {
      name: 'Audio & Video',
      subcategories: [
        {
          name: 'Headphones & Earphones',
          count: 678,
          items: [
            'Wireless Earbuds', 'Bluetooth Headphones', 'Gaming Headsets', 'Studio Headphones',
            'In-ear Headphones', 'Over-ear Headphones', 'Noise Cancelling Headphones',
            'Sports Earphones', 'Kids Headphones', 'Wireless Headphones', 'Wired Earphones'
          ]
        },
        {
          name: 'Speakers & Sound Systems',
          count: 445,
          items: [
            'Bluetooth Speakers', 'Smart Speakers', 'Soundbars', 'Home Theater Systems',
            'Portable Speakers', 'Computer Speakers', 'Bookshelf Speakers', 'Subwoofers',
            'Outdoor Speakers', 'Ceiling Speakers', 'Audio Receivers', 'Amplifiers'
          ]
        },
        {
          name: 'Cameras & Photography',
          count: 567,
          items: [
            'DSLR Cameras', 'Mirrorless Cameras', 'Action Cameras', 'Security Cameras',
            'Instant Cameras', 'Digital Cameras', 'Camera Lenses', 'Tripods',
            'Camera Bags', 'Memory Cards', 'Camera Batteries', 'Flash Units',
            'Camera Filters', 'Selfie Sticks', 'Camera Straps'
          ]
        },
        {
          name: 'TVs & Displays',
          count: 389,
          items: [
            'Smart TVs', 'LED TVs', 'OLED TVs', 'QLED TVs', '4K TVs', '8K TVs',
            'Gaming Monitors', 'Computer Monitors', 'Projectors', 'TV Mounts',
            'TV Stands', 'Streaming Devices', 'TV Antennas', 'HDMI Cables'
          ]
        }
      ]
    },
    'gaming': {
      name: 'Gaming',
      subcategories: [
        {
          name: 'Gaming Consoles',
          count: 234,
          items: [
            'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One',
            'Nintendo Switch', 'Nintendo Switch Lite', 'Retro Gaming Consoles',
            'Handheld Gaming Devices', 'VR Headsets', 'Gaming Accessories'
          ]
        },
        {
          name: 'Gaming Accessories',
          count: 456,
          items: [
            'Gaming Controllers', 'Gaming Keyboards', 'Gaming Mice', 'Gaming Headsets',
            'Gaming Chairs', 'Gaming Desks', 'Controller Chargers', 'Gaming Mouse Pads',
            'Game Storage', 'Gaming Cables', 'Racing Wheels', 'Flight Sticks'
          ]
        },
        {
          name: 'PC Gaming',
          count: 567,
          items: [
            'Gaming Laptops', 'Gaming Desktops', 'Graphics Cards', 'Gaming Monitors',
            'Mechanical Keyboards', 'Gaming Mice', 'Gaming Headsets', 'PC Game Controllers',
            'Gaming Speakers', 'Streaming Equipment', 'RGB Lighting', 'Gaming Software'
          ]
        }
      ]
    },
    'appliances': {
      name: 'Home Appliances',
      subcategories: [
        {
          name: 'Kitchen Appliances',
          count: 723,
          items: [
            'Refrigerators', 'Microwaves', 'Rice Cookers', 'Blenders', 'Food Processors',
            'Air Fryers', 'Electric Kettles', 'Coffee Makers', 'Toasters', 'Pressure Cookers',
            'Induction Cooktops', 'Stand Mixers', 'Juicers', 'Slow Cookers', 'Electric Grills'
          ]
        },
        {
          name: 'Cleaning Appliances',
          count: 445,
          items: [
            'Vacuum Cleaners', 'Robot Vacuums', 'Steam Mops', 'Carpet Cleaners',
            'Pressure Washers', 'Window Cleaners', 'Floor Polishers', 'Handheld Vacuums',
            'Wet & Dry Vacuums', 'Car Vacuums', 'Air Purifiers', 'Dehumidifiers'
          ]
        },
        {
          name: 'Personal Care Appliances',
          count: 334,
          items: [
            'Hair Dryers', 'Hair Straighteners', 'Hair Curlers', 'Electric Shavers',
            'Electric Toothbrushes', 'Facial Steamers', 'Massage Devices', 'Weight Scales',
            'Blood Pressure Monitors', 'Thermometers', 'Humidifiers', 'Essential Oil Diffusers'
          ]
        }
      ]
    }
  }
};
