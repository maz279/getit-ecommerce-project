
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/sonner';

// Import existing pages - using correct import syntax
import Index from '@/pages/Index'; // Homepage
import Login from '@/pages/auth/Login'; // Default export
import Register from '@/pages/auth/Register'; // Default export
import AdminDashboard from '@/pages/admin/Dashboard'; // Default export as AdminDashboard
import MyAccount from '@/pages/MyAccount'; // Profile page
import Wishlist from '@/pages/Wishlist';
import Categories from '@/pages/Categories';
import AboutUs from '@/pages/AboutUs';
import HelpCenter from '@/pages/HelpCenter';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import NotFound from '@/pages/NotFound';
import NewArrivals from '@/pages/NewArrivals';

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
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/profile" element={<MyAccount />} />
                <Route path="/cart" element={<div>Cart Page - Coming Soon</div>} />
                <Route path="/checkout" element={<div>Checkout Page - Coming Soon</div>} />
                <Route path="/orders" element={<div>Orders Page - Coming Soon</div>} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/vendors" element={<div>Vendors Page - Coming Soon</div>} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<div>Contact Page - Coming Soon</div>} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                
                {/* New search-related routes */}
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/vendor/:id" element={<div>Vendor Page - Coming Soon</div>} />
                <Route path="/brands/:brand" element={<div>Brand Page - Coming Soon</div>} />
                <Route path="/categories/:category" element={<div>Category Page - Coming Soon</div>} />
                
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
