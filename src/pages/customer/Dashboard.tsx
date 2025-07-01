import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ShoppingBag, Heart, MapPin, CreditCard, Gift, 
  Star, Package, Truck, Clock, Bell, Settings,
  TrendingUp, Eye, ThumbsUp, MessageCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';

// Mock data - replace with real API calls
const mockCustomerData = {
  profile: {
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@email.com',
    phone: '+880 1234 567890',
    joinDate: '2023-01-15',
    totalOrders: 45,
    totalSpent: 234500,
    loyaltyPoints: 2450,
    membershipLevel: 'Gold'
  },
  recentOrders: [
    { 
      id: '1', 
      date: '2024-01-15', 
      vendor: 'TechHub BD', 
      items: 2, 
      total: 15500, 
      status: 'delivered',
      product: 'Wireless Headphones + Phone Case'
    },
    { 
      id: '2', 
      date: '2024-01-10', 
      vendor: 'Fashion World', 
      items: 1, 
      total: 3200, 
      status: 'shipped',
      product: 'Cotton T-Shirt'
    },
    { 
      id: '3', 
      date: '2024-01-05', 
      vendor: 'Home Essentials', 
      items: 3, 
      total: 8900, 
      status: 'processing',
      product: 'Kitchen Utensils Set'
    }
  ],
  wishlist: [
    { id: '1', name: 'Smart Watch Pro', price: 25000, vendor: 'TechHub BD', image: '/api/placeholder/100/100' },
    { id: '2', name: 'Wireless Earbuds', price: 8500, vendor: 'Audio World', image: '/api/placeholder/100/100' },
    { id: '3', name: 'Bluetooth Speaker', price: 12000, vendor: 'Sound Zone', image: '/api/placeholder/100/100' }
  ],
  recommendations: [
    { id: '1', name: 'Gaming Mouse', price: 4500, rating: 4.8, image: '/api/placeholder/100/100' },
    { id: '2', name: 'USB-C Cable', price: 800, rating: 4.6, image: '/api/placeholder/100/100' },
    { id: '3', name: 'Phone Stand', price: 1200, rating: 4.7, image: '/api/placeholder/100/100' }
  ],
  addresses: [
    { 
      id: '1', 
      label: 'Home', 
      address: 'House 45, Road 12, Dhanmondi, Dhaka-1205', 
      isDefault: true 
    },
    { 
      id: '2', 
      label: 'Office', 
      address: 'Level 8, Building A, Gulshan-2, Dhaka-1212', 
      isDefault: false 
    }
  ],
  loyaltyProgram: {
    currentTier: 'Gold',
    currentPoints: 2450,
    nextTier: 'Platinum',
    pointsToNext: 550,
    benefits: ['Free shipping on orders over ৳1000', '5% cashback', 'Priority support']
  }
};

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'text-blue-600' }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
              <AvatarFallback className="text-lg">
                {user?.full_name?.split(' ').map(n => n[0]).join('') || 'CU'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name || 'Customer'}</h1>
              <p className="text-gray-600 flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                {mockCustomerData.profile.membershipLevel} Member since {new Date(mockCustomerData.profile.joinDate).getFullYear()}
              </p>
            </div>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Orders"
                value={mockCustomerData.profile.totalOrders}
                subtitle="lifetime orders"
                icon={ShoppingBag}
                color="text-blue-600"
              />
              <StatCard
                title="Total Spent"
                value={formatCurrency(mockCustomerData.profile.totalSpent)}
                subtitle="lifetime spending"
                icon={CreditCard}
                color="text-green-600"
              />
              <StatCard
                title="Loyalty Points"
                value={mockCustomerData.profile.loyaltyPoints.toLocaleString()}
                subtitle={`${mockCustomerData.loyaltyProgram.pointsToNext} to ${mockCustomerData.loyaltyProgram.nextTier}`}
                icon={Gift}
                color="text-purple-600"
              />
              <StatCard
                title="Wishlist Items"
                value={mockCustomerData.wishlist.length}
                subtitle="saved for later"
                icon={Heart}
                color="text-red-600"
              />
            </div>

            {/* Loyalty Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2 text-purple-600" />
                  Loyalty Program
                </CardTitle>
                <CardDescription>
                  You're a {mockCustomerData.loyaltyProgram.currentTier} member
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Progress to {mockCustomerData.loyaltyProgram.nextTier}</span>
                      <span className="text-sm text-gray-600">
                        {mockCustomerData.loyaltyProgram.currentPoints} / {mockCustomerData.loyaltyProgram.currentPoints + mockCustomerData.loyaltyProgram.pointsToNext} points
                      </span>
                    </div>
                    <Progress value={82} className="h-3" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockCustomerData.loyaltyProgram.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                        <ThumbsUp className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCustomerData.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{order.product}</span>
                            <span className="text-sm text-gray-600">{order.vendor} • {order.date}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="font-bold">{formatCurrency(order.total)}</span>
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'shipped' ? 'secondary' : 'outline'
                          }>
                            {order.status === 'delivered' && <Package className="h-3 w-3 mr-1" />}
                            {order.status === 'shipped' && <Truck className="h-3 w-3 mr-1" />}
                            {order.status === 'processing' && <Clock className="h-3 w-3 mr-1" />}
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Orders
                  </Button>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>Based on your shopping history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockCustomerData.recommendations.map((product) => (
                      <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-green-600">{formatCurrency(product.price)}</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Track and manage all your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Order Management</h3>
                  <p className="text-gray-600">View order details, track shipments, and manage returns</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>Items you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockCustomerData.wishlist.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-32 rounded object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.vendor}</p>
                        <p className="font-bold text-green-600">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">Add to Cart</Button>
                        <Button size="sm" variant="outline">Remove</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Addresses</CardTitle>
                <CardDescription>Manage your shipping addresses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCustomerData.addresses.map((address) => (
                    <div key={address.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{address.label}</span>
                            {address.isDefault && <Badge variant="secondary">Default</Badge>}
                          </div>
                          <p className="text-gray-600">{address.address}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Add New Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program Details</CardTitle>
                <CardDescription>Earn points and unlock exclusive benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Gift className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Loyalty Rewards</h3>
                  <p className="text-gray-600">Detailed loyalty program information and rewards history</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Management</h3>
                  <p className="text-gray-600">Update personal information, security settings, and preferences</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;