import React, { useState } from 'react';
import { Header } from '../components/homepage/Header';
import { Footer } from '../components/homepage/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  User, 
  Search, 
  Tag, 
  TrendingUp,
  Zap,
  Package,
  Users,
  Globe,
  ArrowRight,
  Clock
} from 'lucide-react';

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const blogPosts = [
    {
      id: 1,
      title: 'The Future of E-commerce in Bangladesh: Trends to Watch in 2025',
      excerpt: 'Discover the emerging trends shaping the e-commerce landscape in Bangladesh, from mobile commerce to AI-powered shopping experiences.',
      author: 'GetIt Editorial Team',
      date: '2025-01-15',
      readTime: '5 min read',
      category: 'Industry Insights',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
      tags: ['E-commerce', 'Bangladesh', 'Trends', 'Mobile Shopping']
    },
    {
      id: 2,
      title: 'How to Start Your Online Business in Bangladesh: A Complete Guide',
      excerpt: 'Everything you need to know about starting an online business in Bangladesh, from registration to finding your first customers.',
      author: 'Business Development Team',
      date: '2025-01-12',
      readTime: '8 min read',
      category: 'Business Tips',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      tags: ['Business', 'Startup', 'Online Selling', 'Guide']
    },
    {
      id: 3,
      title: 'Top 10 Products to Sell Online in Bangladesh This Year',
      excerpt: 'Explore the most profitable product categories for online sellers in Bangladesh based on market demand and competition analysis.',
      author: 'Market Research Team',
      date: '2025-01-10',
      readTime: '6 min read',
      category: 'Market Analysis',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
      tags: ['Products', 'Market Research', 'Selling Tips']
    },
    {
      id: 4,
      title: 'Digital Payment Revolution: How Mobile Banking is Changing Shopping',
      excerpt: 'Understand how bKash, Nagad, and other mobile payment solutions are transforming the way Bangladeshis shop online.',
      author: 'FinTech Analyst',
      date: '2025-01-08',
      readTime: '4 min read',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
      tags: ['Mobile Payment', 'bKash', 'FinTech', 'Digital Bangladesh']
    },
    {
      id: 5,
      title: 'Sustainable Shopping: Eco-Friendly Products Gaining Popularity',
      excerpt: 'Learn about the growing demand for sustainable and eco-friendly products among Bangladeshi consumers.',
      author: 'Sustainability Team',
      date: '2025-01-05',
      readTime: '7 min read',
      category: 'Sustainability',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
      tags: ['Sustainability', 'Eco-Friendly', 'Green Shopping']
    },
    {
      id: 6,
      title: 'Festival Shopping in Bangladesh: Seasonal Marketing Strategies',
      excerpt: 'Discover how to leverage Eid, Durga Puja, and other festivals to boost your online sales throughout the year.',
      author: 'Marketing Team',
      date: '2025-01-03',
      readTime: '5 min read',
      category: 'Marketing',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop',
      tags: ['Festival Marketing', 'Seasonal Sales', 'Cultural Commerce']
    }
  ];

  const categories = [
    'All',
    'Industry Insights',
    'Business Tips',
    'Market Analysis',
    'Technology',
    'Marketing',
    'Sustainability'
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  const filteredPosts = regularPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">GetIt Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest insights, trends, and tips for e-commerce success in Bangladesh
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        <Card className="mb-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-video lg:aspect-auto">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {featuredPost.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(featuredPost.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {featuredPost.readTime}
                </div>
              </div>
              <Button className="w-fit">
                Read Full Article
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <Badge className="mb-3">{post.category}</Badge>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Stay Updated with GetIt Blog
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest e-commerce insights, 
              business tips, and market trends delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Overview */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Industry Insights</h4>
              <p className="text-sm text-gray-600">Market trends & analysis</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Business Tips</h4>
              <p className="text-sm text-gray-600">Grow your online business</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Product Guides</h4>
              <p className="text-sm text-gray-600">Best selling products</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Technology</h4>
              <p className="text-sm text-gray-600">Tech innovations & tools</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;