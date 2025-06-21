import React from 'react';
import { Smartphone } from 'lucide-react';
import { MainCategory } from '../categoriesData';

export const electronicsData: MainCategory = {
  id: 'electronics',
  name: 'Electronics & Technology',
  icon: React.createElement(Smartphone, { className: "w-8 h-8" }),
  color: 'text-blue-500',
  count: 12847,
  featured: true,
  subcategories: {
    'mobile-tablets': {
      name: 'Mobile Phones & Accessories',
      subcategories: [
        {
          name: 'Smartphones',
          count: 2456,
          items: [
            // Android Phones
            'Samsung Galaxy Series', 'Xiaomi/MI Phones', 'OnePlus Phones', 'Oppo Phones',
            'Vivo Phones', 'Huawei Phones', 'Realme Phones', 'Google Pixel',
            // iPhones
            'iPhone 15 Series', 'iPhone 14 Series', 'iPhone 13 Series', 'iPhone 12 Series', 'iPhone SE',
            // Feature Phones
            'Basic Phones', 'Smart Feature Phones', 'Dual SIM Phones'
          ]
        },
        {
          name: 'Tablets & E-Readers',
          count: 723,
          items: [
            // iPad Series
            'iPad Pro', 'iPad Air', 'iPad Mini', 'iPad (Standard)',
            // Android Tablets
            'Samsung Galaxy Tab', 'Huawei MatePad', 'Lenovo Tab', 'Amazon Fire Tablet',
            // E-Readers
            'Kindle', 'Kobo', 'Other E-Readers'
          ]
        },
        {
          name: 'Mobile Accessories',
          count: 1834,
          items: [
            // Cases & Covers
            'Silicone Cases', 'Leather Cases', 'Rugged Cases', 'Flip Cases', 'Transparent Cases',
            // Screen Protection
            'Tempered Glass', 'Screen Protectors', 'Privacy Glass', 'Blue Light Filters',
            // Charging Accessories
            'Phone Chargers', 'Power Banks', 'Wireless Chargers', 'Car Chargers', 'Charging Cables',
            // Audio Accessories
            'Earphones', 'Headphones', 'Bluetooth Headsets', 'Wireless Earbuds', 'Mobile Speakers'
          ]
        },
        {
          name: 'Tablet Accessories',
          count: 445,
          items: [
            'Tablet Cases', 'Screen Protectors', 'Stylus Pens', 'Keyboard Covers', 'Tablet Stands'
          ]
        },
        {
          name: 'Wearable Technology',
          count: 567,
          items: [
            // Smart Watches
            'Apple Watch', 'Samsung Galaxy Watch', 'Fitbit', 'Garmin', 'Xiaomi Mi Band',
            // Fitness Trackers
            'Activity Trackers', 'Heart Rate Monitors', 'GPS Trackers', 'Sleep Trackers'
          ]
        }
      ]
    },
    'computers': {
      name: 'Computers & Laptops',
      subcategories: [
        {
          name: 'Laptops',
          count: 1234,
          items: [
            // Gaming Laptops
            'ASUS ROG Series', 'MSI Gaming', 'HP Omen', 'Dell Alienware', 'Acer Predator',
            // Business Laptops
            'Dell Latitude', 'HP EliteBook', 'Lenovo ThinkPad', 'ASUS ExpertBook',
            // Ultrabooks
            'MacBook Air', 'MacBook Pro', 'Dell XPS', 'HP Spectre', 'ASUS ZenBook',
            // Budget Laptops
            'Entry Level Laptops', 'Student Laptops', 'Refurbished Laptops'
          ]
        },
        {
          name: 'Desktop Computers',
          count: 645,
          items: [
            'All-in-One PCs', 'Gaming PCs', 'Office PCs', 'Custom Built PCs', 'Workstations',
            'Mini PCs', 'Budget Desktops', 'Refurbished Desktops', 'Home Office PCs'
          ]
        },
        {
          name: 'Computer Components',
          count: 823,
          items: [
            'Processors (CPU)', 'Graphics Cards (GPU)', 'Motherboards', 'RAM Memory',
            'Storage (SSD/HDD)', 'Power Supplies', 'Computer Cases', 'Cooling Systems',
            'Sound Cards', 'Network Cards', 'Optical Drives'
          ]
        },
        {
          name: 'Computer Accessories',
          count: 1156,
          items: [
            // Input Devices
            'Keyboards', 'Computer Mice', 'Webcams', 'Microphones', 'Graphics Tablets',
            // Display
            'Monitors', 'Projectors', 'Monitor Arms', 'Screen Filters',
            // Storage
            'External Hard Drives', 'SSDs', 'USB Drives', 'Memory Cards', 'NAS Storage',
            // Networking
            'Routers', 'WiFi Adapters', 'Network Switches', 'Ethernet Cables',
            // Other Accessories
            'USB Hubs', 'Laptop Stands', 'Mouse Pads', 'KVM Switches', 'Cable Management',
            'Laptop Cooling Pads', 'Docking Stations'
          ]
        }
      ]
    },
    'audio-video': {
      name: 'Audio & Video',
      subcategories: [
        {
          name: 'Audio Devices',
          count: 1278,
          items: [
            // Headphones & Earphones
            'Over-Ear Headphones', 'On-Ear Headphones', 'In-Ear Earphones', 'Wireless Headphones',
            'Gaming Headsets', 'Studio Headphones', 'Noise Cancelling Headphones', 'Sports Earphones',
            // Speakers
            'Bluetooth Speakers', 'Home Theater Systems', 'Soundbars', 'Bookshelf Speakers',
            'Portable Speakers', 'Smart Speakers', 'Computer Speakers', 'Subwoofers',
            // Music Systems
            'Hi-Fi Systems', 'Turntables', 'CD Players', 'Radio Systems', 'Audio Receivers', 'Amplifiers'
          ]
        },
        {
          name: 'Video Devices',
          count: 789,
          items: [
            // Televisions
            'Smart TVs', 'LED TVs', 'OLED TVs', 'QLED TVs', '4K TVs', '8K TVs', 'Budget TVs',
            // Streaming Devices
            'Android TV Boxes', 'Chromecast', 'Amazon Fire Stick', 'Roku Devices',
            'TV Mounts', 'TV Stands', 'Streaming Devices', 'TV Antennas', 'HDMI Cables'
          ]
        },
        {
          name: 'Photography & Cameras',
          count: 867,
          items: [
            // DSLR Cameras
            'Canon EOS Series', 'Nikon D Series', 'Sony Alpha',
            // Mirrorless Cameras
            'Sony Alpha Series', 'Canon EOS M', 'Fujifilm X Series',
            // Action Cameras
            'GoPro', 'DJI Action', 'Yi Action Cameras',
            // Instant Cameras
            'Fujifilm Instax', 'Polaroid',
            // Camera Accessories
            'Camera Lenses', 'Tripods', 'Camera Bags', 'Memory Cards', 'Camera Cleaning Kits',
            'Flash Units', 'Camera Filters', 'Camera Batteries', 'Camera Straps'
          ]
        }
      ]
    },
    'gaming': {
      name: 'Gaming & Entertainment',
      subcategories: [
        {
          name: 'Gaming Consoles',
          count: 434,
          items: [
            // PlayStation
            'PlayStation 5', 'PlayStation 4', 'PS VR',
            // Xbox
            'Xbox Series X/S', 'Xbox One',
            // Nintendo
            'Nintendo Switch', 'Nintendo Switch Lite', 'Nintendo DS',
            // Other Consoles
            'Retro Gaming Consoles', 'Handheld Gaming Devices'
          ]
        },
        {
          name: 'Gaming Accessories',
          count: 756,
          items: [
            'Gaming Controllers', 'Gaming Keyboards', 'Gaming Mice', 'Gaming Headsets',
            'Gaming Chairs', 'Gaming Desks', 'Controller Chargers', 'Gaming Mouse Pads',
            'Game Storage', 'Gaming Cables', 'Racing Wheels', 'Flight Sticks', 'VR Headsets'
          ]
        },
        {
          name: 'PC Gaming',
          count: 867,
          items: [
            'Gaming Laptops', 'Gaming Desktops', 'Graphics Cards', 'Gaming Monitors',
            'Mechanical Keyboards', 'Gaming Mice', 'Gaming Headsets', 'PC Game Controllers',
            'Gaming Speakers', 'Streaming Equipment', 'RGB Lighting', 'Gaming Software',
            'Gaming Motherboards', 'Gaming RAM', 'Gaming Cases'
          ]
        }
      ]
    },
    'smart-home': {
      name: 'Smart Home & IoT',
      subcategories: [
        {
          name: 'Smart Home Devices',
          count: 623,
          items: [
            'Smart Lights', 'Smart Switches', 'Smart Thermostats', 'Smart Door Locks',
            'Smart Cameras', 'Smart Doorbells', 'Security Cameras', 'Home Automation Systems',
            'Smart Plugs', 'Smart Sensors', 'Smart Garage Openers'
          ]
        },
        {
          name: 'Voice Assistants',
          count: 234,
          items: [
            'Amazon Echo', 'Google Nest', 'Apple HomePod', 'Smart Displays',
            'Voice Remote Controls', 'Smart Hubs'
          ]
        },
        {
          name: 'Home Security',
          count: 445,
          items: [
            'Security Cameras', 'Video Doorbells', 'Motion Sensors', 'Alarm Systems',
            'Smart Locks', 'Security Monitors', 'Baby Monitors'
          ]
        }
      ]
    },
    'appliances': {
      name: 'Home Appliances',
      subcategories: [
        {
          name: 'Kitchen Appliances',
          count: 923,
          items: [
            'Refrigerators', 'Microwaves', 'Rice Cookers', 'Blenders', 'Food Processors',
            'Air Fryers', 'Electric Kettles', 'Coffee Makers', 'Toasters', 'Pressure Cookers',
            'Induction Cooktops', 'Stand Mixers', 'Juicers', 'Slow Cookers', 'Electric Grills'
          ]
        },
        {
          name: 'Cleaning Appliances',
          count: 545,
          items: [
            'Vacuum Cleaners', 'Robot Vacuums', 'Steam Mops', 'Carpet Cleaners',
            'Pressure Washers', 'Window Cleaners', 'Floor Polishers', 'Handheld Vacuums',
            'Wet & Dry Vacuums', 'Car Vacuums', 'Air Purifiers', 'Dehumidifiers'
          ]
        },
        {
          name: 'Personal Care Appliances',
          count: 434,
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
