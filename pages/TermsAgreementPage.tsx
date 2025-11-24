
import React, { useState, useRef, useEffect } from 'react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { ShieldCheckIcon, ScaleIcon, DocumentTextIcon, CheckCircleIcon, LockClosedIcon, GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';

const TermsAgreementPage: React.FC = () => {
  const { acceptTerms, t, setLanguage, language } = useAppContext();
  const [canAgree, setCanAgree] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const element = contentRef.current;
    if (!element) return;

    // Check if scrolled to bottom with a larger tolerance (50px)
    // Also checks if content fits entirely within the container (scrollHeight <= clientHeight)
    const isBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50 || element.scrollHeight <= element.clientHeight;
    
    if (isBottom) {
      setCanAgree(true);
      setShowScrollHint(false);
    } else {
      setShowScrollHint(true);
    }
  };

  // Check on mount and resize in case content fits without scrolling
  useEffect(() => {
      // Small delay to ensure layout paint
      setTimeout(handleScroll, 100);
      window.addEventListener('resize', handleScroll);
      return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const handleAgree = () => {
    acceptTerms();
    // Navigation to dashboard is automatic via App.tsx after state update
  };

  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-3xl z-10">
        {/* Top Bar with Logo and Lang Switcher */}
        <div className="flex justify-between items-center mb-8">
             <div className="w-10"></div> {/* Spacer */}
             <div className="text-center">
                <Logo href="#" className="inline-flex justify-center mb-6" textClassName="text-2xl text-white" />
                <h1 className="text-3xl font-bold font-display text-white tracking-tight">{t('terms.title')}</h1>
                <p className="text-zinc-400 mt-2">{t('terms.subtitle')}</p>
             </div>
             <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs text-zinc-300"
             >
                 <GlobeAltIcon className="w-4 h-4" />
                 {language === 'en' ? 'العربية' : 'English'}
             </button>
        </div>

        {/* Main Content Container - Replaced Card with direct Div to enforce Flex behavior */}
        <div className="bg-[#09090b] border border-white/10 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[70vh] min-h-[500px] md:h-[600px] relative w-full">
          
          {/* Scrollable Content */}
          <div 
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth relative bg-[#09090b]"
          >
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-indigo-400 mb-2">
                    <ShieldCheckIcon className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">{t('terms.safety.title')}</h2>
                </div>
                <p className="text-zinc-300 leading-relaxed text-sm">
                    {t('terms.safety.desc')}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
                    <li>{t('terms.safety.point1')}</li>
                    <li>{t('terms.safety.point2')}</li>
                    <li>{t('terms.safety.point3')}</li>
                </ul>
            </div>

            <div className="w-full h-px bg-white/5"></div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 text-purple-400 mb-2">
                    <ScaleIcon className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">{t('terms.responsibility.title')}</h2>
                </div>
                <p className="text-zinc-300 leading-relaxed text-sm">
                    {t('terms.responsibility.desc')}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
                    <li>{t('terms.responsibility.point1')}</li>
                    <li>{t('terms.responsibility.point2')}</li>
                    <li>{t('terms.responsibility.point3')}</li>
                </ul>
            </div>

            <div className="w-full h-px bg-white/5"></div>

            <div className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                    <DocumentTextIcon className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">{t('terms.policy.title')}</h2>
                </div>
                <p className="text-zinc-300 leading-relaxed text-sm">
                    {t('terms.policy.desc')}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
                    <li>{t('terms.policy.point1')}</li>
                    <li>{t('terms.policy.point2')}</li>
                </ul>
                <p className="text-zinc-500 text-xs mt-4 italic">
                    Last Updated: October 24, 2025
                </p>
            </div>
            
            {/* Spacer to ensure scroll is possible/required */}
            <div className="h-12"></div>
          </div>

          {/* Scroll Indicator Overlay */}
          {showScrollHint && !canAgree && (
              <div className="absolute bottom-[88px] left-0 right-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none flex justify-center items-end pb-4 z-10">
                  <div className="animate-bounce bg-zinc-900/80 border border-white/10 rounded-full p-2 backdrop-blur text-zinc-400">
                      <ChevronDownIcon className="w-5 h-5" />
                  </div>
              </div>
          )}

          {/* Action Footer */}
          <div className="flex-shrink-0 p-6 bg-zinc-900 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 relative z-20">
            <div className="flex items-center gap-3 text-sm text-zinc-400">
                {canAgree ? (
                    <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                ) : (
                    <LockClosedIcon className="w-5 h-5 text-zinc-600" />
                )}
                <span>
                    {canAgree 
                        ? t('terms.thank_you') 
                        : t('terms.scroll_hint')}
                </span>
            </div>
            <div className="flex w-full md:w-auto">
                <Button 
                    onClick={handleAgree} 
                    disabled={!canAgree} 
                    size="lg"
                    className={`w-full md:w-auto transition-all duration-300 ${!canAgree ? 'opacity-60 cursor-not-allowed grayscale' : 'shadow-[0_0_20px_rgba(99,102,241,0.5)]'}`}
                >
                    {t('terms.agree_btn')}
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAgreementPage;
