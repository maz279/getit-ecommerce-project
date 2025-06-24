
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

// Lazy load components for better performance
const Categories = lazy(() => import("./pages/Categories"));
const WomensClothing = lazy(() => import("./pages/WomensClothing"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const NewArrivals = lazy(() => import("./pages/NewArrivals"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const BulkOrders = lazy(() => import("./pages/BulkOrders"));
const About = lazy(() => import("./pages/About"));
const VendorCenter = lazy(() => import("./pages/VendorCenter"));
const FlashSale = lazy(() => import("./pages/FlashSale"));
const DailyDeals = lazy(() => import("./pages/DailyDeals"));
const GiftCards = lazy(() => import("./pages/GiftCards"));
const MegaSale = lazy(() => import("./pages/MegaSale"));
const GroupBuy = lazy(() => import("./pages/GroupBuy"));
const Premium = lazy(() => import("./pages/Premium"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const PaymentMethods = lazy(() => import("./pages/PaymentMethods"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
            <Route path="/about" element={<About />} />
            <Route path="/seller-center" element={<VendorCenter />} />
            <Route path="/flash-sale" element={<FlashSale />} />
            <Route path="/daily-deals" element={<DailyDeals />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/mega-sale" element={<MegaSale />} />
            <Route path="/group-buy" element={<GroupBuy />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
