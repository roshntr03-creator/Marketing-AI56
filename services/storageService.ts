
import { BrandProfile, CreationJob, UserProfile, ChecklistState } from '../types';

const AUTH_TOKEN_KEY = 'ai_marketing_suite_auth_token';
const USER_PROFILE_KEY = 'ai_marketing_suite_user_profile';
const BRAND_PROFILE_KEY = 'ai_marketing_suite_brand_profile';
const LANGUAGE_KEY = 'ai_marketing_suite_language';
const CREATIONS_KEY = 'ai_marketing_suite_creations';
const CHECKLIST_STATE_KEY = 'ai_marketing_suite_checklist_state';
const DB_NAME = 'ai_marketing_suite_db';
const DB_VERSION = 1;
const STORE_NAME = 'assets';

// --- IndexedDB Helpers ---

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveAsset = async (id: string, data: string): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB Save Error:", error);
    throw error;
  }
};

export const getAsset = async (id: string): Promise<string | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("IndexedDB Get Error:", error);
    return null;
  }
};

// Delete asset if needed (e.g. deleting a job)
export const deleteAsset = async (id: string): Promise<void> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error("IndexedDB Delete Error", e);
    }
}

// --- LocalStorage (Metadata) ---

export const saveAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const clearAuthData = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
};

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const profile = localStorage.getItem(USER_PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
};

export const saveBrandProfile = (profile: BrandProfile) => {
  localStorage.setItem(BRAND_PROFILE_KEY, JSON.stringify(profile));
};

export const getBrandProfile = (): BrandProfile | null => {
  const profile = localStorage.getItem(BRAND_PROFILE_KEY);
  return profile ? JSON.parse(profile) : null;
};

export const saveLanguage = (lang: 'en' | 'ar') => {
  localStorage.setItem(LANGUAGE_KEY, lang);
};

export const getLanguage = (): 'en' | 'ar' => {
  const lang = localStorage.getItem(LANGUAGE_KEY);
  return (lang === 'ar' ? 'ar' : 'en');
};

export const saveCreations = (creations: CreationJob[]) => {
    // Strip heavy params if they exist in the object before saving to LS
    // In our app logic, we store IDs in params and data in IDB, so this is safe.
    localStorage.setItem(CREATIONS_KEY, JSON.stringify(creations));
};

export const getCreations = (): CreationJob[] => {
    const creations = localStorage.getItem(CREATIONS_KEY);
    return creations ? JSON.parse(creations) : [];
};

export const saveChecklistState = (state: ChecklistState) => {
  localStorage.setItem(CHECKLIST_STATE_KEY, JSON.stringify(state));
};

export const getChecklistState = (): ChecklistState => {
  const state = localStorage.getItem(CHECKLIST_STATE_KEY);
  return state ? JSON.parse(state) : { exploredTools: false };
};
