import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  CustomOrderRequest, 
  PaymentAccountDetails, 
  ShowroomContactInfo, 
  CustomerUser,
  WoodType,
  AiChatMessage,
  AiFaqItem,
  AiConversationLog,
  AppNotification,
  ProductReview
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_PAYMENT_DETAILS, SHOWROOM_CONTACT, INITIAL_FAQS, INITIAL_CONVERSATIONS } from '../data/mockData';
import { FirebaseRepository } from '../services/firebaseRepository';


import { AuthService } from '../services/authService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { SavedAddress, UserRole } from '../types';

export type AppScreen = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'custom-order' 
  | 'cart' 
  | 'checkout' 
  | 'my-orders' 
  | 'contact' 
  | 'admin' 
  | 'catalogue'
  | 'profile';

interface AppContextType {
  // Screen & Navigation
  currentScreen: AppScreen;
  setCurrentScreen: (screen: AppScreen) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  
  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedWoodType: WoodType | 'All';
  setSelectedWoodType: (wood: WoodType | 'All') => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  setSortBy: (sort: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest') => void;

  // Data Collections
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  
  // Orders & Custom Orders
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], paymentStatus?: Order['paymentStatus'], cargoBilty?: string) => void;
  
  customOrders: CustomOrderRequest[];
  submitCustomOrder: (req: Omit<CustomOrderRequest, 'id' | 'createdAt' | 'status'>) => CustomOrderRequest;
  updateCustomOrderStatus: (id: string, status: CustomOrderRequest['status'], adminNotes?: string, quotePkr?: number) => void;

  // Payment Details & Admin
  paymentDetails: PaymentAccountDetails;
  updatePaymentDetails: (details: PaymentAccountDetails) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  
  // AI Knowledge & Admin Logs
  aiFaqs: AiFaqItem[];
  addAiFaq: (faq: Omit<AiFaqItem, 'id'>) => void;
  deleteAiFaq: (id: string) => void;
  aiConversations: AiConversationLog[];
  addAiConversationLog: (log: AiConversationLog) => void;
  
  // Contact & User Auth
  contactInfo: ShowroomContactInfo;
  currentUser: CustomerUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<CustomerUser>>;
  isLoggedIn: boolean;
  logoutUser: () => Promise<void>;
  updateUserProfile: (updates: Partial<CustomerUser>) => Promise<void>;
  addSavedAddress: (addr: Omit<SavedAddress, 'id'>) => Promise<void>;
  deleteSavedAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;

  // Auth Modal State
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  authModalInitialTab: 'login' | 'register' | 'phone' | 'reset' | 'profile';
  openAuthModal: (tab?: 'login' | 'register' | 'phone' | 'reset' | 'profile') => void;

  // UI States
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isAiConsultantOpen: boolean;
  setIsAiConsultantOpen: (val: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (val: boolean) => void;

  // Modern UX Features (Search, Comparison, Reviews, Push Notifications, Recently Viewed)
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
  compareList: string[];
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (val: boolean) => void;
  isLiveSearchOpen: boolean;
  setIsLiveSearchOpen: (val: boolean) => void;
  isVoiceSearchListening: boolean;
  startVoiceSearch: (onResult?: (text: string) => void) => void;
  stopVoiceSearch: () => void;
  pushNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (val: boolean) => void;
  requestPushPermission: () => Promise<void>;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date'>) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWoodType, setSelectedWoodType] = useState<WoodType | 'All'>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');

  // UI Controls
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('iwc_dark_mode') === 'true';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAiConsultantOpen, setIsAiConsultantOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Core Data Persistent States
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('iwc_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('iwc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('iwc_wishlist');
    return saved ? JSON.parse(saved) : ['prod-001', 'prod-002'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('iwc_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ord-101',
        orderNumber: 'IWC-2026-8942',
        items: [
          {
            productId: 'prod-001',
            productCode: 'IWC-BED-101',
            productName: 'Royal Chinioti Crown King Bedroom Suite',
            price: 325000,
            quantity: 1,
            image: '/src/assets/images/iqbal_hero_bedroom_1785234338239.jpg'
          }
        ],
        subtotal: 325000,
        deliveryCharge: 8500,
        totalAmount: 333500,
        customerName: 'Mian Tariq Hassan',
        phone: '0300-4829102',
        whatsapp: '0300-4829102',
        email: 'tariqhassan@gmail.com',
        city: 'Lahore',
        shippingAddress: 'House 42, Block C1, Gulberg III, Lahore',
        paymentMethod: 'Bank Transfer',
        paymentReferenceTxn: 'MEZN-904812391',
        paymentProofNote: 'Transferred 100% advance via Meezan App',
        paymentStatus: 'Payment Verified',
        orderStatus: 'Wood Workshop Assembly',
        cargoBiltyNumber: 'NLC-LHR-89410',
        estimatedDeliveryDate: '02 August 2026',
        createdAt: '2026-07-26T14:30:00.000Z'
      }
    ];
  });

  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>(() => {
    const saved = localStorage.getItem('iwc_custom_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'cust-1',
        customerName: 'Usman Ali',
        phone: '0321-9876543',
        email: 'usmanali@gmail.com',
        city: 'Karachi',
        category: 'Custom Furniture',
        preferredDesignTitle: 'Custom 10-Seater Royal Conference Table',
        dimensions: 'Length: 14 Feet | Width: 5 Feet | Height: 30 Inches',
        woodType: 'Solid Sheesham (Chinioti Rosewood)',
        colourStain: 'Walnut High Gloss with Brass Strip Inlays',
        budgetPkr: 350000,
        specialRequirements: 'Needs built-in pop-up electrical sockets and central leather writing pad.',
        status: 'In Discussion',
        createdAt: '2026-07-27T10:15:00.000Z',
        adminNotes: 'Spoke with client on WhatsApp. Reviewing brass inlay shop drawings.',
        estimatedPricePkr: 380000
      }
    ];
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentAccountDetails>(() => {
    const saved = localStorage.getItem('iwc_payment_details');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_DETAILS;
  });

  const [aiFaqs, setAiFaqs] = useState<AiFaqItem[]>(() => {
    const saved = localStorage.getItem('iwc_ai_faqs');
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [aiConversations, setAiConversations] = useState<AiConversationLog[]>(() => {
    const saved = localStorage.getItem('iwc_ai_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  // Auth Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register' | 'phone' | 'reset' | 'profile'>('login');

  const openAuthModal = (tab: 'login' | 'register' | 'phone' | 'reset' | 'profile' = 'login') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const [currentUser, setCurrentUser] = useState<CustomerUser>(() => {
    const saved = localStorage.getItem('iwc_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 'guest-001',
      uid: 'guest-001',
      name: 'Chinioti Furniture Lover',
      phone: '+92 300 1234567',
      email: 'customer@iqbalwoodcraft.com',
      city: 'Chiniot',
      role: 'Customer',
      authProvider: 'anonymous',
      savedAddresses: [
        {
          id: 'addr-main-1',
          label: 'Home Residence',
          address: 'House 14, Main Raiwind Road, Lake City, Lahore',
          city: 'Lahore',
          isDefault: true
        },
        {
          id: 'addr-main-2',
          label: 'Showroom / Office',
          address: 'Plot 45-C, Main Boulevard, DHA Phase 6, Lahore',
          city: 'Lahore',
          isDefault: false
        }
      ],
      addresses: ['House 14, Main Raiwind Road, Lake City, Lahore'],
      wishlistProductIds: ['prod-001', 'prod-002'],
      isAdmin: false,
      isManager: false,
      createdAt: new Date().toISOString()
    };
  });

  const isLoggedIn = currentUser.authProvider !== 'anonymous' && currentUser.uid !== 'guest-001';

  // Effects for Realtime Firebase Synchronization
  useEffect(() => {
    // 1. Subscribe Products
    const unsubProducts = FirebaseRepository.subscribeProducts((remoteProducts) => {
      if (remoteProducts && remoteProducts.length > 0) {
        setProducts(remoteProducts);
      } else {
        // Seed initial products to Firestore on first run
        INITIAL_PRODUCTS.forEach(p => FirebaseRepository.saveProduct(p));
      }
    });

    // 2. Subscribe Orders
    const unsubOrders = FirebaseRepository.subscribeOrders((remoteOrders) => {
      if (remoteOrders && remoteOrders.length > 0) {
        setOrders(remoteOrders);
      }
    });

    // 3. Subscribe Custom Orders
    const unsubCustom = FirebaseRepository.subscribeCustomOrders((remoteCustom) => {
      if (remoteCustom && remoteCustom.length > 0) {
        setCustomOrders(remoteCustom);
      }
    });

    // 4. Subscribe AI FAQs
    const unsubFaqs = FirebaseRepository.subscribeAiFaqs((remoteFaqs) => {
      if (remoteFaqs && remoteFaqs.length > 0) {
        setAiFaqs(remoteFaqs as any);
      }
    });

    // 5. Subscribe AI Conversations
    const unsubConvs = FirebaseRepository.subscribeAiConversations((remoteConvs) => {
      if (remoteConvs && remoteConvs.length > 0) {
        setAiConversations(remoteConvs as any);
      }
    });

    // 6. Subscribe Payment Details
    const unsubPayment = FirebaseRepository.subscribePaymentDetails((remotePayment) => {
      if (remotePayment) {
        setPaymentDetails(remotePayment as any);
      }
    });

    // 7. Subscribe Realtime Auth User Profile
    let unsubUserProfile: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && !fbUser.isAnonymous) {
        if (unsubUserProfile) unsubUserProfile();
        unsubUserProfile = FirebaseRepository.subscribeUserProfile(fbUser.uid, (remoteProfile) => {
          if (remoteProfile) {
            setCurrentUser(remoteProfile);
            if (remoteProfile.role === 'Admin') {
              setIsAdminLoggedIn(true);
            }
          }
        });
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustom();
      unsubFaqs();
      unsubConvs();
      unsubPayment();
      unsubAuth();
      if (unsubUserProfile) unsubUserProfile();
    };
  }, []);

  // Sync user state to LocalStorage
  useEffect(() => {
    localStorage.setItem('iwc_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Auth & Profile Actions
  const logoutUser = async () => {
    await AuthService.logout();
    setCurrentUser({
      id: 'guest-001',
      uid: 'guest-001',
      name: 'Guest Patron',
      phone: '',
      email: '',
      city: 'Chiniot',
      role: 'Customer',
      authProvider: 'anonymous',
      savedAddresses: [],
      addresses: [],
      wishlistProductIds: [],
      isAdmin: false,
      isManager: false
    });
    setIsAdminLoggedIn(false);
    showToast('Logged out successfully.');
  };

  const updateUserProfile = async (updates: Partial<CustomerUser>) => {
    const updated = {
      ...currentUser,
      ...updates
    };
    setCurrentUser(updated);
    if (updated.uid && updated.uid !== 'guest-001') {
      await FirebaseRepository.saveUserProfile(updated);
    }
    showToast('Profile updated successfully!');
  };

  const addSavedAddress = async (addr: Omit<SavedAddress, 'id'>) => {
    const newAddressObj: SavedAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    
    // If setting as default or if it's the first address
    let updatedList = currentUser.savedAddresses || [];
    if (addr.isDefault || updatedList.length === 0) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
      newAddressObj.isDefault = true;
    }
    updatedList = [...updatedList, newAddressObj];

    const updatedUser = {
      ...currentUser,
      savedAddresses: updatedList,
      addresses: updatedList.map(a => `${a.address}, ${a.city}`)
    };

    setCurrentUser(updatedUser);
    if (updatedUser.uid && updatedUser.uid !== 'guest-001') {
      await FirebaseRepository.saveUserProfile(updatedUser);
    }
    showToast(`Saved address "${addr.label}" added!`);
  };

  const deleteSavedAddress = async (addressId: string) => {
    const updatedList = (currentUser.savedAddresses || []).filter(a => a.id !== addressId);
    const updatedUser = {
      ...currentUser,
      savedAddresses: updatedList,
      addresses: updatedList.map(a => `${a.address}, ${a.city}`)
    };
    setCurrentUser(updatedUser);
    if (updatedUser.uid && updatedUser.uid !== 'guest-001') {
      await FirebaseRepository.saveUserProfile(updatedUser);
    }
    showToast('Address removed.');
  };

  const setDefaultAddress = async (addressId: string) => {
    const updatedList = (currentUser.savedAddresses || []).map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    const updatedUser = {
      ...currentUser,
      savedAddresses: updatedList
    };
    setCurrentUser(updatedUser);
    if (updatedUser.uid && updatedUser.uid !== 'guest-001') {
      await FirebaseRepository.saveUserProfile(updatedUser);
    }
    showToast('Default delivery address updated.');
  };

  const setUserRole = async (role: UserRole) => {
    const updatedUser: CustomerUser = {
      ...currentUser,
      role,
      isAdmin: role === 'Admin',
      isManager: role === 'Manager'
    };
    setCurrentUser(updatedUser);
    if (role === 'Admin') {
      setIsAdminLoggedIn(true);
    } else {
      setIsAdminLoggedIn(false);
    }
    if (updatedUser.uid && updatedUser.uid !== 'guest-001') {
      await FirebaseRepository.saveUserProfile(updatedUser);
    }
    showToast(`Role switched to: ${role}`);
  };

  // Effects for Local Storage Persistence Fallback
  useEffect(() => {
    localStorage.setItem('iwc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('iwc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('iwc_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('iwc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('iwc_custom_orders', JSON.stringify(customOrders));
  }, [customOrders]);

  useEffect(() => {
    localStorage.setItem('iwc_payment_details', JSON.stringify(paymentDetails));
  }, [paymentDetails]);

  useEffect(() => {
    localStorage.setItem('iwc_ai_faqs', JSON.stringify(aiFaqs));
  }, [aiFaqs]);

  useEffect(() => {
    localStorage.setItem('iwc_ai_conversations', JSON.stringify(aiConversations));
  }, [aiConversations]);

  // Advanced UX States (Recently Viewed, Compare, Live Search, Push Notifications, Reviews)
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('iwc_recently_viewed');
    return saved ? JSON.parse(saved) : ['prod-001', 'prod-002', 'prod-003'];
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    const saved = localStorage.getItem('iwc_compare_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isLiveSearchOpen, setIsLiveSearchOpen] = useState(false);
  const [isVoiceSearchListening, setIsVoiceSearchListening] = useState(false);
  
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('iwc_push_enabled') === 'true';
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('iwc_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        title: '👑 Royal Sheesham Guarantee',
        message: '10-Year Termite & Seasoning Warranty activated on all handcrafted furniture.',
        type: 'system',
        timestamp: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }),
        read: false
      },
      {
        id: 'notif-2',
        title: '🚚 Pan-Pakistan Bilty Express',
        message: 'Free insured cargo delivery on all orders over PKR 300,000.',
        type: 'promo',
        timestamp: 'Just now',
        read: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('iwc_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('iwc_compare_list', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('iwc_push_enabled', pushNotificationsEnabled.toString());
  }, [pushNotificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('iwc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sync dark mode class on html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('iwc_dark_mode', darkMode.toString());
  }, [darkMode]);

  // Recently Viewed Helper
  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  // Compare Helper
  const toggleCompare = (productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        showToast('Item removed from comparison list');
        return prev.filter(id => id !== productId);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 furniture models at once.');
          return prev;
        }
        showToast('Added to Product Comparison!');
        return [...prev, productId];
      }
    });
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Voice Search Handler
  const startVoiceSearch = (onResult?: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsVoiceSearchListening(true);
          showToast('Listening... Speak furniture name or category now.');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsVoiceSearchListening(false);
          setIsLiveSearchOpen(true);
          showToast(`Voice Search: "${transcript}"`);
          if (onResult) onResult(transcript);
        };

        recognition.onerror = () => {
          setIsVoiceSearchListening(false);
          showToast('Voice search not recognized. Try typing or speaking again.');
        };

        recognition.onend = () => {
          setIsVoiceSearchListening(false);
        };

        recognition.start();
      } catch (err) {
        setIsVoiceSearchListening(false);
        showToast('Voice search failed to initialize.');
      }
    } else {
      showToast('Voice recognition is not supported in this browser.');
    }
  };

  const stopVoiceSearch = () => {
    setIsVoiceSearchListening(false);
  };

  // Push Notifications Handler
  const requestPushPermission = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setPushNotificationsEnabled(true);
          showToast('Push notifications enabled! You will receive live order bilty updates.');
          addNotification({
            title: '🔔 Push Notifications Enabled',
            message: 'You will now receive real-time woodcraft status & cargo bilty updates.',
            type: 'system'
          });
        } else {
          showToast('Push notification permission was denied.');
        }
      } catch (e) {
        showToast('Notifications granted in app state.');
        setPushNotificationsEnabled(true);
      }
    } else {
      setPushNotificationsEnabled(true);
      showToast('Push notification preference enabled in app!');
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newN: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newN, ...prev]);
  };

  // Product Review Addition
  const addProductReview = (productId: string, reviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const existingReviews = p.reviews || [];
        const updatedReviews = [newRev, ...existingReviews];
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newRating = Number((totalRating / updatedReviews.length).toFixed(1));

        const updatedProduct = {
          ...p,
          reviews: updatedReviews,
          rating: newRating,
          reviewCount: updatedReviews.length
        };

        FirebaseRepository.saveProduct(updatedProduct);
        return updatedProduct;
      }
      return p;
    }));

    showToast('Thank you! Your verified review has been published.');
  };

  // AI FAQ Management
  const addAiFaq = (faqData: Omit<AiFaqItem, 'id'>) => {
    const newFaq: AiFaqItem = {
      ...faqData,
      id: `faq-${Date.now()}`
    };
    setAiFaqs(prev => [newFaq, ...prev]);
    FirebaseRepository.saveAiFaq(newFaq as any);
    showToast('New AI FAQ Knowledge Entry added!');
  };

  const deleteAiFaq = (id: string) => {
    setAiFaqs(prev => prev.filter(f => f.id !== id));
    FirebaseRepository.deleteAiFaq(id);
    showToast('AI FAQ Entry deleted.');
  };

  const addAiConversationLog = (log: AiConversationLog) => {
    setAiConversations(prev => [log, ...prev.filter(c => c.id !== log.id)]);
    FirebaseRepository.saveAiConversation(log as any);
  };


  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cart Functions
  const addToCart = (product: Product, quantity = 1, color?: string, notes?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (color) updated[existingIndex].selectedColor = color;
        if (notes) updated[existingIndex].customNotes = notes;
        return updated;
      } else {
        return [...prev, {
          product,
          quantity,
          selectedColor: color || product.availableColors[0],
          customNotes: notes
        }];
      }
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart.');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Functions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from Wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist!');
        return [...prev, productId];
      }
    });
  };

  // Order Functions
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const orderNum = `IWC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    FirebaseRepository.createOrder(newOrder);
    clearCart();
    showToast(`Order ${orderNum} placed successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string, 
    status: Order['orderStatus'], 
    paymentStatus?: Order['paymentStatus'], 
    cargoBilty?: string
  ) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          orderStatus: status,
          ...(paymentStatus ? { paymentStatus } : {}),
          ...(cargoBilty ? { cargoBiltyNumber: cargoBilty } : {})
        };
      }
      return ord;
    }));
    FirebaseRepository.updateOrderStatus(orderId, status, paymentStatus);
    showToast(`Order status updated to ${status}`);
  };

  // Custom Order Functions
  const submitCustomOrder = (reqData: Omit<CustomOrderRequest, 'id' | 'createdAt' | 'status'>): CustomOrderRequest => {
    const newReq: CustomOrderRequest = {
      ...reqData,
      id: `cust-${Date.now()}`,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };
    setCustomOrders(prev => [newReq, ...prev]);
    FirebaseRepository.saveCustomOrder(newReq);
    showToast('Custom Woodcraft Request submitted to Admin!');
    return newReq;
  };

  const updateCustomOrderStatus = (id: string, status: CustomOrderRequest['status'], adminNotes?: string, quotePkr?: number) => {
    setCustomOrders(prev => prev.map(co => {
      if (co.id === id) {
        return {
          ...co,
          status,
          ...(adminNotes ? { adminNotes } : {}),
          ...(quotePkr ? { estimatedPricePkr: quotePkr } : {})
        };
      }
      return co;
    }));
    FirebaseRepository.updateCustomOrderStatus(id, status);
    showToast(`Custom order status updated to ${status}`);
  };

  const updatePaymentDetails = (details: PaymentAccountDetails) => {
    setPaymentDetails(details);
    FirebaseRepository.savePaymentDetails(details as any);
    showToast('Payment account details updated by Admin!');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedProductId,
        setSelectedProductId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedWoodType,
        setSelectedWoodType,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        customOrders,
        submitCustomOrder,
        updateCustomOrderStatus,
        paymentDetails,
        updatePaymentDetails,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        aiFaqs,
        addAiFaq,
        deleteAiFaq,
        aiConversations,
        addAiConversationLog,
        contactInfo: SHOWROOM_CONTACT,
        currentUser,
        setCurrentUser,
        isLoggedIn,
        logoutUser,
        updateUserProfile,
        addSavedAddress,
        deleteSavedAddress,
        setDefaultAddress,
        setUserRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalInitialTab,
        openAuthModal,
        darkMode,
        setDarkMode,
        toastMessage,
        showToast,
        isAiConsultantOpen,
        setIsAiConsultantOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        recentlyViewed,
        addRecentlyViewed,
        compareList,
        toggleCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        isLiveSearchOpen,
        setIsLiveSearchOpen,
        isVoiceSearchListening,
        startVoiceSearch,
        stopVoiceSearch,
        pushNotificationsEnabled,
        setPushNotificationsEnabled,
        requestPushPermission,
        notifications,
        markNotificationRead,
        clearNotifications,
        addNotification,
        addProductReview
      }}
    >

      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
