import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
    ArrowRightIcon, 
    ChartPieIcon, 
    PhotoIcon, 
    VideoCameraIcon, 
    BuildingStorefrontIcon, 
    SparklesIcon, 
    PresentationChartBarIcon,
    LightBulbIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    FireIcon,
    PlayIcon,
    PencilSquareIcon,
    BoltIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

// --- Marketing Tips Data ---
const MARKETING_TIPS = [
  "Video posts on social media generate 1200% more shares than text and images combined.",
  "Personalized emails deliver 6x higher transaction rates than generic blasts.",
  "Interactive content gains 2x more engagement than static content on average.",
  "70% of consumers feel closer to a company as a result of content marketing.",
  "Using emojis in email subject lines can increase open rates by up to 56%.",
  "Long-tail keywords often have 2.5x higher conversion rates than generic terms.",
  "User-Generated Content (UGC) increases web conversion rates by 29%.",
  "A/B testing your ad creatives can lower CPA by 20-40% within the first week.",
  "Consistency is key: Brands that post daily on Instagram grow followers 4x faster."
];

// --- Components ---

const DailyInsight: React.FC = () => {
    const [tip, setTip] = useState("");

    useEffect(() => {
        // Select a tip based on the current hour to simulate "updates every few hours"
        // or random selection on mount for variety in this demo.
        const index = Math.floor(Math.random() * MARKETING_TIPS.length);
        setTip(MARKETING_TIPS[index]);
    }, []);

    return (
        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6 shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            
            <div className="relative z-10 flex items-start gap-4">
                <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <LightBulbIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Pro Marketing Tip</h3>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[10px] text-indigo-200 border border-indigo-500/20 animate-pulse">Live</span>
                    </div>
                    <p className="text-lg font-medium text-white leading-relaxed">"{tip}"</p>
                </div>
            </div>
        </div>
    );
};

