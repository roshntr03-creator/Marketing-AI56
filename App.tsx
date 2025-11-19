import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import BrandPage from './pages/BrandPage';
import CreationsHub from './pages/CreationsHub';
import SettingsPage from './pages/SettingsPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import LandingPage from './pages/LandingPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import UgcVideosPage from './pages/UgcVideosPage';
import PromoVideosPage from './pages/PromoVideosPage';
import CampaignsPage from './pages/CampaignsPage';
import ContentGeneratorPage from './pages/ContentGeneratorPage';
import ImageEditorPage from './pages/ImageEditorPage';
import PostAssistantPage from './pages/PostAssistantPage';
import PromptEnhancerPage from './pages/PromptEnhancerPage';
import CompetitorAnalysisPage from './pages/CompetitorAnalysisPage';

const AppRoutes: React.FC = () => {
    const { isAuthenticated, language } = useAppContext();
    React.useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    return (
        <Routes>
            {isAuthenticated ? (
                // Authenticated Routes inside Layout
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/brand" element={<BrandPage />} />
                    <Route path="/creations" element={<CreationsHub />} />
                    <Route path="/settings" element={<SettingsPage />} />

                    {/* Tool Pages */}
                    <Route path="/image-generator" element={<ImageGeneratorPage />} />
                    <Route path="/ugc-videos" element={<UgcVideosPage />} />
                    <Route path="/promo-videos" element={<PromoVideosPage />} />
                    <Route path="/campaigns" element={<CampaignsPage />} />
                    <Route path="/content-generator" element={<ContentGeneratorPage />} />
                    <Route path="/image-editor" element={<ImageEditorPage />} />
                    <Route path="/post-assistant" element={<PostAssistantPage />} />
                    <Route path="/prompt-enhancer" element={<PromptEnhancerPage />} />
                    <Route path="/competitor-analysis" element={<CompetitorAnalysisPage />} />
                    
                    {/* Redirect root and auth pages to the dashboard if logged in */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/signin" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
                </Route>
            ) : (
                // Public Routes
                <>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    {/* If not authenticated, redirect any other path to landing */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </>
            )}
        </Routes>
    );
};


function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}

export default App;