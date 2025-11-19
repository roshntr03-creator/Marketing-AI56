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
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
                    <SparklesIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold font-display">Prompt Alchemy</h1>
                <p className="text-text-secondary max-w-lg mx-auto text-lg">Transform simple concepts into professional, highly-detailed generation prompts.</p>
            </div>
            
            <Card className="p-1 overflow-hidden bg-gradient-to-b from-primary/30 to-transparent border border-primary/30 shadow-[0_0_40px_rgba(79,70,229,0.15)]">
                <div className="bg-background-card p-8 rounded-lg">
                     <div className="mb-2 flex justify-between">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Raw Concept</label>
                        <span className="text-xs text-text-muted">{idea.length} chars</span>
                     </div>
                     <Textarea 
                        value={idea}
                        onChange={e => setIdea(e.target.value)}
                        placeholder="e.g., a futuristic city with flying cars..."
                        rows={3}
                        className="text-lg bg-background-dark font-medium border-surface-border/50 focus:border-primary"
                     />
                     <div className="mt-6 flex justify-center">
                         <Button onClick={handleEnhance} isLoading={isLoading} disabled={!idea} size="lg" className="px-12 h-14 text-lg shadow-xl shadow-primary/20">
                            <BeakerIcon className="w-6 h-6 mr-2" />
                            Transmute
                         </Button>
                     </div>
                </div>
            </Card>

            {enhancedPrompt && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                     <div className="space-y-4">
                         <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                             <AdjustmentsHorizontalIcon className="w-4 h-4" />
                             Parameters Extracted
                         </h3>
                         <Card className="p-6 space-y-4 h-full bg-background-card/50">
                            <DetailRow label="Subject" value={enhancedPrompt.subject} />
                            <DetailRow label="Style" value={enhancedPrompt.style} />
                            <DetailRow label="Composition" value={enhancedPrompt.composition} />
                            <DetailRow label="Lighting" value={enhancedPrompt.lighting} />
                            <DetailRow label="Color Palette" value={enhancedPrompt.colorPalette} />
                            <DetailRow label="Mood" value={enhancedPrompt.mood} />
                        </Card>
                     </div>

                     <div className="space-y-4">
                         <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                             <SparklesIcon className="w-4 h-4" />
                             Optimized Prompt
                         </h3>
                         <Card className="p-6 h-full flex flex-col bg-gradient-to-br from-primary/10 to-background-card border-primary/20">
                             <div className="flex-grow relative">
                                <p className="text-text-primary leading-relaxed italic text-lg">"{enhancedPrompt.finalPrompt}"</p>
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
        <span className="text-sm font-semibold text-text-secondary flex-shrink-0">{label}</span>
        <span className="text-sm text-white text-right">{value}</span>
    </div>
);

export default PromptEnhancerPage;