const SetupProgress: React.FC = () => {
    const { brandProfile, creations, checklistState, updateChecklist } = useAppContext();

    const checklistItems = [
        { name: 'Define Brand Identity', href: '/brand', isComplete: !!brandProfile, icon: <BuildingStorefrontIcon className="w-4 h-4"/>, desc: "Set your AI persona" },
        { name: 'Generate First Asset', href: '/image-generator', isComplete: creations.length > 0, icon: <SparklesIcon className="w-4 h-4"/>, desc: "Create image or video" },
        { name: 'Explore Tools', href: '/settings', isComplete: checklistState.exploredTools, icon: <BoltIcon className="w-4 h-4"/>, action: () => updateChecklist({ exploredTools: true }), desc: "View full suite" },
    ];
    
    const completedCount = checklistItems.filter(item => item.isComplete).length;
    const progress = (completedCount / checklistItems.length) * 100;

    return (
        <Card className="p-6 h-full flex flex-col bg-[#09090b] border-white/10">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className="font-display font-semibold text-lg text-white">Onboarding</h3>
                    <p className="text-xs text-zinc-500 mt-1">Complete setup to unlock max potential.</p>
                </div>
                <div className="text-right">
                     <span className="text-2xl font-bold text-white font-display">{Math.round(progress)}%</span>
                </div>
            </div>
            
            <div className="w-full bg-zinc-800/50 rounded-full h-1.5 mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }}></div>
            </div>
            
            <ul className="space-y-3 flex-1">
                {checklistItems.map((item, idx) => (
                    <li key={idx} className={`group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${item.isComplete ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${item.isComplete ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-800'}`}>
                                {item.isComplete ? <CheckCircleSolidIcon className="w-4 h-4"/> : item.icon}
                            </div>
                            <div>
                                <span className={`text-sm font-medium block ${item.isComplete ? 'text-white' : 'text-zinc-300'}`}>{item.name}</span>
                                <span className="text-[10px] text-zinc-500">{item.desc}</span>
                            </div>
                        </div>
                        
                        {!item.isComplete && (
                            item.action ? (
                                <button onClick={item.action} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5 transition-colors">
                                    Complete
                                </button>
                            ) : (
                                <Link to={item.href} className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all">
                                    Start
                                </Link>
                            )
                        )}
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const RecentCreations: React.FC = () => {
    const { creations } = useAppContext();
    const recent = creations.slice(0, 4);

    return (
        <Card className="p-6 h-full flex flex-col bg-[#09090b] border-white/10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-display font-semibold text-lg text-white">Recent Activity</h3>
                    <p className="text-xs text-zinc-500 mt-1">Your latest generated assets.</p>
                </div>
                <Link to="/creations" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    View All <ArrowRightIcon className="w-3 h-3" />
                </Link>
            </div>

            {recent.length > 0 ? (
                <div className="space-y-3">
                    {recent.map(job => (
                        <div key={job.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-default">
                            <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/10 overflow-hidden flex-shrink-0 relative">
                                {job.resultUrl ? (
                                    job.type.includes('VIDEO') ? (
                                        <video src={job.resultUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={job.resultUrl} className="w-full h-full object-cover" />
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                        <PhotoIcon className="w-5 h-5" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">{job.title}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                        job.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                        job.status === 'Failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                        {job.status}
                                    </span>
                                    <span className="text-[10px] text-zinc-600">{new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-xl bg-white/[0.02]">
                    <ClockIcon className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs">No recent activity</p>
                </div>
            )}
        </Card>
    );
};

const ShortcutCard: React.FC<{ 
    title: string; 
    icon: React.ReactNode; 
    description: string; 
    gradient: string;
    to: string;
}> = ({ title, icon, description, gradient, to }) => (
    <Link to={to} className="group relative p-[1px] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        <div className="relative h-full bg-[#0e0e10] rounded-[15px] p-5 border border-white/5 overflow-hidden group-hover:border-transparent transition-colors">
            
            {/* Hover Glow Effect inside card */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 blur-[40px] transition-opacity duration-500`}></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${gradient} mb-4`}>
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-white text-sm mb-1 group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    </Link>
);

const StatsWidget: React.FC = () => {
    const { creations } = useAppContext();
    const imageCount = creations.filter(c => c.type === 'IMAGE').length;
    const videoCount = creations.filter(c => c.type.includes('VIDEO')).length;
    
    return (
        <Card className="p-6 bg-[#09090b] border-white/10 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                    <ArrowTrendingUpIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Assets</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                    <span className="text-3xl font-bold text-white font-display block">{imageCount}</span>
                    <span className="text-xs text-zinc-500">Images</span>
                </div>
                <div>
                    <span className="text-3xl font-bold text-white font-display block">{videoCount}</span>
                    <span className="text-xs text-zinc-500">Videos</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                 <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <FireIcon className="w-3 h-3" />
                    <span>Pro Plan Active</span>
                 </div>
            </div>
        </Card>
    );
}

const Dashboard: React.FC = () => {
  const { userProfile } = useAppContext();
  
  const getTimeGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Hero Section */}
      <header className="relative pt-8 pb-6 border-b border-white/5">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
              <div>
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    System Operational
                 </div>
                 <h1 className="font-display text-4xl font-bold text-white tracking-tight">
                    {getTimeGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{userProfile?.name || 'Creator'}</span>
                 </h1>
                 <p className="text-zinc-400 mt-2 text-sm max-w-xl">
                    Your creative command center is ready. What will you build today?
                 </p>
              </div>
              
              <div className="flex gap-3">
                  <Link to="/image-generator">
                      <Button variant="primary" size="sm" className="shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                          <SparklesIcon className="w-4 h-4 mr-2" /> New Project
                      </Button>
                  </Link>
                  <Link to="/settings">
                      <Button variant="secondary" size="sm">Manage Plan</Button>
                  </Link>
              </div>
           </div>
      </header>

      {/* Insight Banner */}
      <section>
          <DailyInsight />
      </section>

      {/* Quick Launch Grid */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1">
            <BoltIcon className="w-4 h-4 text-zinc-500" />
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Quick Launch</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ShortcutCard 
                to="/ugc-videos"
                title="UGC Studio" 
                description="Create viral TikToks & Reels with Sora 2."
                icon={<VideoCameraIcon className="w-5 h-5" />} 
                gradient="from-pink-500 to-rose-500"
            />
            <ShortcutCard 
                to="/image-generator"
                title="Image Lab" 
                description="Generate 8K visuals with Grok 3."
                icon={<PhotoIcon className="w-5 h-5" />} 
                gradient="from-indigo-500 to-blue-500"
            />
            <ShortcutCard 
                to="/campaigns"
                title="Strategy Deck" 
                description="AI-powered campaign blueprints."
                icon={<PresentationChartBarIcon className="w-5 h-5" />} 
                gradient="from-emerald-500 to-teal-500"
            />
             <ShortcutCard 
                to="/workflow-builder"
                title="Workflow OS" 
                description="Automate complex creative pipelines."
                icon={<ChartPieIcon className="w-5 h-5" />} 
                gradient="from-violet-500 to-purple-500"
            />
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[420px]">
          {/* Column 1: Progress */}
          <div className="lg:col-span-1 h-full">
             <SetupProgress />
          </div>

          {/* Column 2: Recent Activity */}
          <div className="lg:col-span-1 h-full">
             <RecentCreations />
          </div>

          {/* Column 3: Stats & Info */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full">
            <div className="flex-1">
                <StatsWidget />
            </div>
            
            {/* Mini Promo Card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-900/50 to-zinc-900 border border-indigo-500/20 relative overflow-hidden group cursor-pointer hover:border-indigo-500/40 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full group-hover:bg-indigo-500/30 transition-colors"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-indigo-300">
                        <PlayIcon className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Tutorial</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Mastering Sora 2.0</h3>
                    <p className="text-xs text-zinc-400">Learn cinematic prompting techniques in 5 mins.</p>
                </div>
            </div>
          </div>
      </section>
    </div>
  );
};

export default Dashboard;