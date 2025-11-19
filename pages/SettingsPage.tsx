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
        <div className="flex items-center gap-2 text-zinc-300 pb-2 border-b border-white/5">
            {icon}
            <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
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
                <h1 className="text-3xl font-bold font-display text-white">{t('more')}</h1>
                <p className="text-zinc-400 mt-1">System configuration.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-10">
                    <SettingsSection title={t('settings.account')} icon={<UserCircleIcon className="w-4 h-4" />}>
                        <Card className="p-6 relative overflow-hidden border-white/10 bg-zinc-900">
                            <div className="flex items-center gap-5 mb-8 relative z-10">
                                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                    {userProfile.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium text-white">{userProfile.name}</h3>
                                    <p className="text-sm text-zinc-500 mb-2">{userProfile.email}</p>
                                    <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded border border-indigo-500/20">
                                        {userProfile.plan} Plan
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3 relative z-10">
                                <Button variant="outline" size="sm" className="flex-1" disabled>Billing</Button>
                                <Button variant="danger" size="sm" onClick={logout}>{t('settings.logout')}</Button>
                            </div>
                        </Card>
                    </SettingsSection>

                    <SettingsSection title="Notifications" icon={<BellIcon className="w-4 h-4" />}>
                        <Card className="p-6 divide-y divide-white/5 bg-zinc-900">
                            <div className="py-3"><Toggle id="notif-1" label="Email me when creations are ready" enabled={creationComplete} onChange={setCreationComplete} /></div>
                            <div className="py-3"><Toggle id="notif-2" label="Weekly AI marketing tips" enabled={weeklyTips} onChange={setWeeklyTips} /></div>
                            <div className="py-3"><Toggle id="notif-3" label="Product updates & changelog" enabled={productUpdates} onChange={setProductUpdates} /></div>
                        </Card>
                    </SettingsSection>
                </div>

                {/* Right Column */}
                <div className="space-y-10">
                    <SettingsSection title={t('settings.language')} icon={<GlobeAltIcon className="w-4 h-4" />}>
                         <Card className="p-6 bg-zinc-900">
                            <p className="text-sm text-zinc-500 mb-4">Interface language.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setLanguage('en')}
                                    className={`p-4 rounded-xl border transition-all ${language === 'en' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                                >
                                    <span className="text-sm font-bold block mb-1">English</span>
                                </button>
                                <button 
                                    onClick={() => setLanguage('ar')}
                                    className={`p-4 rounded-xl border transition-all ${language === 'ar' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                                >
                                    <span className="text-sm font-bold block mb-1">العربية</span>
                                </button>
                            </div>
                        </Card>
                    </SettingsSection>

                    <SettingsSection title={t('settings.tools_links')} icon={<Squares2X2Icon className="w-4 h-4" />}>
                        <Card className="p-6 bg-zinc-900">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {ALL_TOOLS_ORDER.map(toolId => {
                                    const tool = TOOLS[toolId];
                                    return (
                                        <Link 
                                            key={toolId} 
                                            to={`/${toolId === 'ugc-video' ? 'ugc-videos' : toolId === 'promo-video' ? 'promo-videos' : toolId}`} 
                                            className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all group text-center h-24"
                                        >
                                            <div className="text-zinc-500 group-hover:text-indigo-400 mb-2 transition-colors">{tool.icon}</div>
                                            <span className="text-[10px] font-medium text-zinc-500 group-hover:text-white line-clamp-2 uppercase tracking-tight">{tool.name}</span>
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