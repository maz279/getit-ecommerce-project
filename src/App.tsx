import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";

// Lazy load components for better performance
const Categories = lazy(() => import("./pages/Categories"));
const WomensClothing = lazy(() => import("./pages/WomensClothing"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const NewArrivals = lazy(() => import("./pages/NewArrivals"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const BulkOrders = lazy(() => import("./pages/BulkOrders"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const VendorCenter = lazy(() => import("./pages/VendorCenter"));
const VendorRegister = lazy(() => import("./pages/VendorRegister"));
const FlashSale = lazy(() => import("./pages/FlashSale"));
const DailyDeals = lazy(() => import("./pages/DailyDeals"));
const GiftCards = lazy(() => import("./pages/GiftCards"));
const MegaSale = lazy(() => import("./pages/MegaSale"));
const GroupBuy = lazy(() => import("./pages/GroupBuy"));
const Premium = lazy(() => import("./pages/Premium"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const PaymentMethods = lazy(() => import("./pages/PaymentMethods"));
const Orders = lazy(() => import("./pages/Orders"));
const Settings = lazy(() => import("./pages/Settings"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/fashion/womens-fashion" element={<WomensClothing />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/bulk-orders" element={<BulkOrders />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/seller-center" element={<VendorCenter />} />
                <Route path="/vendor/register" element={<VendorRegister />} />
                <Route path="/flash-sale" element={<FlashSale />} />
                <Route path="/daily-deals" element={<DailyDeals />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/mega-sale" element={<MegaSale />} />
                <Route path="/group-buy" element={<GroupBuy />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
