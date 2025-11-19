import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SparklesIcon, PresentationChartBarIcon, MegaphoneIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useAppContext } from '../contexts/AppContext';
import aiService from '../services/aiService';
import { CampaignBlueprint } from '../types';

const CampaignsPage: React.FC = () => {
    const { brandProfile } = useAppContext();
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState(brandProfile?.audience || '');
    const [isLoading, setIsLoading] = useState(false);
    const [campaigns, setCampaigns] = useState<CampaignBlueprint[]>([]);

    const handleGenerate = async () => {
        if (!product || !audience) return;
        setIsLoading(true);
        setCampaigns([]);
        try {
            const result = await aiService.generateCampaigns(product, audience);
            setCampaigns(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display text-white">Campaign Generator</h1>
                    <p className="text-zinc-400">Develop data-driven marketing strategies.</p>
                </div>
            </div>

            <Card className="p-8 bg-zinc-900 border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <Input label="Product / Service" value={product} onChange={e => setProduct(e.target.value)} placeholder="e.g., Cyber-Security Suite for SMEs" className="bg-zinc-950 border-white/10" />
                    <Input label="Target Audience" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., CTOs and IT Managers" className="bg-zinc-950 border-white/10" />
                </div>
                <div className="flex justify-end">
                     <Button onClick={handleGenerate} isLoading={isLoading} disabled={!product || !audience} size="lg" className="w-full md:w-auto min-w-[200px]">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Generate Blueprints
                    </Button>
                </div>
            </Card>

            {campaigns.length > 0 && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="flex items-center gap-2 text-zinc-200 mb-4 border-b border-white/5 pb-4">
                        <PresentationChartBarIcon className="w-5 h-5" />
                        <h2 className="text-sm font-bold font-display uppercase tracking-wide">Strategic Blueprints</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        {campaigns.map((campaign, index) => (
                            <div key={index} className="rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 bg-zinc-900">
                                <div className="p-8 border-b border-white/5 bg-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-2xl font-medium text-white font-display">{campaign.campaignName}</h3>
                                        <span className="px-4 py-1 rounded-full bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-wider border border-white/5">Strategy {index + 1}</span>
                                    </div>
                                    <p className="text-zinc-400 mt-2 max-w-3xl leading-relaxed">{campaign.description}</p>
                                </div>
                                
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                                            <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                                            <h4 className="font-bold text-xs uppercase tracking-wider">Key Messaging</h4>
                                        </div>
                                        <ul className="space-y-3">
                                            {campaign.keyMessaging.map((msg, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></span>
                                                    {msg}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-purple-400">
                                            <MegaphoneIcon className="w-4 h-4" />
                                            <h4 className="font-bold text-xs uppercase tracking-wider">Recommended Channels</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {campaign.recommendedChannels.map((ch, i) => (
                                                <span key={i} className="px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs text-zinc-400">
                                                    {ch}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {campaigns.length === 0 && !isLoading && (
                 <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <PresentationChartBarIcon className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Awaiting Input</h3>
                    <p className="text-zinc-500 max-w-md mt-2">Define your product and audience above.</p>
                </div>
            )}
        </div>
    );
};

export default CampaignsPage;