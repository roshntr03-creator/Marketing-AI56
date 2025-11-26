
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
    VideoCameraIcon, 
    PhotoIcon, 
    PencilSquareIcon, 
    PresentationChartBarIcon, 
    ArrowRightIcon, 
    SparklesIcon, 
    CpuChipIcon,
    BoltIcon,
    GlobeAltIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

// Mock Data for Chart/Trends
const TREND_DATA = [40, 65, 55, 80, 70, 90, 85];

const QuickActionCard: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    to: string;
    colorClass: string;
    delay?: string;
}> = ({ title, description, icon: Icon, to, colorClass, delay = '0s' }) => (
    <Link to={to} className="block group">
        <div 
            className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 p-6 hover:border-white/10 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl h-full"
            style={{ animationDelay: delay }}
        >
            <div className={`absolute top-0 right-0 p-20 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-3xl rounded-full translate-x-10 -translate-y-10`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-xl ${colorClass.replace('from-', 'bg-').replace('to-', '')} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${colorClass.replace('from-', 'text-').replace('to-', '')}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
                
                <div className="mt-auto pt-4 flex items-center text-xs font-medium text-zinc-600 group-hover:text-white transition-colors">
                    Launch Tool <ArrowRightIcon className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    </Link>
);

const StatCard: React.FC<{ label: string, value: string | number, trend?: string, icon: React.ElementType, highlight?: boolean }> = ({ label, value, trend, icon: Icon, highlight }) => (
    <div className={`bg-zinc-900/50 border rounded-xl p-4 flex items-center justify-between ${highlight ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/5'}`}>
        <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <h4 className={`text-2xl font-display font-bold ${highlight ? 'text-indigo-400' : 'text-white'}`}>{value}</h4>
                {trend && <span className="text-xs text-emerald-400 font-medium">{trend}</span>}
            </div>
        </div>
        <div className={`p-3 rounded-lg ${highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-zinc-400'}`}>
            <Icon className="w-5 h-5" />
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { userProfile, creations } = useAppContext();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Calculate Stats
    const videoCount = creations.filter(c => c.type.includes('VIDEO')).length;
    const imageCount = creations.filter(c => c.type === 'IMAGE').length;
    const credits = userProfile?.credits || 0;
    
    return (
        <div className="max-w-7xl mx-auto pb-12 animate-fade-in space-y-8">
            
            {/* Hero Header */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        System Operational
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                        {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{userProfile?.name?.split(' ')[0] || 'Creator'}</span>
                    </h1>
                    <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                        Your AI marketing command center is ready. What will you create today?
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <Link to="/settings">
                        <Button variant="secondary" size="sm">Manage Plan</Button>
                    </Link>
                    <Link to="/workflow-builder">
                        <Button variant="primary" size="sm" leftIcon={<BoltIcon className="w-4 h-4"/>}>
                            New Automation
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Assets" value={creations.length} trend="+12% this week" icon={GlobeAltIcon} />
                <StatCard label="Video Gen" value={videoCount} icon={VideoCameraIcon} />
                <StatCard label="Images Created" value={imageCount} icon={PhotoIcon} />
                <StatCard label="Available Credits" value={credits} icon={CpuChipIcon} highlight />
            </div>

            {/* Main Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Tools */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Quick Actions */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <SparklesIcon className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-lg font-bold text-white">Create New</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <QuickActionCard 
                                title="UGC Video Studio" 
                                description="Generate viral TikTok & Reels content with AI avatars."
                                icon={VideoCameraIcon} 
                                to="/ugc-videos" 
                                colorClass="from-pink-500 to-rose-500"
                            />
                            <QuickActionCard 
                                title="Image Generator" 
                                description="Create stunning visuals using Grok 3 and Seedream."
                                icon={PhotoIcon} 
                                to="/image-generator" 
                                colorClass="from-blue-500 to-cyan-500"
                            />
                            <QuickActionCard 
                                title="Content Writer" 
                                description="Draft blog posts, emails, and ad copy in seconds."
                                icon={PencilSquareIcon} 
                                to="/content-generator" 
                                colorClass="from-amber-500 to-orange-500"
                            />
                            <QuickActionCard 
                                title="Campaign Strategy" 
                                description="Plan comprehensive marketing campaigns."
                                icon={PresentationChartBarIcon} 
                                to="/campaigns" 
                                colorClass="from-emerald-500 to-teal-500"
                            />
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <Card className="p-0 overflow-hidden bg-zinc-900/30 border-white/10">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">Recent Activity</h3>
                            <Link to="/creations" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-400">
                                <thead className="bg-zinc-900/50 text-xs uppercase font-medium text-zinc-500">
                                    <tr>
                                        <th className="px-6 py-3">Project</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {creations.slice(0, 5).map((job) => (
                                        <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-zinc-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-zinc-800 border border-white/5 flex items-center justify-center">
                                                        {job.type.includes('VIDEO') ? <VideoCameraIcon className="w-4 h-4"/> : <PhotoIcon className="w-4 h-4"/>}
                                                    </div>
                                                    <span className="truncate max-w-[150px]">{job.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs">{job.type.replace('_', ' ')}</td>
                                            <td className="px-6 py-4 text-xs">{new Date(job.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                                                    job.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                    job.status === 'Generating' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                    'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                                }`}>
                                                    {job.status === 'Generating' && <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse"></span>}
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {job.resultUrl && (
                                                    <a href={job.resultUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                                                        <ArrowRightIcon className="w-4 h-4 ml-auto" />
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {creations.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-zinc-600">
                                                No recent activity. Start creating!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Insights & Trends */}
                <div className="space-y-8">
                    
                    {/* Usage Widget */}
                    <Card className="p-6 bg-zinc-900/30 border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
                        <h3 className="text-lg font-bold text-white mb-1">Performance</h3>
                        <p className="text-xs text-zinc-500 mb-6">Weekly asset generation</p>
                        
                        <div className="h-32 flex items-end gap-2 mb-4">
                            {TREND_DATA.map((h, i) => (
                                <div key={i} className="flex-1 bg-zinc-800 rounded-t-sm relative group overflow-hidden">
                                    <div 
                                        className="absolute bottom-0 left-0 right-0 bg-indigo-600 opacity-80 group-hover:opacity-100 transition-all duration-500" 
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
                            <span className="text-white font-bold">+24%</span> vs last week
                        </div>
                    </Card>

                    {/* Trending Tip */}
                    <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-1 shadow-xl">
                        <div className="bg-zinc-900/90 rounded-xl p-6 h-full backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-0.5 rounded bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider">New Feature</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Workflow Automation</h3>
                            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                                Connect your AI tools together. Automatically generate an image, write a caption, and post it—all in one flow.
                            </p>
                            <Link to="/workflow-builder">
                                <Button size="sm" className="w-full bg-white text-black hover:bg-zinc-200 border-transparent shadow-none">Try Builder</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mini Community/News */}
                    <Card className="p-6 bg-zinc-900/30 border-white/10">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Latest Updates</h3>
                        <div className="space-y-4">
                            {[
                                { date: 'Today', text: 'Sora 2.0 model integration live.' },
                                { date: 'Yesterday', text: 'Added PDF export to Content Generator.' },
                                { date: '2 days ago', text: 'Team collaboration features enabled.' }
                            ].map((news, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-zinc-300 leading-snug">{news.text}</p>
                                        <span className="text-[10px] text-zinc-600">{news.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;