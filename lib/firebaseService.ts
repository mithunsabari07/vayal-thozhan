/**
 * Firebase Realtime Database Client for ESP32 Hardware Integration
 * Powered by official Firebase SDK and real-time WebSocket listeners
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  onValue,
  update,
  get,
  Database,
  Unsubscribe,
} from 'firebase/database';

export interface HardwareState {
  soil1: number;       // GPIO 34 (Analog: 0 - 4095 or 0 - 100%)
  soil2: number;       // GPIO 35 (Analog: 0 - 4095 or 0 - 100%)
  rain: number;        // GPIO 32 (Analog: 0 - 4095 or 0/1)
  relay1: boolean;     // GPIO 25 (Valve A: active LOW on ESP32)
  relay2: boolean;     // GPIO 26 (Valve B: active LOW on ESP32)
  relay3: boolean;     // GPIO 27 (Water Tank Motor: active LOW on ESP32)
  updatedAt?: number;  // Timestamp from ESP32
  deviceStatus?: 'online' | 'offline';
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDaJfvyK9TwZkaYdfPnxH6rRB64vfZfemw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vayal-tholan.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL || "https://vayal-tholan-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vayal-tholan",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "vayal-tholan.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "251989978811",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:251989978811:web:c195ed902b4232cef3839e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-KZGT1QH06K",
};

const STORAGE_KEY = 'vayal_thozhan_firebase_url';

export function getStoredFirebaseUrl(): string {
  if (typeof window === 'undefined') return firebaseConfig.databaseURL;
  return localStorage.getItem(STORAGE_KEY) || firebaseConfig.databaseURL;
}

export function saveFirebaseUrl(url: string): void {
  if (typeof window === 'undefined') return;
  const clean = url.trim().replace(/\/+$/, '');
  localStorage.setItem(STORAGE_KEY, clean);
}

function getFirebaseDb(customUrl?: string): Database | null {
  if (typeof window === 'undefined') return null;

  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const dbUrl = customUrl || getStoredFirebaseUrl();
    return getDatabase(app, dbUrl);
  } catch (err) {
    console.warn('[Firebase] Database initialization error:', err);
    return null;
  }
}

/**
 * Maps raw ESP32 12-bit ADC reading (0-4095) to soil moisture percentage (0-100%).
 */
export function mapSoilReadingToPercent(raw: number): number {
  if (typeof raw !== 'number' || isNaN(raw)) return 50;
  if (raw >= 0 && raw <= 100) return Math.round(raw);

  // ESP32 12-bit ADC mapping (capacitive soil sensor: ~3800 = dry, ~1400 = wet)
  const dryCalibrated = 3800;
  const wetCalibrated = 1400;
  const clamped = Math.max(wetCalibrated, Math.min(dryCalibrated, raw));
  const percent = ((dryCalibrated - clamped) / (dryCalibrated - wetCalibrated)) * 100;
  return Math.round(Math.max(0, Math.min(100, percent)));
}

/**
 * Maps Rain Sensor reading.
 */
export function mapRainReading(raw: number | boolean | string): boolean {
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'string') return raw.toLowerCase() === 'wet' || raw.toLowerCase() === 'rain';
  if (raw <= 1) return raw === 0; // Active low digital rain sensor
  return raw < 2800; // Analog rain detected
}

/**
 * Subscribe to real-time database changes using official Firebase SDK
 */
export function subscribeToHardwareData(
  baseUrl: string,
  onData: (data: HardwareState) => void,
  onError: (err: any) => void
): Unsubscribe | null {
  const db = getFirebaseDb(baseUrl);
  if (!db) {
    onError(new Error('Firebase DB not initialized'));
    return null;
  }

  const dbRef = ref(db, 'vayal_thozhan');
  return onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val() as HardwareState;
        onData(val);
      } else {
        // Node does not exist yet; default empty state
        onData({
          soil1: 1850,
          soil2: 3400,
          rain: 4095,
          relay1: false,
          relay2: false,
          relay3: false,
        });
      }
    },
    (error) => {
      console.warn('[Firebase] Subscription permission/network error:', error);
      onError(error);
    }
  );
}

/**
 * Fetch one-shot data from Firebase Realtime Database
 */
export async function fetchHardwareData(baseUrl: string): Promise<HardwareState | null> {
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  const endpoint = `${cleanUrl}/vayal_thozhan.json`;

  try {
    const res = await fetch(endpoint, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (res.status === 401 || res.status === 403) {
      console.warn(
        '[Firebase] HTTP 401 Permission Denied: Your Firebase Realtime Database rules need to allow read access. Go to Firebase Console -> Realtime Database -> Rules and set ".read": true, ".write": true.'
      );
      return null;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data === null) {
      // Database connected successfully, but vayal_thozhan node is not created yet
      return {
        soil1: 1850,
        soil2: 3400,
        rain: 4095,
        relay1: false,
        relay2: false,
        relay3: false,
        deviceStatus: 'offline',
      };
    }
    return data;
  } catch (err) {
    // Try official SDK get
    try {
      const db = getFirebaseDb(baseUrl);
      if (db) {
        const snapshot = await get(ref(db, 'vayal_thozhan'));
        if (snapshot.exists()) return snapshot.val();
      }
    } catch (sdkErr) {
      // Permission denied or offline
    }
    return null;
  }
}

/**
 * Update relay states in Firebase Realtime Database (sends command to ESP32)
 */
export async function updateFirebaseRelay(
  baseUrl: string,
  relays: Partial<{ relay1: boolean; relay2: boolean; relay3: boolean }>
): Promise<boolean> {
  // 1. Try official SDK update first
  try {
    const db = getFirebaseDb(baseUrl);
    if (db) {
      await update(ref(db, 'vayal_thozhan'), {
        ...relays,
        lastCommandTime: Date.now(),
      });
      return true;
    }
  } catch (err) {
    console.warn('[Firebase SDK] update failed, falling back to REST PATCH:', err);
  }

  // 2. Fallback to direct REST PATCH
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  const endpoint = `${cleanUrl}/vayal_thozhan.json`;

  try {
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...relays,
        lastCommandTime: Date.now(),
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('[Firebase] Failed to update relay on Firebase:', err);
    return false;
  }
}
