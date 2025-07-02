
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";

// Common pages
const NotFound = lazy(() => import("./pages/common/NotFound"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));

// Authentication pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

// Shop pages
const Categories = lazy(() => import("./pages/Categories"));
const WomensClothing = lazy(() => import("./pages/WomensClothing"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const NewArrivals = lazy(() => import("./pages/NewArrivals"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const BulkOrders = lazy(() => import("./pages/BulkOrders"));
const BulkOrderRequest = lazy(() => import("./pages/BulkOrderRequest"));
const Cart = lazy(() => import("./pages/shop/Cart"));
const GiftCards = lazy(() => import("./pages/shop/GiftCards"));
const GroupBuy = lazy(() => import("./pages/shop/GroupBuy"));
const Premium = lazy(() => import("./pages/shop/Premium"));

// Promotions pages
const FlashSale = lazy(() => import("./pages/promotions/FlashSale"));
const DailyDeals = lazy(() => import("./pages/promotions/DailyDeals"));
const MegaSale = lazy(() => import("./pages/promotions/MegaSale"));

// Account pages
const MyAccount = lazy(() => import("./pages/account/MyAccount"));
const Orders = lazy(() => import("./pages/account/Orders"));
const Settings = lazy(() => import("./pages/account/Settings"));
const PaymentMethods = lazy(() => import("./pages/account/PaymentMethods"));
const PaymentDemo = lazy(() => import("./pages/PaymentDemo"));

// Logistics and Management Components
const FulfillmentDashboard = lazy(() => import("./components/logistics/FulfillmentDashboard"));
const InventoryDashboard = lazy(() => import("./components/inventory/InventoryDashboard"));
const PaymentGatewayManager = lazy(() => import("./components/payment/PaymentGatewayManager"));
const EnhancedProductSearch = lazy(() => import("./components/search/EnhancedProductSearch"));
const ProductComparison = lazy(() => import("./components/products/ProductComparison"));
const EnhancedWishlist = lazy(() => import("./components/wishlist/EnhancedWishlist"));

// Customer Dashboard
const CustomerDashboard = lazy(() => import("./pages/customer/Dashboard"));

// User Dashboard  
const UserDashboard = lazy(() => import("./pages/user/UserDashboard"));

// Order pages
const OrderTracking = lazy(() => import("./pages/order/OrderTracking"));
const TrackOrder = lazy(() => import("./pages/order/TrackOrder"));
const Checkout = lazy(() => import("./pages/Checkout"));

// Support pages
const HelpCenter = lazy(() => import("./pages/support/HelpCenter"));

// Vendor pages
const VendorCenter = lazy(() => import("./pages/VendorCenter"));
const VendorRegister = lazy(() => import("./pages/VendorRegister"));
const VendorDashboard = lazy(() => import("./pages/vendor/Dashboard"));
const VendorDashboardNew = lazy(() => import("./pages/vendor/VendorDashboard"));
const LiveChat = lazy(() => import("./pages/LiveChat"));

// Company pages
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const Careers = lazy(() => import("./pages/Careers"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

// Search and Notifications pages
const SearchPage = lazy(() => import("./pages/SearchPage").then(module => ({ default: module.SearchPage })));
const NotificationsPage = lazy(() => import("./pages/SearchPage").then(module => ({ default: module.NotificationsPage })));

// Additional existing pages
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const DeliveryInfo = lazy(() => import("./pages/DeliveryInfo"));
const MobileBanking = lazy(() => import("./pages/MobileBanking"));
const NewUserOffer = lazy(() => import("./pages/NewUserOffer"));
const FestivalSales = lazy(() => import("./pages/FestivalSales"));
const EidSale = lazy(() => import("./pages/EidSale"));
const Offers = lazy(() => import("./pages/Offers"));
const Recommendations = lazy(() => import("./pages/Recommendations"));

// New missing pages
const StoreLocatorPage = lazy(() => import("./pages/StoreLocator"));
const MobileAppPage = lazy(() => import("./pages/MobileApp"));
const ReviewsPage = lazy(() => import("./pages/Reviews"));

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
                {/* Home */}
                <Route path="/" element={<Index />} />
                
                {/* Authentication */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                
                {/* Shop */}
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/fashion/womens-fashion" element={<WomensClothing />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/bulk-orders" element={<BulkOrders />} />
                <Route path="/bulk-order" element={<BulkOrderRequest />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/group-buy" element={<GroupBuy />} />
                <Route path="/premium" element={<Premium />} />
                
                {/* Promotions */}
                <Route path="/flash-sale" element={<FlashSale />} />
                <Route path="/daily-deals" element={<DailyDeals />} />
                <Route path="/mega-sale" element={<MegaSale />} />
                
                {/* Account */}
                <Route path="/account" element={<MyAccount />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                
                {/* Search and Notifications */}
                <Route path="/search" element={<SearchPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                
                {/* Orders */}
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/checkout/:orderId" element={<Checkout />} />
                
                {/* Support */}
                <Route path="/help" element={<HelpCenter />} />
                
                {/* Vendor */}
                <Route path="/seller-center" element={<VendorCenter />} />
                 <Route path="/live-chat" element={<LiveChat />} />
                 <Route path="/payment-demo" element={<PaymentDemo />} />
                 <Route path="/fulfillment-dashboard" element={<FulfillmentDashboard />} />
                 <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
                 <Route path="/payment-gateway-manager" element={<PaymentGatewayManager />} />
                 <Route path="/enhanced-search" element={<EnhancedProductSearch />} />
                 <Route path="/compare" element={<ProductComparison />} />
                 <Route path="/enhanced-wishlist" element={<EnhancedWishlist />} />
                <Route path="/vendor/register" element={<VendorRegister />} />
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/dashboard-new" element={<VendorDashboardNew />} />
                
                {/* Company */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/returns-refunds" element={<ReturnsRefunds />} />
                <Route path="/delivery-info" element={<DeliveryInfo />} />
                <Route path="/mobile-banking" element={<MobileBanking />} />
                <Route path="/new-user-offer" element={<NewUserOffer />} />
                <Route path="/festival-sales" element={<FestivalSales />} />
                <Route path="/eid-sale" element={<EidSale />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/recommendations" element={<Recommendations />} />
                
                {/* New missing pages */}
                <Route path="/store-locator" element={<StoreLocatorPage />} />
                <Route path="/mobile-app" element={<MobileAppPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                
                {/* Customer & User Dashboard Routes */}
                <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />

                {/* Admin */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
