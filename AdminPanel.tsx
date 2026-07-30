import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, CustomOrderRequest, PaymentAccountDetails, WoodType, BannerSlide, TrustMessage } from '../types';
import { CATEGORIES } from '../data/categories';
import { auth } from '../lib/firebase';
import { AuthService } from '../services/authService';
import { FirebaseRepository } from '../services/firebaseRepository';
import { LiveClock } from './LiveClock';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Wrench, 
  CreditCard, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Bell, 
  TrendingUp, 
  Truck, 
  ShieldCheck,
  Search,
  Bot,
  Sparkles,
  HelpCircle,
  MessageSquare,
  PhoneCall,
  Lock,
  Mail,
  Key,
  LogIn,
  Upload,
  Image as ImageIcon,
  FolderPlus,
  Star
} from 'lucide-react';

const WOOD_OPTIONS: WoodType[] = [
  'Solid Sheesham (Chinioti Rosewood)',
  'Teak Wood (Sagwan)',
  'Walnut Wood (Akhrot)',
  'Oak Wood',
  'High-Grade MDF with Tactile Veneer',
  'Mahogany Wood'
];

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    setProducts, 
    orders, 
    updateOrderStatus, 
    customOrders, 
    updateCustomOrderStatus, 
    paymentDetails, 
    updatePaymentDetails,
    aiFaqs,
    addAiFaq,
    deleteAiFaq,
    aiConversations,
    showToast,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    currentUser,
    bannerSlides,
    saveBannerSlide,
    deleteBannerSlide,
    trustMessages,
    saveTrustMessage,
    deleteTrustMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'banners' | 'trust' | 'orders' | 'custom' | 'ai' | 'payments' | 'notifications'>('dashboard');

  // Trust Message Form State
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const [editingTrustMsg, setEditingTrustMsg] = useState<TrustMessage | null>(null);
  const [trustText, setTrustText] = useState('');
  const [trustIcon, setTrustIcon] = useState('Sparkles');

  // Banner Slide Form State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerBadge, setBannerBadge] = useState('');
  const [bannerCtaText, setBannerCtaText] = useState('');
  const [bannerCategoryFilter, setBannerCategoryFilter] = useState('');
  const [bannerIsCustomOrder, setBannerIsCustomOrder] = useState(false);

  // Admin Login State
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Authorized Admin Emails Whitelist & Role Check
  const AUTHORIZED_ADMIN_EMAILS = [
    'zahid00iqbal0000@gmail.com', 
    'admin@iqbalwoodcraft.com', 
    'iqbal@iqbalwoodcraft.com',
    'owner@iqbalwoodcraft.com'
  ];

  const isAuthorizedAdmin = isAdminLoggedIn || 
    currentUser.role === 'Admin' || 
    currentUser.isAdmin === true || 
    (auth.currentUser?.email && AUTHORIZED_ADMIN_EMAILS.includes(auth.currentUser.email.toLowerCase()));

  const handleAdminEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (!adminEmailInput || !adminPasswordInput) {
        throw new Error('Please enter both admin email and password.');
      }
      const user = await AuthService.loginWithEmail(adminEmailInput, adminPasswordInput);
      const email = user.email ? user.email.toLowerCase() : '';
      if (email && AUTHORIZED_ADMIN_EMAILS.includes(email)) {
        setIsAdminLoggedIn(true);
        showToast('Secure Admin Authentication Successful.');
      } else {
        setAuthError('Access Denied: This account does not have authorized administrator privileges.');
        await AuthService.logout();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminPinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput === '7860') {
      setIsAdminLoggedIn(true);
      showToast('Admin Terminal Unlocked via Security Passcode.');
    } else {
      setAuthError('Invalid Admin Security PIN.');
    }
  };

  const handleGoogleAdminLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const userProfile = await AuthService.loginWithGoogle('Admin');
      const email = userProfile.email ? userProfile.email.toLowerCase() : '';
      if (email && (AUTHORIZED_ADMIN_EMAILS.includes(email) || userProfile.role === 'Admin')) {
        setIsAdminLoggedIn(true);
        showToast('Google Admin Authentication Successful.');
      } else {
        setAuthError('Access Denied: Google Account is not authorized for Admin panel.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google Auth failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // If not authorized admin, render Secure Login Screen
  if (!isAuthorizedAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-stone-900 border border-[#d4af37]/60 rounded-3xl shadow-2xl text-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#d4af37]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <span className="text-xs tracking-widest uppercase text-amber-300 font-bold">Iqbal Woodcraft Security</span>
          <h2 className="text-2xl font-serif font-black text-amber-100 mt-1">Owner & Admin Portal</h2>
          <p className="text-xs text-stone-400 mt-2">
            Restricted access. Authorized management personnel only. All access attempts are verified via Firebase Auth.
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-3 bg-red-950/80 border border-red-600/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
            <X className="w-4 h-4 shrink-0 text-red-400" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleAdminEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Admin Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-500" />
              <input
                type="email"
                required
                value={adminEmailInput}
                onChange={e => setAdminEmailInput(e.target.value)}
                placeholder="admin@iqbalwoodcraft.com"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-500" />
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={e => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-amber-400 transition shadow-lg flex items-center justify-center gap-2"
          >
            {authLoading ? 'Verifying Credentials...' : 'Sign In as Administrator'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-800"></div></div>
          <span className="relative px-3 bg-stone-900 text-stone-500 text-xs uppercase">Or Fast Passcode</span>
        </div>

        <form onSubmit={handleAdminPinLogin} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="password"
              maxLength={10}
              value={adminPinInput}
              onChange={e => setAdminPinInput(e.target.value)}
              placeholder="Enter Admin PIN (e.g. 7860)"
              className="flex-1 px-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold rounded-xl text-xs transition"
            >
              Unlock
            </button>
          </div>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGoogleAdminLogin}
            disabled={authLoading}
            className="w-full py-2.5 bg-white text-stone-900 font-semibold rounded-xl hover:bg-stone-100 transition text-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            Sign in with Google (Admin)
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
          Iqbal Woodcraft & Furniture Showroom • Secure Terminal v3.5
        </div>
      </div>
    );
  }

  // FAQ Form State
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqCat, setNewFaqCat] = useState<'Products' | 'Payment' | 'Delivery' | 'Custom Furniture' | 'Warranty'>('Payment');
  const [expandedConvId, setExpandedConvId] = useState<string | null>(null);

  // Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodCode, setProdCode] = useState('');
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState(CATEGORIES[0].name);
  const [prodPrice, setProdPrice] = useState(150000);
  const [prodSalePrice, setProdSalePrice] = useState(125000);
  const [prodWood, setProdWood] = useState<string>('MDF High Gloss & Solid Wood');
  const [prodDimensions, setProdDimensions] = useState('78" L x 72" W x 48" H');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodDesc, setProdDesc] = useState('');

  // Payment Details Form State
  const [editingPayment, setEditingPayment] = useState<PaymentAccountDetails>(paymentDetails);

  // Notification Broadcast State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingPayments = orders.filter(o => o.paymentStatus.includes('Pending')).length;

  // Custom Category State
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('iwc_custom_categories');
    return saved ? JSON.parse(saved) : [];
  });
  const [newCatName, setNewCatName] = useState('');
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);

  const availableCategoryNames = Array.from(new Set([
    ...CATEGORIES.map(c => c.name),
    ...customCategories
  ]));

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const catName = newCatName.trim();
    if (!customCategories.includes(catName)) {
      const updated = [...customCategories, catName];
      setCustomCategories(updated);
      localStorage.setItem('iwc_custom_categories', JSON.stringify(updated));
    }
    setProdCategory(catName);
    setNewCatName('');
    setIsAddingNewCat(false);
    showToast(`New category "${catName}" added successfully!`);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    
    const readPromises = fileList.map((file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) resolve(ev.target.result as string);
          else reject('Error reading file');
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(base64List => {
      setProdImages(prev => [...prev, ...base64List]);
      showToast(`${base64List.length} image(s) uploaded successfully!`);
    }).catch(err => {
      console.error('Image upload failed:', err);
      showToast('Image upload failed.');
    });
  };

  const removeProductImage = (indexToRemove: number) => {
    setProdImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const setCoverProductImage = (indexToCover: number) => {
    setProdImages(prev => {
      const selected = prev[indexToCover];
      const remaining = prev.filter((_, idx) => idx !== indexToCover);
      return [selected, ...remaining];
    });
    showToast('Cover photo updated.');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodCode) return;

    const fallbackImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    const finalImages = prodImages.length > 0 ? prodImages : [fallbackImage];

    if (editingProduct) {
      const updatedProd: Product = {
        ...editingProduct,
        code: prodCode,
        name: prodName,
        category: prodCategory,
        price: prodPrice,
        salePrice: prodSalePrice,
        woodType: prodWood,
        material: prodWood,
        dimensions: prodDimensions,
        images: finalImages,
        description: prodDesc || editingProduct.description
      };
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProd : p));
      try {
        await FirebaseRepository.saveProduct(updatedProd);
      } catch (err) {
        console.warn('Firestore save warning:', err);
      }
      showToast('Product updated successfully!');
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        code: prodCode,
        name: prodName,
        brand: 'IQBAL WOODCRAFT',
        category: prodCategory,
        images: finalImages,
        price: prodPrice,
        salePrice: prodSalePrice,
        discountPercent: Math.round(((prodPrice - prodSalePrice) / prodPrice) * 100),
        material: prodWood,
        woodType: prodWood,
        dimensions: prodDimensions,
        availableColors: ['Walnut High Gloss', 'Dark Mahogany', 'Matte Black', 'Brass Highlights'],
        description: prodDesc || 'Handcrafted interior masterpiece engineered by Iqbal Woodcraft master artisans.',
        warranty: '10 Years Termite & Structural Guarantee',
        availability: 'In Stock',
        estimatedDeliveryTime: '5-7 Working Days',
        rating: 5.0,
        reviewCount: 1
      };
      setProducts(prev => [newProd, ...prev]);
      try {
        await FirebaseRepository.saveProduct(newProd);
      } catch (err) {
        console.warn('Firestore save warning:', err);
      }
      showToast('New Furniture Product added to Showroom Catalog!');
    }

    setIsProductModalOpen(false);
    resetProductForm();
  };

  const editProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setProdCode(prod.code);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdSalePrice(prod.salePrice || prod.price);
    setProdWood(prod.woodType);
    setProdDimensions(prod.dimensions);
    setProdImages(prod.images || []);
    setProdDesc(prod.description);
    setIsProductModalOpen(true);
  };

  const deleteProductClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this furniture item?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      try {
        await FirebaseRepository.deleteProduct(id);
      } catch (err) {
        console.warn('Firestore delete warning:', err);
      }
      showToast('Product deleted from catalog.');
    }
  };

  const handleClearAllProducts = async () => {
    if (confirm('Are you sure you want to delete ALL products from the catalog and database? This action cannot be undone.')) {
      setProducts([]);
      localStorage.removeItem('iwc_products');
      try {
        await FirebaseRepository.clearAllProducts();
      } catch (err) {
        console.warn('Firestore clear error:', err);
      }
      showToast('All products deleted from catalog and Firestore.');
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdCode(`IWC-${Math.floor(100 + Math.random() * 900)}`);
    setProdName('');
    setProdPrice(150000);
    setProdSalePrice(125000);
    setProdImages([]);
    setProdWood('MDF High Gloss & Solid Wood');
    setProdDesc('');
  };

  const handleSavePaymentAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentDetails(editingPayment);
  };

  // Banner Slide Management Handlers
  const handleEditBannerSlide = (slide: BannerSlide) => {
    setEditingBanner(slide);
    setBannerTitle(slide.title);
    setBannerSubtitle(slide.subtitle);
    setBannerImage(slide.image);
    setBannerBadge(slide.badge || '');
    setBannerCtaText(slide.ctaText || '');
    setBannerCategoryFilter(slide.categoryFilter || '');
    setBannerIsCustomOrder(slide.isCustomOrder || false);
    setIsBannerModalOpen(true);
  };

  const handleCreateNewBannerSlide = () => {
    setEditingBanner(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerImage('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80');
    setBannerBadge('NEW 2026 ROYAL COLLECTION');
    setBannerCtaText('Explore Collection');
    setBannerCategoryFilter('');
    setBannerIsCustomOrder(false);
    setIsBannerModalOpen(true);
  };

  const handleSaveBannerSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImage.trim()) return;

    const newSlide: BannerSlide = {
      id: editingBanner ? editingBanner.id : `banner-${Date.now()}`,
      title: bannerTitle,
      subtitle: bannerSubtitle,
      image: bannerImage,
      badge: bannerBadge,
      ctaText: bannerCtaText,
      categoryFilter: bannerCategoryFilter,
      isCustomOrder: bannerIsCustomOrder
    };

    await saveBannerSlide(newSlide);
    setIsBannerModalOpen(false);
  };

  // Trust Message Handlers
  const handleEditTrustMsg = (msg: TrustMessage) => {
    setEditingTrustMsg(msg);
    setTrustText(msg.text);
    setTrustIcon(msg.icon || 'Sparkles');
    setIsTrustModalOpen(true);
  };

  const handleCreateNewTrustMsg = () => {
    setEditingTrustMsg(null);
    setTrustText('');
    setTrustIcon('Sparkles');
    setIsTrustModalOpen(true);
  };

  const handleSaveTrustMsgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trustText.trim()) return;

    const newMsg: TrustMessage = {
      id: editingTrustMsg ? editingTrustMsg.id : `tm-${Date.now()}`,
      text: trustText.trim(),
      icon: trustIcon
    };

    await saveTrustMessage(newMsg);
    setIsTrustModalOpen(false);
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle) return;
    showToast(`Push Notification Sent: "${notifTitle}"`);
    setNotifTitle('');
    setNotifMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 text-white">
      {/* Admin Header */}
      <div className="bg-stone-900 border border-[#d4af37]/60 rounded-2xl p-6 shadow-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs bg-[#d4af37] text-black font-extrabold px-2 py-0.5 rounded uppercase">
              Admin Access Active
            </span>
            <span className="text-xs text-stone-400 font-mono">DHA Phase 6 Showroom Terminal</span>
            <LiveClock variant="full" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-amber-100 mt-1">
            IQBAL WOODCRAFT Management Dashboard
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'dashboard' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'products' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'banners' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Hero Banners ({bannerSlides.length})
          </button>
          <button
            onClick={() => setActiveTab('trust')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'trust' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            Trust Marquee ({trustMessages.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'orders' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'custom' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Custom Inquiries ({customOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'ai' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-300" />
            AI Assistant & Knowledge ({aiConversations.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeTab === 'payments' ? 'bg-[#d4af37] text-black' : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Bank Accounts
          </button>
        </div>
      </div>

      {/* Tab 1: Overview Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-stone-400">Total Showroom Revenue</span>
              <div className="text-2xl font-black text-[#d4af37] font-mono">
                PKR {totalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">100% Advance Verified Payments</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-stone-400">Total Customer Orders</span>
              <div className="text-2xl font-black text-amber-100 font-mono">
                {orders.length} Orders
              </div>
              <span className="text-[10px] text-amber-400 font-medium">{pendingPayments} Pending Verification</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-stone-400">Custom Order Inquiries</span>
              <div className="text-2xl font-black text-amber-100 font-mono">
                {customOrders.length} Requests
              </div>
              <span className="text-[10px] text-stone-400">Tailor-made Sheesham & Teak</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-stone-400">Furniture Catalog Items</span>
              <div className="text-2xl font-black text-amber-100 font-mono">
                {products.length} Products
              </div>
              <span className="text-[10px] text-stone-400">Across 15 Categories</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-serif font-bold text-amber-200 text-lg border-b border-stone-800 pb-2">
              Quick Admin Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  resetProductForm();
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 bg-[#d4af37] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow hover:brightness-110"
              >
                <Plus className="w-4 h-4" />
                Add New Furniture Product
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-4 py-2.5 bg-stone-800 border border-stone-700 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                Update Cargo Bilty Numbers
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className="px-4 py-2.5 bg-stone-800 border border-stone-700 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4 text-[#d4af37]" />
                Update Bank IBAN Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Products */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-amber-100">
                Interior & Furniture Inventory ({products.length})
              </h2>
              <p className="text-stone-400 text-xs mt-0.5">Manage products, upload images, update free-text specifications & custom categories.</p>
            </div>
            
            <div className="flex items-center gap-2">
              {products.length > 0 && (
                <button
                  onClick={handleClearAllProducts}
                  className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
                  title="Delete all products from catalog and database"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  Wipe Catalog Products
                </button>
              )}
              <button
                onClick={() => {
                  resetProductForm();
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2 bg-[#d4af37] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow hover:brightness-110"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-amber-300 font-bold uppercase border-b border-stone-800">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Code</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Specification / Material</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-950/50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={prod.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        <span className="font-bold text-amber-100">{prod.name}</span>
                      </td>
                      <td className="p-3 font-mono text-amber-400">{prod.code}</td>
                      <td className="p-3">{prod.category}</td>
                      <td className="p-3">{prod.woodType}</td>
                      <td className="p-3 font-bold text-[#d4af37]">PKR {(prod.salePrice || prod.price).toLocaleString()}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => editProductClick(prod)}
                          className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProductClick(prod.id)}
                          className="p-1.5 bg-stone-800 hover:bg-red-900 text-red-300 rounded-lg"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2.5: Manage Hero Banner Slides */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif font-bold text-xl text-amber-100">
                Hero Banners & Promotional Slider ({bannerSlides.length})
              </h2>
              <p className="text-xs text-stone-400">Manage dynamic background banners synced with Firebase Firestore.</p>
            </div>
            <button
              onClick={handleCreateNewBannerSlide}
              className="px-4 py-2 bg-[#d4af37] text-black font-bold text-xs rounded-xl hover:bg-amber-400 flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Banner Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bannerSlides.map(slide => (
              <div key={slide.id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 w-full">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  {slide.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 border border-[#d4af37] text-[#d4af37] text-[10px] font-bold rounded-full">
                      {slide.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-amber-100 text-base">{slide.title}</h3>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2">{slide.subtitle}</p>
                    {slide.categoryFilter && (
                      <span className="inline-block mt-2 text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                        Category Link: {slide.categoryFilter}
                      </span>
                    )}
                  </div>
                  <div className="pt-3 border-t border-stone-800 flex justify-between items-center text-xs">
                    <span className="text-amber-400 font-medium">{slide.ctaText || 'Explore'}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBannerSlide(slide)}
                        className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold rounded-lg flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteBannerSlide(slide.id)}
                        className="px-3 py-1 bg-stone-800 hover:bg-red-900 text-red-300 font-bold rounded-lg flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2.6: Manage Trust Marquee Messages */}
      {activeTab === 'trust' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif font-bold text-xl text-amber-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                Auto Scrolling Trust Marquee ({trustMessages.length})
              </h2>
              <p className="text-xs text-stone-400">Dynamic promotional trust messages synced with Firebase Firestore.</p>
            </div>
            <button
              onClick={handleCreateNewTrustMsg}
              className="px-4 py-2 bg-[#d4af37] text-black font-bold text-xs rounded-xl hover:bg-amber-400 flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Trust Message
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {trustMessages.map(msg => (
              <div key={msg.id} className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-[#d4af37] border border-amber-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-amber-100 text-sm">{msg.text}</h4>
                    <span className="text-[10px] text-stone-400 font-mono">Icon: {msg.icon || 'Sparkles'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEditTrustMsg(msg)}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg transition"
                    title="Edit Message"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteTrustMessage(msg.id)}
                    className="p-1.5 bg-stone-800 hover:bg-red-900 text-red-300 rounded-lg transition"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Manage Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-xl text-amber-100">
            Customer Orders & Cargo Dispatch ({orders.length})
          </h2>

          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-800 pb-3 gap-2">
                  <div>
                    <span className="text-xs font-mono text-[#d4af37] font-bold">Order #{ord.orderNumber}</span>
                    <h4 className="font-serif font-bold text-amber-100 text-base">{ord.customerName} ({ord.phone})</h4>
                    <p className="text-stone-400 text-xs">{ord.shippingAddress}, {ord.city}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-[#d4af37]">PKR {ord.totalAmount.toLocaleString()}</span>
                    <p className="text-[11px] text-amber-300 font-mono">
                      Txn Ref: <code className="text-white bg-black px-1 rounded">{ord.paymentReferenceTxn || 'N/A'}</code> ({ord.paymentMethod})
                    </p>
                  </div>
                </div>

                {/* Status Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Payment Verification Status:</label>
                    <select
                      value={ord.paymentStatus}
                      onChange={(e) => updateOrderStatus(ord.id, ord.orderStatus, e.target.value as any)}
                      className="w-full bg-stone-900 border border-stone-700 text-amber-300 rounded-lg p-2 font-bold"
                    >
                      <option value="Pending 100% Advance Verification">Pending 100% Advance Verification</option>
                      <option value="Payment Verified">Payment Verified</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Production & Crafting Lifecycle:</label>
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                      className="w-full bg-stone-900 border border-stone-700 text-amber-300 rounded-lg p-2 font-bold"
                    >
                      <option value="Order Received">Order Received</option>
                      <option value="Payment Confirmed">Payment Confirmed</option>
                      <option value="Wood Workshop Assembly">Wood Workshop Assembly</option>
                      <option value="Polishing & Quality Check">Polishing & Quality Check</option>
                      <option value="Dispatched via Cargo Bilty">Dispatched via Cargo Bilty</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Cargo Bilty Tracking Number:</label>
                    <input
                      type="text"
                      placeholder="e.g. NLC-KAR-89104"
                      defaultValue={ord.cargoBiltyNumber || ''}
                      onBlur={(e) => updateOrderStatus(ord.id, ord.orderStatus, ord.paymentStatus, e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 text-amber-100 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Manage Custom Inquiries */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-xl text-amber-100">
            Custom Furniture Requests ({customOrders.length})
          </h2>

          <div className="space-y-4">
            {customOrders.map((cust) => (
              <div key={cust.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-3 text-xs">
                <div className="flex justify-between items-start border-b border-stone-800 pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-amber-200 text-base">{cust.preferredDesignTitle}</h4>
                    <p className="text-stone-300">Client: {cust.customerName} ({cust.phone}) - {cust.city}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg font-bold">
                    {cust.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-stone-300">
                  <div><strong>Category:</strong> {cust.category}</div>
                  <div><strong>Wood:</strong> {cust.woodType}</div>
                  <div><strong>Dimensions:</strong> {cust.dimensions}</div>
                  <div><strong>Budget:</strong> PKR {cust.budgetPkr.toLocaleString()}</div>
                </div>

                <p className="text-stone-400 italic">"{cust.specialRequirements}"</p>

                {/* Admin Status Updater */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800">
                  <span className="text-stone-400 font-bold">Update Status:</span>
                  {(['Pending Review', 'In Discussion', 'Quote Sent', 'Payment Received', 'In Crafting Phase', 'Dispatched'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => updateCustomOrderStatus(cust.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                        cust.status === st ? 'bg-[#d4af37] text-black border-amber-300' : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Payment Account Details */}
      {activeTab === 'payments' && (
        <div className="max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
          <h2 className="font-serif font-bold text-xl text-amber-100 border-b border-stone-800 pb-2">
            Update Official Showroom Payment Accounts
          </h2>

          <form onSubmit={handleSavePaymentAccounts} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-300 mb-1">Bank Name & Branch</label>
              <input
                type="text"
                value={editingPayment.bankName}
                onChange={(e) => setEditingPayment({ ...editingPayment, bankName: e.target.value })}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 mb-1">Account Title</label>
                <input
                  type="text"
                  value={editingPayment.accountTitle}
                  onChange={(e) => setEditingPayment({ ...editingPayment, accountTitle: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">IBAN Number</label>
                <input
                  type="text"
                  value={editingPayment.iban}
                  onChange={(e) => setEditingPayment({ ...editingPayment, iban: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 font-mono text-amber-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 mb-1">JazzCash Mobile</label>
                <input
                  type="text"
                  value={editingPayment.jazzCashNumber}
                  onChange={(e) => setEditingPayment({ ...editingPayment, jazzCashNumber: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 font-mono text-amber-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">EasyPaisa Mobile</label>
                <input
                  type="text"
                  value={editingPayment.easyPaisaNumber}
                  onChange={(e) => setEditingPayment({ ...editingPayment, easyPaisaNumber: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 font-mono text-amber-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#d4af37] text-black font-extrabold rounded-xl shadow hover:brightness-110 uppercase"
            >
              Save Official Account Details
            </button>
          </form>
        </div>
      )}

      {/* Tab 5: AI Assistant & Knowledge Base Management */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* AI Bot System Status Header */}
          <div className="bg-stone-900 border border-[#d4af37]/50 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-stone-950 border border-[#d4af37] rounded-xl text-[#d4af37]">
                  <Bot className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center gap-2">
                    IQBAL WOODCRAFT AI Assistant Console
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  </h2>
                  <p className="text-xs text-amber-300">
                    24/7 Showroom Sales Consultant • Connected to Gemini API & Local Timber Engine
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  AI Agent Online (24/7)
                </span>
                <span className="px-3 py-1.5 bg-red-950 text-red-300 border border-red-800 rounded-xl">
                  100% Advance Policy Active (No COD)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2 border-t border-stone-800">
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block mb-0.5">Sales Escalation WhatsApp</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">0309-3509242</span>
              </div>
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block mb-0.5">Custom Furniture AI Wizard</span>
                <span className="text-amber-300 font-bold text-sm">Active & Capturing Inquiries</span>
              </div>
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-stone-400 block mb-0.5">System Knowledge Base</span>
                <span className="text-amber-100 font-bold text-sm">{aiFaqs.length} Active FAQs Configured</span>
              </div>
            </div>
          </div>

          {/* Section A: AI Knowledge Base & FAQs Manager */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#d4af37]" />
                  AI Knowledge Base & FAQs Manager
                </h3>
                <p className="text-xs text-stone-400">
                  Update questions, pricing policies, and delivery knowledge used by the AI Assistant.
                </p>
              </div>
            </div>

            {/* Add New FAQ Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (!newFaqQ || !newFaqA) return;
                addAiFaq({
                  question: newFaqQ,
                  answer: newFaqA,
                  category: newFaqCat
                });
                setNewFaqQ('');
                setNewFaqA('');
              }}
              className="bg-stone-950 border border-stone-800 rounded-xl p-4 space-y-3 text-xs"
            >
              <h4 className="font-bold text-amber-300">Add New AI FAQ Entry:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-stone-300 mb-1">Customer Question *</label>
                  <input
                    type="text"
                    required
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    placeholder="e.g. Do you deliver furniture to Islamabad and Lahore?"
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2 text-amber-100"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Topic Category *</label>
                  <select
                    value={newFaqCat}
                    onChange={(e) => setNewFaqCat(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2 text-amber-100"
                  >
                    <option value="Payment">Payment</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Products">Products</option>
                    <option value="Custom Furniture">Custom Furniture</option>
                    <option value="Warranty">Warranty</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-stone-300 mb-1">AI Official Answer *</label>
                <textarea
                  required
                  rows={2}
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  placeholder="Enter the exact answer the AI should provide customers..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2 text-amber-100"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#d4af37] text-black font-extrabold rounded-xl hover:brightness-110 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add FAQ to AI Knowledge Base
              </button>
            </form>

            {/* List of FAQs */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-300 text-xs">Active Knowledge Base Entries ({aiFaqs.length}):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {aiFaqs.map((faq) => (
                  <div key={faq.id} className="bg-stone-950 border border-stone-800 rounded-xl p-3 space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] font-bold rounded text-[10px] uppercase">
                        {faq.category}
                      </span>
                      <button
                        onClick={() => deleteAiFaq(faq.id)}
                        className="text-stone-500 hover:text-red-400 p-1"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-amber-100">{faq.question}</p>
                    <p className="text-stone-300 text-[11px] leading-relaxed bg-stone-900/60 p-2 rounded-lg">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section B: Customer AI Conversations Log */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#d4af37]" />
                  Customer AI Conversations & Chat Logs
                </h3>
                <p className="text-xs text-stone-400">
                  Review real-time customer conversations captured by the AI Assistant.
                </p>
              </div>
            </div>

            {aiConversations.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No customer AI conversations logged yet.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {aiConversations.map((conv) => {
                  const isExpanded = expandedConvId === conv.id;
                  return (
                    <div key={conv.id} className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-stone-900 pb-2">
                        <div>
                          <h4 className="font-serif font-bold text-amber-200 text-sm">
                            Customer: {conv.customerName}
                          </h4>
                          <p className="text-[11px] text-stone-400">
                            Phone: <span className="text-emerald-400 font-mono">{conv.phone || 'N/A'}</span> • Last Active: {new Date(conv.lastActive).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            conv.status.includes('Custom') 
                              ? 'bg-amber-950 text-amber-300 border border-amber-700' 
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {conv.status}
                          </span>
                          <button
                            onClick={() => setExpandedConvId(isExpanded ? null : conv.id)}
                            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl"
                          >
                            {isExpanded ? 'Hide Chat' : `View Thread (${conv.messages.length} msgs)`}
                          </button>
                        </div>
                      </div>

                      {/* Thread Transcript */}
                      {isExpanded && (
                        <div className="bg-stone-900 p-3 rounded-xl space-y-2 max-h-60 overflow-y-auto mt-2 border border-stone-800">
                          {conv.messages.map((m, idx) => (
                            <div key={idx} className={`p-2 rounded-lg text-[11px] ${
                              m.sender === 'user' 
                                ? 'bg-[#d4af37]/20 border border-[#d4af37]/30 text-amber-100 ml-4' 
                                : 'bg-stone-950 border border-stone-800 text-stone-300 mr-4'
                            }`}>
                              <span className="font-bold text-[#d4af37] block mb-0.5">
                                {m.sender === 'user' ? 'Customer' : 'IQBAL AI Assistant'} ({m.timestamp}):
                              </span>
                              <p className="whitespace-pre-wrap">{m.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-[#d4af37]/60 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="font-serif font-bold text-lg text-amber-100">
                {editingProduct ? 'Edit Furniture / Interior Item' : 'Add New Furniture Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Product Code *</label>
                  <input
                    type="text"
                    value={prodCode}
                    onChange={(e) => setProdCode(e.target.value)}
                    required
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-stone-300 font-medium">Category *</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                      className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 font-bold"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      {isAddingNewCat ? 'Select Existing' : '+ Add New Category'}
                    </button>
                  </div>

                  {isAddingNewCat ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Enter new category name..."
                        className="flex-1 bg-stone-950 border border-amber-500/50 rounded-xl p-2.5 text-amber-100 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddNewCategory}
                        className="px-3 py-2.5 bg-[#d4af37] text-black font-extrabold rounded-xl text-xs"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 text-xs"
                    >
                      {availableCategoryNames.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Furniture Product Name *</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  required
                  placeholder="e.g. Master Bedroom Sliding Wardrobe / Sheesham Dining Table"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Regular Price (PKR)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Sale Price (PKR)</label>
                  <input
                    type="number"
                    value={prodSalePrice}
                    onChange={(e) => setProdSalePrice(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 font-bold text-[#d4af37]"
                  />
                </div>
              </div>

              {/* Free-Text Specifications */}
              <div>
                <label className="block text-stone-300 mb-1 font-medium">
                  Specifications & Materials (Free Text Input - Type Anything) *
                </label>
                <input
                  type="text"
                  value={prodWood}
                  onChange={(e) => setProdWood(e.target.value)}
                  required
                  placeholder="e.g. MDF, Acrylic Finish, High Gloss, Solid Wood, Quartz, Aluminium, Plywood..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100 font-medium text-xs"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] text-stone-500 py-0.5">Quick Examples:</span>
                  {['MDF', 'HDF', 'Solid Sheesham', 'Teak Wood', 'Walnut Wood', 'Acrylic Finish', 'High Gloss', 'Matte Finish', 'Aluminium', 'Steel', 'Glass', 'Marble', 'Quartz', 'Plywood', 'PVC', 'Imported Material'].map(chip => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setProdWood(prev => prev ? (prev.includes(chip) ? prev : `${prev}, ${chip}`) : chip)}
                      className="px-2 py-0.5 bg-stone-800 hover:bg-[#d4af37] hover:text-black text-amber-300 text-[10px] rounded-md border border-stone-700/80 transition"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multiple Image Upload (No URL Text Box) */}
              <div className="space-y-2">
                <label className="block text-stone-300 font-medium">
                  Product Images (Upload Direct from Device) *
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-amber-500/40 hover:border-[#d4af37] bg-stone-950/80 hover:bg-stone-950 p-5 rounded-2xl cursor-pointer transition text-center group">
                  <Upload className="w-7 h-7 text-[#d4af37] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-amber-200 text-xs">Click or Drag & Drop to Upload Images</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">Select multiple images directly from your phone/computer</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>

                {prodImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2.5 mt-3">
                    {prodImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group bg-stone-950 border border-stone-800 rounded-xl overflow-hidden">
                        <img src={imgUrl} alt={`Product thumbnail ${idx + 1}`} className="w-full h-20 object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-black text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow">
                            Cover
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setCoverProductImage(idx)}
                              className="p-1 bg-amber-500 text-black rounded text-[9px] font-bold"
                              title="Set as Cover Photo"
                            >
                              Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeProductImage(idx)}
                            className="p-1 bg-red-600 text-white rounded"
                            title="Delete Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-400/80 italic">No images uploaded yet. Upload at least one image.</p>
                )}
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Dimensions</label>
                <input
                  type="text"
                  value={prodDimensions}
                  onChange={(e) => setProdDimensions(e.target.value)}
                  placeholder="e.g. Length: 8ft | Width: 6ft | Height: 30 inches"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Description</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  rows={3}
                  placeholder="Detail product features, finish, and guarantees..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-amber-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#d4af37] text-black font-extrabold rounded-xl shadow hover:brightness-110 text-xs tracking-wider uppercase"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Banner Slide Add/Edit Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl p-6 max-w-lg w-full text-white relative shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-xl text-amber-100 border-b border-stone-800 pb-2">
              {editingBanner ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
            </h3>

            <form onSubmit={handleSaveBannerSlideSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 mb-1 font-bold">Banner Headline *</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={e => setBannerTitle(e.target.value)}
                  placeholder="e.g. Master Handcrafted Solid Wood Furniture"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-amber-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-bold">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={bannerSubtitle}
                  onChange={e => setBannerSubtitle(e.target.value)}
                  placeholder="e.g. Complete woodwork solutions for home & office..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-bold">Image URL *</label>
                <input
                  type="text"
                  required
                  value={bannerImage}
                  onChange={e => setBannerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Base64 / asset path"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-amber-200 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">Badge Text</label>
                  <input
                    type="text"
                    value={bannerBadge}
                    onChange={e => setBannerBadge(e.target.value)}
                    placeholder="e.g. NEW 2026 ROYAL COLLECTION"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-amber-300"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-bold">CTA Button Label</label>
                  <input
                    type="text"
                    value={bannerCtaText}
                    onChange={e => setBannerCtaText(e.target.value)}
                    placeholder="e.g. View Bedroom Furniture"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-bold">Link Category Collection</label>
                <input
                  type="text"
                  value={bannerCategoryFilter}
                  onChange={e => setBannerCategoryFilter(e.target.value)}
                  placeholder="e.g. Bedroom, American Kitchen, Sofa, Doors..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-amber-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="customOrderChk"
                  checked={bannerIsCustomOrder}
                  onChange={e => setBannerIsCustomOrder(e.target.checked)}
                  className="w-4 h-4 accent-[#d4af37]"
                />
                <label htmlFor="customOrderChk" className="text-stone-300 font-medium cursor-pointer">
                  Direct CTA to Custom Order Wizard instead of category
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#d4af37] text-black font-extrabold rounded-xl hover:bg-amber-400 uppercase tracking-wider text-xs shadow-lg"
              >
                Save Banner Slide to Firebase
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trust Message Add/Edit Modal */}
      {isTrustModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl p-6 max-w-md w-full text-white relative shadow-2xl space-y-4">
            <button
              onClick={() => setIsTrustModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-xl text-amber-100 border-b border-stone-800 pb-2">
              {editingTrustMsg ? 'Edit Trust Message' : 'Add New Trust Message'}
            </h3>

            <form onSubmit={handleSaveTrustMsgSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 mb-1 font-bold">Promotional Message Text *</label>
                <input
                  type="text"
                  required
                  value={trustText}
                  onChange={e => setTrustText(e.target.value)}
                  placeholder="e.g. Custom Furniture Designed for Your Space"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-amber-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-bold">Icon Type</label>
                <select
                  value={trustIcon}
                  onChange={e => setTrustIcon(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-amber-300 font-medium"
                >
                  <option value="Ruler">Ruler (Custom Fit)</option>
                  <option value="Gem">Gem (Premium Quality)</option>
                  <option value="Sparkles">Sparkles (Elegant Living)</option>
                  <option value="Palette">Palette (Tailored Solutions)</option>
                  <option value="Crown">Crown (Royal Luxury)</option>
                  <option value="CheckCircle2">CheckCircle2 (Lasting Beauty)</option>
                  <option value="Compass">Compass (Expert Consultation)</option>
                  <option value="Feather">Feather (Precision Detail)</option>
                  <option value="Star">Star (Beautiful Spaces)</option>
                  <option value="ShieldCheck">ShieldCheck (Reflects Lifestyle)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#d4af37] text-black font-extrabold rounded-xl hover:bg-amber-400 uppercase tracking-wider text-xs shadow-lg mt-2"
              >
                Save Trust Message to Firebase
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
