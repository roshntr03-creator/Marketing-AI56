
import React, { useState, useEffect, useRef } from 'react';
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
    FlagIcon,
    ArrowDownTrayIcon,
    ArrowTopRightOnSquareIcon,
    CommandLineIcon
} from '@heroicons/react/24/outline';
import aiService from '../services/aiService';
import { useAppContext } from '../contexts/AppContext';
import { CompetitorAnalysisReport, CreationJob } from '../types';

const ThreatGauge = ({ score }: { score: number }) => {
    const color = score > 70 ? 'text-red-500 stroke-red-500' : score > 40 ? 'text-amber-500 stroke-amber-500' : 'text-emerald-500 stroke-emerald-500';
    const label = score > 70 ? 'Critical' : score > 40 ? 'Moderate' : 'Low';

    // Semi-circle arc length ~126 (PI * R) where R=40
    const strokeDasharray = 126;
    const strokeDashoffset = 126 - (126 * score) / 100;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-24 overflow-hidden">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    {/* Track */}
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#27272a" strokeWidth="6" strokeLinecap="round" />
                    {/* Progress */}
                    <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        className={`${color} transition-all duration-1000 ease-out`}
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeDasharray={strokeDasharray} 
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end mb-2">
                     <span className={`text-4xl font-bold font-display ${color.split(' ')[0]}`}>{score}</span>
                </div>
            </div>
            <div className="text-center mt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Threat Level</h3>
                <p className={`text-sm font-bold ${color.split(' ')[0]}`}>{label}</p>
            </div>
        </div>
    );
};

const CompetitorAnalysisPage: React.FC = () => {
    const { addCreation, creations } = useAppContext();

    // State
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);
    
    // Animation State
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Derived Data
    const pastReports = creations.filter(c => c.type === 'COMPETITOR_ANALYSIS');
    const currentJob = creations.find(c => c.id === activeJobId);
    
    const activeReport: CompetitorAnalysisReport | null = currentJob?.resultText 
        ? JSON.parse(currentJob.resultText) 
        : null;

    const calculateThreatScore = (report: CompetitorAnalysisReport) => {
        const baseScore = 50;
        const strengthScore = (report.contentStrengths?.length || 0) * 8;
        const weaknessScore = (report.contentWeaknesses?.length || 0) * 5;
        let posMultiplier = 1;
        if (report.marketPosition === 'Leader') posMultiplier = 1.2;
        if (report.marketPosition === 'Niche') posMultiplier = 0.8;
        
        const score = (baseScore + strengthScore - weaknessScore) * posMultiplier;
        return Math.min(Math.max(Math.round(score), 10), 98); 
    };

    const threatScore = activeReport ? calculateThreatScore(activeReport) : 0;

    // Enhanced Simulation Effect
    useEffect(() => {
        if (isAnalyzing) {
            setProgress(0);
            setLogs(['> Initializing scanner protocol...']);
            
            const stages = [
                { prog: 10, msg: `Resolving DNS for ${url}...` },
                { prog: 20, msg: 'Handshaking with host (TLS 1.3)...' },
                { prog: 30, msg: 'Crawling DOM structure & assets...' },
                { prog: 40, msg: 'Extracting meta tags and semantic data...' },
                { prog: 55, msg: 'Analyzing content density & keywords...' },
                { prog: 65, msg: 'Identifying brand voice patterns...' },
                { prog: 75, msg: 'Mapping social signal footprint...' },
                { prog: 85, msg: 'Calculating competitive threat vectors...' },
                { prog: 95, msg: 'Synthesizing strategic intelligence...' },
            ];

            let currentStageIndex = 0;

            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) return 100;
                    
                    const increment = 1.5; 
                    const newProg = prev + increment;
                    
                    if (currentStageIndex < stages.length && newProg >= stages[currentStageIndex].prog) {
                        setLogs(prevLogs => [...prevLogs, `> ${stages[currentStageIndex].msg}`]);
                        currentStageIndex++;
                    }
                    
                    return newProg;
                });
            }, 80);
            
            return () => clearInterval(interval);
        }
    }, [isAnalyzing, url]);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const handleAnalyze = async () => {
        if (!url) return;
        setIsAnalyzing(true);
        setActiveJobId(null);

        try {
            const report = await aiService.analyzeCompetitor(url);
            
            const newJobId = `comp-${Date.now()}`;
            addCreation({
                id: newJobId,
                type: 'COMPETITOR_ANALYSIS',
                title: `Audit: ${new URL(url).hostname}`,
                params: { url },
                status: 'Completed',
                resultText: JSON.stringify(report)
            });

            setActiveJobId(newJobId);
            setLogs(prev => [...prev, '> Analysis Complete.']);

        } catch (e) {
            console.error("Analysis failed", e);
            setLogs(prev => [...prev, '> ERROR: Analysis failed.']);
        } finally {
            setIsAnalyzing(false);
            setProgress(100);
        }
    };

    const loadReport = (job: CreationJob) => {
        setActiveJobId(job.id);
        setUrl(job.params.url || '');
    };

    const handleExport = () => {
        if (!activeReport) return;
        const blob = new Blob([JSON.stringify(activeReport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `competitor-analysis-${currentJob?.id}.json`;
        a.click();
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
                    
                    {/* Loading Overlay (Terminal) */}
                    {isAnalyzing && (
                        <div className="absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-8">
                             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                             
                             <div className="w-full max-w-lg space-y-6 relative z-10">
                                 <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-wider font-mono">
                                     <span className="flex items-center gap-2"><CommandLineIcon className="w-4 h-4"/> System Log</span>
                                     <span>{Math.round(progress)}%</span>
                                 </div>
                                 
                                 {/* Terminal Window */}
                                 <div className="font-mono text-xs text-green-400 bg-black/80 p-6 rounded-xl border border-green-500/20 h-64 overflow-hidden flex flex-col shadow-[0_0_30px_rgba(34,197,94,0.1)] relative">
                                     <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_1px,#000_1px)] bg-[size:100%_3px] opacity-20"></div>
                                     <div className="flex-1 overflow-hidden flex flex-col justify-end">
                                         {logs.map((log, i) => (
                                             <div key={i} className="opacity-80 mb-1 last:opacity-100 last:font-bold">{log}</div>
                                         ))}
                                         <div ref={logsEndRef} />
                                     </div>
                                     <div className="w-2 h-4 bg-green-500 animate-pulse mt-1"></div>
                                 </div>

                                 <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                     <div className="h-full bg-green-500 transition-all duration-200 ease-out" style={{width: `${progress}%`}}></div>
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
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Report Header Toolbar */}
                            <div className="h-16 border-b border-white/5 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-20">
                                 <div className="flex items-center gap-3">
                                     <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${activeReport.marketPosition ? getPositionColor(activeReport.marketPosition) : 'text-zinc-500 border-zinc-500/20'}`}>
                                        {activeReport.marketPosition || 'Analyzing'}
                                     </div>
                                     <div className="h-4 w-px bg-white/10"></div>
                                     <span className="text-xs text-zinc-400">Generated {new Date(currentJob!.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 <Button variant="secondary" size="sm" onClick={handleExport} className="h-8 text-xs">
                                     <ArrowDownTrayIcon className="w-3 h-3 mr-1.5" /> Export
                                 </Button>
                            </div>

                            <div className="p-8 lg:p-10 space-y-10">
                                {/* Summary Row */}
                                <div className="flex flex-col md:flex-row gap-10 items-start">
                                    <div className="flex-1">
                                        <h2 className="text-4xl font-bold text-white font-display mb-4 tracking-tight break-all">
                                            {currentJob?.params.url?.replace('https://', '').replace('www.', '').split('/')[0]}
                                        </h2>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {activeReport.socialPlatforms?.map(platform => (
                                                <div key={platform} className="px-3 py-1 bg-zinc-900 border border-white/5 rounded-md text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                                    {platform}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">
                                            {activeReport.targetAudience ? `Targeting ${activeReport.targetAudience}` : 'Audience analysis complete.'}
                                            {activeReport.toneOfVoice && ` with a ${activeReport.toneOfVoice} tone.`}
                                        </p>
                                    </div>
                                    
                                    {/* Gauge */}
                                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                                        <ThreatGauge score={threatScore} />
                                    </div>
                                </div>

                                {/* Positioning Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-2 text-indigo-400 mb-4">
                                            <UserGroupIcon className="w-5 h-5" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Audience Profile</h3>
                                        </div>
                                        <p className="text-zinc-200 text-sm leading-relaxed border-l-2 border-indigo-500/30 pl-4">{activeReport.targetAudience}</p>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                                        <div className="flex items-center gap-2 text-purple-400 mb-4">
                                            <MegaphoneIcon className="w-5 h-5" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Voice & Tone</h3>
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

                                {/* Content Pillars - Interactive */}
                                {activeReport.keyTopics && activeReport.keyTopics.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 text-pink-400 mb-4">
                                            <HashtagIcon className="w-5 h-5" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider">Detected Content Pillars</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {activeReport.keyTopics.map((topic, i) => (
                                                <a 
                                                    key={i} 
                                                    href={`https://www.google.com/search?q=${encodeURIComponent(topic)}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="group px-4 py-2 rounded-lg bg-pink-500/5 border border-pink-500/10 hover:bg-pink-500/10 hover:border-pink-500/30 text-pink-200 text-xs transition-all flex items-center gap-2 cursor-pointer"
                                                >
                                                    {topic}
                                                    <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* SWOT Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-4">
                                            <BoltIcon className="w-4 h-4"/> Key Strengths
                                        </h3>
                                        <ul className="space-y-3">
                                            {activeReport.contentStrengths.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-zinc-900 border border-white/5 rounded-xl p-6">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2 mb-4">
                                            <ShieldExclamationIcon className="w-4 h-4"/> Weaknesses
                                        </h3>
                                        <ul className="space-y-3">
                                            {activeReport.contentWeaknesses.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Battle Plan */}
                                <div className="bg-gradient-to-br from-indigo-950/30 to-zinc-900 border border-indigo-500/20 rounded-2xl p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/15 transition-colors duration-1000"></div>
                                    
                                    <div className="flex items-center gap-3 mb-8 relative z-10">
                                        <div className="p-2.5 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                                            <TrophyIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white font-display">Strategic Counter-Measures</h3>
                                            <p className="text-xs text-indigo-200/70">Actionable steps to capture market share.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 relative z-10">
                                        {activeReport.howToCompete.map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5 hover:border-indigo-500/40 transition-all group/item">
                                                <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold font-mono text-xs border border-indigo-500/30 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-colors">
                                                    {i + 1}
                                                </span>
                                                <p className="text-sm text-zinc-200 group-hover/item:text-white transition-colors">{item}</p>
                                            </div>
                                        ))}
                                    </div>
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
