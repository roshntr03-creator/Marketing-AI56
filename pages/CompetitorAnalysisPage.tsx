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
                <h1 className="text-3xl font-bold font-display">Market Intelligence</h1>
                <p className="text-text-secondary">Deep-dive competitive analysis using Google Search Grounding.</p>
            </div>
            
            <Card className="p-3 flex flex-col sm:flex-row gap-3 bg-background-card border border-surface-border rounded-2xl shadow-lg">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <GlobeAltIcon className="h-5 w-5 text-text-muted" />
                    </div>
                    <input 
                        className="w-full pl-12 pr-4 py-4 bg-background-dark rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-transparent transition-all"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="Enter competitor URL (e.g. https://competitor.com)"
                        type="url"
                        onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                    />
                </div>
                <Button onClick={handleAnalyze} isLoading={isLoading} disabled={!url} className="px-8 h-auto rounded-xl">
                    Analyze
                </Button>
            </Card>

            {report ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {/* Identity Column */}
                    <div className="lg:col-span-1 space-y-6">
                         <Card className="p-8 border-t-4 border-t-primary h-full bg-gradient-to-b from-background-card to-background-dark">
                            <h3 className="text-lg font-bold font-display text-white mb-6 flex items-center gap-2">
                                <MagnifyingGlassIcon className="w-5 h-5 text-primary" />
                                Market Position
                            </h3>
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xs text-text-secondary uppercase tracking-wider mb-3 font-bold">Target Audience</h4>
                                    <p className="text-sm text-text-primary leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">{report.targetAudience}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs text-text-secondary uppercase tracking-wider mb-3 font-bold">Tone of Voice</h4>
                                    <p className="text-sm text-text-primary leading-relaxed italic border-l-2 border-primary pl-4">"{report.toneOfVoice}"</p>
                                </div>
                            </div>
                         </Card>
                    </div>

                    {/* SWOT Grid */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6 border-l-4 border-l-green-500 bg-green-500/5">
                                <div className="flex items-center gap-2 mb-4 text-green-400">
                                    <BoltIcon className="w-6 h-6" />
                                    <h3 className="font-bold uppercase tracking-wide text-sm">Their Strengths</h3>
                                </div>
                                <ul className="space-y-3">
                                    {report.contentStrengths.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                            <span className="text-green-500 mt-0.5 font-bold text-lg leading-none">+</span> 
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card className="p-6 border-l-4 border-l-red-500 bg-red-500/5">
                                <div className="flex items-center gap-2 mb-4 text-red-400">
                                    <ShieldExclamationIcon className="w-6 h-6" />
                                    <h3 className="font-bold uppercase tracking-wide text-sm">Their Weaknesses</h3>
                                </div>
                                <ul className="space-y-3">
                                    {report.contentWeaknesses.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                            <span className="text-red-500 mt-0.5 font-bold text-lg leading-none">-</span> 
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        <Card className="p-8 bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <TrophyIcon className="w-32 h-32 text-white" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 text-white">
                                    <div className="p-2 bg-primary rounded-lg">
                                        <TrophyIcon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold font-display text-xl">Strategic Edge: How to Win</h3>
                                </div>
                                 <ul className="space-y-4">
                                    {report.howToCompete.map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-sm text-white bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                            <span className="bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
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
                     <div className="py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-surface-border rounded-3xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-20 h-20 bg-background-dark rounded-full flex items-center justify-center mb-6 shadow-lg">
                            <MagnifyingGlassIcon className="w-10 h-10 text-text-muted opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Intelligence Awaiting</h3>
                        <p className="text-text-secondary max-w-md mt-2">Enter a competitor's URL to extract actionable insights and find your competitive edge.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default CompetitorAnalysisPage;