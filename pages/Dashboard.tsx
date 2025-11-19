import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowRightIcon, ChartPieIcon, PhotoIcon, VideoCameraIcon, BuildingStorefrontIcon, SparklesIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

const GettingStarted: React.FC = () => {
    const { brandProfile, creations, checklistState, updateChecklist } = useAppContext();

    const checklistItems = [
        { name: 'Setup Brand Identity', href: '/brand', isComplete: !!brandProfile, icon: <BuildingStorefrontIcon className="w-5 h-5"/>, description: "Define your AI's persona." },
        { name: 'Generate first asset', href: '/image-generator', isComplete: creations.length > 0, icon: <SparklesIcon className="w-5 h-5"/>, description: "Create an image or video." },
        { name: 'Explore all tools', href: '/settings', isComplete: checklistState.exploredTools, icon: <ChartPieIcon className="w-5 h-5"/>, action: () => updateChecklist({ exploredTools: true }), description: "View the full suite." },
    ];
    
    const completedCount = checklistItems.filter(item => item.isComplete).length;
    const progress = (completedCount / checklistItems.length) * 100;

    return (
        <Card className="p-8 h-full flex flex-col relative overflow-hidden border-primary/20 bg-gradient-to-br from-background-card to-background-dark">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <SparklesIcon className="w-48 h-48 text-primary" />
            </div>
            
            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <h3 className="font-display font-bold text-2xl text-white">Setup Progress</h3>
                    <p className="text-sm text-text-secondary mt-1">Complete these steps to unlock full potential.</p>
                </div>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-background-dark rounded-full h-3 mb-8 overflow-hidden relative z-10 shadow-inner shadow-black/50 border border-white/5">
                <div className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.6)]" style={{ width: `${progress}%` }}></div>
            </div>
            
            <ul className="space-y-4 flex-1 relative z-10">
                {checklistItems.map((item, idx) => (
                    <li key={item.name} className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border ${item.isComplete ? 'bg-primary/5 border-primary/20' : 'bg-background-dark/40 border-surface-border hover:border-primary/30 hover:bg-background-dark/60'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg transition-colors ${item.isComplete ? 'text-white bg-green-500/20' : 'text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white'}`}>
                                {item.icon}
                            </div>
                            <div>
                                <span className={`text-sm font-bold block ${item.isComplete ? 'text-white' : 'text-text-primary'}`}>{item.name}</span>
                                <span className="text-xs text-text-secondary">{item.description}</span>
                            </div>
                        </div>
                        
                        <div>
                            {item.isComplete ? (
                                <div className="bg-green-500/10 p-1 rounded-full">
                                    <CheckCircleSolidIcon className="w-6 h-6 text-green-500" />
                                </div>
                            ) : (
                                item.action ? (
                                    <Button size="sm" variant="secondary" onClick={item.action}>Complete</Button>
                                ) : (
                                    <Link to={item.href}>
                                        <Button size="sm" variant="secondary" rightIcon={<ArrowRightIcon className="w-3 h-3" />}>Start</Button>
                                    </Link>
                                )
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const StatCard: React.FC<{ label: string, count: number, icon: React.ReactNode, gradient: string }> = ({ label, count, icon, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} bg-opacity-10 border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group h-full`}>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-black/20 backdrop-blur-sm text-white shadow-sm border border-white/5">
                {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6` })}
            </div>
            <div className="h-12 w-20 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-2xl absolute -top-4 -right-4"></div>
        </div>
        <div>
            <p className="text-4xl font-display font-bold text-white mb-1">{count}</p>
            <p className="text-xs text-white/70 uppercase tracking-wider font-medium">{label}</p>
        </div>
    </div>
);

const UsageStats: React.FC = () => {
    const { creations } = useAppContext();
    const imageCount = creations.filter(c => c.type === 'IMAGE').length;
    const videoCount = creations.filter(c => c.type.includes('VIDEO')).length;
    const contentCount = creations.filter(c => c.type === 'CONTENT').length;

    return (
        <Card className="p-8 h-full flex flex-col bg-background-card/50">
            <h3 className="font-display font-bold text-xl text-white mb-6">Production Overview</h3>
            <div className="grid grid-cols-1 gap-4 flex-1">
                <StatCard label="Images Generated" count={imageCount} icon={<PhotoIcon />} gradient="from-purple-500/20 to-blue-600/20" />
                <StatCard label="Videos Created" count={videoCount} icon={<VideoCameraIcon />} gradient="from-pink-500/20 to-rose-600/20" />
                <StatCard label="Content Pieces" count={contentCount} icon={<PresentationChartBarIcon />} gradient="from-amber-500/20 to-orange-600/20" />
            </div>
        </Card>
    );
};

const Dashboard: React.FC = () => {
  const { userProfile } = useAppContext();
  
  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_0_10px_rgba(79,70,229,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                System Online
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{userProfile?.name || 'Creator'}</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl">
                Your enterprise AI command center is ready. Select a workflow to begin.
            </p>
          </div>
          <Link to="/creations">
            <Button variant="outline" className="h-12 px-6" rightIcon={<ArrowRightIcon className="w-4 h-4"/>}>Recent Activity</Button>
          </Link>
      </header>

      {/* Quick Actions Row */}
      <section>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4 pl-1">Quick Launch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/image-generator"><ShortcutCard title="Image Generator" icon={<PhotoIcon className="w-6 h-6"/>} description="Text to Image" color="text-purple-400" /></Link>
            <Link to="/ugc-videos"><ShortcutCard title="UGC Creator" icon={<VideoCameraIcon className="w-6 h-6"/>} description="Viral Video Ads" color="text-pink-400" /></Link>
            <Link to="/promo-videos"><ShortcutCard title="Promo Video" icon={<VideoCameraIcon className="w-6 h-6"/>} description="Cinematic Clips" color="text-blue-400" /></Link>
            <Link to="/campaigns"><ShortcutCard title="Strategy Deck" icon={<PresentationChartBarIcon className="w-6 h-6"/>} description="Full Campaigns" color="text-amber-400" /></Link>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[450px]">
          <div className="lg:col-span-2 h-full">
             <GettingStarted />
          </div>
          <div className="lg:col-span-1 h-full">
            <UsageStats />
          </div>
      </section>
    </div>
  );
};

const ShortcutCard: React.FC<{ title: string, icon: React.ReactNode, description: string, color: string }> = ({ title, icon, description, color }) => (
    <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/5 to-transparent hover:from-primary/50 transition-all duration-300 cursor-pointer hover:-translate-y-1">
        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative bg-background-card/80 backdrop-blur-xl border border-surface-border h-full p-5 rounded-xl flex items-center gap-4 overflow-hidden group-hover:border-primary/30 transition-colors">
             <div className={`w-12 h-12 rounded-xl bg-background-dark flex items-center justify-center ${color} border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-white group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-xs text-text-secondary">{description}</p>
            </div>
            <ArrowRightIcon className="w-4 h-4 text-text-muted ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
        </div>
    </div>
);

export default Dashboard;