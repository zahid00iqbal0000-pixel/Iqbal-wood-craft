import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Order, CustomOrderRequest, PaymentAccountDetails, AiFaqItem, AiConversationLog, CustomerUser } from '../types';

// Collections
const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const CUSTOM_ORDERS_COL = 'custom_orders';
const AI_FAQS_COL = 'ai_faqs';
const AI_CONVERSATIONS_COL = 'ai_conversations';
const PAYMENT_DETAILS_COL = 'payment_details';
const USERS_COL = 'users';

// Repository Pattern Implementation with Realtime Listeners & Offline First

export const FirebaseRepository = {
  // --- PRODUCTS ---
  subscribeProducts(onUpdate: (products: Product[]) => void, onError?: (err: Error) => void) {
    const q = query(collection(db, PRODUCTS_COL));
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const products: Product[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as Product));
      onUpdate(products);
    }, (err) => {
      console.warn('Realtime Products Sync Error:', err);
      if (onError) onError(err);
    });
  },

  async saveProduct(product: Product): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COL, product.id);
      await setDoc(docRef, {
        ...product,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('Firebase saveProduct Error:', err);
      throw err;
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, PRODUCTS_COL, productId));
    } catch (err) {
      console.error('Firebase deleteProduct Error:', err);
      throw err;
    }
  },

  // --- ORDERS ---
  subscribeOrders(onUpdate: (orders: Order[]) => void) {
    const q = query(collection(db, ORDERS_COL));
    return onSnapshot(q, (snapshot) => {
      const orders: Order[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as Order));
      onUpdate(orders);
    }, (err) => {
      console.warn('Realtime Orders Sync Error:', err);
    });
  },

  async createOrder(order: Order): Promise<void> {
    try {
      const docRef = doc(db, ORDERS_COL, order.id);
      await setDoc(docRef, {
        ...order,
        createdAt: order.createdAt || new Date().toISOString()
      });
    } catch (err) {
      console.error('Firebase createOrder Error:', err);
      throw err;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['orderStatus'], paymentStatus?: Order['paymentStatus']): Promise<void> {
    try {
      const docRef = doc(db, ORDERS_COL, orderId);
      const updates: any = { orderStatus: status };
      if (paymentStatus) updates.paymentStatus = paymentStatus;
      await updateDoc(docRef, updates);
    } catch (err) {
      console.error('Firebase updateOrderStatus Error:', err);
      throw err;
    }
  },

  // --- CUSTOM ORDERS ---
  subscribeCustomOrders(onUpdate: (requests: CustomOrderRequest[]) => void) {
    const q = query(collection(db, CUSTOM_ORDERS_COL));
    return onSnapshot(q, (snapshot) => {
      const reqs: CustomOrderRequest[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as CustomOrderRequest));
      onUpdate(reqs);
    }, (err) => {
      console.warn('Realtime Custom Orders Sync Error:', err);
    });
  },

  async saveCustomOrder(request: CustomOrderRequest): Promise<void> {
    try {
      const docRef = doc(db, CUSTOM_ORDERS_COL, request.id);
      await setDoc(docRef, {
        ...request,
        createdAt: request.createdAt || new Date().toISOString()
      });
    } catch (err) {
      console.error('Firebase saveCustomOrder Error:', err);
      throw err;
    }
  },

  async updateCustomOrderStatus(id: string, status: CustomOrderRequest['status']): Promise<void> {
    try {
      const docRef = doc(db, CUSTOM_ORDERS_COL, id);
      await updateDoc(docRef, { status });
    } catch (err) {
      console.error('Firebase updateCustomOrderStatus Error:', err);
      throw err;
    }
  },

  // --- AI FAQS KNOWLEDGE BASE ---
  subscribeAiFaqs(onUpdate: (faqs: AiFaqItem[]) => void) {
    const q = query(collection(db, AI_FAQS_COL));
    return onSnapshot(q, (snapshot) => {
      const faqs: AiFaqItem[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as AiFaqItem));
      onUpdate(faqs);
    });
  },

  async saveAiFaq(faq: AiFaqItem): Promise<void> {
    try {
      const docRef = doc(db, AI_FAQS_COL, faq.id);
      await setDoc(docRef, faq);
    } catch (err) {
      console.error('Firebase saveAiFaq Error:', err);
    }
  },

  async deleteAiFaq(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, AI_FAQS_COL, id));
    } catch (err) {
      console.error('Firebase deleteAiFaq Error:', err);
    }
  },

  // --- AI CONVERSATIONS ---
  subscribeAiConversations(onUpdate: (convs: AiConversationLog[]) => void) {
    const q = query(collection(db, AI_CONVERSATIONS_COL));
    return onSnapshot(q, (snapshot) => {
      const convs: AiConversationLog[] = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as AiConversationLog));
      onUpdate(convs);
    });
  },

  async saveAiConversation(log: AiConversationLog): Promise<void> {
    try {
      const docRef = doc(db, AI_CONVERSATIONS_COL, log.id);
      await setDoc(docRef, log, { merge: true });
    } catch (err) {
      console.error('Firebase saveAiConversation Error:', err);
    }
  },

  // --- PAYMENT DETAILS ---
  subscribePaymentDetails(onUpdate: (details: PaymentAccountDetails) => void) {
    const docRef = doc(db, PAYMENT_DETAILS_COL, 'main');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as PaymentAccountDetails);
      }
    });
  },

  async savePaymentDetails(details: PaymentAccountDetails): Promise<void> {
    try {
      const docRef = doc(db, PAYMENT_DETAILS_COL, 'main');
      await setDoc(docRef, details, { merge: true });
    } catch (err) {
      console.error('Firebase savePaymentDetails Error:', err);
      throw err;
    }
  },

  // --- USER PROFILES & ROLES ---
  subscribeUserProfile(uid: string, onUpdate: (user: CustomerUser | null) => void) {
    const docRef = doc(db, USERS_COL, uid);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as CustomerUser);
      } else {
        onUpdate(null);
      }
    }, (err) => {
      console.warn('Realtime User Profile Sync Error:', err);
    });
  },

  async getUserProfile(uid: string): Promise<CustomerUser | null> {
    try {
      const docRef = doc(db, USERS_COL, uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as CustomerUser;
      }
      return null;
    } catch (err) {
      console.error('Firebase getUserProfile Error:', err);
      return null;
    }
  },

  async saveUserProfile(user: CustomerUser): Promise<void> {
    try {
      const docRef = doc(db, USERS_COL, user.uid || user.id);
      await setDoc(docRef, {
        ...user,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('Firebase saveUserProfile Error:', err);
      throw err;
    }
  }
};
