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
        <Card className="p-8 h-full flex flex-col relative overflow-hidden border-indigo-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <h3 className="font-display font-semibold text-lg text-white">Setup Progress</h3>
                    <p className="text-sm text-zinc-400 mt-1">Complete these steps to unlock full potential.</p>
                </div>
                <span className="text-2xl font-bold text-indigo-400 font-display">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-8 overflow-hidden relative z-10">
                <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }}></div>
            </div>
            
            <ul className="space-y-3 flex-1 relative z-10">
                {checklistItems.map((item, idx) => (
                    <li key={item.name} className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-200 border ${item.isComplete ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-zinc-900/50 border-white/5 hover:border-white/10'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-md ${item.isComplete ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                {item.icon}
                            </div>
                            <div>
                                <span className={`text-sm font-medium block ${item.isComplete ? 'text-white' : 'text-zinc-300'}`}>{item.name}</span>
                            </div>
                        </div>
                        
                        <div>
                            {item.isComplete ? (
                                <CheckCircleSolidIcon className="w-5 h-5 text-indigo-500" />
                            ) : (
                                item.action ? (
                                    <Button size="sm" variant="secondary" onClick={item.action} className="text-xs h-8 px-3">Complete</Button>
                                ) : (
                                    <Link to={item.href}>
                                        <Button size="sm" variant="secondary" rightIcon={<ArrowRightIcon className="w-3 h-3" />} className="text-xs h-8 px-3">Start</Button>
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

const StatCard: React.FC<{ label: string, count: number, icon: React.ReactNode }> = ({ label, count, icon }) => (
    <div className="bg-[#0e0e10] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:border-white/10 transition-all relative overflow-hidden group h-full">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-zinc-900 text-zinc-400 group-hover:text-indigo-400 transition-colors">
                {React.cloneElement(icon as React.ReactElement, { className: `w-5 h-5` })}
            </div>
        </div>
        <div>
            <p className="text-2xl font-display font-semibold text-white mb-1 tracking-tight">{count}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{label}</p>
        </div>
    </div>
);

const UsageStats: React.FC = () => {
    const { creations } = useAppContext();
    const imageCount = creations.filter(c => c.type === 'IMAGE').length;
    const videoCount = creations.filter(c => c.type.includes('VIDEO')).length;
    const contentCount = creations.filter(c => c.type === 'CONTENT').length;

    return (
        <Card className="p-8 h-full flex flex-col border-white/10">
            <h3 className="font-display font-semibold text-lg text-white mb-6">Overview</h3>
            <div className="grid grid-cols-1 gap-3 flex-1">
                <StatCard label="Images Generated" count={imageCount} icon={<PhotoIcon />} />
                <StatCard label="Videos Created" count={videoCount} icon={<VideoCameraIcon />} />
                <StatCard label="Content Pieces" count={contentCount} icon={<PresentationChartBarIcon />} />
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
            <h1 className="font-display text-3xl font-semibold text-white mb-2 tracking-tight">
                Hello, <span className="text-zinc-400">{userProfile?.name || 'Creator'}</span>
            </h1>
            <p className="text-zinc-500 text-sm">
                Welcome to your command center.
            </p>
          </div>
          <Link to="/creations">
            <Button variant="outline" className="h-10 text-xs" rightIcon={<ArrowRightIcon className="w-3 h-3"/>}>Recent Activity</Button>
          </Link>
      </header>

      {/* Quick Actions Row */}
      <section>
        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 pl-1">Quick Launch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/image-generator"><ShortcutCard title="Image Generator" icon={<PhotoIcon className="w-5 h-5"/>} description="Text to Image" /></Link>
            <Link to="/ugc-videos"><ShortcutCard title="UGC Creator" icon={<VideoCameraIcon className="w-5 h-5"/>} description="Viral Video Ads" /></Link>
            <Link to="/promo-videos"><ShortcutCard title="Promo Video" icon={<VideoCameraIcon className="w-5 h-5"/>} description="Cinematic Clips" /></Link>
            <Link to="/campaigns"><ShortcutCard title="Strategy Deck" icon={<PresentationChartBarIcon className="w-5 h-5"/>} description="Full Campaigns" /></Link>
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

const ShortcutCard: React.FC<{ title: string, icon: React.ReactNode, description: string }> = ({ title, icon, description }) => (
    <div className="group relative p-[1px] rounded-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-gradient-to-b from-white/10 to-transparent hover:from-indigo-500/50 hover:to-indigo-500/10">
        <div className="relative bg-[#0e0e10] h-full p-5 rounded-[11px] flex items-center gap-4 overflow-hidden">
             <div className={`w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-indigo-500 transition-all duration-300 shadow-inner`}>
                {icon}
            </div>
            <div>
                <h3 className="font-semibold text-zinc-200 group-hover:text-white transition-colors text-sm">{title}</h3>
                <p className="text-xs text-zinc-500 group-hover:text-zinc-400">{description}</p>
            </div>
        </div>
    </div>
);

export default Dashboard;