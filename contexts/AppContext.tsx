
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrandProfile, CreationJob, UserProfile, ChecklistState } from '../types';
import { Language, TranslationKey, getTranslation } from '../utils/i18n';
import * as storage from '../services/storageService';
import aiService from '../services/aiService';

interface AppContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  brandProfile: BrandProfile | null;
  language: Language;
  creations: CreationJob[];
  checklistState: ChecklistState;
  login: (email: string, name?: string) => void;
  logout: () => void;
  acceptTerms: () => void;
  setBrandProfile: (profile: BrandProfile) => void;
  setLanguage: (lang: Language) => void;
  addCreation: (job: Omit<CreationJob, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  updateChecklist: (updates: Partial<ChecklistState>) => void;
  t: (key: TranslationKey) => string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!storage.getAuthToken());
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(storage.getUserProfile());
  const [brandProfile, setBrandProfileState] = useState<BrandProfile | null>(storage.getBrandProfile());
  const [language, setLanguageState] = useState<Language>(storage.getLanguage());
  const [creations, setCreations] = useState<CreationJob[]>(storage.getCreations());
  const [checklistState, setChecklistState] = useState<ChecklistState>(storage.getChecklistState());
  // Default to open on large screens (>= 1024px), closed on small screens
  const [isSidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const login = (email: string, name?: string) => {
    const token = 'auth-token-' + Date.now();
    storage.saveAuthToken(token);
    
    let displayName = name;
    if (!displayName && !userProfile) {
        const namePart = email.split('@')[0].replace(/[^a-zA-Z]/g, '');
        displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    } else if (!displayName && userProfile) {
        displayName = userProfile.name;
    }

    // If name provided, it's likely a signup -> require terms
    // If no name provided (login), assume returning user -> terms accepted (simplified logic)
    // In a real app, the backend tells us if terms are accepted.
    const isSignup = !!name;

    const profile: UserProfile = {
        name: displayName || 'Creator',
        email,
        plan: 'Pro',
        termsAccepted: isSignup ? false : true
    };
    storage.saveUserProfile(profile);

    setIsAuthenticated(true);
    setUserProfileState(profile);
  };

  const acceptTerms = () => {
      if (userProfile) {
          const updatedProfile = { ...userProfile, termsAccepted: true };
          setUserProfileState(updatedProfile);
          storage.saveUserProfile(updatedProfile);
      }
  };

  const logout = () => {
    storage.clearAuthData();
    setIsAuthenticated(false);
    setUserProfileState(null);
  };

  const setBrandProfile = (profile: BrandProfile) => {
    storage.saveBrandProfile(profile);
    setBrandProfileState(profile);
  };
  
  const setLanguage = (lang: Language) => {
    storage.saveLanguage(lang);
    setLanguageState(lang);
  };

  const updateChecklist = (updates: Partial<ChecklistState>) => {
    setChecklistState(prev => {
        const newState = { ...prev, ...updates };
        storage.saveChecklistState(newState);
        return newState;
    });
  };

  const t = useCallback((key: TranslationKey) => {
    return getTranslation(language, key);
  }, [language]);

  const addCreation = (jobData: Omit<CreationJob, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const newJob: CreationJob = {
        ...jobData,
        id: jobData.id || `job-${Date.now()}`, // Allow passing ID if pre-generated (e.g. for storage linkage)
        status: jobData.status || 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    setCreations(prev => {
        const updatedCreations = [newJob, ...prev];
        storage.saveCreations(updatedCreations);
        return updatedCreations;
    });
  };

  const updateJob = (id: string, updates: Partial<CreationJob>) => {
    setCreations(prev => {
        const updated = prev.map(job => job.id === id ? { ...job, ...updates, updatedAt: new Date().toISOString() } : job);
        storage.saveCreations(updated);
        return updated;
    });
  };

  // Job Processing Queue
  useEffect(() => {
    const processPendingJob = async () => {
        const pendingJob = creations.find(j => j.status === 'Pending');
        if (!pendingJob) return;

        // Mark as generating to prevent double processing
        updateJob(pendingJob.id, { status: 'Generating' });

        try {
            let resultUrl = '';
            let resultText = '';

            // Retrieve base64 params from IDB if ID is present
            const params = { ...pendingJob.params };
            if (params.imageBase64Id) {
                const imageData = await storage.getAsset(params.imageBase64Id);
                if (imageData) {
                    params.imageBase64 = imageData;
                } else {
                    throw new Error("Source image not found in storage.");
                }
            }

            if (pendingJob.type === 'UGC_VIDEO') {
                resultUrl = await aiService.generateUGCVideo(params);
            } else if (pendingJob.type === 'PROMO_VIDEO') {
                resultUrl = await aiService.generatePromoVideo(params);
            } 
            else if (pendingJob.type === 'IMAGE') {
                // Pass model parameter from params
                const resultUrls = await aiService.generateImage(params.prompt, params.aspectRatio, params.model, params.numImages);
                resultUrl = resultUrls[0];
                
                // Handle multiple images if any
                if (resultUrls.length > 1) {
                    // Add extra jobs for the other images so they appear in gallery
                    resultUrls.slice(1).forEach((extraUrl, idx) => {
                        addCreation({
                            type: 'IMAGE',
                            title: `${pendingJob.title} (${idx + 2})`,
                            params: pendingJob.params,
                            status: 'Completed',
                            resultUrl: extraUrl
                        });
                    });
                }
            } else if (pendingJob.type === 'CONTENT') {
                // Pass full params object for new signature
                resultText = await aiService.generateContent({
                    type: params.contentType,
                    topic: params.topic,
                    tone: params.tone,
                    audience: params.audience,
                    keywords: params.keywords,
                    length: params.length,
                    language: params.language
                });
            }

            // Store result blob/url persistently
            if (resultUrl.startsWith('blob:') || resultUrl.length > 10000) {
                let dataToStore = resultUrl;
                if (resultUrl.startsWith('blob:')) {
                   const res = await fetch(resultUrl);
                   const blob = await res.blob();
                   dataToStore = await new Promise((resolve) => {
                       const reader = new FileReader();
                       reader.onloadend = () => resolve(reader.result as string);
                       reader.readAsDataURL(blob);
                   });
                }
                
                // Use the job ID as key for result
                await storage.saveAsset(`${pendingJob.id}-result`, dataToStore);
                resultUrl = dataToStore;
            }

            updateJob(pendingJob.id, { status: 'Completed', resultUrl, resultText });

        } catch (error) {
            console.error("Job failed", error);
            updateJob(pendingJob.id, { status: 'Failed', error: (error as Error).message });
        }
    };

    processPendingJob();
  }, [creations]); 

  return (
    <AppContext.Provider value={{ 
        isAuthenticated, userProfile, brandProfile, language, creations, checklistState,
        login, logout, setBrandProfile, setLanguage, addCreation, updateChecklist, t,
        acceptTerms, isSidebarOpen, toggleSidebar, setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
