import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ALL_TOOLS_ORDER, TOOLS } from '../constants';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Toggle from '../components/ui/Toggle';
import { UserCircleIcon, BellIcon, GlobeAltIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const SettingsSection: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary pb-2 border-b border-white/5">
            {icon}
            <h2 className="text-lg font-display font-bold uppercase tracking-wide">{title}</h2>
        </div>
        <div className="grid gap-6">
            {children}
        </div>
    </section>
);

const SettingsPage: React.FC = () => {
    const { userProfile, logout, t, language, setLanguage } = useAppContext();
    const [creationComplete, setCreationComplete] = useState(true);
    const [weeklyTips, setWeeklyTips] = useState(true);
    const [productUpdates, setProductUpdates] = useState(false);

    if (!userProfile) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
            <div className="border-b border-white/5 pb-6">
                <h1 className="text-3xl font-bold font-display">{t('more')}</h1>
                <p className="text-text-secondary mt-1">System configuration and preferences.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-10">
                    <SettingsSection title={t('settings.account')} icon={<UserCircleIcon className="w-5 h-5" />}>
                        <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-background-card to-background-dark border-primary/20">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <UserCircleIcon className="w-32 h-32 text-white" />
                            </div>
                            <div className="flex items-center gap-5 mb-8 relative z-10">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary/30 ring-4 ring-background-card">
                                    {userProfile.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{userProfile.name}</h3>
                                    <p className="text-sm text-text-secondary mb-2">{userProfile.email}</p>
                                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase border border-primary/20 tracking-wide">
                                        {userProfile.plan} Plan
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3 relative z-10">
                                <Button variant="outline" size="sm" className="flex-1" disabled>Manage Billing</Button>
                                <Button variant="danger" size="sm" onClick={logout}>{t('settings.logout')}</Button>
                            </div>
                        </Card>
                    </SettingsSection>

                    <SettingsSection title="Notifications" icon={<BellIcon className="w-5 h-5" />}>
                        <Card className="p-6 divide-y divide-white/5">
                            <div className="py-3"><Toggle id="notif-1" label="Email me when creations are ready" enabled={creationComplete} onChange={setCreationComplete} /></div>
                            <div className="py-3"><Toggle id="notif-2" label="Weekly AI marketing tips" enabled={weeklyTips} onChange={setWeeklyTips} /></div>
                            <div className="py-3"><Toggle id="notif-3" label="Product updates & changelog" enabled={productUpdates} onChange={setProductUpdates} /></div>
                        </Card>
                    </SettingsSection>
                </div>

                {/* Right Column */}
                <div className="space-y-10">
                    <SettingsSection title={t('settings.language')} icon={<GlobeAltIcon className="w-5 h-5" />}>
                         <Card className="p-6">
                            <p className="text-sm text-text-secondary mb-4">Select your preferred interface language.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setLanguage('en')}
                                    className={`p-4 rounded-xl border transition-all ${language === 'en' ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/10' : 'bg-background-dark border-surface-border text-text-secondary hover:border-primary/50 hover:bg-white/5'}`}
                                >
                                    <span className="text-lg font-bold block mb-1">English</span>
                                    <span className="text-xs opacity-70">Default</span>
                                </button>
                                <button 
                                    onClick={() => setLanguage('ar')}
                                    className={`p-4 rounded-xl border transition-all ${language === 'ar' ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/10' : 'bg-background-dark border-surface-border text-text-secondary hover:border-primary/50 hover:bg-white/5'}`}
                                >
                                    <span className="text-lg font-bold block mb-1">العربية</span>
                                    <span className="text-xs opacity-70">Arabic</span>
                                </button>
                            </div>
                        </Card>
                    </SettingsSection>

                    <SettingsSection title={t('settings.tools_links')} icon={<Squares2X2Icon className="w-5 h-5" />}>
                        <Card className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {ALL_TOOLS_ORDER.map(toolId => {
                                    const tool = TOOLS[toolId];
                                    return (
                                        <Link 
                                            key={toolId} 
                                            to={`/${toolId === 'ugc-video' ? 'ugc-videos' : toolId === 'promo-video' ? 'promo-videos' : toolId}`} 
                                            className="flex flex-col items-center justify-center p-3 rounded-lg bg-background-dark border border-surface-border hover:border-primary hover:bg-white/5 transition-all group text-center h-24 hover:shadow-lg hover:-translate-y-1"
                                        >
                                            <div className="text-text-secondary group-hover:text-primary mb-2 transition-colors">{tool.icon}</div>
                                            <span className="text-[10px] font-medium text-text-secondary group-hover:text-white line-clamp-2 uppercase tracking-tight">{tool.name}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </Card>
                    </SettingsSection>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;