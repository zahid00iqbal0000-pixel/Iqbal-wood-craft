import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PushNotificationDrawer } from './PushNotificationDrawer';
import { 
  Search, 
  Mic,
  ShoppingCart, 
  Heart, 
  PhoneCall, 
  MessageSquare, 
  Sun, 
  Moon, 
  Sparkles, 
  UserCheck, 
  ShieldAlert, 
  Menu, 
  X, 
  Package, 
  Wrench, 
  BookOpen, 
  Grid,
  MapPin,
  Clock,
  Smartphone,
  User,
  Scale,
  Bell
} from 'lucide-react';

interface HeaderProps {
  onOpenFlutterModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFlutterModal }) => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    cart, 
    wishlist, 
    searchQuery, 
    setSearchQuery, 
    setIsCartDrawerOpen, 
    setIsAiConsultantOpen, 
    darkMode, 
    setDarkMode,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    contactInfo,
    setSelectedCategory,
    currentUser,
    isLoggedIn,
    openAuthModal,
    setIsLiveSearchOpen,
    startVoiceSearch,
    isVoiceSearchListening,
    compareList,
    setIsCompareOpen,
    notifications
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;


  const handleAdminToggle = () => {
    if (isAdminLoggedIn) {
      setIsAdminLoggedIn(false);
      setCurrentScreen('home');
    } else {
      setIsAdminPinModalOpen(true);
    }
  };

  const verifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === '1234' || adminPinInput === 'IWC2026') {
      setIsAdminLoggedIn(true);
      setIsAdminPinModalOpen(false);
      setAdminPinInput('');
      setPinError(false);
      setCurrentScreen('admin');
    } else {
      setPinError(true);
    }
  };

  const navigateTo = (screen: any) => {
    setCurrentScreen(screen);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg transition-colors duration-200 bg-[#121212] border-b border-[#d4af37]/30 text-white">
      {/* Top Utility & Hotline Strip */}
      <div className="bg-gradient-to-r from-stone-950 via-[#1c140d] to-stone-950 px-4 py-1.5 text-xs text-amber-200/90 border-b border-amber-900/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-[11px] md:text-xs">
          <span className="flex items-center gap-1 font-medium text-amber-300">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            Showroom: DHA Phase 6, Karachi
          </span>
          <span className="hidden sm:flex items-center gap-1 text-stone-300">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            10:00 AM - 10:00 PM PKT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-semibold tracking-wide">
            100% Advance Payment Policy
          </span>
          <a
            href={`https://wa.me/92${contactInfo.whatsappBusiness.replace(/[^0-9]/g, '').slice(1)}?text=Assalam-o-Alaikum%20IQBAL%20WOODCRAFT,%20I%20have%20an%20inquiry.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-emerald-700/80 hover:bg-emerald-600 text-white px-2 py-0.5 rounded text-[11px] font-medium transition"
          >
            <MessageSquare className="w-3 h-3" />
            WhatsApp: {contactInfo.whatsappBusiness}
          </a>
          <a
            href={`tel:${contactInfo.salesPhone}`}
            className="hidden md:flex items-center gap-1 bg-amber-700/80 hover:bg-amber-600 text-white px-2 py-0.5 rounded text-[11px] font-medium transition"
          >
            <PhoneCall className="w-3 h-3" />
            Call: {contactInfo.salesPhone}
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src="/src/assets/images/iqbal_woodcraft_logo_1785234354516.jpg"
            alt="IQBAL WOODCRAFT Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg border border-[#d4af37]/50 shadow-md group-hover:scale-105 transition"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="block text-lg md:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#d4af37] to-amber-500 font-serif">
              IQBAL WOODCRAFT
            </span>
            <span className="block text-[10px] md:text-xs text-amber-200/80 uppercase tracking-widest font-sans font-medium">
              Premium Furniture Store
            </span>
          </div>
        </div>

        {/* Live Search Trigger Bar */}
        <div 
          onClick={() => setIsLiveSearchOpen(true)}
          className="hidden md:flex items-center flex-1 max-w-md mx-4 relative cursor-pointer group"
        >
          <div className="w-full bg-stone-900/90 hover:bg-stone-800 text-amber-100 placeholder-stone-400 text-xs md:text-sm px-4 py-2 pl-10 pr-20 rounded-full border border-amber-950 group-hover:border-[#d4af37] transition flex items-center justify-between">
            <span className="truncate text-stone-400">
              {searchQuery ? `Searching: "${searchQuery}"` : 'Live Search furniture, code, Sheesham...'}
            </span>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] bg-stone-800 text-stone-400 border border-stone-700 rounded font-mono">
              ⌘K
            </kbd>
          </div>
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 pointer-events-none" />

          {/* Voice Search Mic Quick Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              startVoiceSearch();
            }}
            className={`absolute right-2.5 p-1.5 rounded-full transition ${
              isVoiceSearchListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-amber-400 hover:text-white hover:bg-stone-800'
            }`}
            title="Voice Search via Microphone"
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Mobile Live Search Icon */}
          <button
            onClick={() => setIsLiveSearchOpen(true)}
            className="md:hidden p-2 text-amber-200 hover:text-white rounded-lg hover:bg-stone-800"
            title="Live Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dark Mode Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-amber-200 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-300" />}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-amber-200 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition"
            title="Push Order & Cargo Bilty Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-black animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Comparison List Trigger */}
          <button
            onClick={() => setIsCompareOpen(true)}
            className="relative p-2 text-amber-200 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition hidden sm:block"
            title="Furniture Specification Comparison"
          >
            <Scale className="w-5 h-5" />
            {compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4af37] text-stone-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-black">
                {compareList.length}
              </span>
            )}
          </button>

          {/* AI Consultant Button */}
          <button
            onClick={() => setIsAiConsultantOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-700/60 to-amber-900/80 border border-[#d4af37]/60 text-amber-200 text-xs font-semibold hover:border-amber-300 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Advisor</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              navigateTo('products');
            }}
            className="relative p-2 text-amber-200 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-black">
                {wishlist.length}
              </span>
            )}
          </button>


          {/* Cart Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative p-2 text-amber-200 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#d4af37] text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-black">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Account / Auth Button */}
          <button
            onClick={() => {
              if (isLoggedIn) {
                setCurrentScreen('profile');
              } else {
                openAuthModal('login');
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-[#d4af37]/40 text-stone-200 hover:border-[#d4af37] text-xs font-bold transition shadow-sm"
            title={isLoggedIn ? 'View Profile & Saved Addresses' : 'Sign In / Register'}
          >
            <User className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">
              {isLoggedIn ? (currentUser.name ? currentUser.name.split(' ')[0] : 'Profile') : 'Sign In'}
            </span>
          </button>

          {/* Admin Panel Toggle */}
          <button
            onClick={handleAdminToggle}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              isAdminLoggedIn 
                ? 'bg-amber-500 text-black shadow-md' 
                : 'bg-stone-800 text-amber-300 border border-amber-900/50 hover:bg-stone-700'
            }`}
            title="Admin Dashboard Mode"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdminLoggedIn ? 'Admin Active' : 'Admin Login'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-amber-200 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Links Bar (Desktop) */}
      <nav className="hidden lg:block bg-stone-950 border-t border-amber-950 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium py-2">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-[#d4af37] transition ${currentScreen === 'home' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : 'text-stone-300'}`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                navigateTo('products');
              }}
              className={`hover:text-[#d4af37] transition ${currentScreen === 'products' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : 'text-stone-300'}`}
            >
              All Furniture Products
            </button>
            <button
              onClick={() => navigateTo('custom-order')}
              className={`flex items-center gap-1 hover:text-[#d4af37] transition ${currentScreen === 'custom-order' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : 'text-amber-400'}`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Custom Furniture Order
            </button>
            <button
              onClick={() => navigateTo('catalogue')}
              className={`flex items-center gap-1 hover:text-[#d4af37] transition ${currentScreen === 'catalogue' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : 'text-stone-300'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              PDF Catalogue
            </button>
            {onOpenFlutterModal && (
              <button
                onClick={onOpenFlutterModal}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#d4af37]" />
                Flutter Android Code
              </button>
            )}
            <button
              onClick={() => navigateTo('my-orders')}
              className={`flex items-center gap-1 hover:text-[#d4af37] transition ${currentScreen === 'my-orders' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : 'text-stone-300'}`}
            >
              <Package className="w-3.5 h-3.5" />
              My Orders & Bilty Track
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`hover:text-[#d4af37] transition ${currentScreen === 'contact' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : 'text-stone-300'}`}
            >
              Contact & Showroom
            </button>
          </div>

          <div className="text-amber-400/90 font-sans tracking-wide">
            CEO: Muhammad Iqbal | Sales: 0302-0940219
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-t border-amber-900/50 px-4 py-4 space-y-3">
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => navigateTo('products')}
              className="w-full bg-stone-950 text-white placeholder-stone-500 text-sm px-4 py-2 pl-9 rounded-lg border border-amber-900"
            />
            <Search className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-stone-200">
            <button
              onClick={() => navigateTo('home')}
              className="p-2 bg-stone-800 rounded text-left hover:bg-stone-700"
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                navigateTo('products');
              }}
              className="p-2 bg-stone-800 rounded text-left hover:bg-stone-700"
            >
              All Products
            </button>
            <button
              onClick={() => navigateTo('custom-order')}
              className="p-2 bg-amber-900/50 text-amber-300 border border-amber-600/40 rounded text-left hover:bg-amber-900/80 flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5" />
              Custom Furniture
            </button>
            <button
              onClick={() => navigateTo('catalogue')}
              className="p-2 bg-stone-800 rounded text-left hover:bg-stone-700 flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Digital Catalogue
            </button>
            <button
              onClick={() => navigateTo('my-orders')}
              className="p-2 bg-stone-800 rounded text-left hover:bg-stone-700 flex items-center gap-1"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              My Orders & Cargo
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="p-2 bg-stone-800 rounded text-left hover:bg-stone-700"
            >
              Showroom Contact
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={() => {
                setIsAiConsultantOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI Furniture Advisor
            </button>

            <button
              onClick={() => {
                handleAdminToggle();
                setIsMobileMenuOpen(false);
              }}
              className="text-xs text-amber-400 underline font-medium"
            >
              {isAdminLoggedIn ? 'Logout Admin' : 'Admin Security Access'}
            </button>
          </div>
        </div>
      )}

      {/* Admin Security Modal */}
      {isAdminPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-[#d4af37]/60 rounded-xl max-w-sm w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#d4af37]" />
                <h3 className="font-bold text-lg text-amber-200">Admin Security Login</h3>
              </div>
              <button
                onClick={() => setIsAdminPinModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-300 mb-4">
              Enter Admin Security Passcode to access the IQBAL WOODCRAFT management dashboard. (Default PIN: <code className="text-amber-400">1234</code>)
            </p>

            <form onSubmit={verifyAdminPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter PIN (e.g. 1234)"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  autoFocus
                  className="w-full bg-stone-950 border border-stone-700 focus:border-[#d4af37] text-amber-100 px-4 py-2 rounded-lg text-center font-mono text-lg tracking-widest outline-none"
                />
                {pinError && (
                  <p className="text-red-400 text-xs mt-1 text-center font-medium">
                    Incorrect Passcode. Try 1234.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminPinModalOpen(false)}
                  className="w-1/2 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-gradient-to-r from-amber-600 to-[#d4af37] text-black font-bold rounded-lg text-xs shadow hover:brightness-110"
                >
                  Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Push Notification Drawer */}
      <PushNotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </header>
  );
};

