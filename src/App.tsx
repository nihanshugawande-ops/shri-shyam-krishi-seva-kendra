import React, { useState, useEffect } from 'react';
import { AppData, Product, CartItem, Language } from './types';
import { initialData } from './data/initialData';
import { api } from './services/api';
import { WhiteCurtainIntro } from './components/WhiteCurtainIntro';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LuxuryIconNav } from './components/LuxuryIconNav';
import { PosterSlider } from './components/PosterSlider';
import { FeaturedProducts } from './components/FeaturedProducts';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AiHelpCenter } from './components/AiHelpCenter';
import { HelpCenter } from './components/HelpCenter';
import { MedicineFinder } from './components/MedicineFinder';
import { FarmerAdvice } from './components/FarmerAdvice';
import { AboutSection } from './components/AboutSection';
import { LocationSection } from './components/LocationSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AppBottomNav } from './components/AppBottomNav';
import { ShoppingBag, ArrowUp } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<AppData>(initialData);
  const [language, setLanguage] = useState<Language>('hi');
  const [showWhiteIntro, setShowWhiteIntro] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Active section and scroll state for luxury navigation
  const [activeSection, setActiveSection] = useState('home');
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('krishi_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Admin state
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('krishi_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Load data & initial language on startup
  const loadData = async () => {
    try {
      const result = await api.getAllData();
      setData(result);
    } catch (err) {
      console.error('Failed to load store data:', err);
    }
  };

  useEffect(() => {
    loadData();
    setIsAdminLoggedIn(api.isAuthenticated());
    const savedLang = api.getSavedLanguage();
    setLanguage(savedLang);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolledPastHero(scrollY > 420);

      const sectionIds = [
        'home',
        'products',
        'ai-help',
        'help-center',
        'medicine-finder',
        'knowledge',
        'location',
      ];

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCurtainComplete = () => {
    setShowWhiteIntro(false);
    // If user has not chosen language before, prompt language selection
    const langAlreadyChosen = localStorage.getItem('shree_shyam_lang');
    if (!langAlreadyChosen) {
      setShowLanguageModal(true);
    }
  };

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    api.setSavedLanguage(lang);
    setShowLanguageModal(false);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleQuickOrder = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Smooth scroll helpers with sticky header offset
  const scrollTo = (id: string) => {
    setActiveSection(id);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#E4E6EB] selection:bg-emerald-500 selection:text-black font-sans antialiased pb-28">
      {/* 1. First-Open Experience: Pure White Theatrical Curtain Intro */}
      {showWhiteIntro && (
        <WhiteCurtainIntro
          onComplete={handleCurtainComplete}
          shopName={language === 'hi' ? data.settings.shopName : (data.settings.shopNameEn || data.settings.shopName)}
          tagline={language === 'hi' ? data.settings.heroSubheading : (data.settings.heroSubheadingEn || data.settings.heroSubheading)}
        />
      )}

      {/* 2. Language Selection Modal */}
      <LanguageSelectModal
        isOpen={showLanguageModal}
        onSelect={handleSelectLanguage}
        currentLanguage={language}
        onClose={() => setShowLanguageModal(false)}
      />

      {/* 3. Navigation Bar (Strict Top Bar Contract) */}
      <Navbar
        settings={data.settings}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        cartCount={totalCartCount}
        language={language}
        onOpenLanguageModal={() => setShowLanguageModal(true)}
      />

      {/* STICKY LUXURY ICON RAIL: Appears when scrolling down to give effortless 1-tap jump to any colorful section */}
      {scrolledPastHero && (
        <div className="sticky top-16 z-30 transition-all animate-fadeIn">
          <LuxuryIconNav
            language={language}
            onNavigate={scrollTo}
            activeSection={activeSection}
            isSticky={true}
          />
        </div>
      )}

      {/* 4. Luxury Charcoal Grey Hero Section */}
      <Hero
        settings={data.settings}
        onExploreProducts={() => scrollTo('products')}
        onExploreKnowledge={() => scrollTo('knowledge')}
        onContactClick={() => scrollTo('location')}
        language={language}
      />

      {/* 5. In-Flow Luxury Quick Service Rail (Distinct Colorful Icons in exact requested order) */}
      <LuxuryIconNav
        language={language}
        onNavigate={scrollTo}
        activeSection={activeSection}
        isSticky={false}
      />

      {/* 6. Premium Promotional Image Slider */}
      <PosterSlider
        posters={data.posters}
        onSelectAction={(link) => {
          if (link?.startsWith('#')) scrollTo(link.replace('#', ''));
          else if (link) window.open(link, '_blank');
        }}
        language={language}
      />

      {/* 7. Featured Products Marketplace */}
      <FeaturedProducts
        products={data.products}
        onViewDetails={(prod) => setSelectedProduct(prod)}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        onQuickOrder={(prod) => handleQuickOrder(prod, 1)}
        onViewAll={() => scrollTo('products')}
        whatsappNumber={data.settings.whatsapp || data.settings.officialPhone}
        language={language}
      />

      {/* 8. Product Catalog with Instant Search & Crop Filters (#products) */}
      <ProductCatalog
        products={data.products}
        categories={data.categories}
        onViewDetails={(prod) => setSelectedProduct(prod)}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        onQuickOrder={(prod) => handleQuickOrder(prod, 1)}
        whatsappNumber={data.settings.whatsapp || data.settings.officialPhone}
        language={language}
      />

      {/* 9. AI Agriculture Help Center (#ai-help) */}
      <AiHelpCenter
        language={language}
        settings={data.settings}
        products={data.products}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        onQuickOrder={(prod) => handleQuickOrder(prod, 1)}
      />

      {/* 10. Direct Help Center & Helpline (#help-center) */}
      <HelpCenter settings={data.settings} language={language} />

      {/* 11. Medicine Guide & Dosage Finder (#medicine-finder) */}
      <MedicineFinder
        products={data.products}
        settings={data.settings}
        language={language}
        onAddToCart={(prod) => handleAddToCart(prod, 1)}
        onQuickOrder={(prod) => handleQuickOrder(prod, 1)}
        onViewDetails={(prod) => setSelectedProduct(prod)}
      />

      {/* 12. Agriculture Knowledge Center (#knowledge) */}
      <FarmerAdvice articles={data.articles} language={language} />

      {/* 13. About Shop Section */}
      <AboutSection settings={data.settings} language={language} />

      {/* 14. Location & Contact System (#location) */}
      <LocationSection
        settings={data.settings}
        language={language}
        onUpdateSettings={(newSettings) =>
          setData((prev) => ({ ...prev, settings: newSettings }))
        }
      />

      {/* 15. Footer */}
      <Footer
        settings={data.settings}
        onOpenAdminLogin={() => {
          if (isAdminLoggedIn) setAdminDashboardOpen(true);
          else setAdminLoginOpen(true);
        }}
        onReplayIntro={() => setShowWhiteIntro(true)}
        language={language}
      />

      {/* Floating Scroll-to-Top Button */}
      {scrolledPastHero && (
        <button
          onClick={() => scrollTo('home')}
          className="fixed bottom-22 sm:bottom-24 left-4 z-40 w-11 h-11 rounded-full bg-emerald-950/90 hover:bg-emerald-900 text-amber-400 hover:text-amber-300 border border-emerald-500/50 shadow-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer group backdrop-blur-md"
          title={language === 'hi' ? 'ऊपर जाएं' : 'Scroll to Top'}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Floating Mobile Cart Indicator */}
      {totalCartCount > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-22 sm:bottom-24 right-4 z-40 flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl border border-emerald-400 transition-transform active:scale-95 cursor-pointer sm:hidden"
          aria-label="Open Cart"
        >
          <ShoppingBag className="w-5 h-5 text-white" />
          <span className="text-xs font-bold font-mono">
            {language === 'hi' ? 'कार्ट' : 'Cart'} ({totalCartCount})
          </span>
        </button>
      )}

      {/* Mobile App Style Bottom Navigation Bar (Docked at bottom with user's requested icons) */}
      <AppBottomNav
        language={language}
        activeSection={activeSection}
        onNavigate={scrollTo}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        language={language}
        settings={data.settings}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        settings={data.settings}
        onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
        onQuickOrder={handleQuickOrder}
        language={language}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoggedIn(true);
          setAdminDashboardOpen(true);
        }}
      />

      {/* Admin Dashboard */}
      {adminDashboardOpen && (
        <AdminDashboard
          data={data}
          onRefreshData={loadData}
          onClose={() => setAdminDashboardOpen(false)}
        />
      )}
    </div>
  );
}
