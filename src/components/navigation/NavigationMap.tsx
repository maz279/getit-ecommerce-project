import React from 'react';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  User, 
  Store, 
  Gift, 
  Truck, 
  Phone, 
  FileText,
  Calendar,
  Zap,
  Users,
  CreditCard,
  MapPin,
  Star,
  Heart,
  Camera,
  Mic,
  Search,
  Settings,
  HelpCircle
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  labelBn: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  description?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export const navigationConfig: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    labelBn: 'হোম',
    path: '/',
    icon: <Home className="w-4 h-4" />,
    description: 'Main homepage'
  },
  {
    id: 'categories',
    label: 'Categories',
    labelBn: 'ক্যাটাগরি',
    path: '/categories',
    icon: <Package className="w-4 h-4" />,
    description: 'Product categories',
    children: [
      {
        id: 'electronics',
        label: 'Electronics',
        labelBn: 'ইলেকট্রনিক্স',
        path: '/categories/electronics',
        description: 'Mobile, Laptop, TV, etc.'
      },
      {
        id: 'fashion',
        label: 'Fashion',
        labelBn: 'ফ্যাশন',
        path: '/categories/fashion',
        description: 'Clothing, Shoes, Accessories',
        children: [
          {
            id: 'mens-fashion',
            label: "Men's Fashion",
            labelBn: 'পুরুষদের ফ্যাশন',
            path: '/categories/fashion/mens',
            description: 'Shirts, Pants, Shoes for Men'
          },
          {
            id: 'womens-fashion',
            label: "Women's Fashion",
            labelBn: 'মহিলাদের ফ্যাশন',
            path: '/categories/fashion/womens',
            description: 'Saree, Salwar, Dress for Women'
          },
          {
            id: 'kids-fashion',
            label: "Kids Fashion",
            labelBn: 'শিশুদের ফ্যাশন',
            path: '/categories/fashion/kids',
            description: 'Clothing for Children'
          }
        ]
      },
      {
        id: 'home-garden',
        label: 'Home & Garden',
        labelBn: 'বাড়ি ও বাগান',
        path: '/categories/home-garden',
        description: 'Furniture, Decor, Kitchen'
      },
      {
        id: 'health-beauty',
        label: 'Health & Beauty',
        labelBn: 'স্বাস্থ্য ও সৌন্দর্য',
        path: '/categories/health-beauty',
        description: 'Skincare, Makeup, Wellness'
      },
      {
        id: 'books-education',
        label: 'Books & Education',
        labelBn: 'বই ও শিক্ষা',
        path: '/categories/books-education',
        description: 'Books, Stationery, Learning'
      }
    ]
  },
  {
    id: 'deals',
    label: 'Deals & Offers',
    labelBn: 'অফার ও ছাড়',
    path: '/deals',
    icon: <Gift className="w-4 h-4" />,
    description: 'Special offers and discounts',
    isPopular: true,
    children: [
      {
        id: 'flash-sale',
        label: 'Flash Sale',
        labelBn: 'ফ্ল্যাশ সেল',
        path: '/promotions/flash-sale',
        description: 'Limited time offers',
        isNew: true
      },
      {
        id: 'daily-deals',
        label: 'Daily Deals',
        labelBn: 'দৈনিক অফার',
        path: '/promotions/daily-deals',
        description: 'New deals every day'
      },
      {
        id: 'mega-sale',
        label: 'Mega Sale',
        labelBn: 'মেগা সেল',
        path: '/promotions/mega-sale',
        description: 'Biggest discounts of the year'
      },
      {
        id: 'festival-sales',
        label: 'Festival Sales',
        labelBn: 'উৎসবের সেল',
        path: '/festival-sales',
        description: 'Special festival offers'
      }
    ]
  },
  {
    id: 'services',
    label: 'Services',
    labelBn: 'সেবা',
    path: '/services',
    icon: <Settings className="w-4 h-4" />,
    description: 'Additional services',
    children: [
      {
        id: 'bulk-orders',
        label: 'Bulk Orders',
        labelBn: 'বাল্ক অর্ডার',
        path: '/bulk-orders',
        description: 'Wholesale and bulk purchasing'
      },
      {
        id: 'group-buy',
        label: 'Group Buy',
        labelBn: 'গ্রুপ বাই',
        path: '/shop/group-buy',
        description: 'Collaborative purchasing'
      },
      {
        id: 'gift-cards',
        label: 'Gift Cards',
        labelBn: 'গিফট কার্ড',
        path: '/shop/gift-cards',
        description: 'Digital gift cards'
      },
      {
        id: 'premium',
        label: 'Premium',
        labelBn: 'প্রিমিয়াম',
        path: '/shop/premium',
        description: 'Premium membership benefits'
      }
    ]
  },
  {
    id: 'vendors',
    label: 'Vendors',
    labelBn: 'বিক্রেতা',
    path: '/vendors',
    icon: <Store className="w-4 h-4" />,
    description: 'Vendor directory and stores',
    children: [
      {
        id: 'vendor-directory',
        label: 'Vendor Directory',
        labelBn: 'বিক্রেতার তালিকা',
        path: '/vendor-directory',
        description: 'Browse all vendors'
      },
      {
        id: 'become-vendor',
        label: 'Become a Vendor',
        labelBn: 'বিক্রেতা হন',
        path: '/vendor-register',
        description: 'Start selling with us'
      },
      {
        id: 'vendor-center',
        label: 'Vendor Center',
        labelBn: 'বিক্রেতা কেন্দ্র',
        path: '/vendor-center',
        description: 'Vendor dashboard'
      }
    ]
  },
  {
    id: 'account',
    label: 'My Account',
    labelBn: 'আমার অ্যাকাউন্ট',
    path: '/account',
    icon: <User className="w-4 h-4" />,
    description: 'User account and preferences',
    children: [
      {
        id: 'profile',
        label: 'Profile',
        labelBn: 'প্রোফাইল',
        path: '/account/my-account',
        description: 'Personal information'
      },
      {
        id: 'orders',
        label: 'My Orders',
        labelBn: 'আমার অর্ডার',
        path: '/account/orders',
        description: 'Order history and tracking'
      },
      {
        id: 'wishlist',
        label: 'Wishlist',
        labelBn: 'উইশলিস্ট',
        path: '/wishlist',
        icon: <Heart className="w-4 h-4" />,
        description: 'Saved products'
      },
      {
        id: 'payment-methods',
        label: 'Payment Methods',
        labelBn: 'পেমেন্ট মেথড',
        path: '/account/payment-methods',
        description: 'Manage payment options'
      },
      {
        id: 'addresses',
        label: 'Address Book',
        labelBn: 'ঠিকানা বই',
        path: '/account/addresses',
        description: 'Delivery addresses'
      }
    ]
  },
  {
    id: 'support',
    label: 'Support',
    labelBn: 'সাহায্য',
    path: '/support',
    icon: <HelpCircle className="w-4 h-4" />,
    description: 'Customer support and help',
    children: [
      {
        id: 'help-center',
        label: 'Help Center',
        labelBn: 'সাহায্য কেন্দ্র',
        path: '/support/help-center',
        description: 'FAQs and guides'
      },
      {
        id: 'contact',
        label: 'Contact Us',
        labelBn: 'যোগাযোগ',
        path: '/contact',
        description: 'Get in touch with us'
      },
      {
        id: 'track-order',
        label: 'Track Order',
        labelBn: 'অর্ডার ট্র্যাক',
        path: '/order/track-order',
        description: 'Track your shipment'
      },
      {
        id: 'returns',
        label: 'Returns & Refunds',
        labelBn: 'ফেরত ও রিফান্ড',
        path: '/returns-refunds',
        description: 'Return policy and process'
      }
    ]
  },
  {
    id: 'about',
    label: 'About',
    labelBn: 'সম্পর্কে',
    path: '/about',
    icon: <FileText className="w-4 h-4" />,
    description: 'Company information',
    children: [
      {
        id: 'about-us',
        label: 'About Us',
        labelBn: 'আমাদের সম্পর্কে',
        path: '/about-us',
        description: 'Company story and mission'
      },
      {
        id: 'careers',
        label: 'Careers',
        labelBn: 'ক্যারিয়ার',
        path: '/careers',
        description: 'Job opportunities'
      },
      {
        id: 'blog',
        label: 'Blog',
        labelBn: 'ব্লগ',
        path: '/blog',
        description: 'Latest news and articles'
      },
      {
        id: 'terms',
        label: 'Terms of Service',
        labelBn: 'সেবার শর্তাবলী',
        path: '/terms-of-service',
        description: 'Terms and conditions'
      },
      {
        id: 'privacy',
        label: 'Privacy Policy',
        labelBn: 'গোপনীয়তা নীতি',
        path: '/privacy-policy',
        description: 'Privacy and data protection'
      }
    ]
  }
];

