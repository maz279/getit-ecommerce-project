import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/homepage/Footer';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const StoreLocator: React.FC = () => {
  const stores = [
    {
      id: 1,
      name: 'GetIt Dhanmondi Store',
      address: 'House 15, Road 7, Dhanmondi, Dhaka 1205',
      phone: '+880-1700-123456',
      hours: '10:00 AM - 10:00 PM',
      services: ['Pickup Point', 'Customer Service', 'Returns & Exchange']
    },
    {
      id: 2,
      name: 'GetIt Gulshan Store',
      address: 'Plot 123, Road 11, Gulshan 1, Dhaka 1212',
      phone: '+880-1700-123457',
      hours: '9:00 AM - 11:00 PM',
      services: ['Pickup Point', 'Product Demo', 'Tech Support']
    },
    {
      id: 3,
      name: 'GetIt Uttara Store',
      address: 'House 45, Road 12, Sector 6, Uttara, Dhaka 1230',
      phone: '+880-1700-123458',
      hours: '10:00 AM - 9:00 PM',
      services: ['Pickup Point', 'Customer Service']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Store Locator</h1>
          <p className="text-muted-foreground text-center mb-6">Find GetIt stores and pickup points near you</p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your location or postal code" 
                className="flex-1"
              />
              <Button>
                <Navigation className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card key={store.id} className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{store.name}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{store.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{store.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{store.hours}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Services Available:</h4>
                  <div className="flex flex-wrap gap-1">
                    {store.services.map((service, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Get Directions
                  </Button>
                  <Button size="sm" className="flex-1">
                    Call Store
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find a store near you?</h2>
          <p className="text-muted-foreground mb-6">
            Don't worry! We offer free home delivery across Bangladesh for orders over ৳500.
          </p>
          <Button size="lg">
            Shop Online Now
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoreLocator;