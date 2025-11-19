import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MagnifyingGlassIcon, GlobeAltIcon, BoltIcon, ShieldExclamationIcon, TrophyIcon } from '@heroicons/react/24/outline';
import aiService from '../services/aiService';
import { CompetitorAnalysisReport } from '../types';

const CompetitorAnalysisPage: React.FC = () => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState<CompetitorAnalysisReport | null>(null);

    const handleAnalyze = async () => {
        if (!url) return;
        setIsLoading(true);
        setReport(null);
        try {
            const result = await aiService.analyzeCompetitor(url);
            setReport(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
            <div>
                <h1 className="text-3xl font-bold font-display text-white">Market Intelligence</h1>
                <p className="text-zinc-400">Deep-dive competitive analysis.</p>
            </div>
            
            <Card className="p-3 flex flex-col sm:flex-row gap-3 bg-zinc-900 border border-white/10 rounded-xl">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <GlobeAltIcon className="h-5 w-5 text-zinc-500" />
                    </div>
                    <input 
                        className="w-full pl-12 pr-4 py-3 bg-zinc-950 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-white/5 transition-all"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="Enter competitor URL (e.g. https://competitor.com)"
                        type="url"
                        onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                    />
                </div>
                <Button onClick={handleAnalyze} isLoading={isLoading} disabled={!url} className="px-8 h-auto rounded-lg">
                    Analyze
                </Button>
            </Card>

            {report ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {/* Identity Column */}
                    <div className="lg:col-span-1 space-y-6">
                         <Card className="p-8 h-full bg-zinc-900 border-white/10">
                            <h3 className="text-sm font-bold font-display text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
                                <MagnifyingGlassIcon className="w-4 h-4 text-indigo-500" />
                                Market Position
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-3 font-bold">Target Audience</h4>
                                    <p className="text-sm text-zinc-300 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">{report.targetAudience}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-3 font-bold">Tone of Voice</h4>
                                    <p className="text-sm text-zinc-300 leading-relaxed italic border-l-2 border-indigo-500/50 pl-4">"{report.toneOfVoice}"</p>
                                </div>
                            </div>
                         </Card>
                    </div>

                    {/* SWOT Grid */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6 border-l-2 border-l-emerald-500 bg-zinc-900">
                                <div className="flex items-center gap-2 mb-4 text-emerald-500">
                                    <BoltIcon className="w-5 h-5" />
                                    <h3 className="font-bold uppercase tracking-wide text-xs">Their Strengths</h3>
                                </div>
                                <ul className="space-y-3">
                                    {report.contentStrengths.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                                            <span className="text-emerald-500 font-bold text-lg leading-none mt-[-2px]">•</span> 
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card className="p-6 border-l-2 border-l-red-500 bg-zinc-900">
                                <div className="flex items-center gap-2 mb-4 text-red-500">
                                    <ShieldExclamationIcon className="w-5 h-5" />
                                    <h3 className="font-bold uppercase tracking-wide text-xs">Their Weaknesses</h3>
                                </div>
                                <ul className="space-y-3">
                                    {report.contentWeaknesses.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                                            <span className="text-red-500 font-bold text-lg leading-none mt-[-2px]">•</span> 
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        <Card className="p-8 bg-gradient-to-br from-indigo-900/20 to-zinc-900 border border-indigo-500/20">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 text-white">
                                    <div className="p-2 bg-indigo-500 rounded-lg">
                                        <TrophyIcon className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-medium font-display text-lg">Strategic Edge: How to Win</h3>
                                </div>
                                 <ul className="space-y-4">
                                    {report.howToCompete.map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-sm text-zinc-200 bg-white/5 p-4 rounded-lg border border-white/5">
                                            <span className="text-indigo-400 font-mono text-xs font-bold flex-shrink-0 mt-0.5">0{i + 1}</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                !isLoading && (
                     <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                            <MagnifyingGlassIcon className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-medium text-white">Intelligence Awaiting</h3>
                        <p className="text-zinc-500 max-w-md mt-2">Enter a competitor's URL to extract actionable insights.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default CompetitorAnalysisPage;