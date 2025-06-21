
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import VendorDashboard from "./pages/vendor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import VendorRegister from "./pages/VendorRegister";
import TrackOrder from "./pages/TrackOrder";
import HelpCenter from "./pages/HelpCenter";
import Wishlist from "./pages/Wishlist";
import MyAccount from "./pages/MyAccount";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/vendor/register" element={<VendorRegister />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/account" element={<MyAccount />} />
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              {/* Protected Vendor Routes */}
              <Route 
                path="/vendor/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <VendorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
