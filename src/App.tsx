import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/sonner';

// Import existing pages
import { Homepage } from '@/pages/Homepage';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { Orders } from '@/pages/Orders';
import { Wishlist } from '@/pages/Wishlist';
import { Categories } from '@/pages/Categories';
import { Vendors } from '@/pages/Vendors';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Help } from '@/pages/Help';
import { Privacy } from '@/pages/Privacy';
import { Terms } from '@/pages/Terms';
import { NotFound } from '@/pages/NotFound';

// Import new pages
import { ProductDetail } from '@/pages/ProductDetail';
import { SearchResults } from '@/pages/SearchResults';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* New search-related routes */}
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/vendor/:id" element={<div>Vendor Page - Coming Soon</div>} />
                <Route path="/brands/:brand" element={<div>Brand Page - Coming Soon</div>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
