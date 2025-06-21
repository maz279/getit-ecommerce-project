
import React from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { 
  Users, Award, Globe, TrendingUp, Heart, Shield, Zap, Target,
  CheckCircle, Smartphone, CreditCard, Truck, MessageSquare,
  BarChart3, Search, Star, ShoppingBag, MapPin, Server, Code,
  Cloud, Lock, Handshake, Rocket, Brain, Eye
} from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About GetIt</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Bangladesh's premier multi-vendor ecommerce platform, revolutionizing the way millions of Bangladeshis shop, sell, and connect online.
          </p>
        </div>

        {/* Company Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Company Overview</h2>
          <div className="bg-gray-50 p-8 rounded-lg space-y-4">
            <p className="text-gray-700 leading-relaxed">
              GetIt is Bangladesh's premier multi-vendor ecommerce platform, revolutionizing the way millions of Bangladeshis shop, sell, and connect online. Much like how Amazon transformed commerce in North America and Shopee reshaped Southeast Asian ecommerce, GetIt is establishing itself as the definitive digital marketplace for Bangladesh, serving as the bridge between local vendors and customers nationwide.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Founded with the vision of democratizing commerce in Bangladesh, GetIt operates as a comprehensive digital ecosystem where thousands of vendors can showcase their products to millions of customers across the country. Our platform combines cutting-edge technology with deep local market understanding to deliver an unparalleled online shopping experience that caters specifically to Bangladeshi consumers and businesses.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-50 p-8 rounded-lg">
            <Target className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-semibold">
              "To establish GetIt as Bangladesh's leading multi-vendor ecommerce platform, empowering local vendors while providing exceptional shopping experiences that build trust, drive growth, and foster a thriving digital commerce ecosystem."
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              At GetIt, we believe that every vendor, from small local businesses to established enterprises, deserves access to the digital marketplace. We are committed to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span><strong>Democratizing Commerce:</strong> Making online selling accessible to vendors of all sizes</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span><strong>Enhancing Customer Experience:</strong> Providing seamless, secure, and convenient shopping experiences</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span><strong>Supporting Local Economy:</strong> Promoting Bangladeshi vendors and "Made in Bangladesh" products</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span><strong>Building Trust:</strong> Establishing a reliable, transparent, and secure marketplace</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span><strong>Driving Innovation:</strong> Continuously advancing ecommerce technology for the Bangladesh market</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-8 rounded-lg">
            <Globe className="w-12 h-12 text-green-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-semibold">
              "To become the undisputed leader in Bangladesh's digital commerce landscape, recognized as the most trusted, innovative, and customer-centric ecommerce platform in the region."
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">We envision a Bangladesh where:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Every business, regardless of size, can reach customers nationwide through digital channels</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Consumers enjoy world-class online shopping experiences with local relevance</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Digital commerce drives economic growth and creates opportunities for all</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Technology bridges the gap between urban and rural markets</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Trust and transparency define every transaction</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Market Position & Competitive Advantage */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Market Position & Competitive Advantage</h2>
          
          {/* Leading Market Share */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
              Leading Market Share
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              GetIt has established itself as Bangladesh's fastest-growing multi-vendor ecommerce platform, with ambitious goals to capture significant market share through:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Growth Targets</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 1,000+ active vendors within first operational year</li>
                  <li>• 50,000+ registered users through superior UX</li>
                  <li>• Nationwide reach including tier-2 and tier-3 cities</li>
                  <li>• 5% market share in Bangladesh's ecommerce sector</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Performance Metrics</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 99.9% uptime and scalability</li>
                  <li>• Sub-2-second page load times</li>
                  <li>• 500+ transactions per second capacity</li>
                  <li>• Cloud-native global deployment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Competitive Differentiators */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Competitive Differentiators</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <Code className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-3">Technology Excellence</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Modern microservices architecture</li>
                  <li>• Optimized for Bangladesh's infrastructure</li>
                  <li>• High-performance transaction handling</li>
                  <li>• Scalable cloud-native deployment</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <MapPin className="w-8 h-8 text-green-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-3">Local Market Expertise</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Deep consumer behavior understanding</li>
                  <li>• Cultural and seasonal integration</li>
                  <li>• Traditional measurement support</li>
                  <li>• Bangladesh-specific compliance</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <Handshake className="w-8 h-8 text-purple-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-3">Vendor-Centric Approach</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Success-aligned commission model</li>
                  <li>• Comprehensive support ecosystem</li>
                  <li>• Transparent dispute resolution</li>
                  <li>• Performance-based incentives</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center bg-blue-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <p className="text-gray-600">Registered Vendors</p>
          </div>
          <div className="text-center bg-green-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">5M+</div>
            <p className="text-gray-600">Products Listed</p>
          </div>
          <div className="text-center bg-purple-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">100K+</div>
            <p className="text-gray-600">Daily Orders</p>
          </div>
          <div className="text-center bg-orange-50 p-6 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">64</div>
            <p className="text-gray-600">Districts Covered</p>
          </div>
        </div>

        {/* What Makes GetIt Unique */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What Makes GetIt Unique</h2>
          
          {/* Built for Bangladesh */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-8 h-8 text-green-600 mr-3" />
              Built for Bangladesh, By Bangladesh
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Unlike international platforms that adapt to local markets, GetIt was conceived, designed, and built specifically for Bangladesh from the ground up. Every feature, every integration, and every user experience element reflects our deep understanding of Bangladeshi culture, preferences, and business practices.
            </p>
          </div>

          {/* Comprehensive Local Integration */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Comprehensive Local Integration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <CreditCard className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-3">Payment Solutions Tailored for Bangladesh</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete integration with bKash, Nagad, and Rocket</li>
                  <li>• Robust Cash on Delivery (COD) system</li>
                  <li>• Support for all major payment gateways</li>
                  <li>• Bangladesh Bank compliance</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <Truck className="w-8 h-8 text-green-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-3">Nationwide Delivery Network</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Partnerships with Pathao, Paperfly, Sundarban</li>
                  <li>• Same-day delivery in major cities</li>
                  <li>• Nationwide coverage (all 64 districts)</li>
                  <li>• Real-time tracking and updates</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <MessageSquare className="w-8 h-8 text-purple-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-3">Communication in Your Language</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Full Bengali language support</li>
                  <li>• SMS through SSL Wireless, Banglalink</li>
                  <li>• Customer support in Bengali & English</li>
                  <li>• Cultural calendar integration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Technology & Infrastructure */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Technology & Infrastructure</h2>
          
          {/* Cutting-Edge Architecture */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Server className="w-8 h-8 text-blue-600 mr-3" />
              Cutting-Edge Architecture
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <Smartphone className="w-8 h-8 text-green-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-3">Frontend Technologies</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• React.js-based responsive web app</li>
                  <li>• Progressive Web App (PWA) capabilities</li>
                  <li>• Native iOS and Android applications</li>
                  <li>• Tailwind CSS for modern design</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <Server className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-3">Backend Services</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Node.js and Go-based microservices</li>
                  <li>• PostgreSQL for data integrity</li>
                  <li>• MongoDB for content management</li>
                  <li>• Elasticsearch for search capabilities</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <Cloud className="w-8 h-8 text-purple-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-3">Infrastructure & DevOps</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Docker containerization</li>
                  <li>• Kubernetes orchestration</li>
                  <li>• CI/CD pipelines</li>
                  <li>• Multi-region cloud deployment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Advanced Technology Platform */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">12 Core Microservices</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              GetIt operates on a state-of-the-art microservices architecture comprising 12 core services, each optimized for specific business functions:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "User Service", desc: "Advanced authentication with local mobile number validation" },
                { name: "Vendor Service", desc: "KYC verification with Bangladesh-specific documents" },
                { name: "Product Service", desc: "Smart catalog management with Bengali search" },
                { name: "Order Service", desc: "Multi-vendor order coordination and tracking" },
                { name: "Payment Service", desc: "Comprehensive payment processing and fraud detection" },
                { name: "Shipping Service", desc: "Intelligent logistics management and coordination" },
                { name: "Notification Service", desc: "Multi-channel communication platform" },
                { name: "Search Service", desc: "AI-powered search with cultural optimization" },
                { name: "Analytics Service", desc: "Business intelligence and performance tracking" },
                { name: "Review Service", desc: "Community-driven ratings and feedback system" },
                { name: "Support Service", desc: "Integrated customer service platform" },
                { name: "Inventory Service", desc: "Real-time stock management across vendors" }
              ].map((service, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">{index + 1}. {service.name}</h4>
                  <p className="text-xs text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Security & Compliance</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg">
              <Lock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Data Protection</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>End-to-end encryption for all sensitive data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>GDPR compliance for international users</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Bangladesh-specific data protection compliance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Regular security audits and penetration testing</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-lg">
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Financial Security</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>PCI DSS compliance for payment processing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Advanced fraud detection using machine learning</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Secure API communication with tokenization</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Regular financial audits and compliance monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Capabilities */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Platform Capabilities & Scale</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Vendors */}
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingBag className="w-8 h-8 text-blue-600 mr-3" />
                For Vendors: Your Gateway to Success
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Simplified Onboarding:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Streamlined registration with Bangladesh KYC verification</li>
                    <li>• Trade License, TIN, and NID verification support</li>
                    <li>• Comprehensive vendor training programs</li>
                    <li>• Dedicated vendor success managers</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Powerful Management Tools:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Intuitive vendor dashboard for business oversight</li>
                    <li>• Bulk product upload capabilities</li>
                    <li>• Real-time inventory tracking and alerts</li>
                    <li>• Advanced analytics for performance insights</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Growth Support:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Marketing tools and promotional campaigns</li>
                    <li>• Performance-based vendor recognition</li>
                    <li>• Access to GetIt's marketing channels</li>
                    <li>• Digital marketing training programs</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* For Customers */}
            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="w-8 h-8 text-green-600 mr-3" />
                For Customers: Exceptional Shopping Experience
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Discovery Made Easy:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Advanced search with Bengali phonetic support</li>
                    <li>• AI-powered product recommendations</li>
                    <li>• Visual search capabilities</li>
                    <li>• Category-based browsing for local preferences</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Trust & Security:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Comprehensive vendor verification systems</li>
                    <li>• Secure payment processing with PCI DSS compliance</li>
                    <li>• Buyer protection and dispute resolution</li>
                    <li>• Transparent reviews from verified purchasers</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Convenience at Every Step:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Mobile-first design for Bangladesh's market</li>
                    <li>• One-click checkout and saved preferences</li>
                    <li>• Real-time order tracking with notifications</li>
                    <li>• Flexible delivery options and pickup points</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Commitment to Bangladesh */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Commitment to Bangladesh</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                Economic Impact
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Supporting Local Businesses:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Digital commerce tools for traditional businesses</li>
                    <li>• National market access for SMEs</li>
                    <li>• Employment in the digital sector</li>
                    <li>• "Made in Bangladesh" product promotion</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Digital Inclusion:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Accessible ecommerce for all vendors</li>
                    <li>• Training for digital transformation</li>
                    <li>• Urban-rural market bridge</li>
                    <li>• Financial inclusion through diverse payments</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Heart className="w-8 h-8 text-purple-600 mr-3" />
                Community Engagement
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Social Responsibility:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Supporting local artisans and craftspeople</li>
                    <li>• Promoting sustainable products</li>
                    <li>• Disaster relief and community development</li>
                    <li>• Digital literacy education programs</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Cultural Sensitivity:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Respecting local traditions in design</li>
                    <li>• Supporting festivals and cultural events</li>
                    <li>• Promoting local culture through vendors</li>
                    <li>• Maintaining culturally appropriate standards</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Vision & Growth Strategy */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Future Vision & Growth Strategy</h2>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Rocket className="w-8 h-8 text-blue-600 mr-3" />
              Expansion Plans
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Market Expansion</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Expansion to neighboring South Asian markets</li>
                  <li>• B2B marketplace capabilities</li>
                  <li>• GetIt Pay - integrated digital wallet</li>
                  <li>• GetIt Logistics - proprietary delivery network</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Technology Advancement</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Augmented reality (AR) for virtual trials</li>
                  <li>• Advanced AI for personalized experiences</li>
                  <li>• Voice commerce in Bengali</li>
                  <li>• Emerging technology integration</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Service Enhancement</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Subscription-based services</li>
                  <li>• Grocery and fresh food delivery</li>
                  <li>• GetIt Plus premium membership</li>
                  <li>• Social commerce features</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Innovation Roadmap */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              Innovation Roadmap
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3 text-blue-600">Next 12 Months</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Advanced seller analytics dashboard</li>
                    <li>• AI-powered customer service chatbot</li>
                  </ul>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Live streaming commerce features</li>
                    <li>• Same-day delivery expansion</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3 text-green-600">Next 2-3 Years</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Private label products program</li>
                    <li>• GetIt Business for B2B commerce</li>
                  </ul>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Cross-border trade facilitation</li>
                    <li>• Predictive inventory management</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3 text-purple-600">Long-term Vision (5+ Years)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Dominant ecommerce platform in Bangladesh</li>
                    <li>• Leading South Asian marketplace</li>
                  </ul>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Comprehensive fintech solutions</li>
                    <li>• Integrated digital commerce ecosystem</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Trust</h3>
              <p className="text-sm text-gray-600">Building lasting relationships through transparency and reliability</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">Continuously improving through technology and creative solutions</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Customer First</h3>
              <p className="text-sm text-gray-600">Putting our customers' needs at the center of everything we do</p>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Growth</h3>
              <p className="text-sm text-gray-600">Empowering businesses and individuals to reach their full potential</p>
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-gray-800 mb-1">Ahmed Rahman</h3>
              <p className="text-gray-600 text-sm mb-2">CEO & Co-Founder</p>
              <p className="text-xs text-gray-500">15+ years in e-commerce and technology</p>
            </div>
            
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-gray-800 mb-1">Fatima Khan</h3>
              <p className="text-gray-600 text-sm mb-2">CTO & Co-Founder</p>
              <p className="text-xs text-gray-500">Expert in scalable technology solutions</p>
            </div>
            
            <div className="text-center bg-gray-50 p-6 rounded-lg">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="font-semibold text-gray-800 mb-1">Karim Hassan</h3>
              <p className="text-gray-600 text-sm mb-2">COO</p>
              <p className="text-xs text-gray-500">Operations and logistics specialist</p>
            </div>
          </div>
        </div>

        {/* Join the GetIt Revolution */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Join the GetIt Revolution</h2>
          <p className="text-gray-700 text-center mb-8 text-lg">
            GetIt represents more than just an ecommerce platform - we are catalysts for Bangladesh's digital transformation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg text-center">
              <ShoppingBag className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-3">For Vendors</h3>
              <p className="text-sm text-gray-600">Ready to transform your business? Join thousands of successful vendors who have chosen GetIt as their digital commerce partner.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center">
              <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-3">For Customers</h3>
              <p className="text-sm text-gray-600">Experience the future of shopping in Bangladesh. Discover products from verified vendors while supporting local businesses.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center">
              <Handshake className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-3">For Partners</h3>
              <p className="text-sm text-gray-600">Be part of Bangladesh's ecommerce revolution. GetIt offers opportunities for strategic partnerships and investment.</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <Award className="w-8 h-8 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Best E-commerce Platform 2023</h3>
                <p className="text-sm text-gray-600">Recognized by Bangladesh Digital Commerce Association</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Users className="w-8 h-8 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">10 Million+ Happy Customers</h3>
                <p className="text-sm text-gray-600">Serving customers across Bangladesh since 2018</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <TrendingUp className="w-8 h-8 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">300% Growth in 2023</h3>
                <p className="text-sm text-gray-600">Fastest growing e-commerce platform in Bangladesh</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Shield className="w-8 h-8 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">99.9% Secure Transactions</h3>
                <p className="text-sm text-gray-600">Industry-leading security and fraud protection</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">GetIt - Where Bangladesh Shops, Sells, and Succeeds</h3>
            <p className="text-gray-600">Connecting vendors and customers, building trust, driving growth, and creating the future of ecommerce in Bangladesh.</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
