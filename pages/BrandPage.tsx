import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BrandProfile } from '../types';
import aiService from '../services/aiService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { BuildingStorefrontIcon, FingerPrintIcon, SparklesIcon, TagIcon, GlobeAltIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const BrandOnboardingWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { setBrandProfile, t } = useAppContext();
    const [step, setStep] = useState(1);
    const [description, setDescription] = useState('');
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewProfile, setPreviewProfile] = useState<BrandProfile | null>(null);

    const handleAnalyze = async () => {
        if (!description && !url) return;
        setIsLoading(true);
        try {
            const profile = await aiService.analyzeBrand(description || `Website: ${url}`);
            setPreviewProfile(profile);
            setStep(2);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSave = () => {
        if (previewProfile) {
            setBrandProfile(previewProfile);
            onClose();
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={step === 1 ? t('brand.setup.welcome') : t('brand.setup.preview')}>
            {step === 1 && (
                <div className="space-y-5">
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 flex gap-3">
                        <SparklesIcon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-primary-300">{t('brand.setup.prompt')}</p>
                    </div>
                    <Input label={t('brand.setup.url')} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-surface-border"></div>
                        <span className="flex-shrink-0 mx-4 text-text-secondary text-xs uppercase tracking-wider">Or Describe Manually</span>
                        <div className="flex-grow border-t border-surface-border"></div>
                    </div>
                    <Textarea label={t('brand.setup.description')} value={description} onChange={e => setDescription(e.target.value)} placeholder="We are a sustainable coffee brand targeting millennials..." rows={4} />
                    <Button onClick={handleAnalyze} isLoading={isLoading} className="w-full" size="lg" rightIcon={<SparklesIcon className="w-5 h-5"/>}>{t('brand.setup.analyze')}</Button>
                </div>
            )}
            {step === 2 && previewProfile && (
                <div className="space-y-6">
                    <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                         <BrandProfileDisplay profile={previewProfile} />
                    </div>
                    <Button onClick={handleSave} className="w-full" size="lg">{t('brand.setup.save')}</Button>
                </div>
            )}
        </Modal>
    );
};

const BrandProfileDisplay: React.FC<{ profile: BrandProfile }> = ({ profile }) => (
    <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-primary bg-gradient-to-br from-background-card to-background-dark">
                <div className="flex items-center gap-2 mb-3 text-primary">
                    <BuildingStorefrontIcon className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Identity</h4>
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-3">{profile.brandName}</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{profile.mission}</p>
            </Card>
            <Card className="p-6 bg-background-card">
                 <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <FingerPrintIcon className="w-5 h-5" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Persona</h4>
                </div>
                <div className="space-y-4">
                    <div>
                        <span className="text-xs text-text-muted uppercase block mb-1 font-bold">Target Audience</span>
                        <p className="text-white text-sm">{profile.audience}</p>
                    </div>
                    <div>
                        <span className="text-xs text-text-muted uppercase block mb-1 font-bold">Voice</span>
                        <p className="text-white text-sm italic border-l-2 border-purple-500/50 pl-3">"{profile.toneOfVoice}"</p>
                    </div>
                </div>
            </Card>
        </div>

        <Card className="p-6 bg-background-card/50">
             <div className="flex items-center gap-2 mb-4 text-pink-400">
                <TagIcon className="w-5 h-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Brand DNA</h4>
            </div>
            
            <div className="mb-6">
                <h5 className="text-xs text-text-secondary mb-3 font-bold uppercase">Core Values</h5>
                <div className="flex flex-wrap gap-2">
                    {profile.coreValues.map((val, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-md bg-background-dark border border-surface-border text-xs text-text-primary hover:border-primary/50 transition-colors shadow-sm">
                            {val}
                        </span>
                    ))}
                </div>
            </div>
            
             <div>
                <h5 className="text-xs text-text-secondary mb-3 font-bold uppercase">Strategic Keywords</h5>
                <div className="flex flex-wrap gap-2">
                    {profile.keywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs border border-primary/20 font-medium">
                            #{kw}
                        </span>
                    ))}
                </div>
            </div>
        </Card>
    </div>
);

const BrandPage: React.FC = () => {
    const { brandProfile, t } = useAppContext();
    const [isWizardOpen, setIsWizardOpen] = useState(!brandProfile);

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-bold font-display">{t('brand.title')}</h1>
                    <p className="text-text-secondary mt-1">Your AI's strategic foundation. This profile guides every generation.</p>
                </div>
                <Button variant="outline" onClick={() => setIsWizardOpen(true)} leftIcon={<SparklesIcon className="w-4 h-4" />}>
                    {brandProfile ? t('brand.reanalyze') : 'Setup Brand'}
                </Button>
            </div>

            {brandProfile ? (
                <div className="animate-fade-in-up">
                    <BrandProfileDisplay profile={brandProfile} />
                </div>
            ) : (
                <Card className="p-12 text-center border-dashed border-surface-border flex flex-col items-center justify-center min-h-[400px] bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-24 h-24 bg-background-dark rounded-full flex items-center justify-center mb-6 border border-surface-border shadow-lg">
                        <BuildingStorefrontIcon className="w-10 h-10 text-text-muted" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Brand Identity Found</h3>
                    <p className="text-text-secondary mb-8 max-w-md">Establish your brand profile to ensure all AI-generated content is consistent with your voice and mission.</p>
                    <Button size="lg" onClick={() => setIsWizardOpen(true)} rightIcon={<FingerPrintIcon className="w-5 h-5" />}>
                        Initialize Brand Identity
                    </Button>
                </Card>
            )}
            {isWizardOpen && <BrandOnboardingWizard onClose={() => setIsWizardOpen(false)} />}
        </div>
    );
};

export default BrandPage;