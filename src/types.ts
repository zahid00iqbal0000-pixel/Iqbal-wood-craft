export type WoodType = 
  | 'Solid Sheesham (Chinioti Rosewood)' 
  | 'Teak Wood (Sagwan)' 
  | 'Walnut Wood (Akhrot)' 
  | 'Oak Wood' 
  | 'High-Grade MDF with Tactile Veneer' 
  | 'Mahogany Wood';

export interface ProductReview {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  userPhoto?: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  code: string; // e.g. IWC-BED-001
  name: string;
  brand: string; // "IQBAL WOODCRAFT"
  category: string;
  images: string[];
  price: number; // PKR
  salePrice?: number; // PKR
  discountPercent?: number;
  material: string;
  woodType: WoodType;
  dimensions: string; // e.g. "Length: 78\" | Width: 72\" | Height: 48\""
  availableColors: string[];
  description: string;
  warranty: string; // e.g. "10 Years Solid Wood Termite Warranty"
  availability: 'In Stock' | 'Made To Order' | 'Limited Edition';
  stockCount?: number;
  polishFinish?: string;
  features?: string[];
  has360View?: boolean;
  estimatedDeliveryTime: string; // e.g. "5 - 7 Working Days (Pan Pakistan)"
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isPremiumCollection?: boolean;
  saleOffer?: string; // e.g. "Summer Deluxe Discount"
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  imageUrl: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  customNotes?: string;
}

export interface CustomOrderRequest {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  category: string;
  preferredDesignTitle: string;
  dimensions: string; // e.g. 10x12 ft or custom measurements
  woodType: WoodType;
  colourStain: string;
  fabricOption?: string;
  budgetPkr: number;
  specialRequirements: string;
  referenceImageUrl?: string;
  status: 'Pending Review' | 'In Discussion' | 'Quote Sent' | 'Payment Received' | 'In Crafting Phase' | 'Dispatched';
  createdAt: string;
  adminNotes?: string;
  estimatedPricePkr?: number;
}

export interface OrderItem {
  productId: string;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. IWC-2026-9042
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  customerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  shippingAddress: string;
  paymentMethod: 'Bank Transfer' | 'JazzCash' | 'EasyPaisa';
  paymentReferenceTxn?: string;
  paymentProofNote?: string;
  paymentStatus: 'Pending 100% Advance Verification' | 'Payment Verified' | 'Rejected';
  orderStatus: 'Order Received' | 'Payment Confirmed' | 'Wood Workshop Assembly' | 'Polishing & Quality Check' | 'Dispatched via Cargo Bilty' | 'Delivered';
  cargoBiltyNumber?: string;
  estimatedDeliveryDate: string;
  createdAt: string;
}

export interface PaymentAccountDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchCode: string;
  jazzCashTitle: string;
  jazzCashNumber: string;
  easyPaisaTitle: string;
  easyPaisaNumber: string;
  note: string;
}

export type UserRole = 'Customer' | 'Admin' | 'Manager';

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Home Residence", "Office", "Chiniot Workshop"
  address: string;
  city: string;
  isDefault?: boolean;
}

export interface CustomerUser {
  id: string;
  uid: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  role: UserRole;
  authProvider: 'email' | 'phone' | 'google' | 'anonymous';
  savedAddresses: SavedAddress[];
  addresses: string[];
  wishlistProductIds: string[];
  isAdmin: boolean;
  isManager?: boolean;
  createdAt?: string;
}

export interface ShowroomContactInfo {
  ceo: string;
  ceoPhone: string;
  businessManager: string;
  bmPhone: string;
  salesAndApp: string;
  salesPhone: string;
  whatsappBusiness: string;
  email: string;
  address: string;
  googleMapsEmbedUrl: string;
  businessHours: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
  quickReplies?: string[];
  isCustomOrderWizard?: boolean;
  isCustomOrderSuccess?: boolean;
  customOrderRefId?: string;
  showHumanSupport?: boolean;
}

export interface AiFaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Products' | 'Payment' | 'Delivery' | 'Custom Furniture' | 'Warranty';
}

export interface AiConversationLog {
  id: string;
  customerName: string;
  phone?: string;
  lastActive: string;
  messages: AiChatMessage[];
  status: 'Active' | 'Escalated to WhatsApp' | 'Custom Request Submitted' | 'Closed';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'wishlist' | 'promo' | 'crafting' | 'system';
  timestamp: string;
  read: boolean;
  linkScreen?: string;
  productId?: string;
}