// Quick access items for mobile navigation
export const quickAccessItems: NavigationItem[] = [
  {
    id: 'cart',
    label: 'Cart',
    labelBn: 'কার্ট',
    path: '/shop/cart',
    icon: <ShoppingCart className="w-4 h-4" />
  },
  {
    id: 'search',
    label: 'Search',
    labelBn: 'খুঁজুন',
    path: '/search',
    icon: <Search className="w-4 h-4" />
  },
  {
    id: 'voice-search',
    label: 'Voice Search',
    labelBn: 'ভয়েস সার্চ',
    path: '/voice-search',
    icon: <Mic className="w-4 h-4" />
  },
  {
    id: 'image-search',
    label: 'Image Search',
    labelBn: 'ছবি দিয়ে খুঁজুন',
    path: '/image-search',
    icon: <Camera className="w-4 h-4" />
  }
];

// Footer navigation links
export const footerNavigation = {
  customer: {
    title: 'Customer Service',
    titleBn: 'গ্রাহক সেবা',
    items: [
      { label: 'Help Center', labelBn: 'সাহায্য কেন্দ্র', path: '/support/help-center' },
      { label: 'Contact Us', labelBn: 'যোগাযোগ', path: '/contact' },
      { label: 'Track Order', labelBn: 'অর্ডার ট্র্যাক', path: '/order/track-order' },
      { label: 'Returns', labelBn: 'ফেরত', path: '/returns-refunds' },
      { label: 'Warranty', labelBn: 'ওয়ারেন্টি', path: '/warranty' }
    ]
  },
  business: {
    title: 'For Business',
    titleBn: 'ব্যবসার জন্য',
    items: [
      { label: 'Become a Vendor', labelBn: 'বিক্রেতা হন', path: '/vendor-register' },
      { label: 'Bulk Orders', labelBn: 'বাল্ক অর্ডার', path: '/bulk-orders' },
      { label: 'Corporate Sales', labelBn: 'কর্পোরেট সেল', path: '/corporate' },
      { label: 'API Integration', labelBn: 'API ইন্টিগ্রেশন', path: '/api' }
    ]
  },
  company: {
    title: 'Company',
    titleBn: 'কোম্পানি',
    items: [
      { label: 'About Us', labelBn: 'আমাদের সম্পর্কে', path: '/about-us' },
      { label: 'Careers', labelBn: 'ক্যারিয়ার', path: '/careers' },
      { label: 'Blog', labelBn: 'ব্লগ', path: '/blog' },
      { label: 'Press', labelBn: 'প্রেস', path: '/press' },
      { label: 'Investors', labelBn: 'বিনিয়োগকারী', path: '/investors' }
    ]
  },
  legal: {
    title: 'Legal',
    titleBn: 'আইনি',
    items: [
      { label: 'Terms of Service', labelBn: 'সেবার শর্তাবলী', path: '/terms-of-service' },
      { label: 'Privacy Policy', labelBn: 'গোপনীয়তা নীতি', path: '/privacy-policy' },
      { label: 'Cookie Policy', labelBn: 'কুকি নীতি', path: '/cookie-policy' },
      { label: 'Accessibility', labelBn: 'অ্যাক্সেসিবিলিটি', path: '/accessibility' }
    ]
  }
};