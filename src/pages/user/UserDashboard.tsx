import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, Shield, Bell, Globe, Moon, Sun, 
  Smartphone, Mail, Lock, Eye, Activity,
  CreditCard, MapPin, Languages, Palette
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/homepage/Header';
import { Footer } from '@/components/homepage/Footer';

// Mock data - replace with real API calls
const mockUserData = {
  profile: {
    name: 'Ahmed Rahman',
    email: 'ahmed.rahman@email.com',
    phone: '+880 1234 567890',
    joinDate: '2023-01-15',
    verified: true,
    avatar: null
  },
  preferences: {
    language: 'en',
    currency: 'BDT',
    theme: 'light',
    notifications: {
      email: true,
      sms: true,
      push: true,
      marketing: false
    }
  },
  security: {
    twoFactor: false,
    lastLogin: '2024-01-15T10:30:00Z',
    activeDevices: 3,
    loginHistory: [
      { device: 'Chrome on Windows', location: 'Dhaka, Bangladesh', time: '2024-01-15T10:30:00Z' },
      { device: 'Mobile App on Android', location: 'Dhaka, Bangladesh', time: '2024-01-14T18:45:00Z' },
      { device: 'Safari on iPhone', location: 'Chittagong, Bangladesh', time: '2024-01-13T09:15:00Z' }
    ]
  },
  activity: {
    totalVisits: 127,
    lastVisit: '2024-01-15T10:30:00Z',
    favoriteCategories: ['Electronics', 'Fashion', 'Books'],
    recentSearches: ['wireless headphones', 'smart watch', 'laptop bag']
  }
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState(mockUserData.preferences.theme);
  const [notifications, setNotifications] = useState(mockUserData.preferences.notifications);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SettingCard = ({ title, description, children }: any) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
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
                {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600 flex items-center">
                {mockUserData.profile.verified && (
                  <>
                    <Shield className="h-4 w-4 text-green-500 mr-1" />
                    Verified Account
                  </>
                )}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            Member since {new Date(mockUserData.profile.joinDate).getFullYear()}
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      defaultValue={mockUserData.profile.name}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      defaultValue={mockUserData.profile.email}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      defaultValue={mockUserData.profile.phone}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Member Since</Label>
                    <Input 
                      id="joinDate" 
                      defaultValue={formatDate(mockUserData.profile.joinDate)}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Preferences
                </CardTitle>
                <CardDescription>
                  Manage how we communicate with you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <SettingCard
                    title="Email Notifications"
                    description="Receive updates via email"
                  >
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, email: checked})
                      }
                    />
                  </SettingCard>
                  <SettingCard
                    title="SMS Notifications"
                    description="Receive important updates via SMS"
                  >
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, sms: checked})
                      }
                    />
                  </SettingCard>
                  <SettingCard
                    title="Push Notifications"
                    description="Receive notifications on your devices"
                  >
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, push: checked})
                      }
                    />
                  </SettingCard>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <SettingCard
                    title="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                  >
                    <Switch 
                      checked={mockUserData.security.twoFactor}
                      onCheckedChange={() => {}}
                    />
                  </SettingCard>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center space-x-3">
                        <Lock className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Change Password</h4>
                          <p className="text-sm text-gray-600">Update your account password</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-3">
                        Change Password
                      </Button>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-medium">Active Devices</h4>
                          <p className="text-sm text-gray-600">{mockUserData.security.activeDevices} devices</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-3">
                        Manage Devices
                      </Button>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Login History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Login Activity</CardTitle>
                <CardDescription>Your recent account access history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.security.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{login.device}</p>
                          <p className="text-sm text-gray-600">{login.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatDate(login.time)}</p>
                        {index === 0 && <Badge variant="secondary">Current</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Display Preferences
                </CardTitle>
                <CardDescription>
                  Customize your app appearance and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <SettingCard
                    title="Dark Mode"
                    description="Switch between light and dark themes"
                  >
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <Switch 
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                      />
                      <Moon className="h-4 w-4" />
                    </div>
                  </SettingCard>

                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Languages className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">Language</h4>
                      </div>
                      <select className="w-full p-2 border rounded-md" defaultValue="en">
                        <option value="en">English</option>
                        <option value="bn">বাংলা (Bangla)</option>
                        <option value="hi">हिंदी (Hindi)</option>
                      </select>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium">Currency</h4>
                      </div>
                      <select className="w-full p-2 border rounded-md" defaultValue="BDT">
                        <option value="BDT">BDT (৳)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Account Activity
                </CardTitle>
                <CardDescription>
                  Overview of your account usage and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-4 text-center">
                    <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-bold text-2xl">{mockUserData.activity.totalVisits}</h4>
                    <p className="text-sm text-gray-600">Total Visits</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-bold text-2xl">{mockUserData.activity.favoriteCategories.length}</h4>
                    <p className="text-sm text-gray-600">Favorite Categories</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-bold text-2xl">{mockUserData.activity.recentSearches.length}</h4>
                    <p className="text-sm text-gray-600">Recent Searches</p>
                  </Card>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Favorite Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {mockUserData.activity.favoriteCategories.map((category, index) => (
                        <Badge key={index} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recent Searches</h4>
                    <div className="flex flex-wrap gap-2">
                      {mockUserData.activity.recentSearches.map((search, index) => (
                        <Badge key={index} variant="outline">{search}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control your privacy and data sharing preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <SettingCard
                    title="Marketing Communications"
                    description="Receive promotional emails and offers"
                  >
                    <Switch 
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, marketing: checked})
                      }
                    />
                  </SettingCard>
                  
                  <SettingCard
                    title="Data Analytics"
                    description="Help improve our service by sharing usage data"
                  >
                    <Switch defaultChecked />
                  </SettingCard>
                  
                  <SettingCard
                    title="Personalized Recommendations"
                    description="Show products based on your browsing history"
                  >
                    <Switch defaultChecked />
                  </SettingCard>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3 text-red-600">Data Management</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full">
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full text-red-600 border-red-200">
                        Request Account Deletion
                      </Button>
                    </div>
                  </div>
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

export default UserDashboard;