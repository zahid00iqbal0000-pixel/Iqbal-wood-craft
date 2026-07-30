import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PushNotificationDrawer } from './PushNotificationDrawer';
import { LiveClock } from './LiveClock';
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
    if (adminPinInput === '7860') {
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
    <header className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${
      darkMode 
        ? 'bg-[#121212] border-b border-[#d4af37]/30 text-white' 
        : 'bg-white text-stone-900 border-b border-amber-200/90 shadow-md'
    }`}>
      {/* Top Utility & Hotline Strip */}
      <div className={`px-4 py-1.5 text-xs border-b flex flex-wrap items-center justify-between gap-2 transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-r from-stone-950 via-[#1c140d] to-stone-950 text-amber-200/90 border-amber-900/30' 
          : 'bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-amber-100 border-amber-800'
      }`}>
        <div className="flex items-center gap-4 text-[11px] md:text-xs">
          <span className="flex items-center gap-1 font-medium text-amber-300">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            Showroom: DHA Phase 6, Karachi
          </span>
          <span className="hidden sm:flex items-center gap-1 text-stone-300">
            <LiveClock />
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
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <img
            src="/src/assets/images/iwc_karachi_gold_logo_1785338810799.jpg"
            alt="IQBAL WOODCRAFT Logo"
            className={`w-12 h-12 md:w-14 md:h-14 object-cover rounded-xl border-2 shadow-xl group-hover:scale-105 transition duration-300 ${
              darkMode ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40' : 'border-amber-600 ring-2 ring-amber-400/50'
            }`}
            referrerPolicy="no-referrer"
          />
          <div>
            <span className={`block text-xl sm:text-2xl md:text-3xl font-black tracking-widest font-serif leading-none uppercase ${
              darkMode 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-[#d4af37] to-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
                : 'text-amber-950 font-black drop-shadow-sm'
            }`}>
              IQBAL WOODCRAFT
            </span>
            <span className={`block text-[10px] md:text-xs uppercase tracking-[0.25em] font-sans font-extrabold mt-0.5 ${
              darkMode ? 'text-amber-300' : 'text-amber-900'
            }`}>
              Master Artisans • Premium Furniture
            </span>
          </div>
        </div>

        {/* Live Search Trigger Bar */}
        <div 
          onClick={() => setIsLiveSearchOpen(true)}
          className="hidden md:flex items-center flex-1 max-w-md mx-4 relative cursor-pointer group"
        >
          <div className={`w-full text-xs md:text-sm px-4 py-2 pl-10 pr-20 rounded-full border transition flex items-center justify-between ${
            darkMode 
              ? 'bg-stone-900/90 hover:bg-stone-800 text-amber-100 placeholder-stone-400 border-amber-950 group-hover:border-[#d4af37]' 
              : 'bg-amber-50/90 hover:bg-amber-100/70 text-stone-900 placeholder-stone-500 border-amber-200 group-hover:border-amber-500 shadow-inner'
          }`}>
            <span className={`truncate ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
              {searchQuery ? `Searching: "${searchQuery}"` : 'Live Search furniture, code, Sheesham...'}
            </span>
            <kbd className={`hidden lg:inline-block px-2 py-0.5 text-[10px] rounded font-mono border ${
              darkMode ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-white text-stone-600 border-amber-200'
            }`}>
              ⌘K
            </kbd>
          </div>
          <Search className={`w-4 h-4 absolute left-3.5 pointer-events-none ${darkMode ? 'text-[#d4af37]' : 'text-amber-700'}`} />

          {/* Voice Search Mic Quick Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              startVoiceSearch();
            }}
            className={`absolute right-2.5 p-1.5 rounded-full transition ${
              isVoiceSearchListening
                ? 'bg-red-500 text-white animate-pulse'
                : darkMode 
                  ? 'text-amber-400 hover:text-white hover:bg-stone-800'
                  : 'text-amber-700 hover:text-amber-900 hover:bg-amber-200/60'
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
            className={`md:hidden p-2 rounded-lg transition ${
              darkMode ? 'text-amber-200 hover:text-white hover:bg-stone-800' : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100'
            }`}
            title="Live Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Dual Theme Switcher Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 shadow-sm ${
              darkMode 
                ? 'bg-stone-900 border-amber-500/50 text-amber-300 hover:border-amber-400 hover:bg-stone-850' 
                : 'bg-amber-100/80 border-amber-300 text-amber-900 hover:bg-amber-200/90'
            }`}
            title={darkMode ? 'Switch to Light Mode (Default)' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <>
                <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
                <span className="text-xs font-bold tracking-tight text-amber-300">Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-700 fill-amber-500/30 animate-spin-slow" />
                <span className="text-xs font-bold tracking-tight text-amber-900">Light</span>
              </>
            )}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className={`relative p-2 rounded-lg transition ${
              darkMode ? 'text-amber-200 hover:text-amber-400 hover:bg-stone-800' : 'text-stone-700 hover:text-amber-800 hover:bg-amber-100'
            }`}
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
            className={`relative p-2 rounded-lg transition hidden sm:block ${
              darkMode ? 'text-amber-200 hover:text-amber-400 hover:bg-stone-800' : 'text-stone-700 hover:text-amber-800 hover:bg-amber-100'
            }`}
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
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-800 text-white border border-amber-400/60 text-xs font-semibold hover:brightness-110 transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
            <span>AI Advisor</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              navigateTo('products');
            }}
            className={`relative p-2 rounded-lg transition ${
              darkMode ? 'text-amber-200 hover:text-amber-400 hover:bg-stone-800' : 'text-stone-700 hover:text-amber-800 hover:bg-amber-100'
            }`}
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
            className={`relative p-2 rounded-lg transition ${
              darkMode ? 'text-amber-200 hover:text-amber-400 hover:bg-stone-800' : 'text-stone-700 hover:text-amber-800 hover:bg-amber-100'
            }`}
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
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition shadow-sm ${
              darkMode 
                ? 'bg-stone-900 border-[#d4af37]/40 text-stone-200 hover:border-[#d4af37]' 
                : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
            title={isLoggedIn ? 'View Profile & Saved Addresses' : 'Sign In / Register'}
          >
            <User className={`w-3.5 h-3.5 ${darkMode ? 'text-[#d4af37]' : 'text-amber-700'}`} />
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
                : darkMode
                  ? 'bg-stone-800 text-amber-300 border border-amber-900/50 hover:bg-stone-700'
                  : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
            }`}
            title="Admin Dashboard Mode"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAdminLoggedIn ? 'Admin Active' : 'Admin Login'}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              darkMode ? 'text-amber-200 hover:text-white' : 'text-stone-800 hover:text-black'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Links Bar (Desktop) */}
      <nav className={`hidden lg:block border-t px-4 transition-colors duration-300 ${
        darkMode 
          ? 'bg-stone-950 border-amber-950 text-stone-300' 
          : 'bg-amber-50/70 border-amber-200/80 text-stone-800'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium py-2">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-[#d4af37] transition ${currentScreen === 'home' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : darkMode ? 'text-stone-300' : 'text-stone-700'}`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                navigateTo('products');
              }}
              className={`hover:text-[#d4af37] transition ${currentScreen === 'products' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : darkMode ? 'text-stone-300' : 'text-stone-700'}`}
            >
              All Furniture Products
            </button>
            <button
              onClick={() => navigateTo('custom-order')}
              className={`flex items-center gap-1 hover:text-[#d4af37] transition ${currentScreen === 'custom-order' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : darkMode ? 'text-amber-400' : 'text-amber-800 font-semibold'}`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Custom Furniture Order
            </button>
            <button
              onClick={() => navigateTo('catalogue')}
              className={`flex items-center gap-1 hover:text-[#d4af37] transition ${currentScreen === 'catalogue' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : darkMode ? 'text-stone-300' : 'text-stone-700'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              PDF Catalogue
            </button>
            {onOpenFlutterModal && (
              <button
                onClick={onOpenFlutterModal}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-bold transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#d4af37]" />
                Flutter Android Code
              </button>
            )}
            <button
              onClick={() => navigateTo('my-orders')}
              className={`flex items-center gap-1 hover:text-[#d4af37] transition ${currentScreen === 'my-orders' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : darkMode ? 'text-stone-300' : 'text-stone-700'}`}
            >
              <Package className="w-3.5 h-3.5" />
              My Orders & Bilty Track
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`hover:text-[#d4af37] transition ${currentScreen === 'contact' ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5' : darkMode ? 'text-stone-300' : 'text-stone-700'}`}
            >
              Contact & Showroom
            </button>
          </div>

          <div className={`${darkMode ? 'text-amber-400/90' : 'text-amber-900'} font-sans tracking-wide font-medium`}>
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
              Enter Admin Security Passcode to access the IQBAL WOOD CRAFT management dashboard. (Default PIN: <code className="text-amber-400">7860</code>)
            </p>

            <form onSubmit={verifyAdminPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter PIN (e.g. 7860)"
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  autoFocus
                  className="w-full bg-stone-950 border border-stone-700 focus:border-[#d4af37] text-amber-100 px-4 py-2 rounded-lg text-center font-mono text-lg tracking-widest outline-none"
                />
                {pinError && (
                  <p className="text-red-400 text-xs mt-1 text-center font-medium">
                    Incorrect Passcode. Try 7860.
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

