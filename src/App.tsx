import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Toaster } from '@/components/ui/sonner';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Preloader } from '@/components/Preloader';
import { AdsController } from '@/components/ads/AdsController';

// Pages
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { UploadArtworkPage } from '@/pages/UploadArtworkPage';
import { DesignRequestPage } from '@/pages/DesignRequestPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { FAQPage } from '@/pages/FAQPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AccountPage } from '@/pages/AccountPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { BusinessCardPage } from '@/pages/BusinessCardPage';
import { PostcardsPage }     from '@/pages/PostcardsPage';
import { ClassicFlyersPage } from '@/pages/ClassicFlyersPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminOrders } from '@/pages/admin/AdminOrders';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminCustomers } from '@/pages/admin/AdminCustomers';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user has visited before in this session
    const hasVisited = sessionStorage.getItem('rayprint_visited');
    if (hasVisited) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('rayprint_visited', 'true');
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white text-[#0F172A]">
        {/* Preloader */}
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

        {/* Main Content */}
        <div
          className={`transition-opacity duration-500 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Navbar />
          <CartDrawer />

          <main>
            <AnimatePresence mode="sync">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:category" element={<CategoryPage />} />
                <Route path="/product/premium-business-cards" element={<BusinessCardPage />} />
                <Route path="/product/premium-postcards"      element={<PostcardsPage />} />
                <Route path="/product/classic-flyers"         element={<ClassicFlyersPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/upload-artwork" element={<UploadArtworkPage />} />
                <Route path="/request-design" element={<DesignRequestPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />

                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />

                {/* Account Routes */}
                <Route path="/account" element={<AccountPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/customers" element={<AdminCustomers />} />
              </Routes>
            </AnimatePresence>
          </main>

          <Footer />
          {/* Route-aware ad controller: Monetag + Adsterra on non-home pages */}
          <AdsController />
          <Toaster position="top-right" />
          <WhatsAppButton />

          {/* Noise overlay */}
          <div className="noise-overlay" />
        </div>
      </div>
    </Router>
  );
}

export default App;
