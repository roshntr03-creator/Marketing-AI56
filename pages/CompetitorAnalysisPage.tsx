
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
    MagnifyingGlassIcon, 
    GlobeAltIcon, 
    BoltIcon, 
    ShieldExclamationIcon, 
    TrophyIcon,
    ChartBarIcon,
    ClockIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    SignalIcon,
    UserGroupIcon,
    MegaphoneIcon,
    HashtagIcon,
    ShareIcon,
    FlagIcon
} from '@heroicons/react/24/outline';
import aiService from '../services/aiService';
import { useAppContext } from '../contexts/AppContext';
import { CompetitorAnalysisReport, CreationJob } from '../types';

const CompetitorAnalysisPage: React.FC = () => {
    const { addCreation, creations } = useAppContext();

    // State
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    
    // Animation State
    const [progress, setProgress] = useState(0);
    const [scanStage, setScanStage] = useState('Initializing');

    // Derived Data
    const pastReports = creations.filter(c => c.type === 'COMPETITOR_ANALYSIS');
    const currentJob = creations.find(c => c.id === activeJobId);
    
    // Parse report from job result if available
    const activeReport: CompetitorAnalysisReport | null = currentJob?.resultText 
        ? JSON.parse(currentJob.resultText) 
        : null;

    // Calculate "Threat Score" (Mock Logic based on strengths/weaknesses count)
    const calculateThreatScore = (report: CompetitorAnalysisReport) => {
        const baseScore = 50;
        const strengthScore = (report.contentStrengths?.length || 0) * 8;
        const weaknessScore = (report.contentWeaknesses?.length || 0) * 5;
        // Position multiplier
        let posMultiplier = 1;
        if (report.marketPosition === 'Leader') posMultiplier = 1.2;
        if (report.marketPosition === 'Niche') posMultiplier = 0.8;
        
        const score = (baseScore + strengthScore - weaknessScore) * posMultiplier;
        return Math.min(Math.max(Math.round(score), 10), 98); // Clamp between 10 and 98
    };

    const threatScore = activeReport ? calculateThreatScore(activeReport) : 0;

    // Simulate scanning progress
    useEffect(() => {
        if (isAnalyzing) {
            setProgress(0);
            setScanStage('Resolving DNS...');
            
            const interval = setInterval(() => {
                setProgress(prev => {
                    const increment = Math.random() * 4;
                    const newProg = prev + increment;
                    
                    if (newProg > 10 && newProg < 25) setScanStage('Crawling Sitemap...');
                    if (newProg > 25 && newProg < 45) setScanStage('Identifying Brand Voice...');
                    if (newProg > 45 && newProg < 65) setScanStage('Mapping Social Footprint...');
                    if (newProg > 65 && newProg < 85) setScanStage('Calculating Market Threat...');
                    if (newProg >= 100) {
                         setScanStage('Finalizing Intelligence...');
                         return 100;
                    }
                    return newProg;
                });
            }, 150);
            
            return () => clearInterval(interval);
        }
    }, [isAnalyzing]);

    const handleAnalyze = async () => {
        if (!url) return;
        setIsAnalyzing(true);
        setActiveJobId(null); // Clear current view

        try {
            // 1. API Call
            const report = await aiService.analyzeCompetitor(url);
            
            // 2. Save to History
            const newJobId = `comp-${Date.now()}`;
            addCreation({
                id: newJobId,
                type: 'COMPETITOR_ANALYSIS',
                title: `Audit: ${new URL(url).hostname}`,
                params: { url },
                status: 'Completed',
                resultText: JSON.stringify(report)
            });

            // 3. Set View
            setActiveJobId(newJobId);

        } catch (e) {
            console.error("Analysis failed", e);
            // Handle error state here
        } finally {
            setIsAnalyzing(false);
            setProgress(100);
        }
    };

    const loadReport = (job: CreationJob) => {
        setActiveJobId(job.id);
        setUrl(job.params.url || '');
    };

    const getPositionColor = (pos?: string) => {
        switch(pos) {
            case 'Leader': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'Challenger': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'Niche': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'Follower': return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
            default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
        }
    };

    return (
        <div className="h-[calc(100vh-9rem)] flex flex-col lg:flex-row gap-6 animate-fade-in pb-2">
            
            {/* LEFT PANEL: Controls & History */}
            <div className="w-full lg:w-4/12 flex flex-col h-full bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 bg-zinc-900/50 backdrop-blur-sm">
                    <h1 className="text-xl font-bold font-display text-white">Market Intel</h1>
                    <p className="text-zinc-400 text-xs">Competitive Intelligence Scanner</p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-zinc-900/20">
                    
                    {/* Input Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <GlobeAltIcon className="w-3 h-3"/> Target URL
                        </label>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-focus-within:opacity-100 transition duration-500 blur"></div>
                            <div className="relative flex bg-zinc-950 rounded-xl border border-white/10 shadow-inner">
                                <input 
                                    className="flex-1 bg-transparent border-none text-sm text-white px-4 py-3 focus:ring-0 placeholder-zinc-600"
                                    placeholder="https://competitor.com"
                                    value={url}
                                    onChange={e => setUrl(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                                />
                                <button 
                                    onClick={() => setUrl('')}
                                    className={`px-3 text-zinc-500 hover:text-white transition-opacity ${url ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                        <Button 
                            onClick={handleAnalyze} 
                            isLoading={isAnalyzing} 
                            disabled={!url} 
                            size="lg" 
                            className="w-full shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300"
                        >
                            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                            Run Deep Scan
                        </Button>
                    </div>

                    {/* History List */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <ClockIcon className="w-3 h-3"/> Recent Audits
                        </label>
                        <div className="space-y-2">
                            {pastReports.map(job => (
                                <button 
                                    key={job.id}
                                    onClick={() => loadReport(job)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all group flex items-center justify-between ${activeJobId === job.id ? 'bg-zinc-900 border-indigo-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs uppercase border border-white/5">
                                            {job.title.charAt(7)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-medium truncate ${activeJobId === job.id ? 'text-white' : 'text-zinc-300'}`}>
                                                {job.params.url?.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]}
                                            </p>
                                            <p className="text-[10px] text-zinc-500">{new Date(job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <ArrowRightIcon className={`w-3 h-3 text-zinc-600 group-hover:text-zinc-400 ${activeJobId === job.id ? 'text-indigo-400' : ''}`} />
                                </button>
                            ))}
                            {pastReports.length === 0 && (
                                <div className="p-6 text-center border border-dashed border-white/10 rounded-lg">
                                    <p className="text-xs text-zinc-500">No audits recorded.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: Analysis Report */}
            <div className="w-full lg:w-8/12 h-full flex flex-col animate-fade-in">
                <Card className="flex-1 flex flex-col p-0 overflow-hidden relative bg-[#050505] border-white/10 shadow-2xl">
                    
                    {/* Loading Overlay */}
                    {isAnalyzing && (
                        <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center">
                             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                             
                             <div className="w-80 space-y-6 relative z-10">
                                 {/* Terminal Output */}
                                 <div className="font-mono text-xs text-green-500 bg-black/50 p-4 rounded-lg border border-green-500/20 h-32 overflow-hidden flex flex-col justify-end shadow-lg">
                                     <div className="opacity-50">Initializing protocols...</div>
                                     <div className="opacity-70">Connecting to target: {url}...</div>
                                     <div className="opacity-90">Status 200 OK.</div>
                                     <div className="animate-pulse">> {scanStage}</div>
                                 </div>

                                 {/* Progress Bar */}
                                 <div className="space-y-2">
                                     <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500">
                                         <span>System Processing</span>
                                         <span>{Math.round(progress)}%</span>
                                     </div>
                                     <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                         <div className="h-full bg-indigo-500 transition-all duration-200" style={{width: `${progress}%`}}></div>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!activeReport && !isAnalyzing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
                            <ChartBarIcon className="w-20 h-20 opacity-20 mb-6" />
                            <h3 className="text-lg font-medium text-zinc-500">Awaiting Intelligence</h3>
                            <p className="text-sm mt-2 max-w-xs text-center opacity-60">Enter a URL on the left to generate a comprehensive strategy audit.</p>
                        </div>
                    )}

                    {/* Active Report View */}
                    {activeReport && !isAnalyzing && (
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                            
                            {/* Top Header: Identity & Score */}
                            <div className="flex flex-col md:flex-row gap-8 mb-10">
                                <div className="flex-1">
                                    <div className="flex gap-2 mb-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium uppercase tracking-wider">
                                            <SignalIcon className="w-3 h-3 animate-pulse"/> Live Analysis
                                        </div>
                                        {activeReport.marketPosition && (
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border ${getPositionColor(activeReport.marketPosition)}`}>
                                                <FlagIcon className="w-3 h-3"/> {activeReport.marketPosition}
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h2 className="text-4xl font-bold text-white font-display mb-2 tracking-tight">
                                        {currentJob?.params.url?.replace('https://', '').split('/')[0]}
                                    </h2>
                                    <p className="text-zinc-400 text-sm">Generated on {new Date(currentJob!.createdAt).toLocaleDateString()}</p>
                                </div>
                                
                                {/* Threat Score Card */}
                                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex items-center gap-6 shadow-lg">
                                    <div className="relative w-20 h-20 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="40" cy="40" r="36" stroke="#27272a" strokeWidth="6" fill="none" />
                                            <circle 
                                                cx="40" cy="40" r="36" 
                                                stroke={threatScore > 70 ? '#ef4444' : threatScore > 40 ? '#f59e0b' : '#10b981'} 
                                                strokeWidth="6" 
                                                fill="none" 
                                                strokeDasharray="226" 
                                                strokeDashoffset={226 - (226 * threatScore) / 100} 
                                                strokeLinecap="round"
                                                className="drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                                            />
                                        </svg>
                                        <span className="absolute text-xl font-bold text-white">{Math.round(threatScore)}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Market Threat</h3>
                                        <p className={`text-lg font-bold ${threatScore > 70 ? 'text-red-400' : threatScore > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                            {threatScore > 70 ? 'High' : threatScore > 40 ? 'Moderate' : 'Low'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Signals Row */}
                            {activeReport.socialPlatforms && activeReport.socialPlatforms.length > 0 && (
                                <div className="mb-8">
                                     <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                                        <ShareIcon className="w-4 h-4" /> Social Signals
                                     </h3>
                                     <div className="flex gap-3">
                                         {activeReport.socialPlatforms.map(platform => (
                                             <div key={platform} className="px-4 py-2 bg-zinc-900 border border-white/5 rounded-lg text-xs text-zinc-300 flex items-center gap-2">
                                                 <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                 {platform}
                                             </div>
                                         ))}
                                     </div>
                                </div>
                            )}

                            {/* Positioning Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                                    <div className="flex items-center gap-2 text-indigo-400 mb-4">
                                        <UserGroupIcon className="w-5 h-5" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider">Target Audience</h3>
                                    </div>
                                    <p className="text-zinc-200 text-sm leading-relaxed">{activeReport.targetAudience}</p>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                                    <div className="flex items-center gap-2 text-purple-400 mb-4">
                                        <MegaphoneIcon className="w-5 h-5" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider">Tone of Voice</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activeReport.toneOfVoice.split(',').map((tone, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                                                {tone.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Key Topics Cloud */}
                            {activeReport.keyTopics && activeReport.keyTopics.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 text-pink-400 mb-4">
                                        <HashtagIcon className="w-5 h-5" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider">Content Pillars</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activeReport.keyTopics.map((topic, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-md bg-pink-500/5 border border-pink-500/10 text-pink-200 text-xs">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SWOT Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                                        <BoltIcon className="w-4 h-4 text-emerald-500"/> Strengths
                                    </h3>
                                    <ul className="space-y-2">
                                        {activeReport.contentStrengths.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-sm text-zinc-300">
                                                <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                                        <ShieldExclamationIcon className="w-4 h-4 text-red-500"/> Weaknesses
                                    </h3>
                                    <ul className="space-y-2">
                                        {activeReport.contentWeaknesses.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-sm text-zinc-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Battle Plan */}
                            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-indigo-500/20 rounded-2xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                
                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
                                        <TrophyIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-display">Strategic Counter-Measures</h3>
                                        <p className="text-xs text-zinc-400">Actionable steps to outcompete this brand.</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 relative z-10">
                                    {activeReport.howToCompete.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors group">
                                            <span className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold font-mono text-sm border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                {i + 1}
                                            </span>
                                            <p className="text-sm text-zinc-200">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default CompetitorAnalysisPage;
