import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { SparklesIcon, DocumentDuplicateIcon, BeakerIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { EnhancedPrompt } from '../types';
import aiService from '../services/aiService';

const PromptEnhancerPage: React.FC = () => {
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [enhancedPrompt, setEnhancedPrompt] = useState<EnhancedPrompt | null>(null);

    const handleEnhance = async () => {
        if (!idea) return;
        setIsLoading(true);
        setEnhancedPrompt(null);
        try {
            const result = await aiService.enhancePrompt(idea);
            setEnhancedPrompt(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Prompt copied!');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            <div className="text-center space-y-2 mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-xl mb-4">
                    <SparklesIcon className="w-6 h-6 text-indigo-500" />
                </div>
                <h1 className="text-3xl font-bold font-display text-white">Prompt Alchemy</h1>
                <p className="text-zinc-400 max-w-lg mx-auto">Transform simple concepts into detailed generation prompts.</p>
            </div>
            
            <Card className="p-8 bg-zinc-900 border-white/10">
                 <div className="mb-2 flex justify-between">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Raw Concept</label>
                    <span className="text-xs text-zinc-600">{idea.length} chars</span>
                 </div>
                 <Textarea 
                    value={idea}
                    onChange={e => setIdea(e.target.value)}
                    placeholder="e.g., a futuristic city with flying cars..."
                    rows={3}
                    className="text-lg bg-zinc-950 font-medium border-white/10 focus:border-indigo-500"
                 />
                 <div className="mt-6 flex justify-center">
                     <Button onClick={handleEnhance} isLoading={isLoading} disabled={!idea} size="lg" className="px-12">
                        <BeakerIcon className="w-5 h-5 mr-2" />
                        Enhance
                     </Button>
                 </div>
            </Card>

            {enhancedPrompt && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                     <div className="space-y-4">
                         <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                             <AdjustmentsHorizontalIcon className="w-4 h-4" />
                             Parameters
                         </h3>
                         <Card className="p-6 space-y-4 h-full bg-zinc-900/50 border-white/10">
                            <DetailRow label="Subject" value={enhancedPrompt.subject} />
                            <DetailRow label="Style" value={enhancedPrompt.style} />
                            <DetailRow label="Composition" value={enhancedPrompt.composition} />
                            <DetailRow label="Lighting" value={enhancedPrompt.lighting} />
                            <DetailRow label="Palette" value={enhancedPrompt.colorPalette} />
                            <DetailRow label="Mood" value={enhancedPrompt.mood} />
                        </Card>
                     </div>

                     <div className="space-y-4">
                         <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                             <SparklesIcon className="w-4 h-4" />
                             Optimized Prompt
                         </h3>
                         <Card className="p-6 h-full flex flex-col bg-gradient-to-br from-indigo-900/20 to-zinc-900 border-indigo-500/30">
                             <div className="flex-grow relative">
                                <p className="text-zinc-200 leading-relaxed text-sm">"{enhancedPrompt.finalPrompt}"</p>
                             </div>
                             
                             <div className="pt-6 mt-6 border-t border-white/5">
                                <Button onClick={() => handleCopyToClipboard(enhancedPrompt.finalPrompt)} variant="primary" className="w-full">
                                    <DocumentDuplicateIcon className="w-4 h-4 mr-2"/>
                                    Copy to Clipboard
                                </Button>
                             </div>
                         </Card>
                     </div>
                </div>
            )}
        </div>
    );
};

const DetailRow: React.FC<{label: string, value: string}> = ({ label, value}) => (
    <div className="flex justify-between items-start py-2 border-b border-white/5 last:border-0 gap-4">
        <span className="text-xs font-medium text-zinc-500 flex-shrink-0 uppercase">{label}</span>
        <span className="text-sm text-zinc-300 text-right">{value}</span>
    </div>
);

export default PromptEnhancerPage;