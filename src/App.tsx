
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
import VerifyEmail from "./pages/auth/VerifyEmail";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import VendorDashboard from "./pages/vendor/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import VendorRegister from "./pages/VendorRegister";
import TrackOrder from "./pages/TrackOrder";
import HelpCenter from "./pages/HelpCenter";
import Wishlist from "./pages/Wishlist";
import MyAccount from "./pages/MyAccount";
import EidSale from "./pages/EidSale";
import NewUserOffer from "./pages/NewUserOffer";
import MobileBanking from "./pages/MobileBanking";
import PaymentMethods from "./pages/PaymentMethods";
import Offers from "./pages/Offers";
import FlashSale from "./pages/FlashSale";
import DailyDeals from "./pages/DailyDeals";
import Recommendations from "./pages/Recommendations";

// New Quick Access Pages
import GiftCards from "./pages/GiftCards";
import MegaSale from "./pages/MegaSale";
import GroupBuy from "./pages/GroupBuy";
import Premium from "./pages/Premium";

// New Footer Navigation Pages
import OrderTracking from "./pages/OrderTracking";
import ReturnsRefunds from "./pages/ReturnsRefunds";
import DeliveryInfo from "./pages/DeliveryInfo";
import SellerCenter from "./pages/SellerCenter";
import AboutUs from "./pages/AboutUs";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

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
              
              {/* Quick Access Routes */}
              <Route path="/flash-sale" element={<FlashSale />} />
              <Route path="/daily-deals" element={<DailyDeals />} />
              <Route path="/gift-cards" element={<GiftCards />} />
              <Route path="/mega-sale" element={<MegaSale />} />
              <Route path="/group-buy" element={<GroupBuy />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/best-sellers" element={<Products />} />
              <Route path="/new-arrivals" element={<Products />} />
              <Route path="/free-delivery" element={<DeliveryInfo />} />
              <Route path="/bulk-orders" element={<Products />} />
              
              {/* Customer Service Routes */}
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/returns-refunds" element={<ReturnsRefunds />} />
              
              {/* Delivery & Logistics Routes */}
              <Route path="/delivery-info" element={<DeliveryInfo />} />
              
              {/* Vendor Routes */}
              <Route path="/seller-center" element={<SellerCenter />} />
              
              {/* Company & Legal Routes */}
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              
              {/* New Hero Section Routes */}
              <Route path="/eid-sale" element={<EidSale />} />
              <Route path="/new-user-offer" element={<NewUserOffer />} />
              <Route path="/mobile-banking" element={<MobileBanking />} />
              <Route path="/payment-methods" element={<PaymentMethods />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/recommendations" element={<Recommendations />} />
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/verify-email" element={<VerifyEmail />} />
              
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
