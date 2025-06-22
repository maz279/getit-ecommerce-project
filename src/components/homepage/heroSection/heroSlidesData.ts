
import { HeroSlide } from './types';

export const heroSlides: HeroSlide[] = [
  {
    bg: "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500",
    title: "Festival Sale - Eid Collection",
    subtitle: "Up to 70% off on traditional and modern Eid items",
    features: [
      "Traditional Clothing & Accessories",
      "Modern Electronics & Gadgets",
      "Home Décor & Furniture",
      "Special Gift Items",
      "Free Express Delivery"
    ],
    buttons: [
      { text: "Shop Eid Sale", link: "/eid-sale", primary: true },
      { text: "View All Offers", link: "/offers", primary: false }
    ],
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
  },
  {
    bg: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-500",
    title: "New User Special Offer",
    subtitle: "৳200 off on your first purchase - Welcome to the GetIt family!",
    features: [
      "৳200 instant discount",
      "Free delivery on first order",
      "Priority customer support",
      "Exclusive welcome deals",
      "Access to member-only sales"
    ],
    buttons: [
      { text: "Claim Offer", link: "/new-user-offer", primary: true },
      { text: "Sign Up Now", link: "/auth/register", primary: false }
    ],
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800"
  },
  {
    bg: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500",
    title: "Mobile Banking Bonus",
    subtitle: "Extra 5% cashback with bKash/Nagad payments",
    features: [
      "5% cashback on bKash payments",
      "5% cashback on Nagad payments", 
      "Instant payment processing",
      "Secure transaction guarantee",
      "No hidden charges"
    ],
    buttons: [
      { text: "Pay with bKash", link: "/mobile-banking", primary: true },
      { text: "Learn More", link: "/payment-methods", primary: false }
    ],
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800"
  },
  {
    bg: "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
    title: "AI-Powered Shopping Experience",
    subtitle: "Discover products tailored just for you",
    buttons: [
      { text: "Get Recommendations", link: "/recommendations", primary: true },
      { text: "Browse Categories", link: "/categories", primary: false }
    ],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
  },
  {
    bg: "bg-gradient-to-r from-green-500 via-teal-500 to-blue-500",
    title: "Flash Sale Extravaganza",
    subtitle: "Up to 80% off on trending items",
    buttons: [
      { text: "Shop Flash Sale", link: "/flash-sale", primary: true },
      { text: "View All Deals", link: "/offers", primary: false }
    ],
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
  },
  {
    bg: "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500",
    title: "Limited Time Mega Deals",
    subtitle: "Don't miss out on these exclusive offers",
    buttons: [
      { text: "Shop Mega Deals", link: "/offers", primary: true },
      { text: "View Products", link: "/products", primary: false }
    ],
    image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800"
  },
  {
    bg: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-500",
    title: "Premium Electronics Collection",
    subtitle: "Latest smartphones, laptops & gadgets",
    buttons: [
      { text: "Shop Electronics", link: "/products", primary: true },
      { text: "Browse Categories", link: "/categories", primary: false }
    ],
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800"
  },
  {
    bg: "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500",
    title: "Smart Home Revolution",
    subtitle: "Transform your home with AI technology",
    buttons: [
      { text: "Shop Smart Home", link: "/products", primary: true },
      { text: "Learn More", link: "/categories", primary: false }
    ],
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800"
  },
  {
    bg: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500",
    title: "Fashion Forward Collection",
    subtitle: "Trending styles for every season",
    buttons: [
      { text: "Shop Fashion", link: "/products", primary: true },
      { text: "View Trends", link: "/categories", primary: false }
    ],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
  }
];
