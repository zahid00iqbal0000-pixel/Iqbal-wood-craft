import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { SplashScreen } from './components/SplashScreen';
import { HeroSlider } from './components/HeroSlider';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomOrderModal } from './components/CustomOrderModal';
import { AdminPanel } from './components/AdminPanel';
import { ContactSection } from './components/ContactSection';
import { PdfCatalogueModal } from './components/PdfCatalogueModal';
import { AiConsultantDrawer } from './components/AiConsultantDrawer';
import { FlutterProjectCodeModal } from './components/FlutterProjectCodeModal';
import { Footer } from './components/Footer';
import { ProductsView } from './views/ProductsView';
import { MyOrdersView } from './views/MyOrdersView';
import { UserProfileView } from './views/UserProfileView';
import { AuthModal } from './components/AuthModal';
import { LiveSearchModal } from './components/LiveSearchModal';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { FloatingCompareBar } from './components/FloatingCompareBar';
import { RecentlyViewedBar } from './components/RecentlyViewedBar';
import { RecommendedProductsSection } from './components/RecommendedProductsSection';
import { Product } from './types';
import { 
  Wrench, 
  Sparkles, 
  MessageSquare, 
  PhoneCall, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  Star, 
  CheckCircle, 
  Award, 
  BookOpen 
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    products, 
    toastMessage, 
    contactInfo, 
    setSelectedCategory,
    setIsAiConsultantOpen,
    isLiveSearchOpen,
    setIsLiveSearchOpen,
    isCompareOpen,
    setIsCompareOpen
  } = useApp();


  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);

  const featuredProducts = products.filter(p => p.isFeatured || p.isBestSeller).slice(0, 6);
  const newArrivals = products.filter(p => p.isNewArrival || p.isPremiumCollection).slice(0, 4);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans flex flex-col justify-between selection:bg-[#d4af37] selection:text-black">
      {/* Top Header */}
      <Header onOpenFlutterModal={() => setIsFlutterModalOpen(true)} />

      {/* Main Dynamic View Area */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <div className="space-y-12">
            {/* Hero Banner Slider */}
            <HeroSlider />

            {/* Category Grid */}
            <CategoryGrid />

            {/* Featured Master Products Section */}
            <section className="py-8 px-4 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-amber-900/30">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                    Handcrafted Showroom Selection
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-amber-100 font-serif mt-1">
                    Featured Masterpiece Furniture
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentScreen('products');
                  }}
                  className="mt-2 md:mt-0 text-xs font-bold text-amber-400 hover:text-amber-200 flex items-center gap-1 group"
                >
                  Explore Entire Showroom Catalog
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => setSelectedProductForModal(p)}
                  />
                ))}
              </div>
            </section>

            {/* Custom Order Callout Banner */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-stone-950 via-[#1c140d] to-stone-950 border border-[#d4af37]/50 p-8 md:p-12 text-white shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950 border border-amber-700/60 rounded-full text-xs font-bold text-amber-300">
                    <Wrench className="w-3.5 h-3.5 text-[#d4af37]" />
                    BESPOKE WOODCRAFTING SERVICE
                  </div>

                  <h2 className="text-2xl md:text-4xl font-serif font-black text-amber-100">
                    Have a Custom Furniture Design in Mind?
                  </h2>

                  <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
                    Submit your room dimensions, wood species preference (Solid Sheesham, Teak, Walnut), stain color, and design photo. Our Chinioti master artisans will custom engineer it for you.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-amber-300 font-medium pt-2">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                      Custom Room Sizes
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                      100% Solid Sheesham Wood
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                      10 Year Warranty
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => setCurrentScreen('custom-order')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-xl hover:brightness-110 uppercase tracking-wider"
                  >
                    Request Custom Order
                  </button>

                  <button
                    onClick={() => setCurrentScreen('catalogue')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 border border-amber-800 text-amber-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800"
                  >
                    <BookOpen className="w-4 h-4 text-[#d4af37]" />
                    PDF Catalogue
                  </button>
                </div>
              </div>
            </section>

            {/* New Arrivals / Premium Collection */}
            <section className="py-8 px-4 max-w-7xl mx-auto">
              <div className="mb-8 pb-4 border-b border-amber-900/30">
                <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                  Master Woodcarving
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-amber-100 font-serif mt-1">
                  New Arrivals & Royal Collection
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => setSelectedProductForModal(p)}
                  />
                ))}
              </div>
            </section>

            {/* Recommended & Popular Products Section */}
            <section className="py-4 px-4 max-w-7xl mx-auto">
              <RecommendedProductsSection />
            </section>

            {/* Recently Viewed Items Bar */}
            <section className="px-4 max-w-7xl mx-auto">
              <RecentlyViewedBar />
            </section>

            {/* Customer Trust Reviews Section */}
            <section className="py-12 bg-stone-900 border-t border-b border-stone-800 px-4">
              <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                    Customer Satisfaction
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-black text-amber-100">
                    Trusted By Furniture Connoisseurs Across Pakistan
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                    </div>
                    <p className="text-xs text-stone-300 italic leading-relaxed">
                      "Extremely impressed by the solid Sheesham king bed set. The floral carving detail is royal and the polish finish is flawless."
                    </p>
                    <div className="text-xs">
                      <strong className="text-amber-200 block">Mian Tariq Hassan</strong>
                      <span className="text-stone-500">Lahore • Verified Buyer</span>
                    </div>
                  </div>

                  <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                    </div>
                    <p className="text-xs text-stone-300 italic leading-relaxed">
                      "I Iqbal Woodcraft team custom manufactured my 7-seater Chesterfield sofa for DHA Phase 6. Excellent Turkish velvet fabric!"
                    </p>
                    <div className="text-xs">
                      <strong className="text-amber-200 block">Dr. Saira Alvi</strong>
                      <span className="text-stone-500">Karachi DHA • Verified Buyer</span>
                    </div>
                  </div>

                  <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                    </div>
                    <p className="text-xs text-stone-300 italic leading-relaxed">
                      "The 8-chair brass inlay dining table is a work of art. Delivery via cargo was safe and timely to Islamabad."
                    </p>
                    <div className="text-xs">
                      <strong className="text-amber-200 block">Chaudhry Kamran</strong>
                      <span className="text-stone-500">Islamabad • Verified Buyer</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentScreen === 'products' && <ProductsView />}
        {currentScreen === 'custom-order' && <CustomOrderModal />}
        {currentScreen === 'checkout' && <CheckoutModal />}
        {currentScreen === 'my-orders' && <MyOrdersView />}
        {currentScreen === 'profile' && <UserProfileView />}
        {currentScreen === 'contact' && <ContactSection />}
        {currentScreen === 'admin' && <AdminPanel />}
        {currentScreen === 'catalogue' && <PdfCatalogueModal />}
      </main>

      {/* Slide-over Drawers & Modals */}
      <CartDrawer />
      <AiConsultantDrawer />
      <AuthModal />
      <FlutterProjectCodeModal 
        isOpen={isFlutterModalOpen} 
        onClose={() => setIsFlutterModalOpen(false)} 
      />
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />
      <LiveSearchModal
        isOpen={isLiveSearchOpen}
        onClose={() => setIsLiveSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProductForModal(p)}
      />
      <ProductComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectProduct={(p) => setSelectedProductForModal(p)}
      />
      <FloatingCompareBar />


      {/* Floating Action Buttons for AI Assistant & WhatsApp */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => setIsAiConsultantOpen(true)}
          className="group relative px-4 py-3 bg-gradient-to-r from-amber-600 via-[#d4af37] to-amber-500 text-stone-950 font-bold rounded-full shadow-2xl border-2 border-amber-300 transition transform hover:scale-105 flex items-center gap-2.5"
          title="IQBAL WOODCRAFT AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-200"></span>
          </span>
          <Sparkles className="w-5 h-5 text-stone-950 animate-pulse" />
          <span className="text-xs font-serif font-black uppercase tracking-wider hidden sm:inline">
            AI Assistant 24/7
          </span>
        </button>

        <a
          href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=Assalam-o-Alaikum%20IQBAL%20WOODCRAFT`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center border-2 border-emerald-400"
          title="Official WhatsApp Business Support"
        >
          <MessageSquare className="w-6 h-6" />
        </a>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-stone-900 border border-[#d4af37] text-amber-100 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Award className="w-4 h-4 text-[#d4af37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <AppProvider>
      {!splashFinished && <SplashScreen onComplete={() => setSplashFinished(true)} />}
      <MainContent />
    </AppProvider>
  );
}
