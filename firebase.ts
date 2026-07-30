import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  getFirestore,
  doc,
  collection
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId and force long polling for sandbox stability
const dbId = (firebaseConfig as any).firestoreDatabaseId || 'ai-studio-iqbalwoodcraft-520d582d-32f4-4a24-ba5a-72f32e9c7e58';
console.log('Initializing Firestore with Database ID:', dbId);

export const db = getApps().length === 0 || !(app as any)._firestore
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, dbId)
  : getFirestore(app, dbId);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Auto anonymous sign in for unauthenticated visitors (handled safely for restricted console environments)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    try {
      if (!auth.currentUser) {
        signInAnonymously(auth).catch((error: any) => {
          if (error?.code === 'auth/admin-restricted-operation') {
            console.info('Firebase Anonymous Auth disabled in project console; continuing with standard guest mode.');
          } else {
            console.info('Firebase Guest Auth note:', error?.message || String(error));
          }
        });
      }
    } catch (err: any) {
      console.info('Firebase Auth init note:', err?.message || String(err));
    }
  }, 100);
}

// Initialize Storage & Analytics
export const storage = getStorage(app);

let analytics: any = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export { analytics };
export default app;
